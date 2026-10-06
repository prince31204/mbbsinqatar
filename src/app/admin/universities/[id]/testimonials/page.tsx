"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Star, Users } from "lucide-react";
import Image from "next/image";
import { cdn } from "@/lib/cdn";

type Testimonial = {
  id: number;
  name: string;
  designation: string | null;
  country: string | null;
  course: string | null;
  year: string | null;
  description: string | null;
  rating: number | null;
  imagePath: string | null;
  status: boolean;
};

export default function UniversityTestimonialsPage() {
  const params = useParams();
  const id = params.id as string;
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("University");
  const [universitySlug, setUniversitySlug] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    country: "India",
    course: "MBBS",
    year: "",
    description: "",
    rating: "5",
    imagePath: null as string | null,
    status: true,
  });
  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const [tRes, uRes] = await Promise.all([
      fetch(`/api/admin/universities/${id}/testimonials`),
      fetch(`/api/admin/universities/${id}`),
    ]);
    if (tRes.ok) setItems(await tRes.json());
    if (uRes.ok) {
      const u = await uRes.json();
      setUniversityName(u.name || "University");
      setUniversitySlug(u.slug || id);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const url = editId
      ? `/api/admin/universities/${id}/testimonials/${editId}`
      : `/api/admin/universities/${id}/testimonials`;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(editId ? "Updated!" : "Added!");
      setShowForm(false);
      setEditId(null);
      load();
    } else toast.error("Failed");
    setSaving(false);
  };

  const handleDelete = async (tid: number) => {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(
      `/api/admin/universities/${id}/testimonials/${tid}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      toast.success("Deleted!");
      load();
    }
  };

  return (
    <div>
      <UniversitySubNav universityId={id} universityName={universityName} />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#17202A]">
              Student Testimonials
            </h2>
            <p className="text-sm text-[#6B7280]">
              {items.length} testimonial{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({
                name: "",
                designation: "",
                country: "India",
                course: "MBBS",
                year: "",
                description: "",
                rating: "5",
                imagePath: null,
                status: true,
              });
            }}
            className="bg-[#102A43] hover:bg-[#102A43]"
          >
            <Plus size={16} className="mr-2" />
            Add Testimonial
          </Button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-[#17202A]">
              {editId ? "Edit Testimonial" : "Add Testimonial"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Student Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input
                  value={form.country || ""}
                  onChange={(e) => set("country", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Course</Label>
                <Input
                  value={form.course || ""}
                  onChange={(e) => set("course", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Year</Label>
                <Input
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  placeholder="2023"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Rating (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={(e) => set("rating", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Designation</Label>
                <Input
                  value={form.designation}
                  onChange={(e) => set("designation", e.target.value)}
                  placeholder="MBBS Student"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Testimonial</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <ImageUpload
                  label="Student Photo (optional)"
                  value={form.imagePath}
                  onChange={(v) => set("imagePath", v)}
                  folder={`universities/${universitySlug || id}/testimonials`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.status}
                onCheckedChange={(v) => set("status", v)}
              />
              <Label>Active</Label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#102A43] hover:bg-[#102A43]"
              >
                {saving ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : null}
                {editId ? "Save" : "Add"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-gray-300 rounded-xl">
            <Users size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No testimonials yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F9FAFB] overflow-hidden shrink-0">
                    {t.imagePath ? (
                      <Image
                        src={cdn(t.imagePath) || ""}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users
                        size={20}
                        className="m-auto mt-2.5 text-[#6B7280]"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[#17202A] text-sm">
                        {t.name}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setEditId(t.id);
                            setForm({
                              name: t.name,
                              designation: t.designation || "",
                              country: t.country || "",
                              course: t.course || "",
                              year: t.year || "",
                              description: t.description || "",
                              rating: t.rating?.toString() || "5",
                              imagePath: t.imagePath,
                              status: t.status,
                            });
                            setShowForm(true);
                          }}
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-[#BC002D]"
                          onClick={() => handleDelete(t.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-[#6B7280]">
                      {[t.course, t.country, t.year]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={
                            i < (t.rating || 5)
                              ? "text-[#BC002D] fill-yellow-400"
                              : "text-[#4B5563]"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {t.description && (
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
