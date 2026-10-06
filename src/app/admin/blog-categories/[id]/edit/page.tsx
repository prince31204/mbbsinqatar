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

export default function BlogCategoryEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    fetch(`/api/admin/blog-categories/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setForm({
          name: d.name ?? "",
          slug: d.slug ?? "",
          description: d.description ?? "",
          status: d.status ?? true,
          metaTitle: d.metaTitle ?? "",
          metaKeyword: d.metaKeyword ?? "",
          metaDescription: d.metaDescription ?? "",
          schema: d.schema ?? "",
        });
      })
      .catch(() => toast.error("Failed to load"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog-categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug,
          description: form.description,
          status: form.status,
          metaTitle: form.metaTitle,
          metaKeyword: form.metaKeyword,
          metaDescription: form.metaDescription,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Category updated");
      router.push("/admin/blog-categories");
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
        <Skeleton className="h-60 w-full" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#17202A] mb-6">
        Edit Blog Category
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Category Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
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
