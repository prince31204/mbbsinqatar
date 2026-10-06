import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  // Get hospitals linked to this university + all available hospitals for linking
  const linked = await prisma.universityHospital.findMany({
    where: { universityId: parseInt(id) },
    include: { hospital: true },
  });
  return NextResponse.json(linked);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  if (!body.hospitalId)
    return NextResponse.json(
      { error: "Hospital ID required" },
      { status: 400 },
    );
  // Check if already linked
  const existing = await prisma.universityHospital.findFirst({
    where: {
      universityId: parseInt(id),
      hospitalId: parseInt(body.hospitalId),
    },
  });
  if (existing)
    return NextResponse.json({ error: "Already linked" }, { status: 409 });
  const item = await prisma.universityHospital.create({
    data: { universityId: parseInt(id), hospitalId: parseInt(body.hospitalId) },
    include: { hospital: true },
  });
  return NextResponse.json(item, { status: 201 });
}
