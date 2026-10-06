import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const programs = await prisma.universityProgram.findMany({
    where: { universityId: parseInt(id), isActive: true },
    select: { id: true, programName: true },
    orderBy: { programName: "asc" },
  });
  return NextResponse.json({ programs });
}
