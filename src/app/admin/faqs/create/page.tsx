"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

type FaqCategory = { id: number; name: string };

export default function CreateFaqPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    question: "",
    answer: "",
    status: true,
    sortOrder: 0,
    categoryId: "__none__",
  });
  const [categories, setCategories] = useState<FaqCategory[]>([]);

  useEffect(() => {
    fetch("/api/admin/faq-categories")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories)
      .catch(() => {});
  }, []);
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: unknown) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.answer) {
      toast.error("Question and answer are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryId:
            form.categoryId && form.categoryId !== "__none__"
              ? parseInt(form.categoryId)
              : null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("FAQ created!");
      router.push("/admin/faqs");
    } catch {
      toast.error("Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/faqs">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#1F2937]">Add FAQ</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>
              Question <span className="text-[#8A1538]">*</span>
            </Label>
            <Input
              value={form.question}
              onChange={(e) => set("question", e.target.value)}
              placeholder="What is the eligibility for MBBS in Qatar?"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Answer <span className="text-[#8A1538]">*</span>
            </Label>
            <Textarea
              value={form.answer}
              onChange={(e) => set("answer", e.target.value)}
              rows={6}
              placeholder="Detailed answer..."
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
                Create FAQ
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
