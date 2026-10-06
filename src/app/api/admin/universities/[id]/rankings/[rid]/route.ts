import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; rid: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { rid } = await params;
  const body = await req.json();
  const item = await prisma.universityRanking.update({
    where: { id: parseInt(rid) },
    data: body,
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { rid } = await params;
  await prisma.universityRanking.delete({ where: { id: parseInt(rid) } });
  return NextResponse.json({ success: true });
}
