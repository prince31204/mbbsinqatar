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

type CityItem = {
  id: number;
  cityName: string;
  description: string;
  population?: string | null;
  highlights?: string | null;
  cityImage?: string | null;
};
const emptyForm = {
  cityName: "",
  description: "",
  population: "",
  highlights: "",
  cityImage: "",
  imageName: "",
};

export default function CitiesAdminPage() {
  const [items, setItems] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/about-country/cities");
    if (r.ok) setItems(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!form.cityName.trim()) return toast.error("City name required");
    const r = await fetch("/api/admin/about-country/cities", {
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
    const r = await fetch(`/api/admin/about-country/cities/${id}`, {
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
    await fetch(`/api/admin/about-country/cities/${id}`, { method: "DELETE" });
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
          <h1 className="text-2xl font-bold text-[#1F2937]">🏙️ Major Cities</h1>
          <p className="text-sm text-[#6B7280]">{items.length} cities</p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="ml-auto bg-[#5B0F26] hover:bg-[#5B0F26]"
        >
          <Plus size={14} className="mr-1" /> Add City
        </Button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>City Name *</Label>
              <Input
                value={form.cityName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cityName: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Population</Label>
              <Input
                value={form.population}
                onChange={(e) =>
                  setForm((p) => ({ ...p, population: e.target.value }))
                }
              />
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
          <div>
            <Label>Highlights</Label>
            <Textarea
              value={form.highlights}
              onChange={(e) =>
                setForm((p) => ({ ...p, highlights: e.target.value }))
              }
              rows={2}
            />
          </div>
          <ImageUpload
            label="Image"
            value={form.cityImage}
            onChange={(path, _name) =>
              setForm((p) => ({ ...p, cityImage: path || "" }))
            }
            folder="about-country/cities/_tmp"
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
            No cities added yet.
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
                      <Label>City Name</Label>
                      <Input
                        value={editForm.cityName}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            cityName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Population</Label>
                      <Input
                        value={editForm.population}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            population: e.target.value,
                          }))
                        }
                      />
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
                  <div>
                    <Label>Highlights</Label>
                    <Textarea
                      value={editForm.highlights}
                      onChange={(e) =>
                        setEditForm((p) => ({
                          ...p,
                          highlights: e.target.value,
                        }))
                      }
                      rows={2}
                    />
                  </div>
                  <ImageUpload
                    label="Image"
                    value={editForm.cityImage}
                    onChange={(path, _name) =>
                      setEditForm((p) => ({ ...p, cityImage: path || "" }))
                    }
                    folder={`about-country/cities/${editId ?? "_tmp"}`}
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
                    <p className="font-semibold text-[#1F2937]">
                      {item.cityName}
                      {item.population && (
                        <span className="ml-2 text-sm font-normal text-[#6B7280]">
                          Pop: {item.population}
                        </span>
                      )}
                    </p>
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
                          cityName: item.cityName,
                          description: item.description,
                          population: item.population ?? "",
                          highlights: item.highlights ?? "",
                          cityImage: item.cityImage ?? "",
                          imageName: "",
                        });
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#8A1538]"
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
