"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { cdn } from "@/lib/cdn";
import Image from "next/image";

type Photo = {
  id: number;
  title: string | null;
  imagePath: string | null;
  position: number;
  status: boolean;
};

export default function UniversityPhotosPage() {
  const params = useParams();
  const id = params.id as string;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("University");
  const [universitySlug, setUniversitySlug] = useState("");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes, uRes] = await Promise.all([
      fetch(`/api/admin/universities/${id}/photos`),
      fetch(`/api/admin/universities/${id}`),
    ]);
    if (pRes.ok) setPhotos(await pRes.json());
    if (uRes.ok) {
      const u = await uRes.json();
      setUniversityName(u.name || "University");
      setUniversitySlug(u.slug || id);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!imagePath) {
      toast.error("Please upload an image");
      return;
    }
    setAdding(true);
    const res = await fetch(`/api/admin/universities/${id}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imagePath,
        imageName: imagePath.split("/").pop(),
        title,
      }),
    });
    if (res.ok) {
      toast.success("Photo added!");
      setImagePath(null);
      setTitle("");
      load();
    } else toast.error("Failed to add photo");
    setAdding(false);
  };

  const handleDelete = async (pid: number) => {
    if (!confirm("Remove this photo?")) return;
    const res = await fetch(`/api/admin/universities/${id}/photos/${pid}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Removed!");
      load();
    } else toast.error("Failed");
  };

  return (
    <div>
      <UniversitySubNav universityId={id} universityName={universityName} />

      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-[#17202A]">Campus Photos</h2>
          <p className="text-sm text-[#6B7280]">
            {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>

        {/* Add Photo */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-4">
          <h3 className="font-semibold text-[#17202A]">Add New Photo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUpload
              label="Campus Photo"
              value={imagePath}
              onChange={setImagePath}
              folder={`universities/${universitySlug || id}/gallery`}
            />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Photo Caption (optional)</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Main Campus Building"
                />
              </div>
              <Button
                onClick={handleAdd}
                disabled={adding || !imagePath}
                className="bg-[#102A43] hover:bg-[#102A43] w-full"
              >
                {adding ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : (
                  <Plus size={14} className="mr-2" />
                )}
                Add Photo
              </Button>
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : photos.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-gray-300 rounded-xl">
            <ImageIcon size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">
              No photos yet. Upload campus images above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((p) => (
              <div
                key={p.id}
                className="group relative bg-white rounded-xl overflow-hidden border border-[#E5E7EB]"
              >
                <div className="aspect-video relative bg-[#F9FAFB]">
                  {p.imagePath ? (
                    <Image
                      src={cdn(p.imagePath) || ""}
                      alt={p.title || "Campus photo"}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon size={24} className="text-[#4B5563]" />
                    </div>
                  )}
                </div>
                {p.title && (
                  <p className="text-xs text-[#4B5563] p-2 truncate">
                    {p.title}
                  </p>
                )}
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-[#102A43] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
