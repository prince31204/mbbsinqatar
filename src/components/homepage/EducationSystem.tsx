import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  Languages,
  LibraryBig,
} from "lucide-react";
import { getEducationSystemContent } from "@/lib/public-page-content";

const themeStyles = {
  red: "border-[#E5E7EB] bg-white hover:border-[#E5E7EB]",
  blue: "border-[#E5E7EB] bg-white hover:border-[#E5E7EB]",
  green: "border-red-200 bg-red-50 hover:border-green-300",
  amber: "border-[#E5E7EB] bg-red-400 hover:border-[#E5E7EB]",
  purple: "border-purple-200 bg-purple-50 hover:border-purple-300",
} as const;

export default async function EducationSystem() {
  const content = await getEducationSystemContent();

  return (
    <section id="education-system" className="bg-[#FFFDF9] pt-10 pb-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center bg-gradient-to-r from-[#102A43] to-[#102A43] rounded-[2rem] p-10 shadow-lg">
          <h2 className="text-4xl font-bold text-white">{content.title}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-[#FCE8ED]">
            {content.description}
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-[#BC002D]" />
              <h3 className="text-2xl font-bold text-[#17202A]">
                {content.introductionTitle}
              </h3>
            </div>
            <p className="mt-5 text-base leading-8 text-[#4B5563]">
              {content.introductionDescription}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {content.summaryStats.map((stat) => (
                <article
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl bg-[#FFFDF9] p-5 ring-1 ring-slate-200 transition-all duration-500 hover:-translate-y-1 hover:ring-red-200 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[#F9FAFB]/10 via-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B7280] transition-colors duration-300 group-hover:text-[#102A43]">
                      {stat.label}
                    </div>
                    <div className="mt-2 text-2xl font-bold text-[#17202A] transition-colors duration-300 group-hover:text-slate-950">
                      {stat.value}
                    </div>
                    {stat.detail ? (
                      <p className="mt-2 text-sm leading-6 text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                        {stat.detail}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-[#BC002D]" />
              <h3 className="text-2xl font-bold text-[#17202A]">Focus areas</h3>
            </div>
            <div className="mt-6 space-y-4">
              {content.focusAreas.slice(0, 4).map((item) => (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl bg-[#FFFDF9] p-5 ring-1 ring-slate-200 transition-all duration-500 hover:-translate-y-1 hover:ring-red-200 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[#F9FAFB]/10 via-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <h4 className="text-lg font-bold text-[#17202A] transition-colors duration-300 group-hover:text-[#102A43]">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {content.timeline.slice(0, 3).map((item) => (
            <article
              key={`${item.label}-${item.title}`}
              className={`group rounded-[1.75rem] border-2 p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${themeStyles[item.theme]}`}
            >
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B7280] transition-colors duration-300 group-hover:text-[#102A43]">
                {item.label}
              </div>
              <h3 className="mt-2 text-xl font-bold text-[#17202A] transition-colors duration-300 group-hover:text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#4B5563] transition-colors duration-300 group-hover:text-[#17202A]">
                {item.description}
              </p>
              {item.points.length > 0 ? (
                <ul className="mt-5 space-y-2">
                  {item.points.slice(0, 4).map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm text-[#4B5563]"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500 transition-colors duration-300 group-hover:text-emerald-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <Languages className="h-6 w-6 text-[#BC002D]" />
              <h3 className="text-2xl font-bold text-[#17202A]">
                Language support
              </h3>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.languageCards.map((card, index) => (
                <article
                  key={`${card.label}-${index}`}
                  className="group relative overflow-hidden rounded-2xl bg-[#FFFDF9] p-5 ring-1 ring-slate-200 transition-all duration-500 hover:-translate-y-1 hover:ring-red-200 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[#F9FAFB]/10 via-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#BC002D] transition-colors duration-300 group-hover:text-[#102A43]">
                      {card.label}
                    </div>
                    <div className="mt-2 text-xl font-bold text-[#17202A] transition-colors duration-300 group-hover:text-slate-950">
                      {card.value}
                    </div>
                    {card.detail ? (
                      <p className="mt-2 text-sm leading-6 text-[#4B5563] transition-colors duration-300 group-hover:text-[#4B5563]">
                        {card.detail}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <LibraryBig className="h-6 w-6 text-[#BC002D]" />
              <h3 className="text-2xl font-bold text-[#17202A]">
                Institution mix
              </h3>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.institutionCards.map((card, index) => (
                <article
                  key={`${card.label}-${index}`}
                  className="group relative overflow-hidden rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200 transition-all duration-500 hover:-translate-y-1 hover:ring-amber-300 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[#F9FAFB]/10 via-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#102A43] transition-colors duration-300 group-hover:text-emerald-700">
                      {card.label}
                    </div>
                    <div className="mt-2 text-xl font-bold text-black transition-colors duration-300 group-hover:text-gray-900">
                      {card.value}
                    </div>
                    {card.detail ? (
                      <p className="mt-2 text-sm leading-6 text-black font-medium transition-colors duration-300 group-hover:text-gray-900">
                        {card.detail}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center bg-[#FFFDF9] border border-[#E5E7EB] rounded-[2rem] p-10 shadow-md">
          <Link
            href="/education-system"
            className="inline-flex items-center gap-2 rounded-lg bg-[#BC002D] px-8 py-4 font-semibold text-white transition-all border border-transparent hover:bg-white hover:text-black hover:border-gray-300 shadow-sm"
          >
            Learn More About the Education System
          </Link>
        </div>
      </div>
    </section>
  );
}
