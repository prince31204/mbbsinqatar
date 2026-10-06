import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  buildMetadata,
  APP_YEAR,
  ADMISSION_YEAR,
  breadcrumbSchema,
} from "@/lib/seo";
import UniversitySearch from "@/components/universities/UniversitySearch";

export const metadata: Promise<Metadata> = buildMetadata({
  title: `MBBS Universities in Japan — All NMC & WHO Recognized Medical Colleges ${APP_YEAR}`,
  description: `Browse all NMC & WHO recognized MBBS universities in Japan. Compare fees, intake, seats, and apply online for ${ADMISSION_YEAR} admission.`,
  path: "/universities",
  pageKey: "universities",
  entitySeo: {
    metaKeyword: `MBBS universities Japan, NMC recognized colleges Japan, medical university list Japan, study MBBS ${APP_YEAR}`,
  },
});

export const revalidate = 3600;

export default async function UniversitiesPage() {
  const universities = await prisma.university
    .findMany({
      where: { status: true },
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnailPath: true,
        rating: true,
        city: true,
        establishedYear: true,
        students: true,
        tuitionFee: true,
        approvedBy: true,
        courseDuration: true,
        fmgePassRate: true,
        neetRequirement: true,
        mediumOfInstruction: true,
        globalRanking: true,
        whoListed: true,
        nmcApproved: true,
        ministryLicensed: true,
        faimerListed: true,
        mciRecognition: true,
        instituteType: { select: { name: true } },
        province: { select: { name: true } },
        cityRelation: { select: { name: true } },
        scholarships: {
          where: { isActive: true },
          select: { title: true },
          take: 1,
        },
      },
      orderBy: [{ id: "asc" }],
    })
    .catch(() => []);

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Universities", url: "/universities" },
  ]);

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page Header */}
      <div className="bg-white text-[#17202A] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            MBBS Universities in Japan
          </h1>
          <p className="text-xl text-[#4B5563] max-w-3xl mx-auto">
            Explore all NMC and WHO recognized medical universities in Japan.
            Compare programs, fees, and apply online.
          </p>
          <p className="mt-4 text-[#4B5563] text-sm">
            {universities.length} universities listed
          </p>
        </div>
      </div>

      <UniversitySearch
        universities={universities.map((u) => ({
          ...u,
          students: u.students !== null ? String(u.students) : null,
          globalRanking:
            u.globalRanking !== null ? String(u.globalRanking) : null,
          rating: u.rating ? Number(u.rating) : null,
          tuitionFee: u.tuitionFee ? String(u.tuitionFee) : null,
          fmgePassRate: u.fmgePassRate ? Number(u.fmgePassRate) : null,
        }))}
      />
    </div>
  );
}
