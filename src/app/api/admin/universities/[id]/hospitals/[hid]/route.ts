import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; hid: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id, hid } = await params;
  await prisma.universityHospital.deleteMany({
    where: { universityId: parseInt(id), hospitalId: parseInt(hid) },
  });
  return NextResponse.json({ success: true });
}
