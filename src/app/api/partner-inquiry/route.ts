import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const partnerInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone must be at least 7 digits").optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  partnerType: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = partnerInquirySchema.parse(body);

    await prisma.partnerInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        city: data.city || null,
        partnerType: data.partnerType || null,
        message: data.message || null,
        status: "pending",
      },
    });

    return NextResponse.json(
      { message: "Partner inquiry submitted successfully." },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 422 },
      );
    }
    console.error("Partner inquiry API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
