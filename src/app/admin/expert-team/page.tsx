"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Users,
  Linkedin,
} from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Expert = {
  id: number;
  name: string;
  designation: string | null;
  description: string | null;
  photoPath: string | null;
  linkedinUrl: string | null;
  position: number;
  status: boolean;
};

const blank: Omit<Expert, "id"> = {
  name: "",
  designation: "",
  description: "",
  photoPath: null,
  linkedinUrl: "",
  position: 1,
  status: true,
};

export default function ExpertTeamPage() {
  const [items, setItems] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Expert, "id">>(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/expert-team");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const url = editId
      ? `/api/admin/expert-team/${editId}`
      : "/api/admin/expert-team";
    const res = await fetch(url, {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(editId ? "Updated!" : "Added!");
      setShowForm(false);
      setEditId(null);
      setForm(blank);
      load();
    } else toast.error("Failed to save");
    setSaving(false);
  };

  const handleEdit = (item: Expert) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      designation: item.designation,
      description: item.description,
      photoPath: item.photoPath,
      linkedinUrl: item.linkedinUrl,
      position: item.position,
      status: item.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this team member?")) return;
    const res = await fetch(`/api/admin/expert-team/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    }
  };

  const toggleStatus = async (item: Expert) => {
    await fetch(`/api/admin/expert-team/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !item.status }),
    });
    load();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Expert Team</h1>
            <p className="text-sm text-[#6B7280]">
              Manage counsellors and team members shown on the website
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(blank);
          }}
          className="bg-[#5B0F26] hover:bg-[#5B0F26]"
        >
          {showForm ? (
            <>
              <X size={14} className="mr-1" />
              Cancel
            </>
          ) : (
            <>
              <Plus size={14} className="mr-1" />
              Add Member
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937]">
            {editId ? "Edit Member" : "New Team Member"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#6B7280]">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#6B7280]">Designation</label>
              <Input
                value={form.designation || ""}
                onChange={(e) => set("designation", e.target.value)}
                placeholder="e.g. Senior Counsellor"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#6B7280]">LinkedIn URL</label>
              <Input
                value={form.linkedinUrl || ""}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#6B7280]">Position</label>
              <Input
                type="number"
                value={form.position}
                onChange={(e) => set("position", parseInt(e.target.value))}
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs text-[#6B7280]">Description</label>
              <textarea
                value={form.description || ""}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Brief bio or introduction..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
              />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                label="Photo"
                value={form.photoPath}
                onChange={(v) => set("photoPath", v)}
                folder={
                  editId
                    ? `expert-team/${editId}/photo`
                    : "expert-team/_tmp/photo"
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.status}
              onCheckedChange={(v) => set("status", v)}
            />
            <label className="text-sm text-[#4B5563]">
              Active (show on website)
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Check size={14} className="mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No team members added yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                {item.photoPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.photoPath}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#E5E7EB] shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#5B0F26] flex items-center justify-center text-[#8A1538] font-semibold text-lg shrink-0">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#1F2937]">{item.name}</p>
                    {item.linkedinUrl && (
                      <a
                        href={item.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8A1538] hover:text-[#5B0F26]"
                      >
                        <Linkedin size={14} />
                      </a>
                    )}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${item.status ? "bg-[#F7E9EE] text-[#5B0F26]" : "bg-[#F9FAFB] text-[#6B7280]"}`}
                    >
                      {item.status ? "Active" : "Hidden"}
                    </span>
                  </div>
                  {item.designation && (
                    <p className="text-sm text-[#6B7280]">{item.designation}</p>
                  )}
                  {item.description && (
                    <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Switch
                    checked={item.status}
                    onCheckedChange={() => toggleStatus(item)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#8A1538] hover:bg-[#5B0F26]"
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
