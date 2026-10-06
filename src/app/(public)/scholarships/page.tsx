import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  ExternalLink,
  MapPin,
  Search,
  Filter,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buildMetadata, APP_YEAR, breadcrumbSchema } from "@/lib/seo";
import { formatCurrencyRange, withCurrencySymbol } from "@/lib/currency";

export const metadata: Promise<Metadata> = buildMetadata({
  title: `MBBS Scholarships in Japan ${APP_YEAR} — Government & Merit Based`,
  description:
    "Find all scholarships for MBBS in Japan. Government, merit, and embassy scholarships for Indian students. Apply before deadlines.",
  entitySeo: {
    metaKeyword: `MBBS scholarship Japan, scholarship for MBBS Japan ${APP_YEAR}, merit scholarship Japan`,
  },
  path: "/scholarships",
  pageKey: "scholarships",
});

export const revalidate = 3600;

function formatAmount(min: number | null, max: number | null): string {
  if (!min && !max) return "Contact for details";
  return formatCurrencyRange(min || 0, max);
}

function getTypeColor(type: string | null): string {
  switch ((type || "").toLowerCase()) {
    case "merit":
    case "merit-based":
      return "bg-[#102A43] text-white";
    case "need":
      return "bg-red-100 text-green-800";
    case "government":
      return "bg-[#F9FAFB] text-[#102A43]";
    case "private":
      return "bg-white text-[#BC002D]";
    default:
      return "bg-white text-[#17202A]";
  }
}

function getModeColor(mode: string | null): string {
  switch ((mode || "").toLowerCase()) {
    case "direct":
      return "bg-emerald-100 text-emerald-800";
    case "through_university":
      return "bg-[#F9FAFB] text-[#102A43]";
    case "through_ministry":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-[#F9FAFB] text-[#17202A]";
  }
}

function formatMode(mode: string | null): string {
  if (!mode) return "";
  return mode.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default async function ScholarshipsPage() {
  const [scholarships, statsSetting] = await Promise.all([
    prisma.scholarship
      .findMany({
        where: { isActive: true },
        include: {
          university: {
            select: {
              name: true,
              slug: true,
              city: true,
              cityRelation: { select: { name: true } },
            },
          },
        },
        orderBy: [{ deadline: "asc" }, { id: "asc" }],
      })
      .catch(() => []),
    prisma.websiteSetting
      .findUnique({
        where: { key: "stats_annual_aid" },
        select: { value: true },
      })
      .catch(() => null),
  ]);

  const totalAidCalculated = scholarships.reduce((sum, s) => {
    const amount = s.amountMax
      ? Number(s.amountMax)
      : s.amountMin
        ? Number(s.amountMin)
        : 0;
    const seats = s.availableSeats || 1;
    return sum + amount * seats;
  }, 0);

  const totalAidDisplay =
    totalAidCalculated > 0
      ? withCurrencySymbol(`${Math.round(totalAidCalculated / 1000)}k+`)
      : withCurrencySymbol("2000k+");

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Scholarships", url: "/scholarships" },
  ]);

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <div className="bg-white text-[#17202A] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#F9FAFB] rounded-full p-4">
              <GraduationCap className="w-12 h-12 text-[#17202A]" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            MBBS Scholarships in Japan
          </h1>
          <p className="text-xl text-[#4B5563] max-w-3xl mx-auto mb-10">
            Discover government, merit, and university scholarships to fund your
            MBBS education in Japan.
          </p>

          {/* Stats row \u2014 4 items like old React */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              {
                val: `${scholarships.length || "250"}+`,
                label: "Scholarships Available",
              },
              { val: totalAidDisplay, label: "Total Aid Distributed" },
              { val: "85%", label: "Students Receive Aid" },
              { val: "95%", label: "Success Rate" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center bg-[#F9FAFB] rounded-xl p-4"
              >
                <div className="text-3xl font-bold text-[#BC002D]">{s.val}</div>
                <div className="text-[#4B5563] text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter bar hint */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#17202A]">
            {scholarships.length > 0
              ? `${scholarships.length} Scholarships Available`
              : "All Scholarships"}
          </h2>
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Filter className="w-4 h-4" />
            <span>Sorted by deadline (earliest first)</span>
          </div>
        </div>

        {scholarships.length === 0 ? (
          <div className="text-center py-16 text-[#6B7280]">
            <Award className="w-16 h-16 mx-auto mb-4 text-[#4B5563]" />
            <p className="text-xl">
              No scholarships available at the moment. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {scholarships.map((s) => {
              const eligibility = (s.eligibility as unknown as string[]) || [];
              const coverage = (s.coverage as unknown as string[]) || [];
              const cityName =
                s.university?.cityRelation?.name || s.university?.city || null;

              return (
                <div
                  key={s.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#E5E7EB] hover:border-[#E5E7EB] overflow-hidden flex flex-col group"
                >
                  {/* Card Header \u2014 red gradient with university info */}
                  <div className="bg-[#102A43] p-6 text-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        {s.university && (
                          <Link
                            href={`/universities/${s.university.slug}`}
                            className="text-xl font-bold hover:text-[#4B5563] transition-colors"
                          >
                            {s.university.name}
                          </Link>
                        )}
                        {!s.university && (
                          <h3 className="text-xl font-bold">{s.title}</h3>
                        )}
                        {cityName && (
                          <div className="flex items-center text-[#4B5563] mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            <span className="text-sm">{cityName}, Japan</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {s.scholarshipType && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border border-[#E5E7EB] text-[#17202A] bg-white/20`}
                          >
                            {s.scholarshipType}
                          </span>
                        )}
                      </div>
                    </div>
                    {s.university && (
                      <div className="border-t border-gray-300/40 pt-3 mt-1">
                        <h4 className="text-base font-semibold">{s.title}</h4>
                        {s.program && (
                          <p className="text-[#4B5563] text-sm">{s.program}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* 4-stat grid \u2014 matches old React ScholarshipCard */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-[#8F0023] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-[#6B7280]">Amount</p>
                          <p className="font-semibold text-[#17202A] text-sm">
                            {formatAmount(
                              s.amountMin ? Number(s.amountMin) : null,
                              s.amountMax ? Number(s.amountMax) : null,
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-5 h-5 text-[#BC002D] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-[#6B7280]">Deadline</p>
                          <p className="font-semibold text-[#17202A] text-sm">
                            {s.deadline
                              ? new Date(s.deadline).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "Open"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="w-5 h-5 text-[#BC002D] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-[#6B7280]">
                            Available Seats
                          </p>
                          <p className="font-semibold text-[#17202A] text-sm">
                            {s.availableSeats
                              ? `${s.availableSeats} seats`
                              : "Open"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-[#6B7280]">Program</p>
                          <p className="font-semibold text-[#17202A] text-sm">
                            {s.program || "MBBS"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Application Mode badge */}
                    {s.applicationMode && (
                      <div className="mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getModeColor(s.applicationMode)}`}
                        >
                          {formatMode(s.applicationMode)}
                        </span>
                      </div>
                    )}

                    {/* Eligibility \u2014 dot list with +N more */}
                    {eligibility.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-[#17202A] mb-2">
                          Key Eligibility:
                        </h5>
                        <ul className="text-sm text-[#4B5563] space-y-1">
                          {eligibility.slice(0, 3).map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-[#BC002D] rounded-full mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                          {eligibility.length > 3 && (
                            <li className="text-[#BC002D] font-medium text-xs">
                              +{eligibility.length - 3} more criteria
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Coverage \u2014 green chip tags */}
                    {coverage.length > 0 && (
                      <div className="mb-5">
                        <h5 className="text-sm font-semibold text-[#17202A] mb-2">
                          Coverage:
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {coverage.map((item, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 bg-red-50 text-[#8F0023] text-xs rounded-md border border-red-200"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA \u2014 gradient button like old React */}
                    <div className="mt-auto">
                      <Link
                        href={`/scholarships/${s.slug}`}
                        className="w-full bg-[#BC002D] text-white py-3 px-6 rounded-xl font-semibold hover: transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                      >
                        <span>View Full Details</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Need Help CTA */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-10 text-center border border-[#E5E7EB]">
          <h3 className="text-2xl font-bold text-[#17202A] mb-3">
            Need Help with Scholarship Applications?
          </h3>
          <p className="text-[#4B5563] mb-8 max-w-2xl mx-auto">
            Our scholarship counselors are here to guide you through the
            application process and help you secure the best financial aid
            opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us?source=talk_to_counselor"
              className="bg-[#BC002D] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8F0023] hover:text-white transition-colors"
            >
              Talk to a Counselor
            </Link>
            <Link
              href="/universities"
              className="border-2 border-[#E5E7EB] text-[#BC002D] px-8 py-4 rounded-lg font-semibold hover:bg-[#BC002D] hover:text-white transition-colors"
            >
              Browse Universities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
