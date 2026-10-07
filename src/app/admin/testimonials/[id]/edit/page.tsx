"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function TestimonialEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    fetch(`/api/admin/testimonials/${id}`)
      .then((r) => r.json())
      .then((d) =>
        setForm({
          name: d.name ?? "",
          designation: d.designation ?? "",
          description: d.description ?? "",
          rating: d.rating ? String(d.rating) : "",
          videoUrl: d.videoUrl ?? "",
          position: String(d.position ?? 1),
          status: d.status ?? true,
          imageName: d.imageName ?? "",
          imagePath: d.imagePath ?? "",
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
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          designation: form.designation,
          description: form.description,
          rating: form.rating ? parseFloat(form.rating) : undefined,
          videoUrl: form.videoUrl,
          position: parseInt(form.position) || 1,
          status: form.status,
          imageName: form.imageName || null,
          imagePath: form.imagePath || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Testimonial updated");
      router.push("/admin/testimonials");
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
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6">
        Edit Testimonial
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Designation</Label>
              <Input
                value={form.designation}
                onChange={(e) => set("designation", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Testimonial Text</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
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
            <div className="flex items-center justify-between pt-5">
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
            folder={`testimonials/${id}/photo`}
          />
        </div>
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#5B0F26] hover:bg-[#5B0F26]"
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
