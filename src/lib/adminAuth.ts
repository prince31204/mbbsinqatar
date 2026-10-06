import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

type AdminAuthResult =
  | { session: Session; error?: never }
  | { session?: never; error: NextResponse };

/**
 * Use at the top of any /api/admin/* route handler.
 * Returns { session } on success, or { error: NextResponse } to return immediately.
 *
 * Usage:
 * const { session, error } = await requireAdmin();
 * if (error) return error;
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  const session = await auth();

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "admin" && role !== "employee") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session };
}

/**
 * Use in /api/upload or any route that any logged-in admin/employee can access.
 * Returns { session } on success, or { error: NextResponse } to return immediately.
 */
export async function requireAuthenticatedAdmin(): Promise<AdminAuthResult> {
  return requireAdmin();
}
