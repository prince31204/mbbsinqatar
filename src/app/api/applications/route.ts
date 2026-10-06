import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { deliverLeadWebhook } from "@/lib/leadWebhook";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  previousEducation: z.string().optional(),
  schoolName: z.string().optional(),
  graduationYear: z.string().optional(),
  percentage: z.string().optional(),
  neetScore: z.string().optional(),
  passportNumber: z.string().optional(),
  universityId: z.number().optional(),
  universityName: z.string().optional(),
  programId: z.number().optional(),
  source: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "20");
    const search = searchParams.get("search") ?? "";

    const where = {
      leadType: "application",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          gender: true,
          country: true,
          city: true,
          state: true,
          fatherName: true,
          motherName: true,
          dateOfBirth: true,
          highestLevelOfEducation: true,
          gradeAverage: true,
          neetScore: true,
          interestedUniversity: true,
          interestedProgram: true,
          leadStatus: true,
          createdAt: true,
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({ data, total });
  } catch (err) {
    console.error("Applications GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const name = `${data.firstName} ${data.lastName}`.trim();

    // Check if lead with this email already exists
    let lead = await prisma.lead.findFirst({ where: { email: data.email } });

    const dobDate = data.dateOfBirth ? new Date(data.dateOfBirth) : null;

    const leadData = {
      name,
      phone: data.phone,
      gender: data.gender,
      city: data.city,
      state: data.state,
      country: data.country,
      fatherName: data.fatherName,
      motherName: data.motherName,
      dateOfBirth: dobDate,
      highestLevelOfEducation: data.previousEducation,
      gradeAverage: data.percentage,
      neetScore: data.neetScore ? parseInt(data.neetScore) : null,
      interestedUniversity: data.universityName,
      interestedProgram: data.programId?.toString(),
      note: [
        data.address ? `Address: ${data.address}` : null,
        data.postalCode ? `Postal Code: ${data.postalCode}` : null,
        data.schoolName ? `School/College: ${data.schoolName}` : null,
        data.graduationYear ? `Graduation Year: ${data.graduationYear}` : null,
        data.passportNumber ? `Passport: ${data.passportNumber}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      leadType: "application",
      leadStatus: "new",
      source: data.source || "apply-form",
    };

    if (lead) {
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: leadData,
      });
    } else {
      try {
        lead = await prisma.lead.create({
          data: { email: data.email, ...leadData },
        });
      } catch {
        // phone unique conflict — omit phone
        lead = await prisma.lead.create({
          data: { email: data.email, ...leadData, phone: undefined },
        });
      }
    }

    // Create inquiry as well
    const inquiry = await prisma.leadInquiry.create({
      data: {
        leadId: lead.id,
        universityId: data.universityId,
        universityName: data.universityName,
        source: data.source || "apply-form",
        status: "pending",
        message: `Full application submitted by ${name}`,
      },
    });

    after(() => deliverLeadWebhook(lead, inquiry));

    if (data.programId) {
      const existingApp = await prisma.studentApplication.findFirst({
        where: { leadId: lead.id, universityProgramId: data.programId },
      });
      if (!existingApp) {
        await prisma.studentApplication.create({
          data: {
            leadId: lead.id,
            universityProgramId: data.programId,
            status: "applied",
            notes: "Submitted via main application form",
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Application submitted successfully." },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 422 },
      );
    }
    console.error("Application POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
