import { index, integer, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../utils";

export const folders_table = createTable(
  "folders_table",
  {
    id: serial("id").primaryKey().notNull(),
    publicId: text("public_id")
      .notNull()
      .unique()
      .$defaultFn(() => crypto.randomUUID()),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    parent: text("parent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (t) => {
    return [
      index("folder_parent_index").on(t.parent),
      index("folder_public_id_index").on(t.publicId),
      index("folder_owner_id_index").on(t.ownerId),
      index("folders_deleted_at_idx").on(t.deletedAt),
    ];
  },
);
