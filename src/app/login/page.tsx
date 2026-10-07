"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only use our own clean 'redirect' param — ignore NextAuth's callbackUrl which causes loops
  const redirect = searchParams.get("redirect") || "/student";
  const verified = searchParams.get("verified") === "1";
  const emailFromQuery = searchParams.get("email") || "";

  const [form, setForm] = useState({ email: emailFromQuery, password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("student-credentials", {
      email: form.email,
      password: form.password,
      type: "student",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8A1538] rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Welcome Back</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Sign in to your student account
          </p>
        </div>

        {/* Verified success banner */}
        {verified && (
          <div className="bg-[#F7E9EE] border border-[#F7E9EE] text-[#5B0F26] px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            ✅ Email verified successfully! Please sign in below.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-white border border-[#E5E7EB] text-[#5B0F26] px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-[#8A1538]"
              />
              <span className="text-[#4B5563]">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[#8A1538] hover:text-[#5B0F26] font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A1538] text-white py-3.5 rounded-xl font-semibold hover:bg-[#5B0F26] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#4B5563]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#8A1538] hover:text-[#5B0F26] font-semibold"
          >
            Register here
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-[#6B7280] hover:text-[#4B5563] text-xs">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
