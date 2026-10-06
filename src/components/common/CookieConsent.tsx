"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ShieldCheck, ArrowRight } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay showing to ensure it's not too jarring
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in- duration-700">
      <div className="bg-white/80 border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-6 relative overflow-hidden group">
        {/* Decorative Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9FAFB]/10 rounded-full -mr-16 -mt-16 hidden transition-all group-hover:bg-[#F9FAFB]/20" />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-[#BC002D] p-3 rounded-2xl shadow-lg shrink-0">
              <Cookie className="w-6 h-6 text-[#17202A]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#17202A] flex items-center gap-2">
                Cookie Policy
                <ShieldCheck className="w-4 h-4 text-[#BC002D]" />
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mt-1">
                We use cookies to enhance your journey and analyze our traffic.
                By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>
            <button
              onClick={handleDecline}
              className="text-[#6B7280] hover:text-[#4B5563] transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-white text-[#17202A] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
            >
              Accept All
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 bg-[#F9FAFB] text-[#4B5563] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all active:scale-95"
            >
              Reject All
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex flex-wrap justify-between items-center gap-2 text-[10px] uppercase tracking-wider font-bold">
            <Link
              href="/privacy-policy"
              className="text-[#6B7280] hover:text-[#102A43] transition-colors"
            >
              Privacy
            </Link>
            <span className="text-[#4B5563]">•</span>
            <Link
              href="/terms-of-service"
              className="text-[#6B7280] hover:text-[#102A43] transition-colors"
            >
              Terms
            </Link>
            <span className="text-[#4B5563]">•</span>
            <Link
              href="/cookie-policy"
              className="text-[#6B7280] hover:text-[#102A43] transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
