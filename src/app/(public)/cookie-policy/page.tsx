import Link from "next/link";
import {
  Cookie,
  ChevronRight,
  Settings,
  PieChart,
  Target,
  Info,
  ShieldAlert,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Cookie Policy — MBBS in Japan",
    description:
      "Our cookie policy explains how we use cookies and similar technologies on our website.",
    path: "/cookie-policy",
  });
}

import CookieResetButton from "@/components/common/CookieResetButton";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] font-outfit">
      {/* Premium Hero Section */}
      <div className="relative bg-white pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <nav className="flex items-center justify-center space-x-2 text-[#BC002D]/80 text-sm mb-8 animate-in fade-in slide-in- duration-700">
            <Link href="/" className="hover:text-[#102A43] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#17202A] font-medium">Cookie Policy</span>
          </nav>

          <div className="inline-flex items-center justify-center p-3 bg-[#BC002D]/10 rounded-2xl border border-[#E5E7EB] mb-6 animate-in zoom-in duration-1000">
            <Cookie className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#17202A] mb-6 tracking-tight">
            Cookie <span className="text-red-500">Policy</span>
          </h1>

          <p className="text-[#6B7280] max-w-2xl mx-auto text-lg leading-relaxed">
            We use cookies to improve your experience. Learn how we use
            technology to better understand your needs.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 pb-24 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-8 md:p-16">
          <div className="flex justify-between items-center mb-12 border-b border-gray-50 pb-8 uppercase tracking-widest text-[10px] font-bold text-[#6B7280]">
            <span>Cookie Usage Guide</span>
            <span>
              Revised:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="space-y-16">
            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl group-hover:bg-[#BC002D] group-hover:text-[#17202A] transition-all duration-300">
                  <Info className="w-6 h-6 text-[#BC002D] group-hover:text-[#17202A]" />
                </div>
                <h2 className="text-3xl font-black text-[#17202A] tracking-tight">
                  1. What are Cookies?
                </h2>
              </div>
              <p className="text-[#4B5563] leading-relaxed text-lg pl-2 border-l-2 border-transparent group-hover:border-[#E5E7EB] transition-colors duration-300">
                Cookies are small text files that are stored on your computer or
                mobile device when you visit a website. They help the site
                recognize your device and remember your preferences over time.
              </p>
            </section>

            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl group-hover:bg-[#BC002D] group-hover:text-[#17202A] transition-all duration-300">
                  <Settings className="w-6 h-6 text-[#BC002D] group-hover:text-[#17202A]" />
                </div>
                <h2 className="text-3xl font-black text-[#17202A] tracking-tight">
                  2. Cookie Categories
                </h2>
              </div>
              <div className="grid md:grid-cols-1 gap-6 pl-2">
                {[
                  {
                    title: "Essential Cookies",
                    Icon: ShieldAlert,
                    desc: "Critical for site operations like secure login and session management. These cannot be disabled.",
                  },
                  {
                    title: "Analytics Cookies",
                    Icon: PieChart,
                    desc: "Anonymously tracks how users interact with our content to help us measure and improve performance.",
                  },
                  {
                    title: "Marketing Cookies",
                    Icon: Target,
                    desc: "Tailors educational content and advertisements based on your interests and browsing behavior.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-8 bg-[#FFFDF9] rounded-2xl flex items-start gap-6 hover:bg-white hover:shadow-xl hover: transition-all border border-transparent hover:border-[#E5E7EB]"
                  >
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <item.Icon className="w-6 h-6 text-[#BC002D]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#17202A] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl group-hover:bg-[#BC002D] group-hover:text-[#17202A] transition-all duration-300">
                  <Target className="w-6 h-6 text-[#BC002D] group-hover:text-[#17202A]" />
                </div>
                <h2 className="text-3xl font-black text-[#17202A] tracking-tight">
                  3. Managing Choices
                </h2>
              </div>
              <p className="text-[#4B5563] leading-relaxed text-lg pl-2 border-l-2 border-transparent group-hover:border-[#E5E7EB] transition-colors duration-300">
                You can control cookies through your browser settings. However,
                disabling essential cookies may impact your ability to use
                certain site features. To reset your preferences on our site,
                you can clear your browser's local storage.
              </p>
            </section>

            <div className="p-8 bg-white rounded-[2rem] border border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h4 className="font-bold text-[#17202A] mb-1 leading-tight text-xl">
                  Manage your preferences
                </h4>
                <p className="text-[#102A43] text-sm opacity-80">
                  Would you like to review your current cookie settings?
                </p>
              </div>
              <CookieResetButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
