"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Send, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const PROGRAMS = ["MBBS", "BDS", "B.Pharm", "MD (Post Graduate)", "Other"];

export default function AgentAddLeadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    universityName: "",
    program: PROGRAMS[0],
    message: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/agent/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Lead added successfully!");
      router.push("/agent/leads");
    } else {
      toast.error("Failed to add lead. Please try again.");
    }
  };

  const generateLink = () => {
    const link = `${window.location.origin}/apply`;
    navigator.clipboard.writeText(link);
    toast.success("Application link copied!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Add New Lead</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Refer a student and track their application
          </p>
        </div>
        <Button
          onClick={generateLink}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Send size={14} />
          Copy Apply Link
        </Button>
      </div>

      {/* Info box */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 text-sm text-[#5B0F26]">
        <strong className="block mb-1">💡 Pro Tip</strong>
        Copy the application link and share it with your student — they can fill
        out the form themselves. Or fill the details below to add them directly.
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F9FAFB] rounded-xl flex items-center justify-center">
            <UserPlus size={18} className="text-[#8A1538]" />
          </div>
          <h2 className="font-semibold text-[#1F2937]">Student Information</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#6B7280]">Full Name *</label>
              <Input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Student's full name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#6B7280]">Email *</label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#6B7280]">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 000 000 0000"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#6B7280]">Preferred Program</label>
              <select
                value={form.program}
                onChange={(e) => set("program", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
              >
                {PROGRAMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs text-[#6B7280]">
                Preferred University (optional)
              </label>
              <Input
                value={form.universityName}
                onChange={(e) => set("universityName", e.target.value)}
                placeholder="e.g. International School of Medicine"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs text-[#6B7280]">Notes</label>
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={3}
                placeholder="Any additional context about this student…"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#8A1538] hover:bg-[#5B0F26]"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <UserPlus size={14} className="mr-1.5" />
                  Add Lead
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
