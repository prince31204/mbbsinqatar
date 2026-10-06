import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const items = await prisma.universityTestimonial.findMany({
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
  if (!body.name)
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  const item = await prisma.universityTestimonial.create({
    data: {
      universityId: parseInt(id),
      name: body.name,
      designation: body.designation || null,
      country: body.country || null,
      course: body.course || null,
      year: body.year || null,
      description: body.description || null,
      rating: body.rating || null,
      imageName: body.imageName || null,
      imagePath: body.imagePath || null,
      videoUrl: body.videoUrl || null,
      position: body.position || 1,
      status: body.status ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
