import { index, integer, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import * as Utils from "../utils";

export const files_table = createTable(
  "files_table",
  {
    id: serial("id").primaryKey().notNull(),
    name: Utils.chars("name").notNull(),
    ownerId: text("owner_id").notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
    parent: integer("parent").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => {
    return [
      index("files_parent_index").on(t.parent),
      index("files_owner_id_index").on(t.ownerId),
    ];
  },
);

export type DB_FileType = typeof files_table.$inferSelect;
