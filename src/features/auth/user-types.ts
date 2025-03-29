import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { users } from "~/server/db/schema";

export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);

export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserSelect = z.infer<typeof userSelectSchema>;
