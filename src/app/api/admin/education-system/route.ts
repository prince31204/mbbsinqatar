import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SYSTEM_ID = 1;

export async function GET() {
  try {
    const record = await prisma.educationSystem.findUnique({
      where: { id: SYSTEM_ID },
      include: {
        _count: {
          select: {
            examinations: true,
            schoolLevels: true,
            degrees: true,
            popularFields: true,
          },
        },
      },
    });

    if (!record) {
      // Create default if missing
      const newRecord = await prisma.educationSystem.create({
        data: { id: SYSTEM_ID, title: "Education System in Qatar" },
      });
      return NextResponse.json(newRecord);
    }

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch education system" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    // Remove nested counts and relations if mistakenly sent
    const {
      _count,
      examinations,
      schoolLevels,
      degrees,
      popularFields,
      id,
      createdAt,
      updatedAt,
      ...data
    } = body;

    // Convert string numbers to Int/Decimal for Prisma
    const numericFields = [
      "higherInstitutionsCount",
      "universitiesCount",
      "academiesCount",
      "institutesCount",
    ];

    const decimalFields = [
      "literacyRate",
      "primaryEnrollment",
      "secondaryCompletion",
      "officialStateLanguagePercentage",
      "officialLanguagePercentage",
      "foreignLanguagePercentage",
    ];

    numericFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null) {
        data[field] = parseInt(data[field]) || 0;
      }
    });

    decimalFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null) {
        data[field] = parseFloat(data[field]) || 0;
      }
    });

    const updated = await prisma.educationSystem.upsert({
      where: { id: SYSTEM_ID },
      update: data,
      create: { id: SYSTEM_ID, ...data },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Education System Update Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update" },
      { status: 500 },
    );
  }
}
