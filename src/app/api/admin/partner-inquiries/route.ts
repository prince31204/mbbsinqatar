import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "25");
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { company: { contains: search, mode: "insensitive" as const } },
            { city: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.partnerInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.partnerInquiry.count({ where }),
    ]);

    return NextResponse.json({ data, total });
  } catch (err) {
    console.error("Admin partner inquiries error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const inquiry = await prisma.partnerInquiry.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        company: body.company || null,
        city: body.city || null,
        partnerType: body.partnerType || null,
        message: body.message || null,
        status: body.status || "converted",
        studentsPlaced: body.studentsPlaced
          ? parseInt(body.studentsPlaced)
          : null,
        experience: body.experience ? parseInt(body.experience) : null,
        rating: body.rating ? parseFloat(body.rating) : null,
        imageName: body.imageName || null,
        imagePath: body.imagePath || null,
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (err) {
    console.error("Admin partner create error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
