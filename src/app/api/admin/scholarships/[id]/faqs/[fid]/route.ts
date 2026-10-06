import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/scholarships/[id]/faqs/[fid]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fid: string }> },
) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { fid } = await params;
  const body = await req.json();
  const updated = await prisma.scholarshipFaq.update({
    where: { id: parseInt(fid) },
    data: body,
  });
  return NextResponse.json(updated);
}

// DELETE /api/admin/scholarships/[id]/faqs/[fid]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; fid: string }> },
) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { fid } = await params;
  await prisma.scholarshipFaq.delete({ where: { id: parseInt(fid) } });
  return NextResponse.json({ success: true });
}
