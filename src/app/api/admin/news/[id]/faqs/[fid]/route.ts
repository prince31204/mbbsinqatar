import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fid: string }> },
) {
  const { fid } = await params;
  try {
    const { question, answer } = await req.json();
    const faq = await prisma.newsFaq.update({
      where: { id: parseInt(fid) },
      data: { question: question?.trim(), answer },
    });
    return NextResponse.json(faq);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; fid: string }> },
) {
  const { fid } = await params;
  await prisma.newsFaq.delete({ where: { id: parseInt(fid) } });
  return NextResponse.json({ ok: true });
}
