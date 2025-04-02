import { index, integer, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import * as Utils from "../utils";

export const files_table = createTable(
  "files_table",
  {
    id: serial("id").primaryKey().notNull(),
    publicId: text("public_id")
      .notNull()
      .unique()
      .$defaultFn(() => crypto.randomUUID()),
    name: Utils.chars("name").notNull(),
    ownerId: text("owner_id").notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
    parent: text("parent").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (t) => {
    return [
      index("files_parent_index").on(t.parent),
      index("files_public_id_index").on(t.publicId),
      index("files_owner_id_index").on(t.ownerId),
      index("files_deleted_at_idx").on(t.deletedAt),
    ];
  },
);
