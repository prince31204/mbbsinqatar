"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

type FormData = {
  name: string;
  slug: string;
  city: string;
  state: string;
  beds: string;
  establishedYear: string;
  accreditation: string;
  status: boolean;
};

export default function EditHospitalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/hospitals/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          city: data.city || "",
          state: data.state || "",
          beds: data.beds?.toString() || "",
          establishedYear: data.establishedYear?.toString() || "",
          accreditation: data.accreditation || "",
          status: data.status,
        });
      });
  }, [id]);

  const set = (field: keyof FormData, value: unknown) =>
    setForm((p) => (p ? { ...p, [field]: value } : p));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    const res = await fetch(`/api/admin/hospitals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        beds: form.beds || null,
        establishedYear: form.establishedYear || null,
      }),
    });
    if (res.ok) {
      toast.success("Hospital updated!");
      router.push("/admin/hospitals");
    } else toast.error("Failed to update hospital");
    setLoading(false);
  };

  if (!form)
    return (
      <div className="p-12 text-center">
        <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/hospitals">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Edit Hospital</h1>
          <p className="text-sm text-[#6B7280]">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Hospital Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label>
                Hospital Name <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Slug <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>State / Province</Label>
              <Input
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Number of Beds</Label>
              <Input
                type="number"
                value={form.beds}
                onChange={(e) => set("beds", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Established Year</Label>
              <Input
                type="number"
                value={form.establishedYear}
                onChange={(e) => set("establishedYear", e.target.value)}
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label>Accreditation</Label>
              <Input
                value={form.accreditation}
                onChange={(e) => set("accreditation", e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Switch
              id="status"
              checked={form.status}
              onCheckedChange={(v) => set("status", v)}
            />
            <Label htmlFor="status" className="cursor-pointer">
              Active
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/hospitals">Cancel</Link>
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
