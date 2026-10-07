"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("student-credentials", {
        email: form.email,
        password: form.password,
        type: "admin",
        redirect: false,
      });
      if (res && !res.error) {
        toast.success("Login successful!");
        router.push("/admin");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#5B0F26] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              M
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Admin Login</h1>
            <p className="text-sm text-[#6B7280] mt-1">MBBS Qatar CMS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-[#4B5563]"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[#4B5563]"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#5B0F26] hover:bg-[#5B0F26] text-white h-11"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
