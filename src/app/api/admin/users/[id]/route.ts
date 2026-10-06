import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      photoPath: true,
      createdAt: true,
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  if (body.password) {
    const bcrypt = await import("bcryptjs");
    body.password = await bcrypt.hash(body.password, 10);
  } else {
    delete body.password;
  }
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: body,
    select: { id: true, name: true, email: true, role: true, status: true },
  });
  return NextResponse.json(user);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.user.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
