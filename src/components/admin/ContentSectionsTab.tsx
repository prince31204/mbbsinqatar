"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Save, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { toast } from "sonner";

interface ContentItem {
  id: number;
  title: string;
  description: string;
  imagePath?: string | null;
  imageName?: string | null;
  position?: number | null;
  parentId?: number | null;
}

interface Props {
  entityId: string;
  apiBase: string; // e.g. "/api/admin/blogs/5/contents"
  uploadFolder?: string;
  toolbarSelector?: string;
}

const emptyForm = {
  title: "",
  description: "",
  imagePath: "",
  imageName: "",
  position: 0,
  parentId: "",
};

export function ContentSectionsTab({
  entityId,
  apiBase,
  uploadFolder,
  toolbarSelector,
}: Props) {
  const [items, setItems] = useState<ContentItem[]>([]);
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
    if (!form.title.trim()) return toast.error("Title is required");
    try {
      const r = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description,
          imagePath: form.imagePath || null,
          imageName: form.imageName || null,
          position: form.position,
          parentId: form.parentId || null,
        }),
      });
      if (!r.ok) throw new Error("Failed to add");
      toast.success("Section added");
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
          title: editForm.title.trim(),
          description: editForm.description,
          imagePath: editForm.imagePath || null,
          imageName: editForm.imageName || null,
          position: editForm.position,
          parentId: editForm.parentId || null,
        }),
      });
      if (!r.ok) throw new Error("Failed to update");
      toast.success("Section updated");
      setEditingId(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this section?")) return;
    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    toast.success("Section deleted");
    load();
  };

  const topLevel = items.filter((i) => !i.parentId);
  const childrenOf = (pid: number) => items.filter((i) => i.parentId === pid);

  if (loading)
    return <div className="p-4 text-[#6B7280] text-sm">Loading sections...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#1F2937]">
          Content Sections ({items.length})
        </h3>
        <Button size="sm" onClick={() => setAdding(!adding)}>
          <Plus className="w-4 h-4 mr-1" /> Add Section
        </Button>
      </div>

      {adding && (
        <div className="border border-[#E5E7EB] rounded-xl p-4 bg-white space-y-3">
          <h4 className="font-medium text-[#5B0F26]">New Section</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Section title"
              />
            </div>
            <div>
              <Label>Parent Section (optional)</Label>
              <select
                value={form.parentId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, parentId: e.target.value }))
                }
                className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm"
              >
                <option value="">— Top Level —</option>
                {topLevel.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Position</Label>
              <Input
                type="number"
                value={form.position}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    position: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
          <div className="min-h-[300px]">
            <Label className="mb-1.5 block">Description / Content</Label>
            <RichTextEditor
              value={form.description}
              onChange={(val) => setForm((p) => ({ ...p, description: val }))}
              placeholder="Section content..."
              toolbarSelector={toolbarSelector}
            />
          </div>
          <ImageUpload
            value={form.imagePath}
            onChange={(path, name) =>
              setForm((p) => ({
                ...p,
                imagePath: path || "",
                imageName: name || "",
              }))
            }
            label="Section Image"
            folder={uploadFolder}
          />
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
        {topLevel.length === 0 ? (
          <p className="text-[#6B7280] text-sm text-center py-8">
            No content sections yet. Add your first section above.
          </p>
        ) : (
          topLevel.map((section) => (
            <div
              key={section.id}
              className="border border-[#E5E7EB] rounded-xl overflow-hidden"
            >
              {editingId === section.id ? (
                <div className="p-4 bg-[#FAF8F7] space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, title: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        type="number"
                        value={editForm.position}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            position: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="min-h-[300px]">
                    <Label className="mb-1.5 block">Description</Label>
                    <RichTextEditor
                      value={editForm.description}
                      onChange={(val) =>
                        setEditForm((p) => ({ ...p, description: val }))
                      }
                      toolbarSelector={toolbarSelector}
                    />
                  </div>
                  <ImageUpload
                    value={editForm.imagePath}
                    onChange={(path, name) =>
                      setEditForm((p) => ({
                        ...p,
                        imagePath: path || "",
                        imageName: name || "",
                      }))
                    }
                    label="Image"
                    folder={uploadFolder}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(section.id)}>
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
                    <p className="font-medium text-[#1F2937]">{section.title}</p>
                    {section.description && (
                      <p
                        className="text-sm text-[#6B7280] line-clamp-1 mt-0.5"
                        dangerouslySetInnerHTML={{
                          __html: section.description,
                        }}
                      />
                    )}
                    {section.imagePath && (
                      <p className="text-xs text-[#8A1538] mt-1 truncate">
                        {section.imagePath}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(section.id);
                        setEditForm({
                          title: section.title,
                          description: section.description,
                          imagePath: section.imagePath ?? "",
                          imageName: section.imageName ?? "",
                          position: section.position ?? 0,
                          parentId: String(section.parentId ?? ""),
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(section.id)}
                      className="text-[#8A1538] hover:text-[#5B0F26]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Children */}
              {childrenOf(section.id).map((child) => (
                <div
                  key={child.id}
                  className="border-t border-[#E5E7EB] bg-[#FAF8F7]"
                >
                  {editingId === child.id ? (
                    <div className="p-4 space-y-3">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="min-h-[300px]">
                        <Label className="mb-1.5 block">Description</Label>
                        <RichTextEditor
                          value={editForm.description}
                          onChange={(val) =>
                            setEditForm((p) => ({ ...p, description: val }))
                          }
                          toolbarSelector={toolbarSelector}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(child.id)}
                        >
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
                    <div className="p-3 pl-8 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronRight className="w-3 h-3 text-[#6B7280] shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[#4B5563]">
                            {child.title}
                          </p>
                          {child.description && (
                            <p
                              className="text-xs text-[#6B7280] line-clamp-1"
                              dangerouslySetInnerHTML={{
                                __html: child.description,
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            setEditingId(child.id);
                            setEditForm({
                              title: child.title,
                              description: child.description,
                              imagePath: child.imagePath ?? "",
                              imageName: child.imageName ?? "",
                              position: child.position ?? 0,
                              parentId: String(child.parentId ?? ""),
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[#8A1538] hover:text-[#5B0F26]"
                          onClick={() => handleDelete(child.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
