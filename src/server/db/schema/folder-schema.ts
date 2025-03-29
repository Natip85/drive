import { index, integer, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../utils";

export const folders_table = createTable(
  "folders_table",
  {
    id: serial("id").primaryKey().notNull(),

    ownerId: text("owner_id").notNull(),

    name: text("name").notNull(),
    parent: integer("parent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => {
    return [
      index("folder_parent_index").on(t.parent),
      index("folder_owner_id_index").on(t.ownerId),
    ];
  },
);

export type DB_FolderType = typeof folders_table.$inferSelect;
