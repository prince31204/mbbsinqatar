import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const item = await prisma.news.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.news.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      slug: body.slug,
      shortnote: body.shortnote || null,
      description: body.description || null,
      thumbnailPath: body.thumbnailPath || null,
      imagePath: body.imagePath || null,
      categoryId: body.categoryId ? parseInt(body.categoryId) : undefined,
      status: body.status,
      homeView: body.homeView,
      trending: body.trending,
      metaTitle: body.metaTitle || null,
      metaKeyword: body.metaKeyword || null,
      metaDescription: body.metaDescription || null,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.news.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
