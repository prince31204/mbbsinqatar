import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  DollarSign,
  BookOpen,
  CheckCircle,
  Calendar,
  Globe,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Layers,
  Stethoscope,
  Building2,
  FileText,
  MapPin,
  Microscope,
  Activity,
  Download,
  CreditCard,
  Plane,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import {
  buildMetadata,
  breadcrumbSchema,
  APP_YEAR,
  ADMISSION_YEAR,
} from "@/lib/seo";
import DownloadFormPopup from "@/components/modals/DownloadFormPopup";
import ExpandableText from "@/components/ui/ExpandableText";
import ProgramPageClient from "./ProgramPageClient";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string; programSlug: string }>;
}

export async function generateStaticParams() {
  const programs = await prisma.universityProgram
    .findMany({
      where: { isActive: true },
      select: { programSlug: true, university: { select: { slug: true } } },
    })
    .catch(() => []);
  return programs.map((p) => ({
    slug: p.university.slug,
    programSlug: p.programSlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, programSlug } = await params;
  const program = await prisma.universityProgram
    .findFirst({
      where: { programSlug, university: { slug } },
      select: {
        programName: true,
        metaTitle: true,
        metaDescription: true,
        metaKeyword: true,
        university: { select: { name: true } },
      },
    })
    .catch(() => null);
  if (!program) return { title: "Program Not Found" };
  return buildMetadata({
    title:
      program.metaTitle ||
      `${program.programName} at ${program.university.name} — Qatar ${APP_YEAR}`,
    description:
      program.metaDescription ||
      `Study ${program.programName} at ${program.university.name}, Qatar. NMC recognized, English medium, affordable fees. Apply for ${ADMISSION_YEAR}.`,
    path: `/universities/${slug}/courses/${programSlug}`,
    entitySeo: {
      metaKeyword:
        program.metaKeyword ||
        `${program.programName} Qatar, MBBS Qatar, ${program.university.name}`,
    },
  });
}

export default async function UniversityProgramDetailPage({ params }: Props) {
  const { slug, programSlug } = await params;

  const program = await prisma.universityProgram
    .findFirst({
      where: { programSlug, university: { slug } },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            slug: true,
            thumbnailPath: true,
            city: true,
            nmcApproved: true,
            whoListed: true,
            faimerListed: true,
            programs: {
              where: { isActive: true },
              select: {
                id: true,
                programName: true,
                programSlug: true,
                annualTuitionFee: true,
                duration: true,
                currency: true,
              },
            },
            hospitals: {
              include: { hospital: true },
              orderBy: { id: "asc" },
              take: 6,
            },
            facilities: {
              include: { facility: true },
              orderBy: { id: "asc" },
            },
          },
        },
        level: true,
      },
    })
    .catch(() => null);

  if (!program || !program.isActive) notFound();

  const u = program.university;

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Universities", url: "/universities" },
    { name: u.name, url: `/universities/${u.slug}` },
    {
      name: program.programName,
      url: `/universities/${u.slug}/courses/${program.programSlug}`,
    },
  ]);

  const syllabusYears = [
    { year: "Year 1", label: "First Year", content: program.year1Syllabus },
    { year: "Year 2", label: "Second Year", content: program.year2Syllabus },
    { year: "Year 3", label: "Third Year", content: program.year3Syllabus },
    { year: "Year 4", label: "Fourth Year", content: program.year4Syllabus },
    { year: "Year 5", label: "Fifth Year", content: program.year5Syllabus },
    { year: "Year 6", label: "Sixth Year", content: program.year6Syllabus },
  ].filter((s) => s.content);

  const facilityIconMap: Record<number, string> = {
    1: "lab",
    2: "library",
    3: "hostel",
    4: "cafeteria",
    5: "wifi",
    6: "transport",
  };
  const admissionProcess = [
    {
      step: 1,
      icon: CheckCircle,
      title: "NEET Qualification",
      description:
        "Clear NEET with minimum qualifying percentile as required by NMC guidelines.",
      timeline: "May–June",
      color: "bg-[#F9FAFB] text-[#8A1538]",
    },
    {
      step: 2,
      icon: FileText,
      title: "University Selection & Application",
      description:
        "Choose your university and submit application with required documents.",
      timeline: "June–July",
      color: "bg-[#F7E9EE] text-[#5B0F26]",
    },
    {
      step: 3,
      icon: CheckCircle,
      title: "Document Verification",
      description:
        "University verifies your documents and academic credentials.",
      timeline: "July–Aug",
      color: "bg-purple-100 text-purple-600",
    },
    {
      step: 4,
      icon: CreditCard,
      title: "Fee Payment & Admission Letter",
      description:
        "Pay registration fee and receive official admission offer letter.",
      timeline: "August",
      color: "bg-orange-100 text-orange-600",
    },
    {
      step: 5,
      icon: Plane,
      title: "Visa Processing",
      description:
        "Apply for Qatar student visa with your admission documents.",
      timeline: "Aug–Sep",
      color: "bg-pink-100 text-pink-600",
    },
    {
      step: 6,
      icon: GraduationCap,
      title: "Travel & Enrollment",
      description:
        "Travel to Qatar and complete university enrollment and orientation.",
      timeline: "September",
      color: "bg-[#F9FAFB] text-[#8A1538]",
    },
  ];

  // Strip HTML to plain text for ExpandableText
  const getPlainText = (html: string | null | undefined): string => {
    if (!html) return "";
    return html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const additionalInfoText = getPlainText(
    program.additionalInformation || program.whyChooseVietnam,
  );

  // Fetch brochure document separately to avoid deep nested generic TS issues in some editors
  // Note: Cast to any to bypass stale VS Code Prisma caching errors
  const pClient: any = prisma;
  const brochureDoc = await pClient.universityDocument.findFirst({
    where: { universityId: u.id, type: "brochure", isActive: true },
  });
  const brochureUrl = brochureDoc?.filePath
    ? (cdn(brochureDoc.filePath) ?? undefined)
    : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-[#FAF8F7] border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-[#4B5563]">
          <Link href="/" className="hover:text-[#5B0F26]">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/universities" className="hover:text-[#5B0F26]">
            Universities
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/universities/${u.slug}`}
            className="hover:text-[#5B0F26]"
          >
            {u.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1F2937] font-medium">
            {program.programName}
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#5B0F26] text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {program.level && (
                  <span className="bg-white/20 text-[#1F2937] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {program.level.name}
                  </span>
                )}
                {u.nmcApproved && (
                  <span className="bg-red-500/30 text-green-200 text-xs font-bold px-3 py-1 rounded-full">
                    ✓ NMC Approved
                  </span>
                )}
                {u.whoListed && (
                  <a
                    href="https://www.who.int/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#F9FAFB]/30 text-[#F8E9EB] text-xs font-bold px-3 py-1 rounded-full hover:bg-[#F9FAFB]/50 transition-colors"
                  >
                    ✓ WHO Listed
                  </a>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                {program.programName}
              </h1>
              <p className="text-[#4B5563] text-lg mb-2">{u.name}</p>
              {u.city && (
                <p className="text-[#4B5563] text-sm">📍 {u.city}, Qatar</p>
              )}
              {program.overview && (
                <p className="text-[#4B5563] mt-5 leading-relaxed max-w-2xl line-clamp-4">
                  {getPlainText(program.overview)}
                </p>
              )}

              {/* Quick highlight badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                {program.duration && (
                  <div className="bg-[#F9FAFB] rounded-xl p-4 ">
                    <Clock className="w-5 h-5 text-[#4B5563] mb-2" />
                    <p className="text-sm text-[#4B5563]">Duration</p>
                    <p className="text-base font-semibold">
                      {program.duration}
                    </p>
                  </div>
                )}
                {program.recognition && (
                  <div className="bg-[#F9FAFB] rounded-xl p-4 ">
                    <Globe className="w-5 h-5 text-[#4B5563] mb-2" />
                    <p className="text-sm text-[#4B5563]">Recognition</p>
                    <p className="text-base font-semibold">
                      {program.recognition}
                    </p>
                  </div>
                )}
                {program.annualTuitionFee && (
                  <div className="bg-[#F9FAFB] rounded-xl p-4 ">
                    <DollarSign className="w-5 h-5 text-[#4B5563] mb-2" />
                    <p className="text-sm text-[#4B5563]">Annual Fee</p>
                    <p className="text-base font-semibold">
                      {String(program.annualTuitionFee)}
                    </p>
                  </div>
                )}
                {program.mediumOfInstruction && (
                  <div className="bg-[#F9FAFB] rounded-xl p-4 ">
                    <BookOpen className="w-5 h-5 text-[#4B5563] mb-2" />
                    <p className="text-sm text-[#4B5563]">Medium</p>
                    <p className="text-base font-semibold">
                      {program.mediumOfInstruction}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-white text-[#1F2937] rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold text-lg mb-4 text-[#1F2937]">
                Program Details
              </h3>
              <div className="space-y-3">
                {program.duration && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                    <span className="text-[#6B7280] flex items-center gap-1.5 text-base">
                      <Clock className="w-4 h-4" />
                      Duration
                    </span>
                    <span className="font-semibold text-base">
                      {program.duration}
                    </span>
                  </div>
                )}
                {program.annualTuitionFee && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                    <span className="text-[#6B7280] flex items-center gap-1.5 text-base">
                      <DollarSign className="w-4 h-4" />
                      Annual Fee
                    </span>
                    <span className="font-semibold text-base text-[#5B0F26]">
                      {String(program.annualTuitionFee)}
                    </span>
                  </div>
                )}
                {program.totalFee && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                    <span className="text-[#6B7280] flex items-center gap-1.5 text-base">
                      <DollarSign className="w-4 h-4" />
                      Total Fee
                    </span>
                    <span className="font-semibold text-base text-[#5B0F26]">
                      {String(program.totalFee)}
                    </span>
                  </div>
                )}
                {program.mediumOfInstruction && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                    <span className="text-[#6B7280] flex items-center gap-1.5 text-base">
                      <Globe className="w-4 h-4" />
                      Medium
                    </span>
                    <span className="font-semibold text-base">
                      {program.mediumOfInstruction}
                    </span>
                  </div>
                )}
                {program.recognition && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                    <span className="text-[#6B7280] flex items-center gap-1.5 text-base">
                      <CheckCircle className="w-4 h-4" />
                      Recognition
                    </span>
                    <span className="font-semibold text-base">
                      {program.recognition}
                    </span>
                  </div>
                )}
                {program.intake && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                    <span className="text-[#6B7280] flex items-center gap-1.5 text-base">
                      <Calendar className="w-4 h-4" />
                      Intake
                    </span>
                    <span className="font-semibold text-base">
                      {program.intake}
                    </span>
                  </div>
                )}
                {program.applicationDeadline && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                    <span className="text-[#6B7280] flex items-center gap-1.5 text-base">
                      <Calendar className="w-4 h-4" />
                      Deadline
                    </span>
                    <span className="font-semibold text-base">
                      {program.applicationDeadline}
                    </span>
                  </div>
                )}
                <div className="pt-3 space-y-2">
                  <Link
                    href="/apply"
                    className="block w-full bg-[#8A1538] hover:bg-[#5B0F26] text-white text-center py-3 rounded-xl font-semibold transition-colors text-sm"
                  >
                    Apply Now <ArrowRight className="w-4 h-4 inline ml-1" />
                  </Link>
                  <Link
                    href={`/universities/${u.slug}`}
                    className="block w-full border border-[#E5E7EB] text-[#4B5563] hover:bg-[#FAF8F7] text-center py-2.5 rounded-xl text-base font-medium transition-colors"
                  >
                    View University →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-10">
          {/* Course Overview */}
          <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-[#8A1538]" /> Course Overview
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Program Structure
                </h3>
                <div className="space-y-3">
                  {program.duration && (
                    <div className="flex items-center p-4 bg-white rounded-xl border border-[#E5E7EB]">
                      <Calendar className="w-5 h-5 text-[#8A1538] mr-3 shrink-0" />
                      <div>
                        <p className="font-semibold text-[#1F2937] text-base">
                          Duration
                        </p>
                        <p className="text-[#5B0F26] text-base">
                          {program.duration}
                        </p>
                      </div>
                    </div>
                  )}
                  {program.mediumOfInstruction && (
                    <div className="flex items-center p-4 bg-[#F7E9EE] rounded-xl border border-green-100">
                      <Globe className="w-5 h-5 text-[#5B0F26] mr-3 shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900 text-base">
                          Medium of Instruction
                        </p>
                        <p className="text-[#5B0F26] text-base">
                          {program.mediumOfInstruction}
                        </p>
                      </div>
                    </div>
                  )}
                  {program.recognition && (
                    <div className="flex items-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <CheckCircle className="w-5 h-5 text-purple-600 mr-3 shrink-0" />
                      <div>
                        <p className="font-semibold text-purple-900 text-base">
                          Recognition
                        </p>
                        <p className="text-purple-700 text-base">
                          {program.recognition}
                        </p>
                      </div>
                    </div>
                  )}
                  {program.annualTuitionFee && (
                    <div className="flex items-center p-4 bg-[#8A1538] rounded-xl border border-[#E5E7EB]">
                      <DollarSign className="w-5 h-5 text-[#8A1538] mr-3 shrink-0" />
                      <div>
                        <p className="font-semibold text-[#8A1538] text-base">
                          Annual Tuition Fee
                        </p>
                        <p className="text-[#8A1538] text-base">
                          {String(program.annualTuitionFee)}
                        </p>
                      </div>
                    </div>
                  )}
                  {program.intake && (
                    <div className="flex items-center p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <Calendar className="w-5 h-5 text-indigo-600 mr-3 shrink-0" />
                      <div>
                        <p className="font-semibold text-indigo-900 text-base">
                          Intake
                        </p>
                        <p className="text-indigo-700 text-base">
                          {program.intake}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Why Choose This Program?
                </h3>
                {program.whyChooseVietnam ? (
                  <div
                    className="text-[#4B5563] leading-relaxed text-base prose prose-base max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: program.whyChooseVietnam,
                    }}
                  />
                ) : (
                  <ul className="space-y-3">
                    {[
                      "Affordable tuition fees compared to private colleges in India",
                      "No donation or capitation fees required",
                      "WHO/NMC recognized globally accepted medical degree",
                      "Safe and student-friendly environment",
                      "English medium instruction with experienced faculty",
                      "Opportunity to practice in India after clearing NMC screening",
                      "Modern facilities and extensive clinical training",
                      "Easy visa process for Indian students",
                    ].map((point, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-[#5B0F26] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-[#4B5563] text-base">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Eligibility Criteria */}
          {program.eligibility && (
            <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                <CheckCircle className="w-7 h-7 text-[#5B0F26]" /> Eligibility
                Criteria
              </h2>
              <div
                className="prose prose-sm max-w-none text-[#4B5563] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: program.eligibility }}
              />
              <div className="mt-6 p-5 bg-[#8A1538] rounded-xl border border-[#E5E7EB]">
                <h3 className="text-base font-semibold text-[#8A1538] mb-1">
                  Important Note for Indian Students
                </h3>
                <p className="text-[#8A1538] text-base">
                  NEET qualification is mandatory for Indian students as per NMC
                  guidelines. Students must also clear the Foreign Medical
                  Graduate Examination (FMGE/NExT) to practice in India after
                  graduation.
                </p>
              </div>
            </section>
          )}

          {/* Additional Information */}
          {additionalInfoText && (
            <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
                Additional Information
              </h2>
              <p className="text-[#6B7280] text-base mb-5">
                Learn more about the education system and opportunities in
                Qatar
              </p>
              <ExpandableText text={additionalInfoText} wordLimit={80} />
            </section>
          )}

          {/* Year-wise Syllabus */}
          {syllabusYears.length > 0 && (
            <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                <span className="bg-[#F9FAFB] p-2 rounded-xl shadow-sm">
                  <Layers className="w-5 h-5 text-[#1F2937]" />
                </span>
                Year-wise Syllabus
              </h2>
              <div className="space-y-3">
                {syllabusYears.map(({ year, label, content }, idx) => (
                  <details
                    key={year}
                    open
                    className="group border border-[#E5E7EB] border-l-4 border-l-[#5B0F26] rounded-2xl shadow-sm overflow-hidden"
                  >
                    <summary className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-[#FAF8F7] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#F9FAFB] text-white font-bold text-sm shadow-sm shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-[#1F2937] text-base">
                            {year}
                          </span>
                          <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F9FAFB] text-[#5B0F26]">
                            {label}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8A1538] group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <div
                      className="px-5 pb-5 pt-3 text-[#4B5563] text-base leading-relaxed prose prose-base max-w-none bg-[#FAF8F7] border-t border-[#E5E7EB]"
                      dangerouslySetInnerHTML={{ __html: content! }}
                    />
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* University Facilities */}
          {u.facilities.length > 0 && (
            <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                <Building2 className="w-7 h-7 text-orange-600" /> University
                Facilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {u.facilities.map((uf) => {
                  const facilityType = facilityIconMap[uf.facilityId] || "lab";
                  const iconColors: Record<string, string> = {
                    lab: "text-[#8A1538]",
                    library: "text-purple-600",
                    hostel: "text-orange-600",
                    cafeteria: "text-[#5B0F26]",
                    wifi: "text-teal-600",
                    transport: "text-[#4B5563]",
                  };
                  const bgColors: Record<string, string> = {
                    lab: "bg-white",
                    library: "bg-purple-50",
                    hostel: "bg-orange-50",
                    cafeteria: "bg-[#F7E9EE]",
                    wifi: "bg-teal-50",
                    transport: "bg-[#FAF8F7]",
                  };
                  return (
                    <div
                      key={uf.id}
                      className={`flex items-start gap-4 p-5 rounded-xl border ${bgColors[facilityType] || "bg-[#FAF8F7]"} border-[#E5E7EB]`}
                    >
                      <div
                        className={`p-3 rounded-xl bg-white shadow-sm shrink-0`}
                      >
                        <Microscope
                          className={`w-6 h-6 ${iconColors[facilityType] || "text-[#4B5563]"}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1F2937]">
                          {uf.facility?.name || "Facility"}
                        </h3>
                        {uf.description && (
                          <p className="text-[#4B5563] text-base mt-1">
                            {uf.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Hospital Affiliations */}
          {u.hospitals.length > 0 && (
            <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-3 flex items-center gap-2">
                <Stethoscope className="w-7 h-7 text-[#8A1538]" /> Hospital
                Affiliations & Clinical Training
              </h2>
              <p className="text-[#4B5563] mb-6 text-sm">
                Students gain hands-on clinical experience at top-tier hospitals
                across Qatar, ensuring comprehensive practical training.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {u.hospitals.map((uh) => (
                  <div
                    key={uh.id}
                    className="rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#F9FAFB] p-2.5 rounded-xl shrink-0">
                          <Stethoscope className="w-5 h-5 text-[#8A1538]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1F2937] text-sm">
                            {uh.hospital.name}
                          </h3>
                          {uh.hospital.accreditation && (
                            <p className="text-[#8A1538] text-xs font-medium">
                              {uh.hospital.accreditation}
                            </p>
                          )}
                        </div>
                      </div>
                      {uh.hospital.beds && (
                        <span className="bg-white text-[#5B0F26] px-3 py-1 rounded-full text-xs font-medium shrink-0">
                          {uh.hospital.beds} Beds
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-[#6B7280]">
                      {(uh.hospital.city || uh.hospital.state) && (
                        <span className="flex items-center gap-1 bg-[#FAF8F7] rounded-md px-2 py-1">
                          <MapPin className="w-3 h-3" />
                          {[uh.hospital.city, uh.hospital.state]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                      {uh.hospital.establishedYear && (
                        <span className="bg-[#FAF8F7] rounded-md px-2 py-1">
                          Est. {uh.hospital.establishedYear}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Admission Process */}
          <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
              <FileText className="w-7 h-7 text-[#8A1538]" /> Admission Process
            </h2>
            <div className="space-y-5">
              {admissionProcess.map((step, index) => (
                <div key={step.step} className="flex items-start gap-5">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-11 h-11 bg-[#8A1538] text-white rounded-full flex items-center justify-center text-base font-bold shadow-sm">
                      {step.step}
                    </div>
                    {index < admissionProcess.length - 1 && (
                      <div className="w-px h-10 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                      <h3 className="font-semibold text-[#1F2937]">
                        {step.title}
                      </h3>
                      <span
                        className={`${step.color} px-3 py-1 rounded-full text-xs font-medium`}
                      >
                        {step.timeline}
                      </span>
                    </div>
                    <p className="text-[#4B5563] text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why Qatar */}
          {program.whyChooseVietnam && !program.additionalInformation && (
            <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-[#8A1538]" /> Why Study in
                Qatar?
              </h2>
              <div className="prose prose-sm max-w-none text-[#4B5563] leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{ __html: program.whyChooseVietnam }}
                />
              </div>
            </section>
          )}

          {/* Other Programs Sidebar + CTA */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* CTA Section */}
              <div className="bg-[#5B0F26] rounded-2xl p-8 text-[#1F2937] text-center">
                <h2 className="text-2xl font-bold mb-3">
                  Ready to Start Your Medical Journey?
                </h2>
                <p className="text-[#F8E9EB] text-sm mb-6 max-w-xl mx-auto">
                  Join thousands of students who have successfully completed
                  their MBBS at {u.name}. Get personalized guidance throughout
                  your admission process.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/apply"
                    className="bg-white text-[#8A1538] hover:bg-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Apply Now
                  </Link>
                  <ProgramPageClient
                    brochureUrl={brochureUrl}
                    universityName={u.name}
                  />
                  <Link
                    href="/contact-us"
                    className="border-2 border-white text-white hover:bg-[#5B0F26] hover:border-[#5B0F26] px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Talk to Counsellor
                  </Link>
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              {/* University card */}
              {u.thumbnailPath && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                  <div className="relative h-36">
                    <Image
                      src={cdn(u.thumbnailPath) || ""}
                      alt={u.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1F2937] text-sm">
                      {u.name}
                    </h3>
                    {u.city && (
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        📍 {u.city}, Qatar
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Other Programs */}
              {u.programs.length > 1 && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <h3 className="font-bold text-[#1F2937] mb-3 text-sm">
                    Other Programs
                  </h3>
                  <div className="space-y-2">
                    {u.programs
                      .filter((p) => p.programSlug !== program.programSlug)
                      .map((p) => (
                        <Link
                          key={p.id}
                          href={`/universities/${u.slug}/courses/${p.programSlug}`}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAF8F7] border border-[#E5E7EB] text-sm transition-colors"
                        >
                          <span className="font-medium text-[#1F2937] line-clamp-1">
                            {p.programName}
                          </span>
                          {p.annualTuitionFee && (
                            <span className="text-[#5B0F26] font-semibold shrink-0 ml-2 text-xs">
                              {String(p.annualTuitionFee)}
                            </span>
                          )}
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Counsellor Card */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center shadow-sm">
                <h3 className="font-bold text-[#1F2937] mb-1.5 text-sm">
                  Need Guidance?
                </h3>
                <p className="text-xs text-[#4B5563] mb-4">
                  Our counsellors are available Mon–Sat, 9am–7pm IST.
                </p>
                <Link
                  href="/contact-us"
                  className="block bg-[#8A1538] hover:bg-[#5B0F26] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Talk to Counsellor
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
