import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; pid: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { pid } = await params;
  const item = await prisma.universityProgram.findUnique({
    where: { id: parseInt(pid) },
    include: { level: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { pid } = await params;
  const body = await req.json();
  const item = await prisma.universityProgram.update({
    where: { id: parseInt(pid) },
    data: {
      programName: body.programName,
      programSlug: body.programSlug,
      duration: body.duration || null,
      levelId: body.levelId ? parseInt(body.levelId) : null,
      studyMode: body.studyMode || null,
      totalFee: body.totalFee || null,
      totalTuitionFee: body.totalTuitionFee || null,
      annualTuitionFee: body.annualTuitionFee || null,
      currency: body.currency || "USD",
      applicationDeadline: body.applicationDeadline || null,
      intake: body.intake || null,
      isActive: body.isActive,
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
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { pid } = await params;
  await prisma.universityProgram.delete({ where: { id: parseInt(pid) } });
  return NextResponse.json({ success: true });
}
