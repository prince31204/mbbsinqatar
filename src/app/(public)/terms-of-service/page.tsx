import Link from "next/link";
import {
  FileText,
  ChevronRight,
  Scale,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Terms of Service — MBBS in Qatar",
    description:
      "Read our terms of service to understand the rules and guidelines for using our platform.",
    path: "/terms-of-service",
  });
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F7] font-outfit">
      {/* Premium Hero Section */}
      <div className="relative bg-white pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <nav className="flex items-center justify-center space-x-2 text-[#8A1538]/80 text-sm mb-8 animate-in fade-in slide-in- duration-700">
            <Link href="/" className="hover:text-[#5B0F26] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1F2937] font-medium">Terms of Service</span>
          </nav>

          <div className="inline-flex items-center justify-center p-3 bg-[#8A1538]/10 rounded-2xl border border-[#E5E7EB] mb-6 animate-in zoom-in duration-1000">
            <FileText className="w-8 h-8 text-[#8A1538]" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#1F2937] mb-6 tracking-tight">
            Terms of <span className="text-[#8A1538]">Service</span>
          </h1>

          <p className="text-[#6B7280] max-w-2xl mx-auto text-lg leading-relaxed">
            Please read these terms carefully before using our platform. By
            accessing our services, you agree to follow these guidelines.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 pb-24 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#E5E7EB] p-8 md:p-16">
          <div className="flex justify-between items-center mb-12 border-b border-gray-50 pb-8 uppercase tracking-widest text-[10px] font-bold text-[#6B7280]">
            <span>Legal Agreement</span>
            <span>
              Effective Date:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="space-y-16">
            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl group-hover:bg-[#8A1538] group-hover:text-[#1F2937] transition-all duration-300">
                  <Scale className="w-6 h-6 text-[#8A1538] group-hover:text-[#1F2937]" />
                </div>
                <h2 className="text-3xl font-black text-[#1F2937] tracking-tight">
                  1. Agreement to Terms
                </h2>
              </div>
              <p className="text-[#4B5563] leading-relaxed text-lg pl-2 border-l-2 border-transparent group-hover:border-[#E5E7EB] transition-colors duration-300">
                By accessing or using mbbsinqatar.com, you agree to be bound
                by these terms of service and all applicable laws and
                regulations. If you do not agree with any of these terms, you
                are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl group-hover:bg-[#8A1538] group-hover:text-[#1F2937] transition-all duration-300">
                  <ShieldAlert className="w-6 h-6 text-[#8A1538] group-hover:text-[#1F2937]" />
                </div>
                <h2 className="text-3xl font-black text-[#1F2937] tracking-tight">
                  2. Use License
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 pl-2">
                {[
                  {
                    title: "Personal Use",
                    desc: "Materials are for non-commercial transitory viewing only.",
                  },
                  {
                    title: "No Modification",
                    desc: "You may not copy or modify any site content.",
                  },
                  {
                    title: "Account Safety",
                    desc: "You are responsible for maintaining account confidentiality.",
                  },
                  {
                    title: "Prohibited Acts",
                    desc: "Any attempt to decompile software is strictly forbidden.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-6 bg-[#FAF8F7] rounded-2xl hover:bg-white hover:shadow-xl hover: transition-all border border-transparent hover:border-[#E5E7EB]"
                  >
                    <h3 className="font-bold text-[#1F2937] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl group-hover:bg-[#8A1538] group-hover:text-[#1F2937] transition-all duration-300">
                  <AlertCircle className="w-6 h-6 text-[#8A1538] group-hover:text-[#1F2937]" />
                </div>
                <h2 className="text-3xl font-black text-[#1F2937] tracking-tight">
                  3. Disclaimer
                </h2>
              </div>
              <p className="text-[#4B5563] leading-relaxed text-lg pl-2 border-l-2 border-transparent group-hover:border-[#E5E7EB] transition-colors duration-300">
                The materials on MBBS in Qatar's website are provided on an
                'as is' basis. We make no warranties, expressed or implied, and
                hereby disclaim all other warranties including merchantability
                or fitness for a particular purpose.
              </p>
            </section>

            <section className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl group-hover:bg-[#8A1538] group-hover:text-[#1F2937] transition-all duration-300">
                  <HelpCircle className="w-6 h-6 text-[#8A1538] group-hover:text-[#1F2937]" />
                </div>
                <h2 className="text-3xl font-black text-[#1F2937] tracking-tight">
                  4. Limitations
                </h2>
              </div>
              <p className="text-[#4B5563] leading-relaxed text-lg pl-2 border-l-2 border-transparent group-hover:border-[#E5E7EB] transition-colors duration-300">
                In no event shall MBBS in Qatar or its suppliers be liable for
                any damages arising out of the use or inability to use the
                materials on the website, even if notified of the possibility of
                such damage.
              </p>
            </section>

            <div className="p-8 bg-white rounded-[2rem] border border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h4 className="font-bold text-[#1F2937] mb-1 leading-tight text-xl">
                  Need more clarity on our terms?
                </h4>
                <p className="text-[#5B0F26] text-sm opacity-80">
                  Our support team can help explain our usage guidelines.
                </p>
              </div>
              <Link
                href="/contact-us"
                className="whitespace-nowrap px-8 py-3 bg-[#8A1538] text-white rounded-xl font-bold hover:bg-[#5B0F26] transition-all shadow-lg active:scale-95"
              >
                Reach Out to Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
