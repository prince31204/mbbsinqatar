import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const items = await prisma.universityIntake.findMany({
    where: { universityId: parseInt(id) },
    orderBy: { position: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  if (!body.intakeMonth || !body.intakeYear)
    return NextResponse.json(
      { error: "Intake month and year required" },
      { status: 400 },
    );
  const item = await prisma.universityIntake.create({
    data: {
      universityId: parseInt(id),
      intakeMonth: body.intakeMonth,
      intakeYear: parseInt(body.intakeYear),
      applicationStart: body.applicationStart
        ? new Date(body.applicationStart)
        : null,
      applicationDeadline: body.applicationDeadline
        ? new Date(body.applicationDeadline)
        : null,
      classesStart: body.classesStart ? new Date(body.classesStart) : null,
      seats: body.seats ? parseInt(body.seats) : null,
      statusText: body.statusText || null,
      notes: body.notes || null,
      position: body.position || 1,
      isActive: body.isActive ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
