"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
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
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

type ScholarshipFaq = {
  id: number;
  question: string;
  answer: string;
  position: number;
  status: boolean;
};

export default function ScholarshipFaqsPage() {
  const params = useParams<{ id: string }>();
  const scholarshipId = params.id;

  const [faqs, setFaqs] = useState<ScholarshipFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/scholarships/${scholarshipId}/faqs`);
    if (res.ok) setFaqs(await res.json());
    setLoading(false);
  }, [scholarshipId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newQ.trim() || !newA.trim()) {
      toast.error("Question and answer required");
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/admin/scholarships/${scholarshipId}/faqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: newQ,
        answer: newA,
        position: faqs.length + 1,
      }),
    });
    if (res.ok) {
      toast.success("FAQ added");
      setNewQ("");
      setNewA("");
      setShowAdd(false);
      load();
    } else toast.error("Failed");
    setSaving(false);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    const res = await fetch(
      `/api/admin/scholarships/${scholarshipId}/faqs/${editId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: editQ, answer: editA }),
      },
    );
    if (res.ok) {
      toast.success("Saved");
      setEditId(null);
      load();
    } else toast.error("Failed");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    const res = await fetch(
      `/api/admin/scholarships/${scholarshipId}/faqs/${id}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      toast.success("Deleted");
      load();
    }
  };

  const toggleStatus = async (f: ScholarshipFaq) => {
    await fetch(`/api/admin/scholarships/${scholarshipId}/faqs/${f.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !f.status }),
    });
    load();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HelpCircle size={22} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Scholarship FAQs
            </h1>
            <p className="text-sm text-[#6B7280]">{faqs.length} questions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/scholarships/${scholarshipId}/edit`}>
              ← Scholarship
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={14} className="mr-1" /> Add FAQ
          </Button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-3">
          <h3 className="font-medium text-[#1F2937]">New FAQ</h3>
          <div className="space-y-2">
            <Input
              placeholder="Question"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
            />
            <textarea
              placeholder="Answer..."
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={saving}
              className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : (
                <Check size={14} className="mr-1" />
              )}{" "}
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#E5E7EB]">
            <HelpCircle size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No FAQs yet. Add the first one!</p>
          </div>
        ) : (
          faqs.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-4"
            >
              {editId === f.id ? (
                <div className="space-y-2">
                  <Input
                    value={editQ}
                    onChange={(e) => setEditQ(e.target.value)}
                    className="font-medium"
                  />
                  <textarea
                    value={editA}
                    onChange={(e) => setEditA(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      className="bg-[#5B0F26] hover:bg-[#5B0F26]"
                    >
                      <Check size={14} className="mr-1" /> Save
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
                  <div className="flex-1">
                    <p className="font-medium text-[#1F2937] mb-1">
                      {f.question}
                    </p>
                    <p className="text-sm text-[#4B5563] whitespace-pre-wrap">
                      {f.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Switch
                      checked={f.status}
                      onCheckedChange={() => toggleStatus(f)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setEditId(f.id);
                        setEditQ(f.question);
                        setEditA(f.answer);
                      }}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-[#8A1538] hover:bg-[#5B0F26]"
                      onClick={() => handleDelete(f.id)}
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
