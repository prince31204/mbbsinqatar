"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Link2,
  ExternalLink,
} from "lucide-react";

type UniversityLink = {
  id: number;
  title: string;
  url: string;
  type: string | null;
  position: number;
  status: boolean;
};

const LINK_TYPES = [
  "Website",
  "Brochure",
  "Admission Form",
  "Prospectus",
  "Video Tour",
  "Virtual Tour",
  "Social Media",
  "Other",
];

const EMPTY_FORM = { title: "", url: "", type: "", position: 1, status: true };

export default function UniversityLinksPage() {
  const params = useParams();
  const id = params.id as string;
  const [items, setItems] = useState<UniversityLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("University");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const [lRes, uRes] = await Promise.all([
      fetch(`/api/admin/universities/${id}/links`),
      fetch(`/api/admin/universities/${id}`),
    ]);
    if (lRes.ok) setItems(await lRes.json());
    if (uRes.ok) {
      const u = await uRes.json();
      setUniversityName(u.name || "University");
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
  const openEdit = (item: UniversityLink) => {
    setForm({
      title: item.title,
      url: item.url,
      type: item.type || "",
      position: item.position,
      status: item.status,
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.url.trim()) {
      toast.error("URL is required");
      return;
    }
    setSaving(true);
    const url = editId
      ? `/api/admin/universities/${id}/links/${editId}`
      : `/api/admin/universities/${id}/links`;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(editId ? "Updated!" : "Link added!");
      setShowForm(false);
      setEditId(null);
      load();
    } else {
      const d = await res.json();
      toast.error(d.error || "Failed");
    }
    setSaving(false);
  };

  const handleDelete = async (lid: number) => {
    if (!confirm("Delete this link?")) return;
    const res = await fetch(`/api/admin/universities/${id}/links/${lid}`, {
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
            <h2 className="text-xl font-bold text-[#1F2937]">
              University Links
            </h2>
            <p className="text-sm text-[#6B7280]">
              {items.length} link{items.length !== 1 ? "s" : ""} — brochures,
              websites, forms, videos
            </p>
          </div>
          <Button onClick={openAdd} className="bg-[#5B0F26] hover:bg-[#5B0F26]">
            <Plus size={16} className="mr-2" />
            Add Link
          </Button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-[#1F2937]">
              {editId ? "Edit Link" : "Add New Link"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Official Website"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Link Type</Label>
                <Select value={form.type} onValueChange={(v) => set("type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LINK_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label>URL *</Label>
                <Input
                  value={form.url}
                  onChange={(e) => set("url", e.target.value)}
                  placeholder="https://example.com/..."
                  type="url"
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
              <div className="flex items-center gap-2 mt-6">
                <Switch
                  checked={form.status}
                  onCheckedChange={(v) => set("status", v)}
                />
                <Label>Active</Label>
              </div>
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
                {editId ? "Save Changes" : "Add Link"}
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
            <Link2 size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280] font-medium">No links yet</p>
            <p className="text-[#6B7280] text-sm">
              Add website, brochure, admission form links
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0">
                  <Link2 size={16} className="text-[#8A1538]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-[#1F2937] text-sm">
                      {item.title}
                    </p>
                    {item.type && (
                      <span className="text-xs bg-[#F9FAFB] text-[#4B5563] px-2 py-0.5 rounded-full">
                        {item.type}
                      </span>
                    )}
                    {!item.status && (
                      <span className="text-xs bg-[#F7E9EE] text-[#8A1538] px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#8A1538] hover:underline truncate flex items-center gap-1 mt-0.5"
                  >
                    {item.url.length > 60
                      ? item.url.slice(0, 60) + "…"
                      : item.url}
                    <ExternalLink size={10} />
                  </a>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => openEdit(item)}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#8A1538] hover:text-[#5B0F26]"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
