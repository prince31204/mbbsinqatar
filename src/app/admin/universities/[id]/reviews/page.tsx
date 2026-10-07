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
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Star,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { cdn } from "@/lib/cdn";

type Review = {
  id: number;
  name: string;
  designation: string | null;
  country: string | null;
  course: string | null;
  year: string | null;
  description: string | null;
  rating: number | null;
  imagePath: string | null;
  position: number;
  status: boolean;
};

const EMPTY_FORM = {
  name: "",
  designation: "",
  country: "India",
  course: "MBBS",
  year: "",
  description: "",
  rating: "5",
  imagePath: null as string | null,
  position: 1,
  status: true,
};

export default function UniversityReviewsPage() {
  const params = useParams();
  const id = params.id as string;
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("University");
  const [universitySlug, setUniversitySlug] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const [rRes, uRes] = await Promise.all([
      fetch(`/api/admin/universities/${id}/reviews`),
      fetch(`/api/admin/universities/${id}`),
    ]);
    if (rRes.ok) setItems(await rRes.json());
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

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };
  const openEdit = (r: Review) => {
    setForm({
      name: r.name,
      designation: r.designation || "",
      country: r.country || "",
      course: r.course || "",
      year: r.year || "",
      description: r.description || "",
      rating: r.rating?.toString() || "5",
      imagePath: r.imagePath,
      position: r.position,
      status: r.status,
    });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const url = editId
      ? `/api/admin/universities/${id}/reviews/${editId}`
      : `/api/admin/universities/${id}/reviews`;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(editId ? "Updated!" : "Review added!");
      setShowForm(false);
      setEditId(null);
      load();
    } else {
      const d = await res.json();
      toast.error(d.error || "Failed");
    }
    setSaving(false);
  };

  const handleDelete = async (rid: number) => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/admin/universities/${id}/reviews/${rid}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    } else toast.error("Failed to delete");
  };

  return (
    <div>
      <UniversitySubNav universityId={id} universityName={universityName} />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Student Reviews</h2>
            <p className="text-sm text-[#6B7280]">
              {items.length} review{items.length !== 1 ? "s" : ""} — ratings and
              written feedback
            </p>
          </div>
          <Button onClick={openAdd} className="bg-[#5B0F26] hover:bg-[#5B0F26]">
            <Plus size={16} className="mr-2" />
            Add Review
          </Button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-[#1F2937]">
              {editId ? "Edit Review" : "Add New Review"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Reviewer Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input
                  value={form.country || ""}
                  onChange={(e) => set("country", e.target.value)}
                  placeholder="India"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Course</Label>
                <Input
                  value={form.course || ""}
                  onChange={(e) => set("course", e.target.value)}
                  placeholder="MBBS"
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
                <Label>Rating (1–5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={form.rating}
                  onChange={(e) => set("rating", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Designation</Label>
                <Input
                  value={form.designation}
                  onChange={(e) => set("designation", e.target.value)}
                  placeholder="MBBS Student, Year 3"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Review Text</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  placeholder="Write the review..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Position</Label>
                <Input
                  type="number"
                  value={form.position}
                  onChange={(e) =>
                    set("position", parseInt(e.target.value) || 1)
                  }
                  min={1}
                />
              </div>
              <div className="col-span-2">
                <ImageUpload
                  label="Reviewer Photo (optional)"
                  value={form.imagePath}
                  onChange={(v) => set("imagePath", v)}
                  folder={`universities/${universitySlug || id}/reviews`}
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
                className="bg-[#5B0F26] hover:bg-[#5B0F26]"
              >
                {saving ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : null}
                {editId ? "Save Changes" : "Add Review"}
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
            <MessageSquare size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280] font-medium">No reviews yet</p>
            <p className="text-[#6B7280] text-sm">
              Add student reviews and ratings for this university
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#F9FAFB] overflow-hidden shrink-0">
                    {r.imagePath ? (
                      <Image
                        src={cdn(r.imagePath) || ""}
                        alt={r.name}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6B7280] font-bold text-lg">
                        {r.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#1F2937] text-sm">
                          {r.name}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {[r.course, r.country, r.year]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => openEdit(r)}
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-[#8A1538]"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mt-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < (r.rating || 5)
                              ? "text-[#8A1538] fill-yellow-400"
                              : "text-[#4B5563]"
                          }
                        />
                      ))}
                      {r.rating && (
                        <span className="text-xs text-[#6B7280] ml-1">
                          {r.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {r.description && (
                  <p className="text-sm text-[#4B5563] leading-relaxed border-t border-[#E5E7EB] pt-3">
                    {r.description}
                  </p>
                )}
                {!r.status && (
                  <span className="text-xs bg-[#5B0F26] text-[#8A1538] px-2 py-0.5 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
