import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const modes = await prisma.studyMode.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(modes);
}

export async function POST(req: NextRequest) {
  try {
    const { studyMode } = await req.json();
    if (!studyMode?.trim())
      return NextResponse.json(
        { error: "Study mode name required" },
        { status: 422 },
      );
    const item = await prisma.studyMode.create({
      data: { studyMode: studyMode.trim() },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
