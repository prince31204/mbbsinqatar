"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProvinceEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ name: "", status: true });

  useEffect(() => {
    fetch(`/api/admin/provinces/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setForm({ name: d.name ?? "", status: d.status ?? true });
      })
      .catch(() => toast.error("Failed to load province"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/provinces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), status: form.status }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Province updated");
      router.push("/admin/provinces");
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
        <Skeleton className="h-40 w-full" />
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#17202A] mb-6">Edit Province</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5"
      >
        <div className="space-y-1.5">
          <Label>Province Name *</Label>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
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
            className="flex-1 bg-[#102A43] hover:bg-[#102A43]"
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
