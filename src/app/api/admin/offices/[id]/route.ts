import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.office.update({
    where: { id: parseInt(id) },
    data: body,
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.office.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
