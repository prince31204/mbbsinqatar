"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
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
          <h1 className="text-2xl font-bold text-[#1F2937]">Reset Password</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Enter the OTP sent to your email
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#F7E9EE] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-[#8A1538]" />
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">
              Password Reset!
            </h2>
            <p className="text-[#4B5563] mb-4">
              Your password has been successfully reset. Redirecting to login...
            </p>
            <Link
              href="/login"
              className="text-[#8A1538] hover:underline font-medium"
            >
              Go to Login →
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-white border border-[#E5E7EB] text-[#5B0F26] px-4 py-3 rounded-lg mb-5 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                  OTP Code
                </label>
                <input
                  type="text"
                  required
                  value={form.otp}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                    })
                  }
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[#1F2937] font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Min 8 characters"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#4B5563]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  placeholder="Repeat new password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8A1538] text-white py-3.5 rounded-xl font-semibold hover:bg-[#5B0F26] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center text-sm text-[#4B5563]">
          <Link
            href="/forgot-password"
            className="text-[#8A1538] hover:text-[#5B0F26] font-medium"
          >
            ← Request New OTP
          </Link>
          {" · "}
          <Link href="/login" className="text-[#6B7280] hover:text-[#4B5563]">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
