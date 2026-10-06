import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/blogs/[id]/contents/[cid]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; cid: string }> },
) {
  const { cid } = await params;
  const contentId = parseInt(cid);
  if (isNaN(contentId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  try {
    const body = await req.json();
    const item = await prisma.blogContent.update({
      where: { id: contentId },
      data: {
        title: body.title?.trim(),
        description: body.description ?? undefined,
        imagePath: body.imagePath ?? undefined,
        imageName: body.imageName ?? undefined,
        position:
          body.position !== undefined ? parseInt(body.position) : undefined,
        parentId:
          body.parentId !== undefined
            ? body.parentId
              ? parseInt(body.parentId)
              : null
            : undefined,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/admin/blogs/[id]/contents/[cid]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; cid: string }> },
) {
  const { cid } = await params;
  const contentId = parseInt(cid);
  if (isNaN(contentId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  await prisma.blogContent.delete({ where: { id: contentId } });
  return NextResponse.json({ ok: true });
}
