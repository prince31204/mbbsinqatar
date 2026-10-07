import Link from "next/link";
import {
  Building,
  CheckCircle,
  Clock,
  Globe,
  Languages,
  Users,
  Landmark,
  TrendingUp,
  Map,
  Factory,
} from "lucide-react";
import { getAboutCountryContent } from "@/lib/public-page-content";

export default async function AboutQatar() {
  const content = await getAboutCountryContent();

  const quickFacts = [
    {
      icon: Building,
      label: "Capital",
      value:
        content.summaryStats.find((item) => item.label === "Capital")?.value ||
        "Port Louis",
    },
    {
      icon: Users,
      label: "Population",
      value:
        content.summaryStats.find((item) => item.label === "Population")
          ?.value || "Growing student base",
    },
    {
      icon: Languages,
      label: "Languages",
      value:
        content.summaryStats.find((item) => item.label === "Languages")
          ?.value || "Multilingual support",
    },
    {
      icon: Clock,
      label: "Currency",
      value:
        content.summaryStats.find((item) => item.label === "Currency")?.value ||
        "MUR",
    },
    {
      icon: Landmark,
      label: "Government",
      value:
        content.summaryStats.find((item) => item.label === "Government")
          ?.value || "Parliamentary democracy",
    },
    {
      icon: TrendingUp,
      label: "GDP per head",
      value:
        content.summaryStats.find((item) => item.label === "GDP per head")
          ?.value || "US$10,300",
    },
    {
      icon: Map,
      label: "Area",
      value:
        content.summaryStats.find((item) => item.label === "Area")?.value ||
        "1860 sq km (725 sq mi)",
    },
    {
      icon: Factory,
      label: "Major Industries",
      value:
        content.summaryStats.find((item) => item.label === "Major Industries")
          ?.value || "Sugar, textiles, tea, tobacco, tourism",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex rounded-full bg-[#F9FAFB] px-4 py-2 text-sm font-semibold text-[#5B0F26]">
              Why {content.countryName} for MBBS?
            </span>

            <h2 className="mt-5 text-4xl font-bold text-[#1F2937]">
              {content.heroTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#4B5563]">
              {content.heroDescription}
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Safe & Student-Friendly Country",
                  description:
                    "Qatar offers a peaceful, secure environment with a high quality of life—ideal for international MBBS students.",
                },
                {
                  title: "Globally Aligned Medical Curriculum",
                  description:
                    "Programs follow international standards, preparing students for NEXT (India), USMLE (USA), and PLAB (UK).",
                },
                {
                  title: "Early & Strong Clinical Exposure",
                  description:
                    "Hands-on hospital training with real patient interaction from early years of MBBS.",
                },
                {
                  title: "Affordable MBBS Fees",
                  description:
                    "Study medicine at lower costs compared to the USA, UK, or Australia with excellent ROI.",
                },
                {
                  title: "100% English-Medium Education",
                  description:
                    "No language barrier—entire MBBS course is taught in English.",
                },
                {
                  title: "Easy Visa Process & Travel Access",
                  description:
                    "Simple admission and visa process with good connectivity to India.",
                },
                {
                  title: "Comfortable Lifestyle with Indian Community",
                  description:
                    "Safe living, multicultural environment, and easy access to Indian food and culture.",
                },
                {
                  title: "Internship & Hospital Training",
                  description:
                    "Clinical rotations in government and private hospitals enhance practical learning.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group flex gap-3 rounded-xl border border-transparent p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E5E7EB] hover:bg-white/60"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 transition-all duration-300 group-hover:bg-emerald-600">
                    <CheckCircle className="h-5 w-5 text-emerald-600 transition-colors duration-300 group-hover:text-[#1F2937]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F2937] text-sm transition-colors duration-300 group-hover:text-[#5B0F26]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/about-qatar"
                className="inline-flex items-center gap-2 rounded-lg bg-[#8A1538] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#5B0F26]"
              >
                Learn More About {content.countryName}
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-[#E5E7EB] bg-[#FAF8F7] p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#E5E7EB] hover:shadow-xl">
              <div className="flex items-center gap-3">
                <Globe className="h-7 w-7 text-[#8A1538]" />
                <h3 className="text-2xl font-bold text-[#1F2937]">
                  Quick facts
                </h3>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="group relative overflow-hidden rounded-xl bg-white p-4 ring-1 ring-slate-200 transition-all duration-500 hover:-translate-y-0.5 hover:ring-red-200 hover:shadow-md"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[#F9FAFB]/10 via-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/50 transition-colors duration-300 group-hover:bg-[#F9FAFB]/50">
                        <fact.icon className="h-5 w-5 text-[#8A1538] transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] transition-colors duration-300 group-hover:text-[#5B0F26]">
                          {fact.label}
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-[#1F2937] transition-colors duration-300 group-hover:text-slate-950">
                          {fact.value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
