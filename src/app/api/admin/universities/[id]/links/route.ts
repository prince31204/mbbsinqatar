import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/universities/[id]/links
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const universityId = parseInt(id);
  if (isNaN(universityId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  const links = await prisma.universityLink.findMany({
    where: { universityId },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(links);
}

// POST /api/admin/universities/[id]/links
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const universityId = parseInt(id);
  if (isNaN(universityId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  try {
    const body = await req.json();
    const { title, url, type, position, status } = body;
    if (!title?.trim())
      return NextResponse.json({ error: "Title required" }, { status: 422 });
    if (!url?.trim())
      return NextResponse.json({ error: "URL required" }, { status: 422 });
    const link = await prisma.universityLink.create({
      data: {
        universityId,
        title: title.trim(),
        url: url.trim(),
        type: type || null,
        position: position ?? 1,
        status: status ?? true,
      },
    });
    return NextResponse.json(link, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
