"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Faq = {
  id: number;
  question: string;
  answer: string;
  position: number;
  status: boolean;
};

export default function UniversityFaqsPage() {
  const params = useParams();
  const id = params.id as string;
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("University");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [fRes, uRes] = await Promise.all([
      fetch(`/api/admin/universities/${id}/faqs`),
      fetch(`/api/admin/universities/${id}`),
    ]);
    if (fRes.ok) setFaqs(await fRes.json());
    if (uRes.ok) {
      const u = await uRes.json();
      setUniversityName(u.name || "University");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!question || !answer) {
      toast.error("Both question and answer are required");
      return;
    }
    setSaving(true);
    const url = editId
      ? `/api/admin/universities/${id}/faqs/${editId}`
      : `/api/admin/universities/${id}/faqs`;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });
    if (res.ok) {
      toast.success(editId ? "Updated!" : "Added!");
      setShowForm(false);
      setEditId(null);
      setQuestion("");
      setAnswer("");
      load();
    } else toast.error("Failed");
    setSaving(false);
  };

  const handleEdit = (f: Faq) => {
    setEditId(f.id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setShowForm(true);
  };

  const handleDelete = async (fid: number) => {
    if (!confirm("Delete this FAQ?")) return;
    const res = await fetch(`/api/admin/universities/${id}/faqs/${fid}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    } else toast.error("Failed");
  };

  return (
    <div>
      <UniversitySubNav universityId={id} universityName={universityName} />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#17202A]">FAQs</h2>
            <p className="text-sm text-[#6B7280]">
              {faqs.length} question{faqs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setQuestion("");
              setAnswer("");
            }}
            className="bg-[#102A43] hover:bg-[#102A43]"
          >
            <Plus size={16} className="mr-2" />
            Add FAQ
          </Button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-[#17202A]">
              {editId ? "Edit FAQ" : "New FAQ"}
            </h3>
            <div className="space-y-1.5">
              <Label>Question *</Label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Is NEET mandatory for MBBS in Japan?"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Answer *</Label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                placeholder="Provide a clear, detailed answer..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#102A43] hover:bg-[#102A43]"
              >
                {saving ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : null}
                {editId ? "Save Changes" : "Add FAQ"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-gray-300 rounded-xl">
            <HelpCircle size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">
              No FAQs yet. Add common questions about this university.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4">
                  <button
                    className="flex-1 text-left"
                    onClick={() =>
                      setExpanded(expanded === faq.id ? null : faq.id)
                    }
                  >
                    <div className="flex items-center gap-2">
                      {expanded === faq.id ? (
                        <ChevronUp
                          size={14}
                          className="text-[#6B7280] shrink-0"
                        />
                      ) : (
                        <ChevronDown
                          size={14}
                          className="text-[#6B7280] shrink-0"
                        />
                      )}
                      <span className="font-medium text-[#17202A] text-sm">
                        {faq.question}
                      </span>
                    </div>
                  </button>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit2 size={13} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-[#BC002D] hover:bg-[#102A43]"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
                {expanded === faq.id && (
                  <div className="px-10 pb-4 text-sm text-[#4B5563] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
