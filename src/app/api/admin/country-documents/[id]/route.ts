import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { filePath, fileName, title } = body;

    const doc = await prisma.countryDocument.update({
      where: { id: Number(id) },
      data: {
        ...(filePath !== undefined && { filePath }),
        ...(fileName !== undefined && { fileName }),
        ...(title !== undefined && { title }),
      },
    });

    return NextResponse.json(doc);
  } catch (err) {
    console.error("[country-documents PATCH]", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.countryDocument.update({
      where: { id: Number(id) },
      data: { isActive: false, filePath: "", fileName: null },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[country-documents DELETE]", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
