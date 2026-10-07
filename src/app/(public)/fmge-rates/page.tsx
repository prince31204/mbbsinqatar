import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, TrendingUp, Filter, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Promise<Metadata> = buildMetadata({
  title: "FMGE / NExT Pass Rates — Qatar MBBS Universities 2024",
  description:
    "Compare FMGE and NExT pass rates for Qatar MBBS graduates by university and year. Real data from NMC-approved Qatar medical universities.",
  entitySeo: {
    metaKeyword:
      "FMGE pass rate Qatar, NExT exam Qatar MBBS, FMGE percentage Qatar, Qatar medical university pass rate",
  },
  path: "/fmge-rates",
  pageKey: "fmge-rates",
});

export const revalidate = 3600;

export default async function FmgeRatesPage() {
  const [rates, universities] = await Promise.all([
    prisma.universityFmgeRate
      .findMany({
        where: { status: true },
        include: {
          university: { select: { id: true, name: true, slug: true } },
        },
        orderBy: [{ year: "desc" }, { passPercentage: "desc" }],
      })
      .catch(() => []),
    prisma.university
      .findMany({
        where: { status: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      })
      .catch(() => []),
  ]);

  // Group by university for the summary cards
  const universityGroups = universities
    .map((uni) => {
      const uniRates = rates.filter((r) => r.universityId === uni.id);
      const latestRate = uniRates[0];
      const avgPass = uniRates.length
        ? uniRates.reduce(
          (sum, r) =>
            sum +
            (r.passPercentage ? parseFloat(r.passPercentage.toString()) : 0),
          0,
        ) / uniRates.length
        : null;
      return { ...uni, rates: uniRates, latestRate, avgPass };
    })
    .filter((u) => u.rates.length > 0);

  // Compute overall summary stats
  const allPassRates = rates
    .filter((r) => r.passPercentage)
    .map((r) => parseFloat(r.passPercentage!.toString()));
  const avgPassRate = allPassRates.length
    ? (allPassRates.reduce((a, b) => a + b, 0) / allPassRates.length).toFixed(1)
    : null;
  const topRate = allPassRates.length
    ? Math.max(...allPassRates).toFixed(1)
    : null;
  const years = [...new Set(rates.map((r) => r.year))].sort((a, b) => b - a);

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "FMGE Rates", url: "/fmge-rates" },
  ]);

  return (
    <div className="min-h-screen bg-[#FAF8F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <div className="bg-white text-[#1F2937] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10 text-black" />
            <h1 className="text-4xl lg:text-5xl font-bold">
              FMGE / NExT Pass Rates
            </h1>
          </div>
          <p className="text-xl text-black max-w-3xl mx-auto mt-3">
            Compare pass rates for Qatar MBBS graduates by university and
            year. Make an informed decision based on real performance data.
          </p>
          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto mt-10">
            {[
              {
                label: "Universities Tracked",
                value: universityGroups.length.toString(),
              },
              { label: "Years of Data", value: years.length.toString() },
              {
                label: "Avg Pass Rate",
                value: avgPassRate ? `${avgPassRate}%` : "—",
              },
              { label: "Top Pass Rate", value: topRate ? `${topRate}%` : "—" },
            ].map((s) => (
              <div key={s.label} className="bg-[#F9FAFB] rounded-2xl py-4 px-3">
                <div className="text-2xl font-bold text-[#5B0F26]">{s.value}</div>
                <div className="text-black text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {rates.length === 0 ? (
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 text-[#4B5563] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#4B5563] mb-2">
              FMGE Data Coming Soon
            </h2>
            <p className="text-[#6B7280]">
              We are compiling FMGE pass rate data for Qatar universities.
              Check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* University Cards */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-[#5B0F26]" />
                <h2 className="text-2xl font-bold text-[#1F2937]">
                  By University
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {universityGroups.map((uni) => (
                  <div
                    key={uni.id}
                    className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <Link
                        href={`/universities/${uni.slug}`}
                        className="font-bold text-[#1F2937] hover:text-[#5B0F26] transition-colors leading-tight"
                      >
                        {uni.name}
                      </Link>
                      {uni.avgPass !== null && (
                        <div className="shrink-0 text-right">
                          <div className="text-2xl font-bold text-[#5B0F26]">
                            {uni.avgPass.toFixed(1)}%
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            avg pass rate
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[#6B7280] text-xs border-b border-[#E5E7EB]">
                            <th className="pb-2 font-medium">Year</th>
                            <th className="pb-2 font-medium text-right">
                              Appeared
                            </th>
                            <th className="pb-2 font-medium text-right">
                              Passed
                            </th>
                            <th className="pb-2 font-medium text-right">
                              Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {uni.rates.map((r) => (
                            <tr key={r.id}>
                              <td className="py-2 font-medium text-[#1F2937]">
                                {r.year}
                              </td>
                              <td className="py-2 text-right text-[#6B7280]">
                                {r.appeared ?? "—"}
                              </td>
                              <td className="py-2 text-right text-[#6B7280]">
                                {r.passed ?? "—"}
                              </td>
                              <td className="py-2 text-right font-bold text-[#5B0F26]">
                                {r.passPercentage
                                  ? `${parseFloat(r.passPercentage.toString()).toFixed(1)}%`
                                  : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Data Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-2 mb-5">
                <Filter className="w-5 h-5 text-[#6B7280]" />
                <h2 className="text-xl font-bold text-[#1F2937]">
                  Complete FMGE Data
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#FAF8F7] text-[#4B5563]">
                      <th className="text-left p-3 rounded-l-lg font-medium">
                        University
                      </th>
                      <th className="text-right p-3 font-medium">Year</th>
                      <th className="text-right p-3 font-medium">Appeared</th>
                      <th className="text-right p-3 font-medium">Passed</th>
                      <th className="text-right p-3 font-medium">Pass Rate</th>
                      <th className="text-right p-3 rounded-r-lg font-medium">
                        1st Attempt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rates.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-[#FAF8F7] transition-colors"
                      >
                        <td className="p-3">
                          <Link
                            href={`/universities/${r.university.slug}`}
                            className="font-medium text-[#1F2937] hover:text-[#5B0F26]"
                          >
                            {r.university.name}
                          </Link>
                        </td>
                        <td className="p-3 text-right text-[#4B5563]">
                          {r.year}
                        </td>
                        <td className="p-3 text-right text-[#6B7280]">
                          {r.appeared ?? "—"}
                        </td>
                        <td className="p-3 text-right text-[#6B7280]">
                          {r.passed ?? "—"}
                        </td>
                        <td className="p-3 text-right">
                          {r.passPercentage ? (
                            <span
                              className={`font-bold ${parseFloat(r.passPercentage.toString()) >= 40 ? "text-[#5B0F26]" : parseFloat(r.passPercentage.toString()) >= 25 ? "text-[#8A1538]" : "text-[#8A1538]"}`}
                            >
                              {parseFloat(r.passPercentage.toString()).toFixed(
                                1,
                              )}
                              %
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3 text-right text-[#6B7280]">
                          {r.firstAttemptPassRate
                            ? `${parseFloat(r.firstAttemptPassRate.toString()).toFixed(1)}%`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 bg-[#5B0F26] rounded-2xl p-8 text-[#1F2937] text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-green-200" />
              <h3 className="text-2xl font-bold mb-2">
                Ready to Study MBBS in Qatar?
              </h3>
              <p className="text-green-100 mb-6 max-w-xl mx-auto">
                Join universities with strong FMGE track records. Get free
                counselling from our experts.
              </p>
              <Link
                href="/contact-us"
                className="inline-block bg-white text-[#5B0F26] font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors"
              >
                Get Free Counselling →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
