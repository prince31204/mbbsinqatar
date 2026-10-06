"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SeoFields } from "@/components/admin/SeoFields";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

type Category = { id: number; name: string };
type FormData = {
  title: string;
  slug: string;
  categoryId: string;
  shortnote: string;
  description: string;
  thumbnailPath: string | null;
  imagePath: string | null;
  status: boolean;
  homeView: boolean;
  trending: boolean;
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormData>({
    title: "",
    slug: "",
    categoryId: "",
    shortnote: "",
    description: "",
    thumbnailPath: null,
    imagePath: null,
    status: true,
    homeView: false,
    trending: false,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/article-categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      toast.error("Title and slug are required");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Article published!");
      router.push("/admin/articles");
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to create article");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/articles">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">New Article</h1>
          <p className="text-sm text-[#6B7280]">Write a blog article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#17202A] border-b pb-3">
            Article Details
          </h2>
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => {
                set("title", e.target.value);
                set("slug", slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.categoryId}
              onValueChange={(v) => set("categoryId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Short Note</Label>
            <div className="min-h-[120px]">
              <RichTextEditor
                value={form.shortnote}
                onChange={(val) => set("shortnote", val)}
                placeholder="Brief summary..."
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Full Description / Content</Label>
            <div className="min-h-[400px]">
              <RichTextEditor
                value={form.description}
                onChange={(val) => set("description", val)}
                placeholder="Write your article content..."
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { k: "status", l: "Published" },
              { k: "homeView", l: "Show on Home" },
              { k: "trending", l: "Trending" },
            ].map(({ k, l }) => (
              <div key={k} className="flex items-center gap-2">
                <Switch
                  checked={!!form[k as keyof FormData]}
                  onCheckedChange={(v) => set(k, v)}
                />
                <Label>{l}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#17202A] border-b pb-3">Media</h2>
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload
              label="Thumbnail"
              value={form.thumbnailPath}
              onChange={(v) => set("thumbnailPath", v)}
              folder="articles/_tmp/thumbnail"
            />
            <ImageUpload
              label="Featured Image"
              value={form.imagePath}
              onChange={(v) => set("imagePath", v)}
              folder="articles/_tmp/image"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="font-semibold text-[#17202A] border-b pb-3 mb-4">
            SEO
          </h2>
          <SeoFields
            values={{
              metaTitle: form.metaTitle,
              metaKeyword: form.metaKeyword,
              metaDescription: form.metaDescription,
              schema: "",
            }}
            onChange={(f, v) => set(f, v)}
            hideOgImage={true}
          />
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/articles">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-[#102A43] hover:bg-[#102A43]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} className="mr-2" />
                Publish Article
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
