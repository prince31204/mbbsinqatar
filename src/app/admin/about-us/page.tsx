"use client";

import { Users, Globe, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const managementLinks = [
  {
    label: "Website Settings (logo, contact, social links)",
    href: "/admin/settings",
    icon: "⚙️",
  },
  {
    label: "Offices — Add/Edit office locations shown on About page",
    href: "/admin/offices",
    icon: "🏢",
  },
  {
    label: "Testimonials — Student and parent reviews",
    href: "/admin/testimonials",
    icon: "💬",
  },
  {
    label: "Gallery — Team and campus photos",
    href: "/admin/gallery",
    icon: "🖼️",
  },
  { label: "Team Members (Users)", href: "/admin/users", icon: "👥" },
];

export default function AboutUsAdminPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Users size={22} className="text-[#BC002D]" />
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">About Us Page</h1>
          <p className="text-sm text-[#6B7280]">
            Manage content shown on the public About Us page
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-3">
        <h2 className="font-semibold text-[#17202A]">
          Content is managed via these modules:
        </h2>
        {managementLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FFFDF9] border border-[#E5E7EB] transition-colors"
          >
            <span className="text-xl">{l.icon}</span>
            <span className="text-sm text-[#4B5563]">{l.label}</span>
            <LinkIcon size={14} className="ml-auto text-[#6B7280] shrink-0" />
          </Link>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/about-us"
          target="_blank"
          className="inline-flex items-center gap-2 border border-[#E5E7EB] text-[#4B5563] px-4 py-2 rounded-lg text-sm hover:bg-[#FFFDF9] transition-colors"
        >
          <Globe size={14} /> View Public Page
        </Link>
      </div>
    </div>
  );
}
