import {
  index,
  integer,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createTable } from "../utils";
import * as Utils from "../utils";
import { relations } from "drizzle-orm";
import { users } from ".";

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

export const fileRelations = relations(files_table, ({ one, many }) => ({
  favorites: many(fileFavorites),
}));

export const fileFavorites = Utils.createTable(
  "file_favorites",
  {
    userId: Utils.userId()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    filePublicId: text("file_favorites_public_id")
      .references(() => files_table.publicId, { onDelete: "cascade" })
      .notNull(),
    createdAt: Utils.createUpdateTimestamps.createdAt,
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.filePublicId] }),
    userIdIdx: index("file_favorites_user_id_idx").on(t.userId),
  }),
);

export const fileFavoritesRelations = relations(fileFavorites, ({ one }) => ({
  user: one(users, { fields: [fileFavorites.userId], references: [users.id] }),
  file: one(files_table, {
    fields: [fileFavorites.filePublicId],
    references: [files_table.publicId],
  }),
}));
