import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const item = await prisma.countryMajorCity.update({
      where: { id: parseInt(id) },
      data: {
        cityName: body.cityName?.trim(),
        description: body.description || null,
        population: body.population || null,
        highlights: body.highlights || null,
        cityImage: body.cityImage || null,
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
  await prisma.countryMajorCity.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
