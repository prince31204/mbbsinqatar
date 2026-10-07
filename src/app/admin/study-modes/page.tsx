"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, BookOpen, Pencil, Save, X } from "lucide-react";

type StudyMode = { id: number; studyMode: string };

export default function StudyModesPage() {
  const [items, setItems] = useState<StudyMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMode, setNewMode] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/study-modes");
    if (r.ok) setItems(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newMode.trim()) return toast.error("Name is required");
    const r = await fetch("/api/admin/study-modes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studyMode: newMode.trim() }),
    });
    if (r.ok) {
      toast.success("Study mode added");
      setNewMode("");
      load();
    } else toast.error("Failed to add");
  };

  const handleUpdate = async (id: number) => {
    if (!editValue.trim()) return toast.error("Name is required");
    const r = await fetch(`/api/admin/study-modes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studyMode: editValue.trim() }),
    });
    if (r.ok) {
      toast.success("Updated");
      setEditId(null);
      load();
    } else toast.error("Failed to update");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this study mode?")) return;
    await fetch(`/api/admin/study-modes/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen size={22} className="text-[#8A1538]" />
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Study Modes</h1>
          <p className="text-sm text-[#6B7280]">
            {items.length} mode{items.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
        <h2 className="font-semibold text-[#1F2937] mb-4">Add New Study Mode</h2>
        <div className="flex gap-3">
          <Input
            value={newMode}
            onChange={(e) => setNewMode(e.target.value)}
            placeholder="e.g. Full-time, Part-time, Online…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={handleAdd}
            className="bg-[#5B0F26] hover:bg-[#5B0F26] shrink-0"
          >
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] divide-y">
        {loading ? (
          <div className="p-8 text-center text-[#6B7280]">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-[#6B7280]">
            No study modes yet.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4">
              {editId === item.id ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdate(item.id);
                      if (e.key === "Escape") setEditId(null);
                    }}
                  />
                  <Button size="sm" onClick={() => handleUpdate(item.id)}>
                    <Save size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditId(null)}
                  >
                    <X size={14} />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-[#1F2937]">{item.studyMode}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditId(item.id);
                      setEditValue(item.studyMode);
                    }}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#8A1538] hover:text-[#5B0F26]"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
