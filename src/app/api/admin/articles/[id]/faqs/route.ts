import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const articleId = parseInt(id);
  const faqs = await prisma.articleFaq.findMany({
    where: { articleId },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(faqs);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const articleId = parseInt(id);
  try {
    const { question, answer } = await req.json();
    if (!question?.trim())
      return NextResponse.json({ error: "Question required" }, { status: 422 });
    const faq = await prisma.articleFaq.create({
      data: { articleId, question: question.trim(), answer: answer ?? "" },
    });
    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
