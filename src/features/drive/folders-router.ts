import { TRPCError } from "@trpc/server";
import { eq, inArray, and, isNull, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { files_table, folders_table } from "~/server/db/schema";
import { folderAddRenameSchema, folderSelectSchema } from "./folder-types";

export const foldersRouter = createTRPCRouter({
  getFolders: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.db
        .select()
        .from(folders_table)
        .where(
          and(eq(folders_table.parent, input), isNull(folders_table.deletedAt)),
        )
        .orderBy(folders_table.id);
    }),
  getTrashFolders: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return ctx.db
      .select()
      .from(folders_table)
      .where(isNotNull(folders_table.deletedAt))
      .orderBy(folders_table.deletedAt);
  }),
  getSidebarFolders: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const folders = await ctx.db
        .select({
          publicId: folders_table.publicId,
          name: folders_table.name,
        })
        .from(folders_table)
        .where(
          and(
            eq(folders_table.ownerId, input),
            inArray(folders_table.name, ["Root", "Trash"]),
          ),
        );

      const folderMap = Object.fromEntries(
        folders.map((f) => [f.name, f.publicId]),
      );

      return {
        rootFolderId: folderMap.Root ?? null,
      };
    }),
  getAllParentsForFolder: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const parents = [];
      let currentId: string | null = input;
      while (currentId !== null) {
        const folder = await ctx.db
          .selectDistinct()
          .from(folders_table)
          .where(eq(folders_table.publicId, currentId));

        if (!folder[0]) {
          throw new Error("Parent folder not found");
        }
        parents.unshift(folder[0]);
        currentId = folder[0]?.parent;
      }
      return parents;
    }),
  getFolderById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const folder = await ctx.db
        .select()
        .from(folders_table)
        .where(eq(folders_table.publicId, input));
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
        .where(eq(folders_table.publicId, input.publicId))
        .limit(1);

      if (!existingFolder.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
      }

      return await ctx.db
        .update(folders_table)
        .set({ name: input.name })
        .where(eq(folders_table.publicId, input.publicId));
    }),
  moveFolderToTrash: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const folderIdsToUpdate = await getAllDescendantFolders(input, ctx.db);

      const updateFolderResult = await ctx.db
        .update(folders_table)
        .set({ deletedAt: new Date() })
        .where(
          and(
            eq(folders_table.ownerId, ctx.session.user.id),
            inArray(folders_table.publicId, folderIdsToUpdate),
          ),
        )
        .returning();

      if (!updateFolderResult.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No folders found to mark as deleted",
        });
      }

      const updateFileResult = await ctx.db
        .update(files_table)
        .set({ deletedAt: new Date() })
        .where(
          and(
            eq(files_table.ownerId, ctx.session.user.id),
            inArray(files_table.parent, folderIdsToUpdate),
          ),
        )
        .returning();

      if (!updateFileResult) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No files found to mark as deleted",
        });
      }

      return { success: true };
    }),
  restoreFolder: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const updateResult = await ctx.db
        .update(folders_table)
        .set({ deletedAt: null })
        .where(
          and(
            eq(folders_table.publicId, input),
            eq(folders_table.ownerId, ctx.session.user.id),
            isNotNull(folders_table.deletedAt),
          ),
        )
        .returning();

      if (!updateResult.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No folder found to restore",
        });
      }

      return { success: true };
    }),
});

/* eslint-disable */
async function getAllDescendantFolders(
  folderPublicId: string,
  tx: any,
): Promise<string[]> {
  const queue: string[] = [folderPublicId];
  const allFolderIds: string[] = [];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) continue;

    allFolderIds.push(currentId);

    const childFolders: [{ publicId: string }] = await tx
      .select({ publicId: folders_table.publicId })
      .from(folders_table)
      .where(eq(folders_table.parent, currentId));

    queue.push(...childFolders.map((folder) => folder.publicId));
  }

  return allFolderIds;
}
