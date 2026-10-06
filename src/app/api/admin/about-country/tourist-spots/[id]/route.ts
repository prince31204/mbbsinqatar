import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const item = await prisma.countryTouristAttraction.update({
      where: { id: parseInt(id) },
      data: {
        attractionName: body.attractionName?.trim(),
        description: body.description || null,
        ordering: body.ordering ?? 0,
        isActive: body.isActive ?? true,
        image: body.image || null,
        iconClass: body.iconClass || null,
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
  await prisma.countryTouristAttraction.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
