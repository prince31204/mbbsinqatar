import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const offices = await prisma.office.findMany({
      where: { status: true },
      orderBy: { position: "asc" },
    });
    return NextResponse.json(offices);
  } catch (error) {
    console.error("[OFFICES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
