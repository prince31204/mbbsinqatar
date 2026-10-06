import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const linked = await prisma.universityFacility.findMany({
    where: { universityId: parseInt(id) },
    include: { facility: true },
  });
  return NextResponse.json(linked);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  if (!body.facilityId)
    return NextResponse.json(
      { error: "Facility ID required" },
      { status: 400 },
    );
  const existing = await prisma.universityFacility.findFirst({
    where: {
      universityId: parseInt(id),
      facilityId: parseInt(body.facilityId),
    },
  });
  if (existing)
    return NextResponse.json({ error: "Already linked" }, { status: 409 });
  const item = await prisma.universityFacility.create({
    data: {
      universityId: parseInt(id),
      facilityId: parseInt(body.facilityId),
      description: body.description || null,
      status: body.status ?? true,
    },
    include: { facility: true },
  });
  return NextResponse.json(item, { status: 201 });
}
