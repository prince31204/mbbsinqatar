"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Link2,
  Edit2,
  X,
  Check,
  ExternalLink,
} from "lucide-react";

type GovLink = {
  id: number;
  name: string;
  url: string;
  description: string | null;
  logoPath: string | null;
  category: string | null;
  position: number;
  status: boolean;
};

const blank: Omit<GovLink, "id"> = {
  name: "",
  url: "",
  description: "",
  logoPath: null,
  category: "",
  position: 1,
  status: true,
};

export default function GovernmentLinksPage() {
  const [items, setItems] = useState<GovLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<GovLink, "id">>(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/government-links");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = async () => {
    if (!form.name || !form.url) {
      toast.error("Name and URL are required");
      return;
    }
    setSaving(true);
    const url = editId
      ? `/api/admin/government-links/${editId}`
      : "/api/admin/government-links";
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

  const handleEdit = (item: GovLink) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      url: item.url,
      description: item.description,
      logoPath: item.logoPath,
      category: item.category,
      position: item.position,
      status: item.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this link?")) return;
    const res = await fetch(`/api/admin/government-links/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link2 size={22} className="text-[#BC002D]" />
          <div>
            <h1 className="text-2xl font-bold text-[#17202A]">
              Government Links
            </h1>
            <p className="text-sm text-[#6B7280]">
              Official recognition & accreditation links
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(blank);
          }}
          className="bg-[#102A43] hover:bg-[#102A43]"
        >
          {showForm ? (
            <>
              <X size={14} className="mr-1" />
              Cancel
            </>
          ) : (
            <>
              <Plus size={14} className="mr-1" />
              Add Link
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#17202A]">
            {editId ? "Edit Link" : "New Government Link"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL *</Label>
              <Input
                type="url"
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                value={form.category || ""}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. Accreditation, Ministry"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Position</Label>
              <Input
                type="number"
                value={form.position}
                onChange={(e) => set("position", parseInt(e.target.value))}
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description || ""}
                onChange={(e) => set("description", e.target.value)}
                rows={2}
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
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#102A43] hover:bg-[#102A43]"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} className="mr-1" />
                  Save Link
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
            <Link2 size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No government links added yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FFFDF9] text-left text-[#6B7280]">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">URL</th>
                <th className="px-4 py-3 font-medium text-center">Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-[#FFFDF9]"
                >
                  <td className="px-4 py-3 font-medium text-[#17202A]">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">
                    {item.category || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#BC002D] hover:underline flex items-center gap-1 text-xs"
                    >
                      <ExternalLink size={11} />
                      {item.url.replace(/^https?:\/\//, "").slice(0, 40)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={item.status}
                      onCheckedChange={async () => {
                        await fetch(`/api/admin/government-links/${item.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: !item.status }),
                        });
                        load();
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
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
                        className="h-8 w-8 p-0 text-[#BC002D] hover:bg-[#102A43]"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
