"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeoFields } from "@/components/admin/SeoFields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ContentSectionsTab } from "@/components/admin/ContentSectionsTab";
import { FaqsTab } from "@/components/admin/FaqsTab";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Loader2,
  Eye,
  Save,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  User,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cdn } from "@/lib/cdn";
import AuthorProfile from "@/components/blog/AuthorProfile";
import { getExpertProfile } from "@/data/experts";
import Link from "next/link";

const TABS = ["Details", "Contents", "FAQs", "Preview"] as const;
type Tab = (typeof TABS)[number];

export default function BlogEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("Details");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [categorySlug, setCategorySlug] = useState("");
  const [categories, setCategories] = useState<
    { id: number; name: string; slug: string }[]
  >([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    authorId: "1",
    status: true,
    homeView: false,
    trending: false,
    readingTime: 5,
    thumbnailName: "",
    thumbnailPath: "",
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    ogImagePath: "",
    schema: "",
  });
  const [previewData, setPreviewData] = useState<{
    contents: any[];
    faqs: any[];
  }>({ contents: [], faqs: [] });
  const [previewLoading, setPreviewLoading] = useState(false);

  // Derived content tree for preview
  const topLevelSections = previewData.contents.filter((c) => !c.parentId);
  const getChildrenOf = (parentId: number) =>
    previewData.contents.filter((c) => c.parentId === parentId);
  const wordCount = form.content
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime =
    form.readingTime || Math.max(1, Math.round(wordCount / 200));
  const currentCategory = categories.find(
    (c) => String(c.id) === form.categoryId,
  );
  const liveUrl = `/blog/${currentCategory?.slug || categorySlug || "uncategorized"}/${form.slug}`;

  useEffect(() => {
    if (activeTab === "Preview") {
      setPreviewLoading(true);
      Promise.all([
        fetch(`/api/admin/blogs/${id}/contents`).then((r) => r.json()),
        fetch(`/api/admin/blogs/${id}/faqs`).then((r) => r.json()),
      ])
        .then(([contentsRes, faqsRes]) => {
          setPreviewData({
            contents: Array.isArray(contentsRes) ? contentsRes : [],
            faqs: Array.isArray(faqsRes) ? faqsRes : [],
          });
        })
        .catch(() => toast.error("Failed to load preview sections"))
        .finally(() => setPreviewLoading(false));
    }
  }, [activeTab, id]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/blogs/${id}`).then((r) => r.json()),
      fetch("/api/admin/blog-categories?limit=200").then((r) => r.json()),
      fetch("/api/admin/users?limit=200").then((r) => r.json()),
    ])
      .then(([blog, catData, userData]) => {
        setCategories(catData.data ?? []);
        setUsers(userData.data ?? []);
        setCategorySlug(blog.category?.slug ?? "");
        setForm({
          title: blog.title ?? "",
          slug: blog.slug ?? "",
          excerpt: blog.shortnote ?? blog.excerpt ?? "",
          content: blog.description ?? "",
          categoryId: String(blog.categoryId ?? ""),
          authorId: String(blog.authorId ?? "1"),
          status: blog.status ?? true,
          homeView: blog.homeView ?? false,
          trending: blog.trending ?? false,
          readingTime: blog.readingTime ?? 5,
          thumbnailName: blog.thumbnailName ?? "",
          thumbnailPath: blog.thumbnailPath ?? "",
          metaTitle: blog.metaTitle ?? "",
          metaKeyword: blog.metaKeyword ?? "",
          metaDescription: blog.metaDescription ?? "",
          schema: blog.schema ?? "",
          ogImagePath: blog.ogImagePath ?? "",
        });
      })
      .catch(() => toast.error("Failed to load"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug,
          shortnote: form.excerpt,
          description: form.content,
          categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
          authorId: form.authorId ? parseInt(form.authorId) : undefined,
          readingTime: form.readingTime,
          status: form.status,
          homeView: form.homeView,
          trending: form.trending,
          thumbnailName: form.thumbnailName || null,
          thumbnailPath: form.thumbnailPath || null,
          metaTitle: form.metaTitle,
          metaKeyword: form.metaKeyword,
          metaDescription: form.metaDescription,
          ogImagePath: form.ogImagePath || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Blog updated");
      router.push("/admin/blogs");
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
        <Skeleton className="h-96 w-full" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between sticky top-0 bg-[#FAF8F7]/80 z-[60] py-3 border-b mb-6 px-1 gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-[#1F2937] truncate">
            {form.title || "Edit Blog Post"}
          </h1>
          <p className="text-xs text-[#6B7280]">ID: {id}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("Preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              activeTab === "Preview"
                ? "bg-[#5B0F26] text-white border-[#E5E7EB]"
                : "bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#E5E7EB] hover:text-[#5B0F26]"
            }`}
          >
            <Eye size={14} /> Preview
          </button>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#E5E7EB] hover:text-[#5B0F26] transition-all"
          >
            <ExternalLink size={14} /> Live
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F9FAFB] p-1 rounded-xl mb-6 w-fit">
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
        <form id="blog-edit-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Top Row: Publish Settings & Thumbnail side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4 shadow-sm">
              <h3 className="font-semibold text-[#4B5563] text-sm border-b pb-2">
                Publish Settings
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={form.categoryId}
                    onValueChange={(v) => set("categoryId", v)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Author</Label>
                  <Select
                    value={form.authorId}
                    onValueChange={(v) => set("authorId", v)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Reading Time (mins)</Label>
                  <Input
                    type="number"
                    value={form.readingTime}
                    onChange={(e) =>
                      set("readingTime", parseInt(e.target.value))
                    }
                    className="h-9"
                  />
                </div>
                <div className="flex items-center justify-between bg-[#FAF8F7] p-2 rounded-lg border border-[#E5E7EB] mt-5">
                  <Label className="text-xs">Published Status</Label>
                  <Switch
                    checked={form.status}
                    onCheckedChange={(v) => set("status", v)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between bg-[#FAF8F7] p-2 rounded-lg border border-[#E5E7EB]">
                  <Label className="text-xs font-semibold">Home Featured</Label>
                  <Switch
                    checked={form.homeView}
                    onCheckedChange={(v) => set("homeView", v)}
                  />
                </div>
                <div className="flex items-center justify-between bg-[#FAF8F7] p-2 rounded-lg border border-[#E5E7EB]">
                  <Label className="text-xs font-semibold">Trending Post</Label>
                  <Switch
                    checked={form.trending}
                    onCheckedChange={(v) => set("trending", v)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="font-semibold text-[#4B5563] text-sm border-b pb-2 mb-4">
                Thumbnail Image
              </h3>
              <ImageUpload
                value={form.thumbnailPath}
                onChange={(path, name) =>
                  setForm((p) => ({
                    ...p,
                    thumbnailPath: path ?? "",
                    thumbnailName: name ?? "",
                  }))
                }
                folder={`blogs/${id}/thumbnail`}
              />
            </div>
          </div>

          {/* Main Content: Full Width Editor Area */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-6 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                  placeholder="Enter blog title..."
                  className="h-10 text-lg font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (URL Path)</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="url-path-here"
                  className="h-10 font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Excerpt / Summary</Label>
              <div className="min-h-[200px]">
                <RichTextEditor
                  value={form.excerpt}
                  onChange={(val) => set("excerpt", val)}
                  placeholder="Short summary for listed view..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Main Article Content</Label>
              <div className="min-h-[600px]">
                <RichTextEditor
                  value={form.content}
                  onChange={(val) => set("content", val)}
                  placeholder="Write your professional article here..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <SeoFields
              values={{
                metaTitle: form.metaTitle,
                metaKeyword: form.metaKeyword,
                metaDescription: form.metaDescription,
                ogImagePath: form.ogImagePath,
                schema: form.schema,
              }}
              onChange={(k, v) => set(k, v)}
              hideOgImage={true}
            />
          </div>

          <div className="flex gap-4 sticky bottom-6 bg-white p-4 rounded-2xl border shadow-lg z-50">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="flex-1 bg-[#5B0F26] hover:bg-[#5B0F26] text-white font-bold h-12 shadow-md"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="h-12 px-8"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {activeTab === "Contents" && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <ContentSectionsTab
            entityId={id}
            apiBase={`/api/admin/blogs/${id}/contents`}
            uploadFolder={`blogs/${id}/content`}
          />
        </div>
      )}

      {activeTab === "FAQs" && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <FaqsTab apiBase={`/api/admin/blogs/${id}/faqs`} />
        </div>
      )}
      {activeTab === "Preview" && (
        <div className="space-y-6">
          {/* Breadcrumb Mockup */}
          <nav className="bg-white border rounded-xl border-[#E5E7EB] p-3 flex flex-wrap items-center gap-1.5 text-xs text-[#6B7280]">
            <span className="hover:text-[#5B0F26] cursor-default">Home</span>
            <ChevronRight className="w-3 h-3 text-[#4B5563]" />
            <span className="hover:text-[#5B0F26] cursor-default">Blog</span>
            <ChevronRight className="w-3 h-3 text-[#4B5563]" />
            <span className="hover:text-[#5B0F26] cursor-default">
              {categories.find((c) => String(c.id) === form.categoryId)?.name ||
                "Category"}
            </span>
            <ChevronRight className="w-3 h-3 text-[#4B5563]" />
            <span className="text-[#1F2937] font-medium truncate max-w-[200px]">
              {form.title || "Blog Title"}
            </span>
          </nav>
          <article className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden p-8">
            {/* Category pill + badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center bg-[#5B0F26] text-[#8A1538] border border-[#E5E7EB] text-xs font-semibold px-3 py-1 rounded-full">
                {currentCategory?.name || "Uncategorized"}
              </span>
              {form.status && (
                <span className="inline-flex items-center bg-[#F7E9EE] text-[#5B0F26] border border-[#F7E9EE] text-xs font-semibold px-3 py-1 rounded-full">
                  Published
                </span>
              )}
              {form.trending && (
                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold px-3 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" /> Trending
                </span>
              )}
              {form.homeView && (
                <span className="inline-flex items-center bg-white text-[#8A1538] border border-[#E5E7EB] text-xs font-semibold px-3 py-1 rounded-full">
                  Home Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1F2937] leading-snug mb-5">
              {form.title || "(Untitled Post)"}
            </h1>

            {/* Author + date + reading time */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-6 pb-6 border-b border-[#E5E7EB]">
              <span className="flex items-center gap-1.5 text-[#8A1538]">
                <User className="w-4 h-4" />{" "}
                {getExpertProfile(parseInt(form.authorId))?.name ||
                  "Expert Author"}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 text-orange-600">
                <Clock className="w-4 h-4" /> {readingTime} min read
              </span>
            </div>

            {/* Hero image */}
            {form.thumbnailPath && (
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-sm group">
                <img
                  src={cdn(form.thumbnailPath)}
                  alt={form.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                />
              </div>
            )}

            {/* Short note / excerpt */}
            {form.excerpt && (
              <div className="border-l-4 border-[#E5E7EB] pl-4 mb-8 bg-[#F9FAFB]/10 py-3 rounded-r-xl">
                <div
                  className="text-[#4B5563] text-lg leading-relaxed prose prose-sm max-w-none prose-p:my-1"
                  dangerouslySetInnerHTML={{ __html: form.excerpt }}
                />
              </div>
            )}

            {/* Main description */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1F2937] prose-a:text-[#8A1538] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-[#E5E7EB] text-[#4B5563] mb-10"
              dangerouslySetInnerHTML={{
                __html:
                  form.content ||
                  "<p class='text-[#6B7280] italic'>No content yet.</p>",
              }}
            />

            {/* Content sections */}
            {previewLoading ? (
              <div className="space-y-4 my-8 animate-pulse text-center text-[#6B7280] py-10 border-t">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading article sections...
              </div>
            ) : (
              <div className="space-y-10">
                {topLevelSections.map((section) => (
                  <div key={section.id}>
                    {section.title && (
                      <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#5B0F26] rounded-full inline-block shrink-0" />
                        {section.title}
                      </h2>
                    )}
                    {section.description && (
                      <div
                        className="prose prose-lg max-w-none text-[#4B5563] prose-headings:text-[#1F2937] prose-a:text-[#8A1538]"
                        dangerouslySetInnerHTML={{
                          __html: section.description,
                        }}
                      />
                    )}
                    {section.imagePath && (
                      <div className="relative h-64 rounded-xl overflow-hidden mt-5 shadow-sm">
                        <img
                          src={cdn(section.imagePath)}
                          alt={section.title || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Child sections */}
                    {getChildrenOf(section.id).length > 0 && (
                      <div className="mt-6 space-y-6 pl-4 border-l-2 border-[#E5E7EB]">
                        {getChildrenOf(section.id).map((child) => (
                          <div key={child.id}>
                            {child.title && (
                              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                                {child.title}
                              </h3>
                            )}
                            {child.description && (
                              <div
                                className="prose max-w-none text-[#4B5563]"
                                dangerouslySetInnerHTML={{
                                  __html: child.description,
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* FAQ Section */}
                {previewData.faqs.length > 0 && (
                  <div className="bg-[#FAF8F7] rounded-2xl p-8 mt-12 border border-[#E5E7EB]">
                    <h2 className="text-2xl font-bold text-[#1F2937] mb-6 fund-primary">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {previewData.faqs.map((faq) => (
                        <details
                          key={faq.id}
                          className="group bg-white border border-[#E5E7EB] rounded-xl overflow-hidden"
                        >
                          <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[#1F2937] list-none select-none hover:text-[#5B0F26] transition-colors">
                            {faq.question}
                            <span className="ml-4 shrink-0 text-[#6B7280] group-open:rotate-45 transition-transform duration-200 text-xl leading-none">
                              +
                            </span>
                          </summary>
                          <div
                            className="px-5 pb-5 text-[#4B5563] text-sm leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Expert Author Profile */}
            {getExpertProfile(parseInt(form.authorId)) && (
              <AuthorProfile
                profile={getExpertProfile(parseInt(form.authorId))!}
              />
            )}
          </article>
        </div>
      )}
    </div>
  );
}
