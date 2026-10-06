import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SYSTEM_ID = 1;

export async function GET() {
  const items = await prisma.educationPopularField.findMany({
    where: { pageId: SYSTEM_ID },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.field?.trim())
      return NextResponse.json(
        { error: "Field name required" },
        { status: 422 },
      );

    const item = await prisma.educationPopularField.create({
      data: {
        pageId: SYSTEM_ID,
        field: body.field.trim(),
        description: body.description || null,
        numberOfInstitutions: body.numberOfInstitutions || null,
        durationYears: body.durationYears || null,
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
