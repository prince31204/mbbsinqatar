import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/blogs/[id]/contents
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const blogId = parseInt(id);
  if (isNaN(blogId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  const contents = await prisma.blogContent.findMany({
    where: { blogId },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(contents);
}

// POST /api/admin/blogs/[id]/contents
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const blogId = parseInt(id);
  if (isNaN(blogId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  try {
    const body = await req.json();
    const {
      title,
      description,
      imagePath,
      imageName,
      position,
      parentId,
      slug,
    } = body;
    if (!title?.trim())
      return NextResponse.json({ error: "Title required" }, { status: 422 });
    const item = await prisma.blogContent.create({
      data: {
        blogId,
        title: title.trim(),
        slug: slug || title.trim().toLowerCase().replace(/ /g, "-"),
        description: description ?? "",
        imagePath: imagePath || null,
        imageName: imageName || null,
        position: position ?? 0,
        parentId: parentId ? parseInt(parentId) : null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
