import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const universityId = parseInt(id);
  const students = await prisma.universityStudent.findMany({
    where: { universityId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(students);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const universityId = parseInt(id);
  const body = await req.json();
  const student = await prisma.universityStudent.create({
    data: { ...body, universityId },
  });
  return NextResponse.json(student, { status: 201 });
}
