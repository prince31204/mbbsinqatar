"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, UserPlus } from "lucide-react";
import Link from "next/link";

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 +91 (India)" },
  { code: "+996", label: "🇰🇬 +996 (Qatar)" },
  { code: "+880", label: "🇧🇩 +880 (Bangladesh)" },
  { code: "+92", label: "🇵🇰 +92 (Pakistan)" },
  { code: "+977", label: "🇳🇵 +977 (Nepal)" },
  { code: "+94", label: "🇱🇰 +94 (Sri Lanka)" },
  { code: "+1", label: "🇺🇸 +1 (USA/Canada)" },
  { code: "+44", label: "🇬🇧 +44 (UK)" },
  { code: "+61", label: "🇦🇺 +61 (Australia)" },
];

const NEET_STATUSES = [
  "qualified",
  "not_qualified",
  "not_appeared",
  "waiting",
] as const;
const LEAD_TYPES = [
  "general",
  "university",
  "scholarship",
  "hot",
  "follow-up",
  "converted",
] as const;

export default function CreateLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCode: "+91",
    city: "",
    state: "",
    country: "India",
    interestedIn: "",
    neetScore: "",
    neetQualificationStatus: "__none__",
    highestLevelOfEducation: "",
    leadType: "__none__",
    source: "",
    status: "active",
    note: "",
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email || null,
        phone: form.phone || null,
        phoneCode: form.phoneCode || null,
        city: form.city || null,
        state: form.state || null,
        country: form.country || null,
        interestedUniversity: form.interestedIn || null,
        neetScore: form.neetScore ? parseInt(form.neetScore) : null,
        neetQualificationStatus:
          form.neetQualificationStatus &&
          form.neetQualificationStatus !== "__none__"
            ? form.neetQualificationStatus
            : null,
        highestLevelOfEducation: form.highestLevelOfEducation || null,
        leadType:
          form.leadType && form.leadType !== "__none__" ? form.leadType : null,
        source: form.source || null,
        status: form.status,
        note: form.note || null,
      };

      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create lead");
      }

      toast.success("Lead created successfully!");
      router.push("/admin/leads");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/leads">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <UserPlus size={22} className="text-[#8A1538]" />
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Add Lead</h1>
          <p className="text-sm text-[#6B7280]">
            Create a new lead/enquiry record
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label>
                Full Name <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="rahul@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <div className="flex gap-2">
                <Select
                  value={form.phoneCode}
                  onValueChange={(v) => set("phoneCode", v)}
                >
                  <SelectTrigger className="w-44 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="9876543210"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Delhi"
              />
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Input
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="Delhi"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Input
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                placeholder="India"
              />
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Academic &amp; Interest Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label>Interested In</Label>
              <Input
                value={form.interestedIn}
                onChange={(e) => set("interestedIn", e.target.value)}
                placeholder="e.g. MBBS in Qatar, International School of Medicine"
              />
            </div>
            <div className="space-y-1.5">
              <Label>NEET Score</Label>
              <Input
                type="number"
                value={form.neetScore}
                onChange={(e) => set("neetScore", e.target.value)}
                placeholder="e.g. 450"
              />
            </div>
            <div className="space-y-1.5">
              <Label>NEET Status</Label>
              <Select
                value={form.neetQualificationStatus}
                onValueChange={(v) => set("neetQualificationStatus", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Not specified —</SelectItem>
                  {NEET_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Highest Education Level</Label>
              <Input
                value={form.highestLevelOfEducation}
                onChange={(e) => set("highestLevelOfEducation", e.target.value)}
                placeholder="e.g. 12th Grade (Science)"
              />
            </div>
          </div>
        </div>

        {/* CRM Info */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            CRM Classification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Lead Type</Label>
              <Select
                value={form.leadType}
                onValueChange={(v) => set("leadType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {LEAD_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Input
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
                placeholder="e.g. website, talk_to_counselor..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Internal Note</Label>
              <Textarea
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                rows={3}
                placeholder="Add notes about this lead (visible to admins only)…"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" asChild>
            <Link href="/admin/leads">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={14} className="mr-2" />
                Create Lead
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
