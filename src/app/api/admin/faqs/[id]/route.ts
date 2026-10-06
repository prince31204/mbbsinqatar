import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });
  if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(faq);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const { sortOrder, position, categoryId, ...rest } = await req.json();
  const pos = position ?? sortOrder;
  const data: Record<string, unknown> = { ...rest };
  if (pos !== undefined) data.position = pos;
  if (categoryId !== undefined) {
    data.category = categoryId
      ? { connect: { id: Number(categoryId) } }
      : { disconnect: true };
  }
  return NextResponse.json(
    await prisma.faq.update({ where: { id: parseInt(id) }, data }),
  );
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.faq.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
