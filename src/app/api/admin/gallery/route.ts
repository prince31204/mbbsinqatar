import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import {
  filenameFromPath,
  normalizeLocalUpload,
  promoteTmpUpload,
} from "@/lib/upload-paths";

export async function GET() {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const items = await prisma.gallery.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  if (!body.imagePath)
    return NextResponse.json({ error: "Image path required" }, { status: 400 });
  const imagePath =
    normalizeLocalUpload(body.imagePath) ?? body.imagePath ?? null;
  let item = await prisma.gallery.create({
    data: {
      title: body.title || null,
      imageName: body.imageName || filenameFromPath(imagePath) || "",
      imagePath: imagePath || "",
      position: body.position ? parseInt(body.position) : 1,
      status: body.status ?? true,
    },
  });

  const promotedImage = await promoteTmpUpload(item.imagePath, item.id);
  if (promotedImage && promotedImage !== item.imagePath) {
    item = await prisma.gallery.update({
      where: { id: item.id },
      data: { imagePath: promotedImage },
    });
  }
  return NextResponse.json(item, { status: 201 });
}
