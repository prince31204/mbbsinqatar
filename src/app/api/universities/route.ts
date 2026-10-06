import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const universities = await prisma.university.findMany({
    where: { status: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ universities });
}
