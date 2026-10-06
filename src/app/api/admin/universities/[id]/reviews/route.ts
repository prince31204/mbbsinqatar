import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/universities/[id]/reviews
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const universityId = parseInt(id);
  if (isNaN(universityId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  const reviews = await prisma.universityReview.findMany({
    where: { universityId },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(reviews);
}

// POST /api/admin/universities/[id]/reviews
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const universityId = parseInt(id);
  if (isNaN(universityId))
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
    if (!name?.trim())
      return NextResponse.json({ error: "Name required" }, { status: 422 });
    const review = await prisma.universityReview.create({
      data: {
        universityId,
        name: name.trim(),
        designation: designation || null,
        country: country || null,
        course: course || null,
        year: year || null,
        description: description || null,
        rating: rating ? parseFloat(rating) : null,
        imageName: imageName || null,
        imagePath: imagePath || null,
        position: position ?? 1,
        status: status ?? true,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
