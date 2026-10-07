"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GraduationCap, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#8A1538] rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-black text-[#1F2937] mb-3">Oops!</h1>
        <h2 className="text-xl font-bold text-[#4B5563] mb-3">
          Something went wrong
        </h2>
        <p className="text-[#6B7280] mb-8 leading-relaxed text-sm">
          An unexpected error occurred. Our team has been notified. Please try
          again or go back to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-[#8A1538] hover:bg-[#5B0F26] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#E5E7EB] text-[#8A1538] hover:bg-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-[#6B7280]">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
