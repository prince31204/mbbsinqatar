"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
} from "lucide-react";
import { cdn } from "@/lib/cdn";
import { ImageUpload } from "@/components/admin/ImageUpload";

type OgImage = {
  id: number;
  name: string;
  imageName: string;
  imagePath: string;
  status: boolean;
};

export default function OgImagesPage() {
  const [images, setImages] = useState<OgImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImagePath, setNewImagePath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/seo/og-images");
    if (res.ok) setImages(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newName || !newImagePath) {
      toast.error("Name and image are required");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/seo/og-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        imageName: newImagePath.split("/").pop() ?? newName,
        imagePath: newImagePath,
      }),
    });
    if (res.ok) {
      toast.success("OG Image added");
      setNewName("");
      setNewImagePath(null);
      setShowAdd(false);
      load();
    } else toast.error("Failed");
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this OG image?")) return;
    const res = await fetch(`/api/admin/seo/og-images/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Deleted");
      load();
    }
  };

  const toggleStatus = async (img: OgImage) => {
    await fetch(`/api/admin/seo/og-images/${img.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !img.status }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon size={22} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Default OG Images
            </h1>
            <p className="text-sm text-[#6B7280]">
              Fallback Open Graph images for social sharing
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-[#5B0F26] hover:bg-[#5B0F26]"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={14} className="mr-1" /> Add OG Image
        </Button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-4">
          <h3 className="font-medium text-[#1F2937]">New Default OG Image</h3>
          <div className="space-y-1.5">
            <label className="text-xs text-[#6B7280] block">Name / Label</label>
            <Input
              placeholder="e.g. Homepage Default"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <ImageUpload
            label="OG Image (1200×630 recommended)"
            value={newImagePath}
            onChange={(v) => setNewImagePath(v)}
            folder="og-images/_tmp/image"
          />
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
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowAdd(false);
                setNewImagePath(null);
                setNewName("");
              }}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-4 p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : images.length === 0 ? (
          <div className="col-span-4 p-12 text-center bg-white rounded-xl border border-[#E5E7EB]">
            <ImageIcon size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">
              No OG images yet. Add a default image for social sharing.
            </p>
          </div>
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
            >
              <div className="aspect-video bg-[#F9FAFB] overflow-hidden">
                <img
                  src={
                    cdn(img.imagePath) ||
                    "https://placehold.co/1200x630/e2e8f0/94a3b8?text=No+Image"
                  }
                  alt={img.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    if (!el.dataset.fallback) {
                      el.dataset.fallback = "1";
                      el.src =
                        "https://placehold.co/1200x630/e2e8f0/94a3b8?text=No+Image";
                    }
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-[#1F2937] truncate">
                  {img.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <Switch
                    checked={img.status}
                    onCheckedChange={() => toggleStatus(img)}
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-[#8A1538] hover:bg-white"
                      title="Copy relative path"
                      onClick={() => {
                        navigator.clipboard.writeText(img.imagePath);
                        toast.success("Path copied to clipboard");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-[#8A1538] hover:bg-[#5B0F26]"
                      onClick={() => handleDelete(img.id)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
