"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cdn } from "@/lib/cdn";

type ImageUploadProps = {
  label?: string;
  value?: string | null;
  onChange: (url: string | null, filename?: string) => void;
  folder?: string;
};

export function ImageUpload({
  label = "Image",
  value,
  onChange,
  folder = "general",
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = errData.error || "Upload failed";
        const detail = errData.detail ? `: ${errData.detail}` : "";
        throw new Error(`${msg}${detail} (HTTP ${res.status})`);
      }
      const data = await res.json();
      onChange(data.url);
      toast.success("Image uploaded.");
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Upload failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#4B5563]">{label}</Label>
      {value ? (
        <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-[#E5E7EB] group">
          <Image
            src={cdn(value)}
            alt={label}
            fill
            sizes="192px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={14} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={() => onChange(null)}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center cursor-pointer hover:border-[#E5E7EB] hover:bg-[#F9FAFB]/10 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? (
            <Loader2
              size={24}
              className="mx-auto text-[#6B7280] animate-spin mb-2"
            />
          ) : (
            <ImageIcon size={24} className="mx-auto text-[#4B5563] mb-2" />
          )}
          <p className="text-sm text-[#6B7280]">
            {loading ? "Uploading..." : "Drop image here or click to browse"}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">PNG, JPG, WebP up to 5MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
