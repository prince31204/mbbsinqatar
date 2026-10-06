import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SYSTEM_ID = 1;

export async function GET() {
  const items = await prisma.educationDegree.findMany({
    where: { pageId: SYSTEM_ID },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.degree?.trim())
      return NextResponse.json(
        { error: "Degree name required" },
        { status: 422 },
      );

    const item = await prisma.educationDegree.create({
      data: {
        pageId: SYSTEM_ID,
        degree: body.degree.trim(),
        duration: body.duration || null,
        ectsCredits: body.ectsCredits || null,
        recognition: body.recognition || null,
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
