import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const items = await prisma.universityFmgeRate.findMany({
    where: { universityId: parseInt(id) },
    orderBy: { year: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  if (!body.year)
    return NextResponse.json({ error: "Year required" }, { status: 400 });
  const item = await prisma.universityFmgeRate.create({
    data: {
      universityId: parseInt(id),
      year: parseInt(body.year),
      appeared: body.appeared ? parseInt(body.appeared) : null,
      passed: body.passed ? parseInt(body.passed) : null,
      passPercentage: body.passPercentage || null,
      firstAttemptPassRate: body.firstAttemptPassRate || null,
      rank: body.rank ? parseInt(body.rank) : null,
      notes: body.notes || null,
      source: body.source || null,
      position: body.position || 1,
      status: body.status ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
