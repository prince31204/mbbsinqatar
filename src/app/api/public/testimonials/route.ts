import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: true },
      orderBy: { position: "asc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Public testimonials fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}
