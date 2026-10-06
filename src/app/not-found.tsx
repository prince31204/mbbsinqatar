import Link from "next/link";
import { GraduationCap, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white to-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#BC002D] rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-black text-[#BC002D] mb-2 leading-none">
          404
        </h1>
        <h2 className="text-2xl font-bold text-[#17202A] mb-3">
          Page Not Found
        </h2>
        <p className="text-[#6B7280] mb-8 leading-relaxed">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#BC002D] hover:bg-[#8F0023] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/universities"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#E5E7EB] text-[#BC002D] hover:bg-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Universities
          </Link>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 text-left">
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-3">
            Popular Pages
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Universities", href: "/universities" },
              { label: "Scholarships", href: "/scholarships" },
              { label: "Compare Universities", href: "/compare" },
              { label: "About Japan", href: "/about-japan" },
              { label: "FMGE Pass Rates", href: "/fmge-rates" },
              { label: "Contact Us", href: "/contact-us" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 text-sm text-[#4B5563] hover:text-[#102A43] transition-colors py-1"
              >
                <ArrowLeft className="w-3 h-3 rotate-180" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
