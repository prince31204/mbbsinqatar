import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const items = await prisma.universityPhoto.findMany({
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
  const item = await prisma.universityPhoto.create({
    data: {
      universityId: parseInt(id),
      title: body.title || null,
      imageName: body.imageName || null,
      imagePath: body.imagePath || null,
      position: body.position || 1,
      status: body.status ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
