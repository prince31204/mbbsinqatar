import Link from "next/link";
import {
  Award,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HomePageStats } from "@/lib/public-page-content";
import { formatCurrencyRange } from "@/lib/currency";

interface ScholarshipsSectionProps {
  stats: HomePageStats;
}

type EligibilityItem = string;
type CoverageItem = string;

function formatAmount(min: number | null, max: number | null): string {
  if (!min && !max) return "Contact for details";
  return formatCurrencyRange(min || 0, max);
}

function formatDeadline(deadline: Date | null): string {
  if (!deadline) return "Open";
  return new Date(deadline).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getTypeColor(type: string | null): string {
  switch ((type || "").toLowerCase()) {
    case "government":
      return "bg-[#F7E9EE] text-green-800";
    case "embassy":
      return "bg-[#F9FAFB] text-[#5B0F26]";
    case "university":
      return "bg-purple-100 text-purple-800";
    case "merit":
    case "merit-based":
      return "bg-[#5B0F26] text-white";
    default:
      return "bg-white text-[#1F2937]";
  }
}

export default async function ScholarshipsSection({
  stats,
}: ScholarshipsSectionProps) {
  const scholarships = await prisma.scholarship
    .findMany({
      where: { isActive: true, universityId: null },
      select: {
        id: true,
        slug: true,
        title: true,
        scholarshipType: true,
        program: true,
        amountMin: true,
        amountMax: true,
        deadline: true,
        availableSeats: true,
        eligibility: true,
        coverage: true,
      },
      take: 4,
      orderBy: { id: "asc" },
    })
    .catch(() => []);

  return (
    <section id="scholarships" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
            Scholarships &amp; Financial Aid
          </h2>
          <p className="text-xl text-[#4B5563] max-w-3xl mx-auto">
            Make your education dreams affordable with various scholarship
            opportunities available for international students studying in
            Qatar.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <Award className="w-12 h-12 text-[#8A1538] mx-auto mb-4" />,
              val: stats.scholarships,
              label: "Government & University Scholarships",
              bg: " ",
            },
            {
              icon: (
                <DollarSign className="w-12 h-12 text-[#5B0F26] mx-auto mb-4" />
              ),
              val: stats.annualAid,
              label: "Est. Total Annual Aid",
              bg: " ",
            },
            {
              icon: <Users className="w-12 h-12 text-[#8A1538] mx-auto mb-4" />,
              val: stats.meritAwards,
              label: "Merit-Based Awards",
              bg: " ",
            },
            {
              icon: <Star className="w-12 h-12 text-purple-600 mx-auto mb-4" />,
              val: stats.verifiedPrograms,
              label: "Verified Programs",
              bg: " ",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`group rounded-2xl bg-gradient-to-br p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${s.bg}`}
            >
              {s.icon}
              <div className="mb-2 text-3xl font-bold text-[#1F2937] transition-transform duration-300 group-hover:scale-105">
                {s.val}
              </div>
              <div className="font-medium text-[#4B5563]">{s.label}</div>
            </div>
          ))}
        </div>

        {scholarships.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {scholarships.map((scholarship) => {
              const eligibilityItems =
                (scholarship.eligibility as unknown as EligibilityItem[]) || [];
              const coverageItems =
                (scholarship.coverage as unknown as CoverageItem[]) || [];

              return (
                <div
                  key={scholarship.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-[#E5E7EB] hover:shadow-2xl"
                >
                  {/* Header banner */}
                  <div className="relative flex h-32 flex-col justify-end bg-[#8A1538] p-6">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium shadow-sm transition-transform duration-300 group-hover:scale-105 ${getTypeColor(scholarship.scholarshipType)}`}
                      >
                        {scholarship.scholarshipType || "Merit"}
                      </span>
                    </div>
                    <h3 className="relative text-xl font-bold text-white drop-shadow-sm">
                      {scholarship.title}
                    </h3>
                    {scholarship.program && (
                      <p className="relative text-sm text-[#F7E9EE] mt-1">
                        {scholarship.program}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="rounded-lg bg-[#F7E9EE] p-4 transition-colors duration-300 group-hover:bg-red-100">
                        <DollarSign className="mb-2 h-5 w-5 text-[#5B0F26] transition-transform duration-300 group-hover:scale-110" />
                        <div className="text-sm text-[#4B5563]">Amount</div>
                        <div className="font-semibold text-[#1F2937]">
                          {formatAmount(
                            scholarship.amountMin
                              ? Number(scholarship.amountMin)
                              : null,
                            scholarship.amountMax
                              ? Number(scholarship.amountMax)
                              : null,
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white p-4 transition-colors duration-300 group-hover:bg-[#F9FAFB]">
                        <Calendar className="mb-2 h-5 w-5 text-[#8A1538] transition-transform duration-300 group-hover:scale-110" />
                        <div className="text-sm text-[#4B5563]">Deadline</div>
                        <div className="font-semibold text-[#1F2937]">
                          {formatDeadline(scholarship.deadline)}
                        </div>
                      </div>
                    </div>

                    {eligibilityItems.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-[#1F2937] mb-2">
                          Eligibility
                        </h4>
                        <div className="space-y-1">
                          {eligibilityItems.slice(0, 3).map((item, i) => (
                            <p key={i} className="text-[#4B5563] text-sm">
                              • {item}
                            </p>
                          ))}
                        </div>
                        {scholarship.availableSeats && (
                          <div className="flex items-center mt-2 text-sm text-[#6B7280]">
                            <Users className="w-4 h-4 mr-1" />
                            <span>
                              {scholarship.availableSeats} scholarships
                              available
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {coverageItems.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-[#1F2937] mb-3">
                          Coverage Includes
                        </h4>
                        <div className="space-y-2">
                          {coverageItems.slice(0, 4).map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-2"
                            >
                              <CheckCircle className="w-4 h-4 text-[#8A1538] flex-shrink-0" />
                              <span className="text-[#4B5563] text-sm">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Link
                        href={`/scholarships/${scholarship.slug}`}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#8A1538] py-3 font-medium text-white transition-all duration-300"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Need Help CTA — from old React Scholarships.tsx */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-[#1F2937] mb-4">
            Need Help with Scholarship Applications?
          </h3>
          <p className="text-[#4B5563] mb-8 max-w-2xl mx-auto">
            Our scholarship counselors are here to guide you through the
            application process and help you secure the best financial aid
            opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scholarships"
              className="bg-[#8A1538] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#5B0F26] transition-colors"
            >
              Explore Scholarships
            </Link>
            <Link
              href="/contact-us?source=talk_to_counselor"
              className="border-2 border-[#E5E7EB] text-[#8A1538] px-8 py-4 rounded-lg font-semibold hover:bg-[#8A1538] hover:text-[#1F2937] transition-colors"
            >
              Talk to a Counselor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
