import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Singleton GET — always returns first AboutUs record (id=1 default)
export async function GET() {
  const record = await prisma.aboutUs
    .findFirst({ orderBy: { id: "asc" } })
    .catch(() => null);
  return NextResponse.json(record);
}

// PATCH — update (or create) the singleton AboutUs page record
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await prisma.aboutUs.findFirst({ select: { id: true } });
    const data = {
      heroTitle: body.heroTitle || "",
      heroDescription: body.heroDescription || "",
      button1Label: body.button1Label || null,
      button1Link: body.button1Link || null,
      button2Label: body.button2Label || null,
      button2Link: body.button2Link || null,
      partnerUniversities: body.partnerUniversities
        ? parseInt(body.partnerUniversities)
        : null,
      studentsPlaced: body.studentsPlaced
        ? parseInt(body.studentsPlaced)
        : null,
      channelPartners: body.channelPartners
        ? parseInt(body.channelPartners)
        : null,
      yearsExperience: body.yearsExperience
        ? parseInt(body.yearsExperience)
        : null,
      mission: body.mission || null,
      vision: body.vision || null,
      whyChooseUs: body.whyChooseUs || null,
      serviceDescription: body.serviceDescription || null,
      universityListings: body.universityListings || null,
      studentCounseling: body.studentCounseling || null,
      admissionAssistance: body.admissionAssistance || null,
      internationalSupport: body.internationalSupport || null,
      partnerWithUs: body.partnerWithUs || null,
      partnerBenefits: body.partnerBenefits || null,
      whyStudyMbbsTitle: body.whyStudyMbbsTitle || null,
      whyStudyMbbsDescription: body.whyStudyMbbsDescription || null,
      contact1: body.contact1 || null,
      contact2: body.contact2 || null,
      email1: body.email1 || null,
      email2: body.email2 || null,
      address: body.address || null,
    };
    const record = existing
      ? await prisma.aboutUs.update({ where: { id: existing.id }, data })
      : await prisma.aboutUs.create({ data });
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
