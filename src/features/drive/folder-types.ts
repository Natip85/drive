import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { folders_table } from "~/server/db/schema";

export const folderInsertSchema = createInsertSchema(folders_table);
export const folderSelectSchema = createSelectSchema(folders_table);

export const folderAddRenameSchema = createSelectSchema(folders_table).omit({
  id: true,
  publicId: true,
  deletedAt: true,
});

export type FolderAddRename = z.infer<typeof folderAddRenameSchema>;

export type FolderInsert = z.infer<typeof folderInsertSchema>;
export type FolderSelect = z.infer<typeof folderSelectSchema>;
