import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import {
  filenameFromPath,
  normalizeLocalUpload,
  promoteTmpUpload,
} from "@/lib/upload-paths";

export async function GET() {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const items = await prisma.expertTeam.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const photoPath =
    normalizeLocalUpload(body.photoPath) ?? body.photoPath ?? null;
  let item = await prisma.expertTeam.create({
    data: {
      name: body.name,
      designation: body.designation || null,
      description: body.description || null,
      photoPath,
      photoName: filenameFromPath(photoPath),
      linkedinUrl: body.linkedinUrl || null,
      position: body.position ? parseInt(body.position) : 1,
      status: body.status ?? true,
    },
  });

  const promotedPhoto = await promoteTmpUpload(item.photoPath, item.id);
  if (promotedPhoto !== item.photoPath) {
    item = await prisma.expertTeam.update({
      where: { id: item.id },
      data: { photoPath: promotedPhoto },
    });
  }
  return NextResponse.json(item, { status: 201 });
}
