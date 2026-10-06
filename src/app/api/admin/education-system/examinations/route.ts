import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SYSTEM_ID = 1;

export async function GET() {
  const items = await prisma.educationExamination.findMany({
    where: { pageId: SYSTEM_ID },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.examName?.trim())
      return NextResponse.json(
        { error: "Exam name required" },
        { status: 422 },
      );

    const item = await prisma.educationExamination.create({
      data: {
        pageId: SYSTEM_ID,
        examName: body.examName.trim(),
        gradeLevel: body.gradeLevel || null,
        type: body.type || null,
        subjects: body.subjects || null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create" },
      { status: 500 },
    );
  }
}
