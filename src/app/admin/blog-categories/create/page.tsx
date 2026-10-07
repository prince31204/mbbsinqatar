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

export default function BlogCategoryCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    status: true,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    schema: "",
  });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleNameChange = (name: string) => {
    set("name", name);
    if (!form.slug || form.slug === slugify(form.name, { lower: true })) {
      set("slug", slugify(name, { lower: true, strict: true }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Category name is required");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug || slugify(form.name, { lower: true, strict: true }),
          description: form.description || undefined,
          status: form.status,
          metaTitle: form.metaTitle || undefined,
          metaKeyword: form.metaKeyword || undefined,
          metaDescription: form.metaDescription || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Blog category created");
      router.push("/admin/blog-categories");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6">
        Add Blog Category
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Category Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Study Abroad"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="study-abroad"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Brief category description…"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Published</Label>
            <Switch
              checked={form.status}
              onCheckedChange={(v) => set("status", v)}
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
            }}
            onChange={(k, v) => set(k, v)}
            hideOgImage={true}
          />
        </div>
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#5B0F26] hover:bg-[#5B0F26]"
          >
            {loading ? "Saving…" : "Create Category"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
