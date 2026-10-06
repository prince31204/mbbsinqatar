import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; iid: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { iid } = await params;
  const body = await req.json();
  const item = await prisma.universityIntake.update({
    where: { id: parseInt(iid) },
    data: body,
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { iid } = await params;
  await prisma.universityIntake.delete({ where: { id: parseInt(iid) } });
  return NextResponse.json({ success: true });
}
