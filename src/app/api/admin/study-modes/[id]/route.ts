import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const { studyMode } = await req.json();
    const item = await prisma.studyMode.update({
      where: { id: parseInt(id) },
      data: { studyMode: studyMode?.trim() },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.studyMode.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
