import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

// Use the Edge-safe auth config in proxy — no Prisma/bcrypt here!
const { auth } = NextAuth(authConfig);

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  // Admin routes — require admin/employee role
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!session || (userRole !== "admin" && userRole !== "employee")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Admin login — redirect if already logged in as admin
  if (
    pathname === "/admin/login" &&
    session &&
    (userRole === "admin" || userRole === "employee")
  ) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Agent routes — require agent role
  if (pathname.startsWith("/agent") && pathname !== "/agent/login") {
    if (!session || userRole !== "agent") {
      return NextResponse.redirect(new URL("/agent/login", req.url));
    }
  }

  // Student routes — require student role
  if (pathname.startsWith("/student")) {
    if (!session || userRole !== "student") {
      return NextResponse.redirect(
        new URL("/login?redirect=" + encodeURIComponent(pathname), req.url),
      );
    }
  }

  // Auth pages — redirect logged-in students away
  if (
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/otp-verification") &&
    session &&
    userRole === "student"
  ) {
    return NextResponse.redirect(new URL("/student", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/agent/:path*",
    "/student/:path*",
    "/login",
    "/register",
    "/otp-verification",
  ],
};
