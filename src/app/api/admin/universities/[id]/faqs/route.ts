import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const items = await prisma.universityFaq.findMany({
    where: { universityId: parseInt(id) },
    orderBy: { position: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  if (!body.question || !body.answer)
    return NextResponse.json(
      { error: "Question and answer required" },
      { status: 400 },
    );
  const count = await prisma.universityFaq.count({
    where: { universityId: parseInt(id) },
  });
  const item = await prisma.universityFaq.create({
    data: {
      universityId: parseInt(id),
      question: body.question,
      answer: body.answer,
      position: count + 1,
      status: body.status ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
