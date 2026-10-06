"use client";

import { BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

// Static pages managed via this module — they're server-rendered from DB data
// so this acts as a management hub pointing admins to the right places.
const pages = [
  {
    title: "About Us",
    route: "/about-us",
    icon: "🏢",
    desc: "Team, mission, stats, and office info",
    managedBy: "Website Settings + Offices",
    links: [
      { label: "Website Settings", href: "/admin/settings" },
      { label: "Offices", href: "/admin/offices" },
      { label: "Testimonials", href: "/admin/testimonials" },
    ],
  },
  {
    title: "About Japan",
    route: "/about-japan",
    icon: "🇻🇳",
    desc: "Country info, lifestyle, cuisine, tourist spots",
    managedBy: "About Country module",
    links: [{ label: "About Country", href: "/admin/about-country" }],
  },
  {
    title: "Education System",
    route: "/education-system",
    icon: "🎓",
    desc: "MBBS structure, exam info (FMGE/NExT), degree recognition",
    managedBy: "Static content — edit code to update",
    links: [{ label: "FMGE Rates", href: "/admin/fmge-rates" }],
  },
  {
    title: "Our Partners",
    route: "/our-partners",
    icon: "🤝",
    desc: "Partner universities and MoU institutions",
    managedBy: "Universities module",
    links: [{ label: "Universities", href: "/admin/universities" }],
  },
  {
    title: "Contact Us",
    route: "/contact-us",
    icon: "📞",
    desc: "Contact form, office addresses",
    managedBy: "Website Settings + Offices",
    links: [
      { label: "Website Settings", href: "/admin/settings" },
      { label: "Offices", href: "/admin/offices" },
    ],
  },
];

export default function PageContentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen size={22} className="text-[#BC002D]" />
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">Page Contents</h1>
          <p className="text-sm text-[#6B7280]">
            Manage public-facing static pages
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {pages.map((p) => (
          <div
            key={p.route}
            className="bg-white rounded-xl border border-[#E5E7EB] p-5"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-[#17202A]">{p.title}</h2>
                    <Link
                      href={p.route}
                      target="_blank"
                      className="text-[#6B7280] hover:text-[#102A43] transition-colors"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                  <p className="text-sm text-[#6B7280] mt-0.5">{p.desc}</p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Managed via: {p.managedBy}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-xs border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[#4B5563] hover:bg-[#FFFDF9] hover:text-[#102A43] transition-colors"
                  >
                    {l.label} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
