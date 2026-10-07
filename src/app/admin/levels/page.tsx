"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, Layers } from "lucide-react";

type Level = { id: number; name: string; slug: string; status: boolean };

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function LevelsPage() {
  const [items, setItems] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ name: string; slug: string }>({
    name: "",
    slug: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/levels");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await fetch("/api/admin/levels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.trim(),
        slug: slugify(newName.trim()),
      }),
    });
    if (res.ok) {
      toast.success("Added!");
      setNewName("");
      load();
    } else toast.error("Failed — slug may already exist");
    setAdding(false);
  };

  const handleUpdate = async (item: Level) => {
    const res = await fetch(`/api/admin/levels/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editData.name,
        slug: editData.slug,
        status: item.status,
      }),
    });
    if (res.ok) {
      toast.success("Updated!");
      setEditId(null);
      load();
    } else toast.error("Failed — slug may conflict");
  };

  const handleStatusToggle = async (item: Level) => {
    await fetch(`/api/admin/levels/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !item.status }),
    });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this level?")) return;
    const res = await fetch(`/api/admin/levels/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    } else toast.error("Cannot delete — it may be in use");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Layers size={22} className="text-[#8A1538]" />
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Education Levels</h1>
          <p className="text-sm text-[#6B7280]">
            Program levels (e.g. MBBS, MD, BDS, PG Diploma)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB] bg-[#FAF8F7] flex gap-3">
          <Input
            placeholder="New level name (e.g. MBBS)..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1"
          />
          <Button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="bg-[#5B0F26] hover:bg-[#5B0F26] shrink-0"
          >
            {adding ? (
              <Loader2 size={14} className="animate-spin mr-1" />
            ) : (
              <Plus size={14} className="mr-1" />
            )}
            Add
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-left text-[#6B7280]">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium text-center">Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-[#FAF8F7]"
                >
                  <td className="px-4 py-3 text-[#6B7280]">{i + 1}</td>
                  <td className="px-4 py-3">
                    {editId === item.id ? (
                      <Input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((p) => ({
                            ...p,
                            name: e.target.value,
                            slug: slugify(e.target.value),
                          }))
                        }
                        className="h-8 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="cursor-pointer hover:text-[#5B0F26]"
                        onClick={() => {
                          setEditId(item.id);
                          setEditData({ name: item.name, slug: item.slug });
                        }}
                      >
                        {item.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editId === item.id ? (
                      <Input
                        value={editData.slug}
                        onChange={(e) =>
                          setEditData((p) => ({ ...p, slug: e.target.value }))
                        }
                        className="h-8 text-sm font-mono"
                      />
                    ) : (
                      <code className="text-xs bg-[#F9FAFB] px-1.5 py-0.5 rounded">
                        {item.slug}
                      </code>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={item.status}
                      onCheckedChange={() => handleStatusToggle(item)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {editId === item.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleUpdate(item)}
                        >
                          <Save size={12} className="mr-1" /> Save
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-[#8A1538] hover:bg-[#5B0F26] hover:text-white"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={13} />
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
