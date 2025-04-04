import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { files_table } from "~/server/db/schema";
import type { RouterOutputs } from "~/trpc/react";

export const fileInsertSchema = createInsertSchema(files_table);
export const fileSelectSchema = createSelectSchema(files_table);

export type FileInsert = z.infer<typeof fileInsertSchema>;
export type FileSelect = z.infer<typeof fileSelectSchema>;

export type File = NonNullable<RouterOutputs>["files"]["getAllFiles"];
