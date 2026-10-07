"use client";

import { useState } from "react";
import { Lock, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.newPassword !== form.confirm) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/student/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setForm({ currentPassword: "", newPassword: "", confirm: "" });
      } else {
        setError(data.error || "Failed to change password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-6 h-6 text-[#8A1538]" />
        <h1 className="text-2xl font-bold text-[#1F2937]">Change Password</h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-7 max-w-lg">
        {success && (
          <div className="flex items-center gap-2 bg-[#F7E9EE] border border-[#F7E9EE] text-[#5B0F26] px-4 py-3 rounded-xl mb-5 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" /> Password changed
            successfully.
          </div>
        )}
        {error && (
          <div className="bg-white border border-[#E5E7EB] text-[#5B0F26] px-4 py-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 pr-12 text-[#1F2937] text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#4B5563]"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                placeholder="At least 8 characters"
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 pr-12 text-[#1F2937] text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#4B5563]"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {form.newPassword && form.newPassword.length < 8 && (
              <p className="text-xs text-[#8A1538] mt-1">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Repeat new password"
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#1F2937] text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
            />
            {form.confirm && form.confirm !== form.newPassword && (
              <p className="text-xs text-[#8A1538] mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#8A1538] hover:bg-[#5B0F26] text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
