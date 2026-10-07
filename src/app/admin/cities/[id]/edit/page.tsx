"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Province = { id: number; name: string };

export default function CityEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [form, setForm] = useState({ name: "", provinceId: "", status: true });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/cities/${id}`).then((r) => r.json()),
      fetch("/api/admin/provinces?limit=200").then((r) => r.json()),
    ])
      .then(([city, pData]) => {
        setProvinces(pData.data ?? []);
        setForm({
          name: city.name ?? "",
          provinceId: String(city.provinceId ?? ""),
          status: city.status ?? true,
        });
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          provinceId: parseInt(form.provinceId),
          status: form.status,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("City updated");
      router.push("/admin/cities");
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
        <Skeleton className="h-48 w-full" />
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6">Edit City</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5"
      >
        <div className="space-y-1.5">
          <Label>City Name *</Label>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
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
