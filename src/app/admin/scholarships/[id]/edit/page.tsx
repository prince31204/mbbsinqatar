"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SeoFields } from "@/components/admin/SeoFields";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { CURRENCY_SYMBOL } from "@/lib/currency";

export default function ScholarshipEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    ogImagePath: "",
    schema: "",
  });

  useEffect(() => {
    fetch(`/api/admin/scholarships/${id}`)
      .then((r) => r.json())
      .then((d) =>
        setForm({
          title: d.title ?? "",
          slug: d.slug ?? "",
          scholarshipType: d.scholarshipType ?? "",
          amountMin: d.amountMin ? String(d.amountMin) : "",
          amountMax: d.amountMax ? String(d.amountMax) : "",
          discountPercentage: d.discountPercentage
            ? String(d.discountPercentage)
            : "",
          availableSeats: d.availableSeats ? String(d.availableSeats) : "",
          program: d.program ?? "",
          applicationMode: d.applicationMode ?? "",
          deadline: d.deadline ? d.deadline.split("T")[0] : "",
          shortnote: d.shortnote ?? "",
          isActive: d.isActive ?? true,
          metaTitle: d.metaTitle ?? "",
          metaKeyword: d.metaKeyword ?? "",
          metaDescription: d.metaDescription ?? "",
          schema: d.schema ?? "",
          ogImagePath: d.ogImagePath ?? "",
        }),
      )
      .catch(() => toast.error("Failed to load"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/scholarships/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          scholarshipType: form.scholarshipType,
          amountMin: form.amountMin ? parseFloat(form.amountMin) : undefined,
          amountMax: form.amountMax ? parseFloat(form.amountMax) : undefined,
          discountPercentage: form.discountPercentage
            ? parseInt(form.discountPercentage)
            : undefined,
          availableSeats: form.availableSeats
            ? parseInt(form.availableSeats)
            : undefined,
          program: form.program,
          applicationMode: form.applicationMode,
          deadline: form.deadline,
          shortnote: form.shortnote,
          isActive: form.isActive,
          metaTitle: form.metaTitle,
          metaKeyword: form.metaKeyword,
          metaDescription: form.metaDescription,
          ogImagePath: form.ogImagePath || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Scholarship updated");
      router.push("/admin/scholarships");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (fetching)
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#17202A]">Edit Scholarship</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/scholarships/${id}/faqs`}>
            <HelpCircle size={14} className="mr-1" /> Manage FAQs
          </Link>
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#4B5563] border-b pb-2">
            Basic Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Input
                value={form.scholarshipType}
                onChange={(e) => set("scholarshipType", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Program</Label>
              <Input
                value={form.program}
                onChange={(e) => set("program", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#4B5563] border-b pb-2">
            Financial Details
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>{`Min (${CURRENCY_SYMBOL})`}</Label>
              <Input
                type="number"
                value={form.amountMin}
                onChange={(e) => set("amountMin", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{`Max (${CURRENCY_SYMBOL})`}</Label>
              <Input
                type="number"
                value={form.amountMax}
                onChange={(e) => set("amountMax", e.target.value)}
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
              />
            </div>
            <div className="space-y-1.5">
              <Label>Seats</Label>
              <Input
                type="number"
                value={form.availableSeats}
                onChange={(e) => set("availableSeats", e.target.value)}
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
              <Label>Mode</Label>
              <Input
                value={form.applicationMode}
                onChange={(e) => set("applicationMode", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Short Note</Label>
            <Textarea
              value={form.shortnote}
              onChange={(e) => set("shortnote", e.target.value)}
              rows={3}
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
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <SeoFields
            values={{
              metaTitle: form.metaTitle,
              metaKeyword: form.metaKeyword,
              metaDescription: form.metaDescription,
              schema: form.schema,
              ogImagePath: form.ogImagePath,
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
            {loading ? "Saving…" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
