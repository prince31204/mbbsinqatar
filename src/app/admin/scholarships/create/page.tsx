"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SeoFields } from "@/components/admin/SeoFields";
import { toast } from "sonner";
import slugify from "slugify";
import { CURRENCY_SYMBOL } from "@/lib/currency";

export default function ScholarshipCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    scholarshipType: "",
    amountMin: "",
    amountMax: "",
    discountPercentage: "",
    availableSeats: "",
    program: "",
    applicationMode: "",
    deadline: "",
    shortnote: "",
    isActive: true,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    schema: "",
  });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleTitleChange = (title: string) => {
    set("title", title);
    if (!form.slug || form.slug === slugify(form.title, { lower: true })) {
      set("slug", slugify(title, { lower: true, strict: true }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug || slugify(form.title, { lower: true, strict: true }),
          scholarshipType: form.scholarshipType || undefined,
          amountMin: form.amountMin ? parseFloat(form.amountMin) : undefined,
          amountMax: form.amountMax ? parseFloat(form.amountMax) : undefined,
          discountPercentage: form.discountPercentage
            ? parseInt(form.discountPercentage)
            : undefined,
          availableSeats: form.availableSeats
            ? parseInt(form.availableSeats)
            : undefined,
          program: form.program || undefined,
          applicationMode: form.applicationMode || undefined,
          deadline: form.deadline || undefined,
          shortnote: form.shortnote || undefined,
          isActive: form.isActive,
          metaTitle: form.metaTitle || undefined,
          metaKeyword: form.metaKeyword || undefined,
          metaDescription: form.metaDescription || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Scholarship created");
      router.push("/admin/scholarships");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#17202A] mb-6">Add Scholarship</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Core Info */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#4B5563] border-b pb-2">
            Basic Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Merit Scholarship 2025"
                required
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="merit-scholarship-2025"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Scholarship Type</Label>
              <Input
                value={form.scholarshipType}
                onChange={(e) => set("scholarshipType", e.target.value)}
                placeholder="Merit / Need-based / Sports"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Program</Label>
              <Input
                value={form.program}
                onChange={(e) => set("program", e.target.value)}
                placeholder="MBBS, BDS…"
              />
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#4B5563] border-b pb-2">
            Financial Details
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>{`Min Amount (${CURRENCY_SYMBOL})`}</Label>
              <Input
                type="number"
                value={form.amountMin}
                onChange={(e) => set("amountMin", e.target.value)}
                placeholder="500"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{`Max Amount (${CURRENCY_SYMBOL})`}</Label>
              <Input
                type="number"
                value={form.amountMax}
                onChange={(e) => set("amountMax", e.target.value)}
                placeholder="5000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Discount %</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={form.discountPercentage}
                onChange={(e) => set("discountPercentage", e.target.value)}
                placeholder="20"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Available Seats</Label>
              <Input
                type="number"
                value={form.availableSeats}
                onChange={(e) => set("availableSeats", e.target.value)}
                placeholder="50"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Application Mode</Label>
              <Input
                value={form.applicationMode}
                onChange={(e) => set("applicationMode", e.target.value)}
                placeholder="Online / Offline"
              />
            </div>
          </div>
        </div>

        {/* Notes & Status */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Short Note</Label>
            <Textarea
              value={form.shortnote}
              onChange={(e) => set("shortnote", e.target.value)}
              rows={3}
              placeholder="Brief description…"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => set("isActive", v)}
            />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <SeoFields
            values={{
              metaTitle: form.metaTitle,
              metaKeyword: form.metaKeyword,
              metaDescription: form.metaDescription,
              schema: form.schema,
            }}
            onChange={(k, v) => set(k, v)}
            hideOgImage={true}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#102A43] hover:bg-[#102A43]"
          >
            {loading ? "Saving…" : "Create Scholarship"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
