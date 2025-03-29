import { relations } from "drizzle-orm";
import { index, integer, pgEnum, primaryKey, text } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

import * as Utils from "../utils";
import { UserRoles, type UserRole } from "./constants";

export const userRoleEnum = pgEnum("user_role", UserRoles);
const defaultUserRole: UserRole[] = ["user"];

export const users = Utils.createAuthTable(
  "user",
  {
    id: Utils.userId("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: Utils.chars("name"),
    email: Utils.chars("email").notNull().unique(),
    emailVerified: Utils.timeStamp("email_verified").default(
      Utils.currentTimestamp,
    ),
    image: Utils.chars("image"),
    roles: userRoleEnum("roles")
      .array()
      .$type<UserRole[]>()
      .default(defaultUserRole)
      .notNull(),
    phone: Utils.chars("phone"),
    lastLogin: Utils.timeStamp("last_login"),
    ...Utils.createUpdateTimestamps,
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = Utils.createAuthTable(
  "account",
  {
    userId: Utils.userId().references(() => users.id, { onDelete: "cascade" }),
    type: Utils.chars("type").$type<AdapterAccount["type"]>().notNull(),
    provider: Utils.chars("provider").notNull(),
    providerAccountId: Utils.chars("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: Utils.chars("token_type"),
    scope: Utils.chars("scope"),
    id_token: text("id_token"),
    session_state: Utils.chars("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = Utils.createAuthTable(
  "session",
  {
    sessionToken: Utils.chars("session_token").notNull().primaryKey(),
    userId: Utils.userId().references(() => users.id, { onDelete: "cascade" }),
    expires: Utils.timeStamp("expires").notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = Utils.createAuthTable(
  "verification_token",
  {
    identifier: Utils.chars("identifier").notNull(),
    token: Utils.chars("token").notNull(),
    expires: Utils.timeStamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    identifierIdx: index("verification_token_identifier_idx").on(vt.identifier),
    expiresIdx: index("verification_token_expires_idx").on(vt.expires),
  }),
);
