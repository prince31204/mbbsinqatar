import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  ArrowRight,
  Building2,
  BookOpen,
  Clock,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { formatCurrencyNumber, formatCurrencyRange } from "@/lib/currency";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const scholarships = await prisma.scholarship
    .findMany({
      where: { isActive: true },
      select: { slug: true },
    })
    .catch(() => []);
  return scholarships.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await prisma.scholarship
    .findUnique({
      where: { slug },
      select: {
        title: true,
        shortnote: true,
        metaTitle: true,
        metaDescription: true,
        metaKeyword: true,
      },
    })
    .catch(() => null);
  if (!s) return { title: "Scholarship Not Found" };
  return buildMetadata({
    title: s.metaTitle || `${s.title} — MBBS Scholarship Qatar`,
    description:
      s.metaDescription ||
      s.shortnote ||
      `Apply for ${s.title}. Scholarships for MBBS in Qatar.`,
    entitySeo: {
      metaKeyword: s.metaKeyword || `${s.title}, MBBS scholarship Qatar`,
    },
    path: `/scholarships/${slug}`,
  });
}

export default async function ScholarshipDetailPage({ params }: Props) {
  const { slug } = await params;

  const scholarship = await prisma.scholarship
    .findUnique({
      where: { slug },
      include: {
        university: {
          select: {
            name: true,
            slug: true,
            thumbnailPath: true,
            city: true,
            programs: { where: { isActive: true }, take: 5 },
          },
        },
        faqs: { orderBy: { position: "asc" } },
      },
    })
    .catch(() => null);

  if (!scholarship || !scholarship.isActive) notFound();

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Scholarships", url: "/scholarships" },
    { name: scholarship.title, url: `/scholarships/${scholarship.slug}` },
  ]);

  const deadline = scholarship.deadline ? new Date(scholarship.deadline) : null;
  const isExpired = deadline ? deadline < new Date() : false;
  const daysLeft = deadline
    ? Math.ceil((deadline.getTime() - Date.now()) / 86400000)
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-[#FAF8F7] border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-2 text-sm text-[#4B5563]">
          <Link href="/" className="hover:text-[#5B0F26]">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/scholarships" className="hover:text-[#5B0F26]">
            Scholarships
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1F2937] font-medium truncate">
            {scholarship.title}
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#5B0F26] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              {scholarship.scholarshipType && (
                <span className="inline-block bg-white/20 text-[#1F2937] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                  {scholarship.scholarshipType}
                </span>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {scholarship.title}
              </h1>
              {scholarship.shortnote && (
                <p className="text-lg text-[#4B5563] mb-6 leading-relaxed">
                  {scholarship.shortnote}
                </p>
              )}
              {scholarship.university && (
                <div className="flex items-center gap-3 text-[#4B5563]">
                  <Building2 className="w-4 h-4" />
                  <span>{scholarship.university.name}</span>
                  {scholarship.university.city && (
                    <span>· {scholarship.university.city}</span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Info Card */}
            <div className="bg-white text-[#1F2937] rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold text-lg mb-4 text-[#1F2937]">
                Scholarship Overview
              </h3>
              <div className="space-y-3">
                {(scholarship.amountMin || scholarship.amountMax) && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Amount
                    </span>
                    <span className="font-semibold text-[#5B0F26]">
                      {scholarship.amountMin && scholarship.amountMax
                        ? formatCurrencyRange(
                            Number(scholarship.amountMin),
                            Number(scholarship.amountMax),
                          )
                        : formatCurrencyNumber(
                            Number(
                              scholarship.amountMin || scholarship.amountMax,
                            ),
                          )}
                    </span>
                  </div>
                )}
                {scholarship.discountPercentage && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Discount</span>
                    <span className="font-semibold text-[#8A1538]">
                      {scholarship.discountPercentage}% off tuition
                    </span>
                  </div>
                )}
                {scholarship.availableSeats && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Seats
                    </span>
                    <span className="font-semibold">
                      {scholarship.availableSeats} available
                    </span>
                  </div>
                )}
                {scholarship.program && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      Program
                    </span>
                    <span className="font-semibold">{scholarship.program}</span>
                  </div>
                )}
                {scholarship.applicationMode && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Mode
                    </span>
                    <span className="font-semibold">
                      {scholarship.applicationMode}
                    </span>
                  </div>
                )}
                {deadline && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#6B7280] flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Deadline
                      </span>
                      <span
                        className={`font-semibold ${isExpired ? "text-[#8A1538]" : "text-[#5B0F26]"}`}
                      >
                        {deadline.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {!isExpired && daysLeft !== null && daysLeft <= 30 && (
                      <div className="mt-2 bg-orange-50 text-orange-700 rounded-lg px-3 py-2 text-sm font-medium text-center">
                        ⏰ Only {daysLeft} days left to apply!
                      </div>
                    )}
                    {isExpired && (
                      <div className="mt-2 bg-white text-[#8A1538] rounded-lg px-3 py-2 text-sm font-medium text-center">
                        Applications Closed
                      </div>
                    )}
                  </div>
                )}
                {!isExpired && (
                  <Link
                    href="/contact-us"
                    className="block w-full mt-4 bg-[#8A1538] hover:bg-[#5B0F26] text-white text-center py-3 rounded-xl font-semibold transition-colors"
                  >
                    Apply Now <ArrowRight className="w-4 h-4 inline ml-1" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Eligibility / Features */}
            <section className="bg-white rounded-2xl border border-[#E5E7EB] p-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#8A1538]" /> Scholarship
                Highlights
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  scholarship.scholarshipType && {
                    label: "Type",
                    value: scholarship.scholarshipType,
                  },
                  scholarship.program && {
                    label: "Eligible Program",
                    value: scholarship.program,
                  },
                  scholarship.applicationMode && {
                    label: "Application Mode",
                    value: scholarship.applicationMode,
                  },
                  scholarship.availableSeats && {
                    label: "Available Seats",
                    value: `${scholarship.availableSeats} seats`,
                  },
                ]
                  .filter(Boolean)
                  .map((item) => (
                    <div
                      key={(item as { label: string }).label}
                      className="bg-[#FAF8F7] rounded-xl p-4"
                    >
                      <div className="text-xs text-[#6B7280] mb-1">
                        {(item as { label: string }).label}
                      </div>
                      <div className="font-semibold text-[#1F2937]">
                        {(item as { value: string }).value}
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* FAQ Section */}
            {scholarship.faqs.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#E5E7EB] p-8">
                <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-[#8A1538]" /> Frequently
                  Asked Questions
                </h2>
                <div className="space-y-4">
                  {scholarship.faqs.map((faq) => (
                    <details
                      key={faq.id}
                      className="group border border-[#E5E7EB] rounded-xl"
                    >
                      <summary className="flex justify-between items-center p-5 cursor-pointer font-medium text-[#1F2937] hover:bg-[#FAF8F7] rounded-xl">
                        {faq.question}
                        <ChevronRight className="w-4 h-4 text-[#6B7280] group-open:rotate-90 transition-transform shrink-0 ml-3" />
                      </summary>
                      <div className="px-5 pb-5 text-[#4B5563] leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* University card */}
            {scholarship.university && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <h3 className="font-bold text-[#1F2937] mb-4">Offered By</h3>
                {scholarship.university.thumbnailPath && (
                  <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                    <Image
                      src={cdn(scholarship.university.thumbnailPath) || ""}
                      alt={scholarship.university.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <h4 className="font-semibold text-[#1F2937]">
                  {scholarship.university.name}
                </h4>
                {scholarship.university.city && (
                  <p className="text-sm text-[#6B7280] mt-1">
                    {scholarship.university.city}, Qatar
                  </p>
                )}
                <Link
                  href={`/universities/${scholarship.university.slug}`}
                  className="mt-4 block text-center border border-[#E5E7EB] text-[#8A1538] hover:bg-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View University →
                </Link>
              </div>
            )}

            {/* CTA */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center">
              <Award className="w-10 h-10 text-[#8A1538] mx-auto mb-3" />
              <h3 className="font-bold text-[#1F2937] mb-2">
                Interested in this scholarship?
              </h3>
              <p className="text-sm text-[#4B5563] mb-4">
                Our counsellors will guide you through the application process.
              </p>
              <Link
                href="/contact-us?source=talk_to_counselor"
                className="block w-full bg-[#8A1538] hover:bg-[#5B0F26] text-white py-3 rounded-xl font-semibold transition-colors text-sm"
              >
                Talk to a Counsellor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
