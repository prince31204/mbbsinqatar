import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; rid: string }> };

// PATCH /api/admin/universities/[id]/reviews/[rid]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { rid } = await params;
  const id = parseInt(rid);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  try {
    const body = await req.json();
    const {
      name,
      designation,
      country,
      course,
      year,
      description,
      rating,
      imageName,
      imagePath,
      position,
      status,
    } = body;
    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (designation !== undefined) data.designation = designation;
    if (country !== undefined) data.country = country;
    if (course !== undefined) data.course = course;
    if (year !== undefined) data.year = year;
    if (description !== undefined) data.description = description;
    if (rating !== undefined) data.rating = rating ? parseFloat(rating) : null;
    if (imageName !== undefined) data.imageName = imageName;
    if (imagePath !== undefined) data.imagePath = imagePath;
    if (position !== undefined) data.position = position;
    if (status !== undefined) data.status = status;
    const review = await prisma.universityReview.update({
      where: { id },
      data,
    });
    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/admin/universities/[id]/reviews/[rid]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { rid } = await params;
  const id = parseInt(rid);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  await prisma.universityReview.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
