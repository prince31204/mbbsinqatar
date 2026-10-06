import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  type: z.enum(["admin", "student", "agent"]).default("student"),
});

// Full auth config — runs in Node.js runtime (API routes, server components).
// Extends the edge-safe authConfig with the Credentials provider that needs Prisma + bcrypt.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "student-credentials",
      name: "Student Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        type: { label: "Type", type: "text" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password, type } = parsed.data;

        if (type === "admin") {
          // Admin login
          const user = await prisma.user.findUnique({
            where: { email, status: true },
          });
          if (!user) return null;
          if (user.role !== "admin" && user.role !== "employee") return null;
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) return null;
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.photoPath || null,
          };
        } else if (type === "agent") {
          // Agent login
          const user = await prisma.user.findUnique({
            where: { email, status: true },
          });
          if (!user || user.role !== "agent") return null;
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) return null;
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: "agent",
            image: user.photoPath || null,
          };
        } else {
          // Student (Lead) login
          const lead = await prisma.lead.findFirst({
            where: { email, status: "active", deletedAt: null },
          });
          if (!lead || !lead.password) return null;
          const valid = await bcrypt.compare(password, lead.password);
          if (!valid) return null;
          // Accept if emailVerified boolean is true OR emailVerifiedAt timestamp is set
          if (!lead.emailVerified && !lead.emailVerifiedAt) return null;
          return {
            id: String(lead.id),
            email: lead.email!,
            name: lead.name,
            role: "student",
            image: null,
          };
        }
      },
    }),
  ],
});
