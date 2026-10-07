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
  Building2,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Office = {
  id: number;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  mapEmbed: string | null;
  imagePath: string | null;
  position: number;
  status: boolean;
};

const blank: Omit<Office, "id"> = {
  name: "",
  address: "",
  city: "",
  state: "",
  country: "Qatar",
  phone: "",
  email: "",
  mapEmbed: "",
  imagePath: null,
  position: 1,
  status: true,
};

export default function OfficesPage() {
  const [items, setItems] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Office, "id">>(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/offices");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = async () => {
    if (!form.name || !form.address) {
      toast.error("Name and address are required");
      return;
    }
    setSaving(true);
    const url = editId ? `/api/admin/offices/${editId}` : "/api/admin/offices";
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
      setForm(blank);
      load();
    } else toast.error("Failed to save");
    setSaving(false);
  };

  const handleEdit = (item: Office) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      address: item.address,
      city: item.city,
      state: item.state,
      country: item.country,
      phone: item.phone,
      email: item.email,
      mapEmbed: item.mapEmbed,
      imagePath: item.imagePath,
      position: item.position,
      status: item.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this office?")) return;
    const res = await fetch(`/api/admin/offices/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    } else toast.error("Failed");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 size={22} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Offices</h1>
            <p className="text-sm text-[#6B7280]">Manage office locations</p>
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
              Add Office
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937]">
            {editId ? "Edit Office" : "New Office"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label>Office Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label>Address *</Label>
              <Input
                value={form.address || ""}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input
                value={form.city || ""}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Input
                value={form.state || ""}
                onChange={(e) => set("state", e.target.value)}
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
              <Label>Phone</Label>
              <Input
                value={form.phone || ""}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email || ""}
                onChange={(e) => set("email", e.target.value)}
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
              <Label>Google Maps Embed URL</Label>
              <Textarea
                value={form.mapEmbed || ""}
                onChange={(e) => set("mapEmbed", e.target.value)}
                rows={2}
                placeholder="Paste embed URL here..."
              />
            </div>
          </div>
          <ImageUpload
            label="Office Photo"
            value={form.imagePath}
            onChange={(v) => set("imagePath", v)}
            folder={editId ? `offices/${editId}/photo` : "offices/_tmp/photo"}
          />
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
              className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} className="mr-1" />
                  Save Office
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
            <Building2 size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No offices added yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 hover:bg-[#FAF8F7]"
              >
                <Building2 size={20} className="text-[#6B7280] mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#1F2937]">{item.name}</div>
                  <div className="text-sm text-[#6B7280]">
                    {item.address}
                    {item.city ? `, ${item.city}` : ""}
                    {item.country ? `, ${item.country}` : ""}
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-[#6B7280]">
                    {item.phone && <span>📞 {item.phone}</span>}
                    {item.email && <span>✉️ {item.email}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={item.status}
                    onCheckedChange={async () => {
                      await fetch(`/api/admin/offices/${item.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: !item.status }),
                      });
                      load();
                    }}
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
