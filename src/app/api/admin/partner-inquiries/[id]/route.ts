import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const inquiry = await prisma.partnerInquiry.findUnique({
      where: { id },
    });

    if (!inquiry)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(inquiry);
  } catch (err) {
    console.error("GET partner inquiry error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json();

    // Allowed fields to update
    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.partnerType !== undefined)
      updateData.partnerType = body.partnerType;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.message !== undefined) updateData.message = body.message;
    if (body.studentsPlaced !== undefined)
      updateData.studentsPlaced = body.studentsPlaced
        ? parseInt(body.studentsPlaced)
        : null;
    if (body.experience !== undefined)
      updateData.experience = body.experience
        ? parseInt(body.experience)
        : null;
    if (body.rating !== undefined)
      updateData.rating = body.rating ? parseFloat(body.rating) : null;
    if (body.imageName !== undefined)
      updateData.imageName = body.imageName || null;
    if (body.imagePath !== undefined)
      updateData.imagePath = body.imagePath || null;
    const inquiry = await prisma.partnerInquiry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(inquiry);
  } catch (err) {
    console.error("PATCH partner inquiry error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
