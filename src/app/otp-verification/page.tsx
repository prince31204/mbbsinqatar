"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Loader2, RefreshCw } from "lucide-react";

export default function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid OTP. Please try again.");
      } else {
        setSuccess("✅ Email verified! Redirecting to login...");
        // Small delay so user sees the success message
        setTimeout(() => {
          router.push(`/login?verified=1&email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSuccess("A new OTP has been sent to your email.");
      setCountdown(60);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-[#8A1538] rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
          Verify Your Email
        </h1>
        <p className="text-[#6B7280] text-sm mb-2">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="font-semibold text-[#1F2937] mb-8">{email}</p>

        {error && (
          <div className="bg-white border border-[#E5E7EB] text-[#5B0F26] px-4 py-3 rounded-lg mb-6 text-sm text-left">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-[#F7E9EE] border border-[#F7E9EE] text-[#5B0F26] px-4 py-3 rounded-lg mb-6 text-sm text-left">
            {success}
          </div>
        )}

        <form onSubmit={handleVerify}>
          {/* OTP Inputs */}
          <div className="flex justify-center space-x-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/200 transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A1538] text-white py-3.5 rounded-xl font-semibold hover:bg-[#5B0F26] disabled:opacity-60 transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify OTP</span>
            )}
          </button>
        </form>

        <div className="mt-6">
          {countdown > 0 ? (
            <p className="text-[#6B7280] text-sm">Resend OTP in {countdown}s</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex items-center justify-center space-x-1.5 text-[#8A1538] hover:text-[#5B0F26] font-medium text-sm mx-auto disabled:opacity-60"
            >
              <RefreshCw
                className={`w-4 h-4 ${resending ? "animate-spin" : ""}`}
              />
              <span>Resend OTP</span>
            </button>
          )}
        </div>

        <div className="mt-4">
          <Link
            href="/register"
            className="text-[#6B7280] hover:text-[#4B5563] text-xs"
          >
            ← Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
}
