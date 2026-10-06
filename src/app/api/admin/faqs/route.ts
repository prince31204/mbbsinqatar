import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "25");
  const search = searchParams.get("search") ?? "";
  const where = search
    ? { question: { contains: search, mode: "insensitive" as const } }
    : undefined;
  const [data, total] = await Promise.all([
    prisma.faq.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true } } },
    }),
    prisma.faq.count({ where }),
  ]);
  return NextResponse.json({ data, total });
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { question, answer, status, sortOrder, position, categoryId } =
    await req.json();
  const pos = position ?? sortOrder ?? 0;
  try {
    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        status: status ?? true,
        position: pos,
        ...(categoryId
          ? { category: { connect: { id: Number(categoryId) } } }
          : {}),
      },
    });
    return NextResponse.json(faq, { status: 201 });
  } catch (err) {
    console.error("FAQ create error:", err);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 },
    );
  }
}
