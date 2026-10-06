"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Plus, Trash2, Save, Pencil, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cdn } from "@/lib/cdn";
import Image from "next/image";

type CuisineItem = {
  id: number;
  dishName: string;
  dishDescription: string;
  dishImage?: string | null;
  iconClass?: string | null;
};

const emptyForm = {
  dishName: "",
  dishDescription: "",
  dishImage: "",
  imageName: "",
  iconClass: "",
};

export default function CuisineAdminPage() {
  const [items, setItems] = useState<CuisineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/about-country/cuisine");
    if (r.ok) setItems(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!form.dishName.trim()) return toast.error("Dish name required");
    const r = await fetch("/api/admin/about-country/cuisine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      toast.success("Added");
      setForm(emptyForm);
      setShowAdd(false);
      load();
    } else toast.error("Failed to add");
  };

  const handleUpdate = async (id: number) => {
    const r = await fetch(`/api/admin/about-country/cuisine/${id}`, {
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
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/about-country/cuisine/${id}`, { method: "DELETE" });
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
            🍜 Cuisine & Food
          </h1>
          <p className="text-sm text-[#6B7280]">{items.length} dishes listed</p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="ml-auto bg-[#102A43] hover:bg-[#102A43]"
        >
          <Plus size={14} className="mr-1" /> Add Dish
        </Button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#17202A]">Add Dish</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Dish Name *</Label>
              <Input
                value={form.dishName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, dishName: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Icon (emoji or URL)</Label>
              <Input
                value={form.iconClass}
                onChange={(e) =>
                  setForm((p) => ({ ...p, iconClass: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.dishDescription}
              onChange={(e) =>
                setForm((p) => ({ ...p, dishDescription: e.target.value }))
              }
              rows={3}
            />
          </div>
          <ImageUpload
            label="Image"
            value={form.dishImage}
            onChange={(path, _name) =>
              setForm((p) => ({ ...p, dishImage: path || "" }))
            }
            folder="about-country/cuisine/_tmp"
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd}>
              <Save size={14} className="mr-1" /> Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAdd(false);
                setForm(emptyForm);
              }}
            >
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
            No dishes added yet.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-4"
            >
              {editId === item.id ? (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Dish Name</Label>
                      <Input
                        value={editForm.dishName}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            dishName: e.target.value,
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
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editForm.dishDescription}
                      onChange={(e) =>
                        setEditForm((p) => ({
                          ...p,
                          dishDescription: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                  <ImageUpload
                    label="Image"
                    value={editForm.dishImage}
                    onChange={(path, _name) =>
                      setEditForm((p) => ({ ...p, dishImage: path || "" }))
                    }
                    folder={`about-country/cuisine/${editId ?? "_tmp"}`}
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
                <div className="flex items-start gap-4">
                  {item.dishImage && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={cdn(item.dishImage)}
                        alt={item.dishName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#17202A]">
                      {item.iconClass} {item.dishName}
                    </p>
                    {item.dishDescription && (
                      <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
                        {item.dishDescription}
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
                          dishName: item.dishName,
                          dishDescription: item.dishDescription,
                          dishImage: item.dishImage ?? "",
                          imageName: "",
                          iconClass: item.iconClass ?? "",
                        });
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#BC002D] hover:text-[#102A43]"
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
