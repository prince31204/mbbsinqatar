import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; pid: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { pid } = await params;
  const body = await req.json();
  const item = await prisma.universityPhoto.update({
    where: { id: parseInt(pid) },
    data: body,
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { pid } = await params;
  await prisma.universityPhoto.delete({ where: { id: parseInt(pid) } });
  return NextResponse.json({ success: true });
}
