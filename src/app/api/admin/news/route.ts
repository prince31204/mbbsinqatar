import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { normalizeLocalUpload, promoteTmpUpload } from "@/lib/upload-paths";

export async function GET(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.news.count({ where }),
  ]);
  return NextResponse.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  if (!body.title || !body.slug)
    return NextResponse.json(
      { error: "Title and slug required" },
      { status: 400 },
    );
  const thumbnailPath =
    normalizeLocalUpload(body.thumbnailPath) ?? body.thumbnailPath ?? null;
  const imagePath =
    normalizeLocalUpload(body.imagePath) ?? body.imagePath ?? null;

  let item = await prisma.news.create({
    data: {
      title: body.title,
      slug: body.slug,
      shortnote: body.shortnote || null,
      description: body.description || null,
      thumbnailPath,
      imagePath,
      categoryId: body.categoryId ? parseInt(body.categoryId) : 1,
      authorId: parseInt(session.user?.id as string) || 1,
      status: body.status ?? true,
      homeView: body.homeView ?? false,
      trending: body.trending ?? false,
      metaTitle: body.metaTitle || null,
      metaKeyword: body.metaKeyword || null,
      metaDescription: body.metaDescription || null,
    },
  });

  const promotedThumbnail = await promoteTmpUpload(item.thumbnailPath, item.id);
  const promotedImage = await promoteTmpUpload(item.imagePath, item.id);
  const updates: Record<string, string | null> = {};
  if (promotedThumbnail !== item.thumbnailPath)
    updates.thumbnailPath = promotedThumbnail;
  if (promotedImage !== item.imagePath) updates.imagePath = promotedImage;
  if (Object.keys(updates).length > 0) {
    item = await prisma.news.update({ where: { id: item.id }, data: updates });
  }
  return NextResponse.json(item, { status: 201 });
}
