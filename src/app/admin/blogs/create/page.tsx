"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SeoFields } from "@/components/admin/SeoFields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Save,
  User as UserIcon,
  Clock,
  Tag,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail: null as string | null,
    isFeatured: false,
    status: true,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    schema: "",
    readingTime: 5,
    authorId: "1",
    categoryId: "1",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/blog-categories?limit=200").then((r) => r.json()),
      fetch("/api/admin/users?limit=200").then((r) => r.json()),
    ]).then(([cats, usrs]) => {
      setCategories(cats.data ?? []);
      setUsers(usrs.data ?? []);
      if (cats.data?.[0]) set("categoryId", String(cats.data[0].id));
      if (usrs.data?.[0]) set("authorId", String(usrs.data[0].id));
    });
  }, []);

  const set = (field: string, value: unknown) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      toast.error("Title and slug are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Blog post created!");
      router.push("/admin/blogs");
    } catch {
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 sticky top-0 bg-[#FFFDF9]/80 py-4 border-b mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blogs">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">New Blog Post</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#17202A] border-b pb-3">
            Post Details
          </h2>
          <div className="space-y-1.5">
            <Label>
              Title <span className="text-[#BC002D]">*</span>
            </Label>
            <Input
              value={form.title}
              onChange={(e) => {
                set("title", e.target.value);
                set("slug", slugify(e.target.value));
              }}
              placeholder="e.g. MBBS in Japan — Complete Guide 2025"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Slug <span className="text-[#BC002D]">*</span>
              </Label>
              <Input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Author</Label>
              <Select
                value={form.authorId}
                onValueChange={(v) => set("authorId", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Author" />
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => set("categoryId", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
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
              <Label>Reading Time (min)</Label>
              <Input
                type="number"
                value={form.readingTime}
                onChange={(e) => set("readingTime", parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1.5 min-h-[300px]">
            <Label>Excerpt</Label>
            <RichTextEditor
              value={form.excerpt}
              onChange={(val) => set("excerpt", val)}
              placeholder="Short summary shown in listings"
            />
          </div>
          <div className="space-y-1.5 min-h-[500px]">
            <Label>Content</Label>
            <RichTextEditor
              value={form.content}
              onChange={(val) => set("content", val)}
              placeholder="Write your blog post content here..."
            />
          </div>
          <div className="flex gap-6">
            {[
              { key: "status", label: "Published" },
              { key: "isFeatured", label: "Featured" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <Switch
                  id={key}
                  checked={form[key as keyof typeof form] as boolean}
                  onCheckedChange={(v) => set(key, v)}
                />
                <Label htmlFor={key} className="cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="font-semibold text-[#17202A] border-b pb-3 mb-4">
            Thumbnail
          </h2>
          <ImageUpload
            label="Blog Thumbnail"
            value={form.thumbnail}
            onChange={(v) => set("thumbnail", v)}
            folder="blogs/_tmp/thumbnail"
          />
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
              schema: form.schema,
            }}
            onChange={(f, v) => set(f, v)}
            hideOgImage={true}
          />
        </div>
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" asChild>
            <Link href="/admin/blogs">Cancel</Link>
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
                Publish Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
