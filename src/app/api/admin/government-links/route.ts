import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const items = await prisma.officialGovernmentLink.findMany({
    orderBy: { position: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  if (!body.name || !body.url)
    return NextResponse.json(
      { error: "Name and URL required" },
      { status: 400 },
    );
  const item = await prisma.officialGovernmentLink.create({
    data: {
      name: body.name,
      url: body.url,
      description: body.description || null,
      logoPath: body.logoPath || null,
      category: body.category || null,
      position: body.position ? parseInt(body.position) : 1,
      status: body.status ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
