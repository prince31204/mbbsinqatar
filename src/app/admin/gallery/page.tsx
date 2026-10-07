"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { cdn } from "@/lib/cdn";

type GalleryItem = {
  id: number;
  title: string | null;
  imagePath: string;
  position: number;
  status: boolean;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newImage) {
      toast.error("Please upload an image first");
      return;
    }
    setUploading(true);
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imagePath: newImage,
        imageName: newImage.split("/").pop() || "",
        title: newTitle || null,
        position: items.length + 1,
      }),
    });
    if (res.ok) {
      toast.success("Added to gallery!");
      setNewImage(null);
      setNewTitle("");
      setShowAdd(false);
      load();
    } else toast.error("Failed to add");
    setUploading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this photo from gallery?")) return;
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Removed!");
      load();
    }
  };

  const toggleStatus = async (item: GalleryItem) => {
    await fetch(`/api/admin/gallery/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !item.status }),
    });
    load();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon size={22} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Gallery</h1>
            <p className="text-sm text-[#6B7280]">
              {items.length} photos in gallery
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-[#5B0F26] hover:bg-[#5B0F26]"
        >
          {showAdd ? (
            <>
              <X size={14} className="mr-1" />
              Cancel
            </>
          ) : (
            <>
              <Plus size={14} className="mr-1" />
              Add Photo
            </>
          )}
        </Button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937]">Add Photo to Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUpload
              label="Photo *"
              value={newImage}
              onChange={setNewImage}
              folder="gallery/_tmp/image"
            />
            <div className="space-y-1.5">
              <Label>Caption (optional)</Label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Photo caption..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={uploading || !newImage}
              className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={14} className="mr-1" />
                  Add to Gallery
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-[#E5E7EB]">
          <ImageIcon size={36} className="mx-auto mb-3 text-[#4B5563]" />
          <p className="text-[#6B7280]">Gallery is empty.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={14} className="mr-1" />
            Add First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`relative group rounded-xl overflow-hidden border-2 ${item.status ? "border-[#E5E7EB]" : "border-[#E5E7EB] opacity-60"}`}
            >
              <img
                src={cdn(item.imagePath)}
                alt={item.title || "Gallery photo"}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs"
                  onClick={() => toggleStatus(item)}
                >
                  {item.status ? "Hide" : "Show"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 text-xs"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/60 text-[#1F2937] text-xs p-2 truncate">
                  {item.title}
                </div>
              )}
              {!item.status && (
                <div className="absolute top-2 right-2 bg-[#5B0F26] text-white text-xs px-2 py-0.5 rounded">
                  Hidden
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
