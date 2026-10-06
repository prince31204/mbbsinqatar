import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const items = await prisma.universityProgram.findMany({
    where: { universityId: parseInt(id) },
    include: { level: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  if (!body.programName)
    return NextResponse.json(
      { error: "Program name required" },
      { status: 400 },
    );
  const item = await prisma.universityProgram.create({
    data: {
      universityId: parseInt(id),
      programName: body.programName,
      programSlug:
        body.programSlug ||
        body.programName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      duration: body.duration || null,
      levelId: body.levelId ? parseInt(body.levelId) : null,
      studyMode: body.studyMode || null,
      totalFee: body.totalFee || null,
      totalTuitionFee: body.totalTuitionFee || null,
      annualTuitionFee: body.annualTuitionFee || null,
      currency: body.currency || "USD",
      applicationDeadline: body.applicationDeadline || null,
      intake: body.intake || null,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder || 1,
      overview: body.overview || null,
      eligibility: body.eligibility || null,
      mediumOfInstruction: body.mediumOfInstruction || null,
      recognition: body.recognition || null,
      whyChooseVietnam: body.whyChooseVietnam || null,
      additionalInformation: body.additionalInformation || null,
      year1Syllabus: body.year1Syllabus || null,
      year2Syllabus: body.year2Syllabus || null,
      year3Syllabus: body.year3Syllabus || null,
      year4Syllabus: body.year4Syllabus || null,
      year5Syllabus: body.year5Syllabus || null,
      year6Syllabus: body.year6Syllabus || null,
      metaTitle: body.metaTitle || null,
      metaKeyword: body.metaKeyword || null,
      metaDescription: body.metaDescription || null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
