import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const items = await prisma.faqCategory.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  if (!body.name)
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const item = await prisma.faqCategory.create({
    data: { name: body.name, slug, status: body.status ?? true },
  });
  return NextResponse.json(item, { status: 201 });
}
