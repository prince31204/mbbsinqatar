// @ts-nocheck
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  ChevronRight,
  BookOpen,
  Globe,
  Users,
  Trophy,
  Award,
  ArrowRight,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  CreditCard,
  Plane,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import {
  buildMetadata,
  universitySchema,
  breadcrumbSchema,
  faqSchema,
  APP_YEAR,
  ADMISSION_YEAR,
} from "@/lib/seo";
import { replaceCurrencySymbol } from "@/lib/currency";
import InlineApplyForm from "@/components/university/InlineApplyForm";
import UniversityHero from "@/components/university/UniversityHero";
import UniversityAbout from "@/components/university/UniversityAbout";
import UniversityDocuments from "@/components/university/UniversityDocuments";
import UniversityTrustSeals from "@/components/university/UniversityTrustSeals";
import UniversityPrograms from "@/components/university/UniversityPrograms";
import UniversityFacilities from "@/components/university/UniversityFacilities";
import UniversityGallery from "@/components/university/UniversityGallery";
import UniversityRankings from "@/components/university/UniversityRankings";
import UniversityHospitals from "@/components/university/UniversityHospitals";
import UniversityFMGE from "@/components/university/UniversityFMGE";
import UniversityTestimonials from "@/components/university/UniversityTestimonials";
import UniversityFAQs from "@/components/university/UniversityFAQs";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const universities = await prisma.university
    .findMany({
      where: { status: true },
      select: { slug: true },
    })
    .catch(() => []);
  return universities.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const u = await prisma.university
    .findUnique({
      where: { slug },
      select: {
        name: true,
        shortnote: true,
        thumbnailPath: true,
        bannerPath: true,
        metaTitle: true,
        metaDescription: true,
        metaKeyword: true,
        city: true,
        province: { select: { name: true } },
      },
    })
    .catch(() => null);
  if (!u) return { title: "University Not Found" };
  return buildMetadata({
    title:
      u.metaTitle ||
      `${u.name} | MBBS Fees ${APP_YEAR}, NMC Status & Admission for Indians | mbbsinjapan.com`,
    description:
      u.metaDescription ||
      u.shortnote ||
      `Study MBBS at ${u.name}, Japan. NMC & WHO recognized, English medium, affordable fees. Apply ${ADMISSION_YEAR}.`,
    path: `/universities/${slug}`,
    entitySeo: {
      metaKeyword:
        u.metaKeyword ||
        `${u.name}, MBBS ${u.name}, ${u.city || "Japan"} medical university, MBBS Japan`,
    },
    ogImage: u.bannerPath
      ? (cdn(u.bannerPath) ?? undefined)
      : u.thumbnailPath
        ? (cdn(u.thumbnailPath) ?? undefined)
        : undefined,
  });
}

export default async function UniversityDetailPage({ params }: Props) {
  const { slug } = await params;
  const university = await prisma.university
    .findUnique({
      where: { slug },
      include: {
        instituteType: true,
        province: true,
        cityRelation: true,
        programs: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        faqs: { orderBy: { position: "asc" } },
        scholarships: { where: { isActive: true } },
        photos: {
          where: { status: true },
          orderBy: { position: "asc" },
          take: 12,
        },
        hospitals: { include: { hospital: true }, orderBy: { id: "asc" } },
        facilities: { include: { facility: true }, orderBy: { id: "asc" } },
        rankings: { where: { status: true }, orderBy: { position: "asc" } },
        testimonials: {
          where: { status: true },
          orderBy: { position: "asc" },
          take: 6,
        },
        reviews: {
          where: { status: true },
          orderBy: { position: "asc" },
          take: 6,
        },
        fmgeRates: {
          where: { status: true },
          orderBy: { year: "desc" },
          take: 5,
        },
        intakes: { where: { isActive: true }, orderBy: { id: "asc" } },
        studentRecords: { where: { status: true }, take: 8 },
        documents: true,
      },
    })
    .catch((e) => {
      console.error("[UniversityPage]", e?.message);
      return null;
    });

  if (!university) notFound();

  const countryDocs = await prisma.countryDocument
    .findMany({ where: { isActive: true, country: "Japan" } })
    .catch(() => []);

  const universityMapped = {
    ...university,
    brochurePath:
      university.documents.find((d) => d.type === "brochure")?.filePath || null,
    universityLicensePath:
      university.documents.find((d) => d.type === "university_license")
        ?.filePath || null,
    aggregationLetterPath:
      university.documents.find((d) => d.type === "aggregation_letter")
        ?.filePath || null,
    embassyLetterPath:
      countryDocs.find((d) => d.type === "embassy_letter")?.filePath || null,
    nmcGuidelinesPath:
      countryDocs.find((d) => d.type === "nmc_guidelines")?.filePath || null,
  };

  const jsonLd = [
    universitySchema({
      ...universityMapped,
      rating: universityMapped.rating ? Number(universityMapped.rating) : null,
      bestRating: universityMapped.bestRating
        ? Number(universityMapped.bestRating)
        : null,
      description: universityMapped.shortnote,
      foundingDate: universityMapped.establishedYear,
      numberOfStudents: universityMapped.students,
      sameAs: universityMapped.applyNowUrl,
    }),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Universities", url: "/universities" },
      {
        name: universityMapped.name,
        url: `/universities/${universityMapped.slug}`,
      },
    ]),
  ];

  if (universityMapped.faqs && universityMapped.faqs.length > 0) {
    jsonLd.push(faqSchema(universityMapped.faqs));
  }

  const applicationSteps = [
    {
      icon: FileText,
      title: "Submit Application",
      description:
        "Complete the online application form with all required documents and academic records.",
      timeframe: "1–2 days",
      color: "blue",
    },
    {
      icon: CheckCircle,
      title: "Document Verification",
      description:
        "Our admissions team verifies your documents and confirms academic eligibility.",
      timeframe: "3–5 days",
      color: "green",
    },
    {
      icon: CreditCard,
      title: "Fee Payment",
      description:
        "Pay the initial registration fee and receive your official admission offer letter.",
      timeframe: "1–2 days",
      color: "purple",
    },
    {
      icon: Plane,
      title: "Visa Processing",
      description:
        "We assist with your Japan student visa application and provide invitation letter.",
      timeframe: "15–20 days",
      color: "orange",
    },
    {
      icon: Calendar,
      title: "Arrival & Enrollment",
      description:
        "Arrive in Japan and complete your university enrollment and orientation.",
      timeframe: "2–3 days",
      color: "pink",
    },
  ];
  const stepColors: Record<string, string> = {
    blue: "bg-[#F9FAFB] text-[#BC002D]",
    green: "bg-red-100 text-[#8F0023]",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    pink: "bg-pink-100 text-pink-600",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-white border-b text-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-2 text-[#6B7280]">
          <Link href="/" className="hover:text-[#102A43]">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/universities" className="hover:text-[#102A43]">
            Universities
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#17202A] font-medium truncate">
            {universityMapped.name}
          </span>
        </div>
      </nav>

      <UniversityHero university={universityMapped} />

      {/* University Comparison Shortcuts — Internal Linking Hub */}
      <section className="bg-[#FFFDF9] border-y border-[#E5E7EB] py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-4 text-sm text-[#4B5563]">
          <span className="font-semibold text-[#17202A]">
            Compare Universities:
          </span>
          <Link href="/compare" className="text-[#BC002D] hover:underline">
            Full Comparison Tool
          </Link>
        </div>
      </section>

      <UniversityAbout university={universityMapped} />

      {/* Added Content Section: Infrastructure & Facilities Detail */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#17202A] mb-6">
                World-Class Infrastructure & Laboratory Facilities
              </h2>
              <div className="prose prose-blue text-[#4B5563] max-w-none space-y-4">
                <p>
                  {universityMapped.name} provides a comprehensive academic
                  environment tailored for international medical students. The
                  campus features state-of-the-art simulation centers where
                  students can practice clinical procedures before moving to
                  affiliated hospitals.
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 list-none p-0">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#BC002D]" /> Digital
                    Anatomy Tables
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#BC002D]" /> 24/7
                    Library Access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#BC002D]" /> Modern
                    Research Labs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#BC002D]" /> On-campus
                    Hostels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#BC002D]" /> Indian
                    Mess Facilities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#BC002D]" /> Sports &
                    Recreational Area
                  </li>
                </ul>
                <p className="pt-4 italic text-sm border-l-4 border-[#E5E7EB] pl-4 bg-white py-3 rounded-r-lg">
                  <strong>NMC Note:</strong> This university complies with all
                  FMGL (Foreign Medical Graduate Licentiate) Regulations,
                  ensuring a 54-month course duration + 12 months clinical
                  internship.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#BC002D] rounded-[2.5rem] opacity-10 hidden group-hover:opacity-20 transition-opacity" />
              <div className="relative bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src={
                    universityMapped.bannerPath
                      ? cdn(universityMapped.bannerPath) || ""
                      : "https://images.pexels.com/photos/263443/pexels-photo-263443.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }
                  alt={`MBBS Classrooms at ${universityMapped.name}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Added Content Section: Location & Living in Japan */}
      <section className="py-16 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#17202A] mb-4">
              Location & Student Life in {universityMapped.city || "Japan"}
            </h2>
            <p className="text-[#4B5563] max-w-2xl mx-auto">
              Discover the environment where you will live and study for the
              next 6 years.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB]">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <MapPin className="text-[#BC002D] w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#17202A] mb-2">City Atmosphere</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {universityMapped.city} is a major urban hub in Japan,
                offering a blend of modern lifestyle and traditional Japan
                culture. It is extremely safe for international students with
                24/7 security in university zones.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB]">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-orange-600 w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#17202A] mb-2">Indian Community</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                With over {universityMapped.students || "1200+"} Indian students
                currently enrolled, you will find a strong support network.
                Indian festivals like Diwali and Holi are celebrated on campus
                with great enthusiasm.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB]">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-[#8F0023] w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#17202A] mb-2">Cost of Living</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {replaceCurrencySymbol(
                  "Most students spend between $150–$250 per month on personal expenses, food, and local travel. This makes",
                )}{" "}
                {universityMapped.city}{" "}
                {replaceCurrencySymbol(
                  "one of the most affordable cities for medical education globally.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <UniversityDocuments university={universityMapped} />
      <UniversityTrustSeals university={universityMapped} />

      {(() => {
        const stats = [
          {
            icon: Trophy,
            label: "Global Ranking",
            value: universityMapped.globalRanking
              ? `#${universityMapped.globalRanking}`
              : null,
          },
          {
            icon: Award,
            label: "National Ranking",
            value: universityMapped.nationalRanking
              ? `#${universityMapped.nationalRanking}`
              : null,
          },
          {
            icon: BookOpen,
            label: "Years of Excellence",
            value:
              universityMapped.yearOfExcellence ||
              (universityMapped.establishedYear
                ? new Date().getFullYear() - universityMapped.establishedYear
                : null),
          },
          {
            icon: Users,
            label: "Total Students",
            value: universityMapped.students || null,
          },
          {
            icon: Globe,
            label: "Intl. Students",
            value: universityMapped.countriesRepresented
              ? `${universityMapped.countriesRepresented} Countries`
              : null,
          },
        ].filter(
          (s) => s.value !== null && s.value !== undefined && s.value !== "",
        );

        if (stats.length === 0) return null;

        return (
          <section className="py-12 bg-white border-b border-[#E5E7EB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`grid grid-cols-2 ${stats.length >= 5 ? "lg:grid-cols-5 md:grid-cols-3" : stats.length === 4 ? "md:grid-cols-4" : stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-8`}
              >
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className="bg-[#102A43] p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:shadow-xl transition-shadow">
                      <stat.icon className="h-9 w-9 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-[#17202A] mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-[#6B7280] text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {universityMapped.programs.length > 0 && (
        <UniversityPrograms
          universitySlug={universityMapped.slug}
          programs={universityMapped.programs}
        />
      )}
      {universityMapped.facilities.length > 0 && (
        <UniversityFacilities facilities={universityMapped.facilities} />
      )}
      {universityMapped.photos.length > 0 && (
        <UniversityGallery
          universityName={universityMapped.name}
          photos={universityMapped.photos}
        />
      )}
      {universityMapped.rankings.length > 0 && (
        <UniversityRankings rankings={universityMapped.rankings} />
      )}
      {universityMapped.hospitals.length > 0 && (
        <UniversityHospitals hospitals={universityMapped.hospitals} />
      )}
      {universityMapped.fmgeRates.length > 0 && (
        <UniversityFMGE
          fmgeRates={universityMapped.fmgeRates}
          fmgePassRate={universityMapped.fmgePassRate}
        />
      )}

      {/* Scholarships */}
      {universityMapped.scholarships.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <span className="inline-block bg-[#F9FAFB] text-[#102A43] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-2">
                Financial Aid
              </span>
              <h2 className="text-4xl font-bold text-[#17202A] mb-2">
                Scholarships Available
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {universityMapped.scholarships.map((s) => (
                <Link
                  key={s.id}
                  href={`/scholarships/${s.slug}`}
                  className="group bg-white border border-[#E5E7EB] border-l-4 border-l-[#102A43] rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <h3 className="font-bold text-[#17202A] text-sm leading-snug mb-1.5 group-hover:text-[#102A43] transition-colors">
                    {s.title}
                  </h3>
                  {s.amount && (
                    <span className="inline-block bg-white text-[#102A43] text-xs font-semibold px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                      {s.amount}
                    </span>
                  )}
                  {s.description && (
                    <p className="text-[#6B7280] text-xs mt-1.5 line-clamp-2">
                      {s.description}
                    </p>
                  )}
                  <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-end">
                    <span className="text-xs font-semibold text-[#BC002D] flex items-center gap-1">
                      Learn More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {universityMapped.testimonials.length > 0 && (
        <UniversityTestimonials
          testimonials={universityMapped.testimonials}
          universityName={universityMapped.name}
          rating={universityMapped.rating}
          parentSatisfaction={universityMapped.parentSatisfaction}
        />
      )}
      {universityMapped.faqs.length > 0 && (
        <UniversityFAQs
          universityName={universityMapped.name}
          faqs={universityMapped.faqs}
        />
      )}

      {/* Inline Apply Form */}
      <section id="apply" className="py-10 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[#17202A] mb-4">
              Apply Directly to the University
            </h2>
            <p className="text-xl text-[#4B5563]">
              Complete your application below. No agency fees, direct admission
              process.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-8">
            <InlineApplyForm
              universityId={universityMapped.id}
              universityName={universityMapped.name}
              universitySlug={universityMapped.slug}
            />
          </div>
        </div>
      </section>

      {/* Application Procedure */}
      <section className="py-10 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-[#17202A] mb-4">
              Application Procedure
            </h2>
            <p className="text-xl text-[#4B5563] max-w-3xl mx-auto">
              Our streamlined admission process ensures a smooth journey from
              application to enrollment.
            </p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-blue-200" />
            <div>
              {applicationSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  <div
                    className={`w-full lg:flex-1 ${index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"}`}
                  >
                    <div className="bg-white p-7 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-4 rounded-full ${stepColors[step.color]} shrink-0`}
                        >
                          <step.icon className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-[#17202A]">
                              {step.title}
                            </h3>
                            <span className="bg-[#F9FAFB] text-[#4B5563] px-3 py-0.5 rounded-full text-xs font-medium">
                              {step.timeframe}
                            </span>
                          </div>
                          <p className="text-[#4B5563] text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:flex w-16 h-16 bg-[#F9FAFB] rounded-full items-center justify-center shadow-lg shrink-0 z-10">
                    <span className="text-[#17202A] font-bold text-xl">
                      {index + 1}
                    </span>
                  </div>
                  <div className="hidden lg:block lg:flex-1" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 bg-[#102A43] rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Need Assistance?</h3>
            <p className="text-white mb-6">
              Our dedicated admissions team is here to help you throughout the
              application process
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="mailto:info@mbbsinjapan.com"
                className="flex items-center gap-3"
              >
                <div className="bg-white p-2 rounded-full">
                  <Mail className="h-5 w-5 text-[#BC002D]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Email Support</p>
                  <p className="text-white text-sm">
                    info@mbbsinjapan.com
                  </p>
                </div>
              </Link>
              <Link href="/contact-us" className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                  <Phone className="h-5 w-5 text-[#BC002D]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Get Free Counselling</p>
                  <p className="text-white text-sm">Talk to our experts</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-gradient-to-br from-[#102A43] to-[#17202A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Medical Journey?
          </h2>
          <p className="text-gray-200 text-lg mb-8">
            Secure your seat at {universityMapped.name} — limited spots
            available for {APP_YEAR} intake.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={universityMapped.applyNowUrl || "/apply"}
              target={universityMapped.applyNowUrl ? "_blank" : undefined}
              rel={
                universityMapped.applyNowUrl ? "noopener noreferrer" : undefined
              }
              className="bg-[#BC002D] text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#8F0023] transition-all hover:scale-105 shadow-lg"
            >
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/universities"
              className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              ← Back to Universities
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
