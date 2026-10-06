import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const userId = parseInt(session.user?.id as string);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      description: true,
      photoPath: true,
      role: true,
    },
  });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const userId = parseInt(session.user?.id as string);
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.designation !== undefined) updateData.designation = body.designation;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.photoPath !== undefined) updateData.photoPath = body.photoPath;

  // Password change — requires current password verification
  if (body.newPassword) {
    if (!body.currentPassword) {
      return NextResponse.json(
        { error: "Current password required" },
        { status: 400 },
      );
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const valid = await bcrypt.compare(body.currentPassword, user.password);
    if (!valid)
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    updateData.password = await bcrypt.hash(body.newPassword, 10);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      description: true,
      photoPath: true,
      role: true,
    },
  });
  return NextResponse.json(updated);
}
