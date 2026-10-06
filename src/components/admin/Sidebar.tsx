"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Award,
  Users,
  MapPin,
  Search,
  BookOpen,
  Settings,
  Upload,
  ChevronDown,
  ChevronRight,
  Building2,
  Newspaper,
  MessageSquare,
  Image,
  Globe,
  FolderOpen,
  Link2,
  BarChart3,
  Star,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={16} /> },
  {
    label: "Content",
    icon: <FileText size={16} />,
    children: [
      { label: "Blogs", href: "/admin/blogs" },
      { label: "Blog Categories", href: "/admin/blog-categories" },
      { label: "News", href: "/admin/news" },
      { label: "News Categories", href: "/admin/news-categories" },
      { label: "Articles", href: "/admin/articles" },
      { label: "Article Categories", href: "/admin/article-categories" },
    ],
  },
  {
    label: "Universities",
    icon: <GraduationCap size={16} />,
    children: [
      { label: "All Universities", href: "/admin/universities" },
      { label: "Hospitals", href: "/admin/hospitals" },
      { label: "FMGE Rates", href: "/admin/fmge-rates" },
      { label: "Institute Types", href: "/admin/institute-types" },
      { label: "Facilities", href: "/admin/facilities" },
    ],
  },
  {
    label: "Scholarships",
    icon: <Award size={16} />,
    children: [{ label: "All Scholarships", href: "/admin/scholarships" }],
  },
  {
    label: "Leads (CRM)",
    icon: <MessageSquare size={16} />,
    children: [
      { label: "All Leads", href: "/admin/leads" },
      { label: "Applications", href: "/admin/applications" },
      { label: "Partner Inquiries", href: "/admin/partner-inquiries" },
      { label: "Export / Webhook", href: "/admin/leads/webhook" },
    ],
  },
  {
    label: "Location",
    icon: <MapPin size={16} />,
    children: [
      { label: "Provinces", href: "/admin/provinces" },
      { label: "Cities", href: "/admin/cities" },
    ],
  },
  {
    label: "SEO",
    icon: <Search size={16} />,
    children: [
      { label: "Static Page SEO", href: "/admin/seo/static" },
      { label: "Dynamic Page SEO", href: "/admin/seo/dynamic" },
      { label: "Default OG Images", href: "/admin/seo/og-images" },
    ],
  },
  {
    label: "Pages",
    icon: <BookOpen size={16} />,
    children: [
      { label: "About Country", href: "/admin/about-country" },
      { label: "About Us", href: "/admin/about-us" },
      { label: "Education System", href: "/admin/education-system" },
      { label: "Page Contents", href: "/admin/page-contents" },
      { label: "Government Links", href: "/admin/government-links" },
      { label: "Expert Team", href: "/admin/expert-team" },
    ],
  },
  {
    label: "Configuration",
    icon: <Settings size={16} />,
    children: [
      { label: "Website Settings", href: "/admin/settings" },
      { label: "FAQs", href: "/admin/faqs" },
      { label: "FAQ Categories", href: "/admin/faq-categories" },
      { label: "Testimonials", href: "/admin/testimonials" },
      { label: "Gallery", href: "/admin/gallery" },
      { label: "Offices", href: "/admin/offices" },
      { label: "Upload Files", href: "/admin/uploads" },
    ],
  },
  {
    label: "Users",
    icon: <Users size={16} />,
    children: [
      { label: "Admin Users", href: "/admin/users" },
      { label: "Registered Users", href: "/admin/registered-users" },
      { label: "My Profile", href: "/admin/profile" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Content",
    "Universities",
    "Scholarships",
    "Configuration",
  ]);

  const toggle = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    );
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (children?: { href: string }[]) =>
    children?.some((c) => pathname.startsWith(c.href)) ?? false;

  return (
    <aside className="w-64 min-h-screen bg-[#071A2B] text-white flex flex-col border-r border-[#102A43]">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[#102A43]">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#BC002D] flex items-center justify-center text-white font-bold text-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm text-white">
            MBBS Japan
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((item) => {
          if (item.href) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium mb-0.5 transition-colors",
                  isActive(item.href)
                    ? "bg-[#BC002D] text-white"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#102A43]",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          }

          const open = openGroups.includes(item.label);
          const groupActive = isGroupActive(item.children);

          return (
            <div key={item.label} className="mb-0.5">
              <button
                onClick={() => toggle(item.label)}
                suppressHydrationWarning
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                  groupActive
                    ? "text-white bg-[#102A43]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#102A43]",
                )}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {open && (
                <div className="ml-4 mt-0.5 border-l border-gray-700 pl-3 space-y-0.5">
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive(child.href) ||
                          pathname.startsWith(child.href + "/")
                          ? "bg-[#BC002D] text-white"
                          : "text-[#94A3B8] hover:text-white hover:bg-[#102A43]",
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#102A43]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:text-white hover:bg-[#102A43] transition-colors"
        >
          <Globe size={14} />
          View Public Site
        </Link>
      </div>
    </aside>
  );
}
