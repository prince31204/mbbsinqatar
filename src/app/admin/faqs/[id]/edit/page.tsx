"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type FaqCategory = { id: number; name: string };

export default function EditFaqPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    status: true,
    sortOrder: 0,
    categoryId: "",
  });

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const loadData = useCallback(async () => {
    setFetching(true);
    try {
      const [faqRes, catRes] = await Promise.all([
        fetch(`/api/admin/faqs/${id}`),
        fetch("/api/admin/faq-categories"),
      ]);
      if (faqRes.ok) {
        const faq = await faqRes.json();
        setForm({
          question: faq.question ?? "",
          answer: faq.answer ?? "",
          status: faq.status ?? true,
          sortOrder: faq.sortOrder ?? 0,
          categoryId: faq.categoryId ? String(faq.categoryId) : "__none__",
        });
      } else {
        toast.error("FAQ not found");
        router.push("/admin/faqs");
      }
      if (catRes.ok) setCategories(await catRes.json());
    } finally {
      setFetching(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.question.trim(),
          answer: form.answer.trim(),
          status: form.status,
          sortOrder: Number(form.sortOrder),
          categoryId:
            form.categoryId && form.categoryId !== "__none__"
              ? parseInt(form.categoryId)
              : null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("FAQ updated!");
      router.push("/admin/faqs");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error saving FAQ");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 p-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/faqs">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">Edit FAQ</h1>
          <p className="text-sm text-[#6B7280]">Update question and answer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>
              Question <span className="text-[#BC002D]">*</span>
            </Label>
            <Input
              value={form.question}
              onChange={(e) => set("question", e.target.value)}
              placeholder="What is the eligibility for MBBS in Japan?"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Answer <span className="text-[#BC002D]">*</span>
            </Label>
            <Textarea
              value={form.answer}
              onChange={(e) => set("answer", e.target.value)}
              rows={6}
              placeholder="Detailed answer…"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => set("categoryId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">
                    — General / No Category —
                  </SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  set("sortOrder", parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="status"
              checked={form.status}
              onCheckedChange={(v) => set("status", v)}
            />
            <Label htmlFor="status" className="cursor-pointer">
              Published
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" asChild>
            <Link href="/admin/faqs">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-[#102A43] hover:bg-[#102A43]"
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
