import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fid: string }> },
) {
  const { fid } = await params;
  const faqId = parseInt(fid);
  if (isNaN(faqId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  try {
    const { question, answer } = await req.json();
    const faq = await prisma.blogFaq.update({
      where: { id: faqId },
      data: { question: question?.trim(), answer },
    });
    return NextResponse.json(faq);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; fid: string }> },
) {
  const { fid } = await params;
  await prisma.blogFaq.delete({ where: { id: parseInt(fid) } });
  return NextResponse.json({ ok: true });
}
