import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  users,
  type UserRole,
  accounts,
  sessions,
  verificationTokens,
} from "../db/schema";
import { env } from "~/env";
import { db } from "../db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roles: UserRole[];
    } & DefaultSession["user"];
  }

  interface User {
    roles: UserRole[];
  }

  interface JWT {
    id: string;
    roles: UserRole[];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  // debug: true,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    verifyRequest: "/auth/verify-request",
    // error: '/auth/error', // Error code passed in query string as ?error=
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave as empty string if not of interest)
  },
  providers: [
    GoogleProvider({
      redirectProxyUrl: env.AUTH_REDIRECT_PROXY_URL,
      allowDangerousEmailAccountLinking: true,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    // TODO update user last login
    // signIn: async ({user}) => {
    //   if (!user.email) return false

    //   const existingUser = await db.query.users.findFirst({
    //     where: (users, {eq}) => eq(users.email, user.email),
    //   })

    //   if (existingUser.id) {
    //     await db.update(users).set({
    //       lastLogin: new Date(),
    //     }).where(eq(users.id, existingUser[0].id))
    //   }

    //   return true
    // },
    authorized: async ({ auth }) => {
      return !!auth;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.image = user?.image;
        token.name = user?.name;
      }

      // if (trigger === 'update') {
      //   const updatedUser = await db.query.users.findFirst({where: eq(users.id, token.id as string)})
      //   if (updatedUser) {
      //     token.id = updatedUser.id
      //     token.roles = updatedUser.roles
      //     token.language = updatedUser.language
      //     token.image = updatedUser.image
      //     token.name = updatedUser.name
      //   }
      // }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        id: token.id as string,
        roles: token.roles as UserRole[],
        image: token.picture,
        name: token.name,
      };
      return session;
    },
  },
} satisfies NextAuthConfig;
