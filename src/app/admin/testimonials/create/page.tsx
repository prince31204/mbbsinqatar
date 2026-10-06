"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";

export default function TestimonialCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    description: "",
    rating: "",
    videoUrl: "",
    position: "1",
    status: true,
    imageName: "",
    imagePath: "",
  });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          designation: form.designation || undefined,
          description: form.description || undefined,
          rating: form.rating ? parseFloat(form.rating) : undefined,
          videoUrl: form.videoUrl || undefined,
          position: parseInt(form.position) || 1,
          status: form.status,
          imageName: form.imageName || undefined,
          imagePath: form.imagePath || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Testimonial created");
      router.push("/admin/testimonials");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#17202A] mb-6">Add Testimonial</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Student / Parent name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Designation</Label>
              <Input
                value={form.designation}
                onChange={(e) => set("designation", e.target.value)}
                placeholder="e.g. MBBS Student, 2024"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Testimonial Text</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              placeholder="What did they say about us?"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
                placeholder="5.0"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Position</Label>
              <Input
                type="number"
                min="1"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between col-span-1 pt-5">
              <Label>Published</Label>
              <Switch
                checked={form.status}
                onCheckedChange={(v) => set("status", v)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Video URL (optional)</Label>
            <Input
              value={form.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=…"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <Label className="mb-3 block">Photo</Label>
          <ImageUpload
            value={form.imagePath}
            onChange={(path, name) =>
              setForm((p) => ({
                ...p,
                imagePath: path ?? "",
                imageName: name ?? "",
              }))
            }
            folder="testimonials/_tmp/photo"
          />
        </div>
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#102A43] hover:bg-[#102A43]"
          >
            {loading ? "Saving…" : "Create Testimonial"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
