import type { NextAuthConfig } from "next-auth";

// This is a lightweight auth config that works in the Edge Runtime (middleware).
// It does NOT import Prisma, bcryptjs, or any other Node.js-only modules.
// The full auth config (with Credentials provider) lives in src/lib/auth.ts.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Providers are added in auth.ts (Node.js runtime only)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "student";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
