import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import {
  filenameFromPath,
  normalizeLocalUpload,
  promoteTmpUpload,
} from "@/lib/upload-paths";

export async function GET(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "25");
  const search = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "desc";

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [data, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.blog.count({ where }),
  ]);

  return NextResponse.json({ data, total });
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();

  const rawThumbnail = body.thumbnailPath ?? body.thumbnail ?? null;
  const thumbnailPath =
    normalizeLocalUpload(rawThumbnail) ?? rawThumbnail ?? null;
  const imagePath =
    normalizeLocalUpload(body.imagePath) ?? body.imagePath ?? null;

  const firstUser = await prisma.user.findFirst();
  const fallbackAuthorId = firstUser?.id || 1;

  let blog = await prisma.blog.create({
    data: {
      title: body.title ?? null,
      slug: body.slug ?? null,
      shortnote: body.shortnote ?? body.excerpt ?? null,
      description: body.description ?? body.content ?? null,
      thumbnailPath,
      thumbnailName: filenameFromPath(thumbnailPath),
      imagePath,
      imageName: filenameFromPath(imagePath),
      categoryId: body.categoryId ? parseInt(body.categoryId) : 1,
      authorId: body.authorId
        ? parseInt(body.authorId)
        : parseInt(session.user?.id as string) || fallbackAuthorId,
      readingTime: body.readingTime ? parseInt(body.readingTime) : 5,
      status: body.status ?? true,
      homeView: body.homeView ?? body.isFeatured ?? false,
      trending: body.trending ?? false,
      metaTitle: body.metaTitle ?? null,
      metaKeyword: body.metaKeyword ?? null,
      metaDescription: body.metaDescription ?? null,
      schema: body.schema ?? null,
    },
  });

  const promotedThumbnail = await promoteTmpUpload(blog.thumbnailPath, blog.id);
  const promotedImage = await promoteTmpUpload(blog.imagePath, blog.id);
  const updates: Record<string, string | null> = {};
  if (promotedThumbnail !== blog.thumbnailPath)
    updates.thumbnailPath = promotedThumbnail;
  if (promotedImage !== blog.imagePath) updates.imagePath = promotedImage;
  if (Object.keys(updates).length > 0) {
    blog = await prisma.blog.update({ where: { id: blog.id }, data: updates });
  }

  return NextResponse.json(blog, { status: 201 });
}
