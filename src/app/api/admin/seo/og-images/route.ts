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
  const images = await prisma.defaultOgImage.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const imagePath =
    normalizeLocalUpload(body.imagePath) ?? body.imagePath ?? null;
  let img = await prisma.defaultOgImage.create({
    data: {
      name: body.name,
      imageName: body.imageName || filenameFromPath(imagePath),
      imagePath,
      status: body.status ?? true,
    },
  });
  const promotedImage = await promoteTmpUpload(img.imagePath, img.id);
  if (promotedImage && promotedImage !== img.imagePath) {
    img = await prisma.defaultOgImage.update({
      where: { id: img.id },
      data: { imagePath: promotedImage },
    });
  }
  return NextResponse.json(img, { status: 201 });
}
