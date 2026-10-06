import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.expertTeam.findMany({
    where: { status: true },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(items);
}
