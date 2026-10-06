import { NextResponse, after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { deliverLeadWebhook } from "@/lib/leadWebhook";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  nationality: z.string().optional(),
  message: z.string().optional(),
  universityId: z.number().optional(),
  universityName: z.string().optional(),
  scholarshipId: z.number().optional(),
  leadSource: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = leadSchema.parse(body);

    const leadSource = data.source || data.leadSource || "website";

    // Find or create/update lead
    const lead = await prisma.lead.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        phone: data.phone,
        ...(data.nationality ? { country: data.nationality } : {}),
        source: leadSource,
        updatedAt: new Date(),
      },
      create: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        ...(data.nationality ? { country: data.nationality } : {}),
        source: leadSource,
        leadType: "inquiry",
        leadStatus: "new",
      },
    });

    // Check if this inquiry already exists to avoid duplicates from same source
    const existingInquiry = await prisma.leadInquiry.findFirst({
      where: {
        leadId: lead.id,
        source: leadSource,
        status: "pending",
      },
    });

    if (existingInquiry) {
      return NextResponse.json(
        { message: "Lead already exists for this source" },
        { status: 409 },
      );
    }

    const messageText = [
      data.message,
      data.nationality ? `Nationality: ${data.nationality}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const inquiry = await prisma.leadInquiry.create({
      data: {
        leadId: lead.id,
        universityId: data.universityId,
        universityName: data.universityName,
        scholarshipId: data.scholarshipId,
        message: messageText || null,
        source: leadSource,
        status: "pending",
      },
    });

    after(() => deliverLeadWebhook(lead, inquiry));

    return NextResponse.json(
      { message: "Inquiry submitted successfully." },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 422 },
      );
    }
    console.error("Lead API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
