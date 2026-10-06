"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Plus, Trash2, Save, Pencil, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

type AttractionItem = {
  id: number;
  attractionName: string;
  description: string;
  ordering: number;
  isActive: boolean;
  iconClass?: string | null;
  image?: string | null;
};
const emptyForm = {
  attractionName: "",
  description: "",
  ordering: 0,
  isActive: true,
  iconClass: "",
  image: "",
  imageName: "",
};

export default function TouristSpotsAdminPage() {
  const [items, setItems] = useState<AttractionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/about-country/tourist-spots");
    if (r.ok) setItems(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!form.attractionName.trim()) return toast.error("Name required");
    const r = await fetch("/api/admin/about-country/tourist-spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      toast.success("Added");
      setForm(emptyForm);
      setShowAdd(false);
      load();
    } else toast.error("Failed");
  };

  const handleUpdate = async (id: number) => {
    const r = await fetch(`/api/admin/about-country/tourist-spots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (r.ok) {
      toast.success("Updated");
      setEditId(null);
      load();
    } else toast.error("Failed");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/about-country/tourist-spots/${id}`, {
      method: "DELETE",
    });
    toast.success("Deleted");
    load();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/about-country">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">
            🗺️ Tourist Attractions
          </h1>
          <p className="text-sm text-[#6B7280]">{items.length} places</p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="ml-auto bg-[#102A43] hover:bg-[#102A43]"
        >
          <Plus size={14} className="mr-1" /> Add Place
        </Button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Attraction Name *</Label>
              <Input
                value={form.attractionName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, attractionName: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Icon (emoji)</Label>
              <Input
                value={form.iconClass}
                onChange={(e) =>
                  setForm((p) => ({ ...p, iconClass: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Order</Label>
              <Input
                type="number"
                value={form.ordering}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    ordering: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
              />
              <Label>Active</Label>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
            />
          </div>
          <ImageUpload
            label="Image"
            value={form.image}
            onChange={(path, _name) =>
              setForm((p) => ({ ...p, image: path || "" }))
            }
            folder="about-country/tourist-spots/_tmp"
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd}>
              <Save size={14} className="mr-1" /> Save
            </Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-[#6B7280]">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-[#6B7280]">
            No attractions added yet.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-4 ${item.isActive ? "border-[#E5E7EB]" : "border-[#E5E7EB] opacity-70"}`}
            >
              {editId === item.id ? (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={editForm.attractionName}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            attractionName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Input
                        value={editForm.iconClass}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            iconClass: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={editForm.ordering}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            ordering: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-end gap-2 pb-1">
                      <Switch
                        checked={editForm.isActive}
                        onCheckedChange={(v) =>
                          setEditForm((p) => ({ ...p, isActive: v }))
                        }
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                  <ImageUpload
                    label="Image"
                    value={editForm.image}
                    onChange={(path, _name) =>
                      setEditForm((p) => ({ ...p, image: path || "" }))
                    }
                    folder={`about-country/tourist-spots/${editId ?? "_tmp"}`}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(item.id)}>
                      <Save size={14} className="mr-1" /> Update
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditId(null)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.iconClass && (
                        <span className="text-lg">{item.iconClass}</span>
                      )}
                      <p className="font-semibold text-[#17202A]">
                        {item.attractionName}
                      </p>
                      {!item.isActive && (
                        <span className="text-xs bg-[#102A43] text-[#BC002D] px-2 py-0.5 rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditId(item.id);
                        setEditForm({
                          attractionName: item.attractionName,
                          description: item.description,
                          ordering: item.ordering,
                          isActive: item.isActive,
                          iconClass: item.iconClass ?? "",
                          image: item.image ?? "",
                          imageName: "",
                        });
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#BC002D]"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
