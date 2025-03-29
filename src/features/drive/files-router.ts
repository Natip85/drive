import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { files_table } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export const filesRouter = createTRPCRouter({
  getFiles: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.db
        .select()
        .from(files_table)
        .where(eq(files_table.parent, input))
        .orderBy(files_table.id);
    }),
  createNewFile: publicProcedure
    .input(
      z.object({
        file: z.object({
          name: z.string(),
          size: z.number(),
          url: z.string(),
          parent: z.number(),
        }),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // if (!ctx.session?.user) {
      //   throw new TRPCError({ code: "UNAUTHORIZED" });
      // }

      return await ctx.db.insert(files_table).values({
        ...input.file,
        ownerId: input.userId,
      });
    }),
  deleteFile: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [file] = await ctx.db
        .select()
        .from(files_table)
        .where(
          and(
            eq(files_table.id, input),
            eq(files_table.ownerId, ctx.session.user.id),
          ),
        );

      if (!file) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No file found to delete",
        });
      }

      const fileId = file.url.split("/f/")[1];

      if (!fileId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid file URL",
        });
      }

      const utapiResult = await utApi.deleteFiles([fileId]);

      const dbDeleteResult = await ctx.db
        .delete(files_table)
        .where(eq(files_table.id, input));

      const c = await cookies();

      c.set("force-refresh", JSON.stringify(Math.random()));
      return {
        success: true,
        utDeleted: utapiResult.deletedCount,
        dbDeleted: dbDeleteResult.length,
      };
    }),
});
