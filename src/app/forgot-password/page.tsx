"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Loader2, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8A1538] rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Forgot Password?</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Enter your email to receive a reset OTP
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#F7E9EE] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-[#8A1538]" />
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">
              Check Your Email
            </h2>
            <p className="text-[#4B5563] mb-6">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent
              a 6-digit OTP. Check your inbox (and spam folder).
            </p>
            <Link
              href="/reset-password"
              className="block w-full bg-[#8A1538] hover:bg-[#5B0F26] text-white py-3 rounded-xl font-semibold text-center transition-colors"
            >
              Enter OTP & Reset Password →
            </Link>
            <p className="mt-4 text-sm text-[#6B7280]">
              Didn&apos;t get it?{" "}
              <button
                onClick={() => setSent(false)}
                className="text-[#8A1538] hover:underline font-medium"
              >
                Try again
              </button>
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-white border border-[#E5E7EB] text-[#5B0F26] px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8A1538] text-white py-3.5 rounded-xl font-semibold hover:bg-[#5B0F26] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send Reset OTP"
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center text-sm text-[#4B5563]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-[#8A1538] hover:text-[#5B0F26] font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
