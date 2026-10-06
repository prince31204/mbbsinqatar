"use client";

import { Globe2, ExternalLink } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    title: "Cuisine & Food",
    href: "/admin/about-country/cuisine",
    icon: "🍜",
    desc: "Japan traditional dishes and food culture",
    done: true,
  },
  {
    title: "Lifestyle & Culture",
    href: "/admin/about-country/lifestyle",
    icon: "🏙️",
    desc: "Daily life, culture, and social norms",
    done: true,
  },
  {
    title: "Tourist Attractions",
    href: "/admin/about-country/tourist-spots",
    icon: "🗺️",
    desc: "Popular destinations and travel highlights",
    done: true,
  },
  {
    title: "Major Cities",
    href: "/admin/about-country/cities",
    icon: "🌆",
    desc: "Key cities students may live in",
    done: true,
  },
  {
    title: "Country Documents",
    href: "/admin/about-country/documents",
    icon: "📄",
    desc: "Embassy Letter & NMC Guidelines (shared across all universities)",
    done: true,
  },
];

export default function AboutCountryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe2 size={22} className="text-[#BC002D]" />
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">About Japan</h1>
          <p className="text-sm text-[#6B7280]">
            Manage country information shown on the public About Japan page
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md transition-shadow flex items-start gap-4"
          >
            <div className="text-3xl">{s.icon}</div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-[#17202A] mb-1">{s.title}</h2>
              <p className="text-sm text-[#6B7280] mb-3">{s.desc}</p>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#8F0023] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                <ExternalLink size={11} /> Manage Content
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/about-japan"
        target="_blank"
        className="inline-flex items-center gap-2 border border-[#E5E7EB] text-[#4B5563] px-4 py-2 rounded-lg text-sm hover:bg-[#FFFDF9] transition-colors"
      >
        <Globe2 size={14} /> View Public Page
      </Link>
    </div>
  );
}
