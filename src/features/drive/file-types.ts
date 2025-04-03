import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { files_table } from "~/server/db/schema";

export const fileInsertSchema = createInsertSchema(files_table);
export const fileSelectSchema = createSelectSchema(files_table);

export type FileInsert = z.infer<typeof fileInsertSchema>;
export type FileSelect = z.infer<typeof fileSelectSchema>;
