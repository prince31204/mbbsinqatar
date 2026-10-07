"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface Props {
  apiBase: string; // e.g. "/api/admin/blogs/5/faqs"
}

const emptyForm = { question: "", answer: "" };

export function FaqsTab({ apiBase }: Props) {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(apiBase);
      if (r.ok) setItems(await r.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!form.question.trim()) return toast.error("Question is required");
    try {
      const r = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.question.trim(),
          answer: form.answer,
        }),
      });
      if (!r.ok) throw new Error("Failed to add");
      toast.success("FAQ added");
      setForm(emptyForm);
      setAdding(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const r = await fetch(`${apiBase}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editForm.question.trim(),
          answer: editForm.answer,
        }),
      });
      if (!r.ok) throw new Error("Failed to update");
      toast.success("FAQ updated");
      setEditingId(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    toast.success("FAQ deleted");
    load();
  };

  if (loading)
    return <div className="p-4 text-[#6B7280] text-sm">Loading FAQs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#1F2937]">FAQs ({items.length})</h3>
        <Button size="sm" onClick={() => setAdding(!adding)}>
          <Plus className="w-4 h-4 mr-1" /> Add FAQ
        </Button>
      </div>

      {adding && (
        <div className="border border-[#E5E7EB] rounded-xl p-4 bg-white space-y-3">
          <h4 className="font-medium text-[#5B0F26]">New FAQ</h4>
          <div>
            <Label>Question *</Label>
            <Input
              value={form.question}
              onChange={(e) =>
                setForm((p) => ({ ...p, question: e.target.value }))
              }
              placeholder="Enter question..."
            />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea
              value={form.answer}
              onChange={(e) =>
                setForm((p) => ({ ...p, answer: e.target.value }))
              }
              rows={3}
              placeholder="Enter answer..."
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-[#6B7280] text-sm text-center py-8">
            No FAQs yet. Add your first FAQ above.
          </p>
        ) : (
          items.map((faq, idx) => (
            <div
              key={faq.id}
              className="border border-[#E5E7EB] rounded-xl overflow-hidden"
            >
              {editingId === faq.id ? (
                <div className="p-4 bg-[#8A1538] space-y-3">
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={editForm.question}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, question: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={editForm.answer}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, answer: e.target.value }))
                      }
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(faq.id)}>
                      <Save className="w-4 h-4 mr-1" /> Update
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1F2937] text-sm">
                      Q{idx + 1}: {faq.question}
                    </p>
                    {faq.answer && (
                      <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(faq.id);
                        setEditForm({
                          question: faq.question,
                          answer: faq.answer,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(faq.id)}
                      className="text-[#8A1538] hover:text-[#5B0F26]"
                    >
                      <Trash2 className="w-4 h-4" />
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
