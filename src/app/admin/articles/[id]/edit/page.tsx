"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { ContentSectionsTab } from "@/components/admin/ContentSectionsTab";
import { FaqsTab } from "@/components/admin/FaqsTab";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

type Category = { id: number; name: string; slug: string };
const TABS = ["Details", "Contents", "FAQs"] as const;
type Tab = (typeof TABS)[number];

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<Tab>("Details");
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/articles/${id}`).then((r) => r.json()),
      fetch("/api/admin/article-categories").then((r) => r.json()),
    ]).then(([data, cats]) => {
      setCategories(cats);
      setForm({ ...data, categoryId: data.categoryId?.toString() || "" });
    });
  }, [id]);

  const set = (f: string, v: unknown) =>
    setForm((p) => (p ? { ...p, [f]: v } : p));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    const res = await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Updated!");
      router.push("/admin/articles");
    } else toast.error("Failed to update");
    setLoading(false);
  };

  if (!form)
    return (
      <div className="p-12 text-center">
        <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/articles">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#1F2937]">Edit Article</h1>
            <a
              href={`/articles/${categories.find((c) => String(c.id) === String(form.categoryId))?.slug}/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#E5E7EB] hover:text-[#5B0F26] transition-all shadow-sm"
            >
              Live <Eye size={14} />
            </a>
          </div>
          <p className="text-sm text-[#6B7280] line-clamp-1">
            {String(form.title || "")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F9FAFB] p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? "bg-white shadow text-[#1F2937]" : "text-[#6B7280] hover:text-[#4B5563]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Details" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
            <h2 className="font-semibold text-[#1F2937] border-b pb-3">
              Article Details
            </h2>
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={String(form.title || "")}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input
                value={String(form.slug || "")}
                onChange={(e) => set("slug", e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={String(form.categoryId || "")}
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
                  value={String(form.shortnote || "")}
                  onChange={(val) => set("shortnote", val)}
                  placeholder="Brief summary..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Full Description</Label>
              <div className="min-h-[400px]">
                <RichTextEditor
                  value={String(form.description || "")}
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
                    checked={!!form[k]}
                    onCheckedChange={(v) => set(k, v)}
                  />
                  <Label>{l}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
            <h2 className="font-semibold text-[#1F2937] border-b pb-3">Media</h2>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                label="Thumbnail"
                value={form.thumbnailPath as string | null}
                onChange={(v) => set("thumbnailPath", v)}
                folder={`articles/${id}/thumbnail`}
              />
              <ImageUpload
                label="Featured Image"
                value={form.imagePath as string | null}
                onChange={(v) => set("imagePath", v)}
                folder={`articles/${id}/image`}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="font-semibold text-[#1F2937] border-b pb-3 mb-4">
              SEO
            </h2>
            <SeoFields
              values={{
                metaTitle: String(form.metaTitle || ""),
                metaKeyword: String(form.metaKeyword || ""),
                metaDescription: String(form.metaDescription || ""),
                ogImagePath: String(form.ogImagePath || ""),
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
              className="bg-[#5B0F26] hover:bg-[#5B0F26]"
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
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {activeTab === "Contents" && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <ContentSectionsTab
            entityId={id}
            apiBase={`/api/admin/articles/${id}/contents`}
            uploadFolder={`articles/${id}/content`}
          />
        </div>
      )}

      {activeTab === "FAQs" && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <FaqsTab apiBase={`/api/admin/articles/${id}/faqs`} />
        </div>
      )}
    </div>
  );
}
