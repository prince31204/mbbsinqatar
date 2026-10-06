import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SYSTEM_ID = 1;

export async function GET() {
  const items = await prisma.educationSchoolLevel.findMany({
    where: { pageId: SYSTEM_ID },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.level?.trim())
      return NextResponse.json({ error: "Level required" }, { status: 422 });

    const item = await prisma.educationSchoolLevel.create({
      data: {
        pageId: SYSTEM_ID,
        level: body.level.trim(),
        ageRange: body.ageRange || null,
        durationYears: body.durationYears ? parseInt(body.durationYears) : null,
        isCompulsory: body.isCompulsory ?? false,
        numberOfSchools: body.numberOfSchools || null,
        title: body.title || null,
        description: body.description || null,
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
