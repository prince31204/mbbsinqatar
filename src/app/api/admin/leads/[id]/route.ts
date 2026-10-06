import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id: parseInt(id) },
    include: {
      inquiries: { orderBy: { createdAt: "desc" } },
      applications: {
        include: {
          program: { include: { university: { select: { name: true } } } },
        },
        orderBy: { appliedAt: "desc" },
      },
    },
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  return NextResponse.json(
    await prisma.lead.update({ where: { id: parseInt(id) }, data: body }),
  );
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.lead.update({
    where: { id: parseInt(id) },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ success: true });
}
