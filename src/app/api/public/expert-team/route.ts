import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.expertTeam.findMany({
      where: { status: true },
      orderBy: { position: "asc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("[EXPERT_TEAM_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
