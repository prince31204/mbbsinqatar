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
  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : undefined;
  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.testimonial.count({ where }),
  ]);
  return NextResponse.json({ data, total });
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const imagePath =
    normalizeLocalUpload(body.imagePath) ?? body.imagePath ?? null;
  const imageName = body.imageName || filenameFromPath(imagePath);
  let testimonial = await prisma.testimonial.create({
    data: {
      name: body.name,
      designation: body.designation || null,
      description: body.description || null,
      imagePath,
      imageName,
      rating: body.rating ?? null,
      videoUrl: body.videoUrl || null,
      position: body.position ? parseInt(body.position) : 1,
      status: body.status ?? true,
    },
  });

  const promotedImage = await promoteTmpUpload(
    testimonial.imagePath,
    testimonial.id,
  );
  if (promotedImage !== testimonial.imagePath) {
    testimonial = await prisma.testimonial.update({
      where: { id: testimonial.id },
      data: { imagePath: promotedImage },
    });
  }
  return NextResponse.json(testimonial, { status: 201 });
}
