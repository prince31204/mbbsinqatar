"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import slugify from "slugify";

export default function ProvinceCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", status: true });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Province name is required");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/provinces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), status: form.status }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Province created");
      router.push("/admin/provinces");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6">Add Province</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5"
      >
        <div className="space-y-1.5">
          <Label>Province Name *</Label>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Chui Region"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Published</Label>
          <Switch
            checked={form.status}
            onCheckedChange={(v) => set("status", v)}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#5B0F26] hover:bg-[#5B0F26]"
          >
            {loading ? "Saving…" : "Create Province"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
