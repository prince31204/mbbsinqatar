"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Province = { id: number; name: string };

export default function CityCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [form, setForm] = useState({ name: "", provinceId: "", status: true });

  useEffect(() => {
    fetch("/api/admin/provinces?limit=200")
      .then((r) => r.json())
      .then((d) => setProvinces(d.data ?? []))
      .catch(() => toast.error("Could not load provinces"));
  }, []);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("City name is required");
    if (!form.provinceId) return toast.error("Please select a province");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          provinceId: parseInt(form.provinceId),
          status: form.status,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("City created");
      router.push("/admin/cities");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#17202A] mb-6">Add City</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5"
      >
        <div className="space-y-1.5">
          <Label>City Name *</Label>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Curepipe"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Province *</Label>
          <Select
            value={form.provinceId}
            onValueChange={(v) => set("provinceId", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select province…" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            className="flex-1 bg-[#102A43] hover:bg-[#102A43]"
          >
            {loading ? "Saving…" : "Create City"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
