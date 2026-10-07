import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/homepage/HeroSection";
import UniversityGrid from "@/components/homepage/UniversityGrid";
import UniversityMapSection from "@/components/homepage/UniversityMapSection";
import AboutQatar from "@/components/homepage/AboutQatar";
import ScholarshipsSection from "@/components/homepage/ScholarshipsSection";
import EducationSystem from "@/components/homepage/EducationSystem";
import MinistryLinks from "@/components/homepage/MinistryLinks";
import CompareUniversities from "@/components/homepage/CompareUniversities";
import FmgeSection from "@/components/homepage/FmgeSection";
import HomepageFAQ from "@/components/homepage/HomepageFAQ";
import { homepageFaqs } from "@/lib/homepage-faqs";
import {
  organizationSchema,
  buildMetadata,
  faqSchema,
  APP_YEAR,
  ADMISSION_YEAR,
} from "@/lib/seo";
import { getHomepageStats, getHomepageFaqs } from "@/lib/public-page-content";

export const metadata: Promise<Metadata> = buildMetadata({
  title: `MBBS in Qatar ${APP_YEAR} | NMC Recognised Universities | Fees & Admission for Indian Students`,
  description: `Explore top NMC-recognised medical universities in Qatar. Compare fees, FMGE rates, and apply for MBBS ${APP_YEAR} admission. Free counselling for Indian students.`,
  path: "/",
  pageKey: "home",
  entitySeo: {
    metaKeyword: `MBBS in Qatar, study MBBS Qatar, medical university Qatar, NMC recognized Qatar, MBBS admission ${APP_YEAR}, low fee MBBS abroad`,
  },
});

const UniversityGridFallback = () => (
  <section className="py-8 bg-[#FAF8F7]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default async function HomePage() {
  const [stats, faqs, visibility] = await Promise.all([
    getHomepageStats(),
    getHomepageFaqs(),
    prisma.websiteSetting
      .findUnique({ where: { key: "scholarship_visibility" } })
      .catch(() => null),
  ]);

  const showScholarship = visibility?.value !== "false";

  const jsonLd = [organizationSchema(), faqSchema(faqs)];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sections */}
      <HeroSection stats={stats} />
      <Suspense fallback={<UniversityGridFallback />}>
        <UniversityGrid />
      </Suspense>

      <Suspense fallback={<div className="py-16 bg-white mb-2" />}>
        <UniversityMapSection />
      </Suspense>

      <AboutQatar />

      <Suspense fallback={<div className="py-16 bg-[#FAF8F7]" />}>
        <CompareUniversities />
      </Suspense>

      {showScholarship && (
        <Suspense fallback={<div className="py-16 bg-white" />}>
          <ScholarshipsSection stats={stats} />
        </Suspense>
      )}

      <Suspense fallback={<div className="py-16 bg-white" />}>
        <FmgeSection />
      </Suspense>
      <EducationSystem />
      <MinistryLinks />
      <HomepageFAQ dynamicFaqs={faqs} />
    </>
  );
}
