"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Check, X, Search } from "lucide-react";

// Dynamic page types (templates that generate many URLs)
const PAGE_SUGGESTIONS = [
  "universities",
  "university-detail",
  "scholarships",
  "scholarship-detail",
  "blog",
  "blog-detail",
  "articles",
  "article-detail",
  "news",
  "news-detail",
];

type SeoEntry = {
  id: number;
  page: string;
  metaTitle: string | null;
  metaKeyword: string | null;
  metaDescription: string | null;
  ogImagePath: string | null;
  status: boolean;
};

export default function DynamicSeoPage() {
  const [entries, setEntries] = useState<SeoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<SeoEntry>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({
    page: "",
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    ogImagePath: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/seo/dynamic");
    if (res.ok) setEntries(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newEntry.page) {
      toast.error("Page type required");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/seo/dynamic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    });
    if (res.ok) {
      toast.success("Dynamic SEO entry saved");
      setShowAdd(false);
      setNewEntry({
        page: "",
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        ogImagePath: "",
      });
      load();
    } else toast.error("Failed");
    setSaving(false);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    const res = await fetch(`/api/admin/seo/dynamic/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      toast.success("Saved");
      setEditId(null);
      load();
    } else toast.error("Failed");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this SEO template?")) return;
    const res = await fetch(`/api/admin/seo/dynamic/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Deleted");
      load();
    }
  };

  const toggleStatus = async (e: SeoEntry) => {
    await fetch(`/api/admin/seo/dynamic/${e.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !e.status }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Search size={22} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Dynamic Page SEO
            </h1>
            <p className="text-sm text-[#6B7280]">
              Default meta templates for listing & detail pages. Supports{" "}
              <code className="text-[#8A1538]">{`{{name}}`}</code> placeholders.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-[#5B0F26] hover:bg-[#5B0F26]"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={14} className="mr-1" /> Add Template
        </Button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-3">
          <h3 className="font-medium text-[#1F2937]">
            New Dynamic SEO Template
          </h3>
          <p className="text-xs text-[#6B7280]">
            Use <code className="bg-[#F9FAFB] px-1 rounded">{`{{name}}`}</code>,{" "}
            <code className="bg-[#F9FAFB] px-1 rounded">{`{{city}}`}</code>,{" "}
            <code className="bg-[#F9FAFB] px-1 rounded">{`{{country}}`}</code> as
            placeholders.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6B7280] mb-1 block">
                Page Type *
              </label>
              <select
                value={newEntry.page}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, page: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
              >
                <option value="">Select page type...</option>
                {PAGE_SUGGESTIONS.filter(
                  (p) => !entries.find((e) => e.page === p),
                ).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#6B7280] mb-1 block">
                Meta Title Template
              </label>
              <Input
                value={newEntry.metaTitle}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, metaTitle: e.target.value })
                }
                placeholder={`{{name}} - MBBS in Qatar`}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-[#6B7280] mb-1 block">
                Meta Description Template
              </label>
              <textarea
                value={newEntry.metaDescription}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, metaDescription: e.target.value })
                }
                rows={2}
                placeholder={`Learn about {{name}} - top medical university in Qatar...`}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
              />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] mb-1 block">
                Meta Keywords
              </label>
              <Input
                value={newEntry.metaKeyword}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, metaKeyword: e.target.value })
                }
                placeholder="mbbs Qatar, {{name}}"
              />
            </div>
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
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <Search size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No dynamic SEO templates yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4">
                {editId === entry.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#6B7280] mb-1 block">
                          Page Type
                        </label>
                        <Input
                          value={editData.page ?? ""}
                          onChange={(e) =>
                            setEditData({ ...editData, page: e.target.value })
                          }
                          className="font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#6B7280] mb-1 block">
                          Meta Title
                        </label>
                        <Input
                          value={editData.metaTitle ?? ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              metaTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-[#6B7280] mb-1 block">
                          Meta Description
                        </label>
                        <textarea
                          value={editData.metaDescription ?? ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              metaDescription: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B0F26]/500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#6B7280] mb-1 block">
                          Keywords
                        </label>
                        <Input
                          value={editData.metaKeyword ?? ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              metaKeyword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
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
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-semibold text-[#8A1538] bg-white px-2 py-0.5 rounded">
                          {entry.page}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${entry.status ? "bg-[#F7E9EE] text-[#5B0F26]" : "bg-[#F9FAFB] text-[#6B7280]"}`}
                        >
                          {entry.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {entry.metaTitle && (
                        <p className="text-sm font-medium text-[#1F2937] truncate">
                          {entry.metaTitle}
                        </p>
                      )}
                      {entry.metaDescription && (
                        <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">
                          {entry.metaDescription}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Switch
                        checked={entry.status}
                        onCheckedChange={() => toggleStatus(entry)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setEditId(entry.id);
                          setEditData({
                            page: entry.page,
                            metaTitle: entry.metaTitle ?? "",
                            metaKeyword: entry.metaKeyword ?? "",
                            metaDescription: entry.metaDescription ?? "",
                            ogImagePath: entry.ogImagePath ?? "",
                          });
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#8A1538] hover:bg-[#5B0F26] hover:text-white"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
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
