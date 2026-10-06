import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const item = await prisma.educationSchoolLevel.update({
      where: { id: parseInt(id) },
      data: {
        level: body.level?.trim(),
        ageRange: body.ageRange || null,
        durationYears: body.durationYears ? parseInt(body.durationYears) : null,
        isCompulsory: body.isCompulsory ?? false,
        numberOfSchools: body.numberOfSchools || null,
        title: body.title || null,
        description: body.description || null,
      },
    });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await prisma.educationSchoolLevel.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete" },
      { status: 500 },
    );
  }
}
