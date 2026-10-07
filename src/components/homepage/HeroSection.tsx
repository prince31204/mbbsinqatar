"use client";

import Link from "next/link";
import {
  ArrowRight,
  Users,
  GraduationCap,
  Globe,
  Award,
  Building2,
  Stethoscope,
} from "lucide-react";
import { useDownloadModal } from "@/lib/modalContext";
import { HomePageStats } from "@/lib/public-page-content";

const FALLBACK_BROCHURE = "/brochures/Qatar_university.pdf";

interface HeroSectionProps {
  stats: HomePageStats;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const { openModal } = useDownloadModal();

  return (
    <section id="home" className="relative bg-white text-[#111827]">
      {/* Dot pattern */}

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#8A1538]">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Official Partner of Top Qatar Medical Universities
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-[#111827] drop-shadow-sm pb-1">
                MBBS in Qatar
              </h1>

              <p className="text-xl text-[#4B5563] leading-relaxed">
                Study MBBS in Qatar at globally accredited medical
                universities with affordable fees, English-medium education, and
                strong clinical exposure plus a clear pathway to obtaining a
                medical practice license in Qatar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/universities"
                className="bg-[#8A1538] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#5B0F26] transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-red-500/20"
              >
                <span>Explore Universities</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <button
                onClick={() => openModal("MBBS in Qatar", FALLBACK_BROCHURE)}
                className="border-2 border-[#8A1538] bg-white hover:bg-[#FEF2F2] text-[#8A1538] px-8 py-4 rounded-lg font-semibold transition-colors cursor-pointer"
                suppressHydrationWarning={true}
              >
                Download Brochure
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              {[
                {
                  value: stats.universities,
                  label: "Top Medical Universities",
                },
                { value: stats.students, label: "Indian Students" },
                { value: stats.admissionSupport, label: "Admission Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-[#8A1538]">
                    {stat.value}
                  </div>
                  <div className="text-[#4B5563] text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-2xl p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-[#111827]">Why Choose Qatar?</h3>
                <p className="text-sm text-[#4B5563]">
                  MBBS in Qatar, graduates can apply for medical registration
                  through the Medical Council of Qatar.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: <Stethoscope className="w-6 h-6 text-white" />,
                    title: "Internship & Hospital Training Opportunities",
                    desc: "Clinical rotations in government and private hospitals enhance practical learning.",
                  },
                  {
                    icon: <Globe className="w-6 h-6 text-white" />,
                    title: "Curriculum Aligned with Global Standards",
                    desc: "Medical programs follow international guidelines, preparing students for exams like NEXT (India), USMLE (USA), and PLAB (UK).",
                  },
                  {
                    icon: <Award className="w-6 h-6 text-white" />,
                    title: "Strong Internship & Licensing Opportunities",
                    desc: "Opportunity to complete internships and explore pathways for medical licensing in Qatar and abroad.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#8A1538] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-red-500/20">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-[#111827]">{item.title}</h4>
                      <p className="text-[#4B5563] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#8A1538] rounded-full opacity-10 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#8A1538] rounded-full opacity-10 animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}
