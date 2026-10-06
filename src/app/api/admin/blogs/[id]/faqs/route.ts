import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const blogId = parseInt(id);
  if (isNaN(blogId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  const faqs = await prisma.blogFaq.findMany({
    where: { blogId },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(faqs);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const blogId = parseInt(id);
  if (isNaN(blogId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  try {
    const { question, answer } = await req.json();
    if (!question?.trim())
      return NextResponse.json({ error: "Question required" }, { status: 422 });
    const faq = await prisma.blogFaq.create({
      data: { blogId, question: question.trim(), answer: answer ?? "" },
    });
    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
