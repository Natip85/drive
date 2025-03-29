import { TRPCError } from "@trpc/server";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { folders_table, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session?.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        roles: true,
      },
    });

    return user;
  }),
  getRootFolderForUser: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const folder = await ctx.db
        .select()
        .from(folders_table)
        .where(
          and(eq(folders_table.ownerId, input), isNull(folders_table.parent)),
        );
      return folder[0];
    }),
  onboardUser: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.db.transaction(async () => {
        const rootFolder = await ctx.db
          .insert(folders_table)
          .values({
            name: "Root",
            parent: null,
            ownerId: input,
          })
          .returning({
            id: folders_table.id,
          });

        const rootFolderId = rootFolder[0]?.id;

        await ctx.db.insert(folders_table).values([
          {
            name: "Trash",
            parent: rootFolderId,
            ownerId: input,
          },
          {
            name: "Shared",
            parent: rootFolderId,
            ownerId: input,
          },
          {
            name: "Documents",
            parent: rootFolderId,
            ownerId: input,
          },
        ]);

        return rootFolderId;
      });
    }),
});
