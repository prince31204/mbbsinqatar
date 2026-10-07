"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  BookOpen,
  Image,
  HelpCircle,
  Hospital,
  Wrench,
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  ArrowLeft,
  Link2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = { label: string; href: string; icon: React.ReactNode };

export function UniversitySubNav({
  universityId,
  universityName,
}: {
  universityId: string;
  universityName: string;
}) {
  const pathname = usePathname();
  const base = `/admin/universities/${universityId}`;

  const tabs: Tab[] = [
    {
      label: "Edit Details",
      href: `${base}/edit`,
      icon: <GraduationCap size={14} />,
    },
    {
      label: "Programs",
      href: `${base}/programs`,
      icon: <BookOpen size={14} />,
    },
    { label: "Photos", href: `${base}/photos`, icon: <Image size={14} /> },
    { label: "FAQs", href: `${base}/faqs`, icon: <HelpCircle size={14} /> },
    {
      label: "Hospitals",
      href: `${base}/hospitals`,
      icon: <Hospital size={14} />,
    },
    {
      label: "Facilities",
      href: `${base}/facilities`,
      icon: <Wrench size={14} />,
    },
    {
      label: "Rankings",
      href: `${base}/rankings`,
      icon: <BarChart3 size={14} />,
    },
    { label: "Intakes", href: `${base}/intakes`, icon: <Calendar size={14} /> },
    {
      label: "FMGE Rates",
      href: `${base}/fmge-rates`,
      icon: <TrendingUp size={14} />,
    },
    {
      label: "Testimonials",
      href: `${base}/testimonials`,
      icon: <Users size={14} />,
    },
    {
      label: "Reviews",
      href: `${base}/reviews`,
      icon: <MessageSquare size={14} />,
    },
    { label: "Links", href: `${base}/links`, icon: <Link2 size={14} /> },
    { label: "Students", href: `${base}/students`, icon: <Users size={14} /> },
  ];

  return (
    <div className="mb-6 space-y-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/admin/universities"
            className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#1F2937]"
          >
            <ArrowLeft size={14} />
            All Universities
          </Link>
        </Button>
        <span className="text-[#4B5563]">/</span>
        <span className="text-sm font-medium text-[#1F2937] truncate max-w-xs">
          {universityName}
        </span>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-[#E5E7EB] overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px",
                active
                  ? "border-[#E5E7EB] text-[#8A1538]"
                  : "border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-gray-300",
              )}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
