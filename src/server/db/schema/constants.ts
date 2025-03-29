export const UserRoles = [
  "admin",
  "owner",
  "user",
  "investigator",
  "staff",
  "paid",
  "blocked",
] as const;
export type UserRole = (typeof UserRoles)[number];
