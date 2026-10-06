import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const item = await prisma.countryLifestyleCulture.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title?.trim(),
        description: body.description || null,
        iconClass: body.iconClass || null,
        image: body.image || null,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.countryLifestyleCulture.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
