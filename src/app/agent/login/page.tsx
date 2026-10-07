"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function AgentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("student-credentials", {
      email,
      password,
      type: "agent",
      redirect: false,
    });
    setLoading(false);
    if (res?.error) setError("Invalid email or password");
    else router.push("/agent");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8A1538] rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-9 h-9 text-[#1F2937]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Agent Portal</h1>
          <p className="text-[#6B7280] mt-1 text-sm">
            MBBS Qatar — Partner Access
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-[#1F2937] mb-6">
            Sign in to your account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-3.5 text-[#6B7280]"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5B0F26]/500 outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-3.5 text-[#6B7280]"
                />
                <input
                  required
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5B0F26]/500 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-[#6B7280]"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#5B0F26]">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8A1538] hover:bg-[#5B0F26] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
