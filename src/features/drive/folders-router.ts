import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { folders_table } from "~/server/db/schema";
import { folderAddRenameSchema, folderSelectSchema } from "./folder-types";

export const foldersRouter = createTRPCRouter({
  getFolders: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.db
        .select()
        .from(folders_table)
        .where(eq(folders_table.parent, input))
        .orderBy(folders_table.id);
    }),
  getAllParentsForFolder: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const parents = [];
      let currentId: number | null = input;
      while (currentId !== null) {
        const folder = await ctx.db
          .selectDistinct()
          .from(folders_table)
          .where(eq(folders_table.id, currentId));

        if (!folder[0]) {
          throw new Error("Parent folder not found");
        }
        parents.unshift(folder[0]);
        currentId = folder[0]?.parent;
      }
      return parents;
    }),
  getFolderById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const folder = await ctx.db
        .select()
        .from(folders_table)
        .where(eq(folders_table.id, input));
      return folder[0];
    }),
  createNewFolder: protectedProcedure
    .input(folderAddRenameSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.db.insert(folders_table).values({
        ...input,
      });
    }),
  renameFolder: protectedProcedure
    .input(folderSelectSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const existingFolder = await ctx.db
        .select()
        .from(folders_table)
        .where(eq(folders_table.id, input.id))
        .limit(1);

      if (!existingFolder.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
      }

      return await ctx.db
        .update(folders_table)
        .set({ name: input.name })
        .where(eq(folders_table.id, input.id));
    }),
});
