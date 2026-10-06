import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; lid: string }> };

// PATCH /api/admin/universities/[id]/links/[lid]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { lid } = await params;
  const id = parseInt(lid);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  try {
    const body = await req.json();
    const { title, url, type, position, status } = body;
    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (url !== undefined) data.url = url;
    if (type !== undefined) data.type = type;
    if (position !== undefined) data.position = position;
    if (status !== undefined) data.status = status;
    const link = await prisma.universityLink.update({ where: { id }, data });
    return NextResponse.json(link);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/admin/universities/[id]/links/[lid]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { lid } = await params;
  const id = parseInt(lid);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  await prisma.universityLink.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
