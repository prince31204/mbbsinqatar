"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { cdn } from "@/lib/cdn";

interface OgImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function OgImagePicker({
  value,
  onChange,
  label = "OG Image",
}: OgImagePickerProps) {
  const [images, setImages] = useState<
    { id: number; name: string; imagePath: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/seo/og-images");
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch (error) {
        console.error("Failed to fetch OG images", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Determine if the current value matches one of the gallery images
  const selectedImage = images.find((img) => img.imagePath === value);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
          {label}
        </Label>
        {loading && (
          <Loader2 size={12} className="animate-spin text-[#6B7280]" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#6B7280] font-medium">
              Select from Gallery
            </label>
            <Select
              value={selectedImage ? value : "custom"}
              onValueChange={(v) => {
                if (v !== "custom") onChange(v);
              }}
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Pick an OG image..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">
                  -- Custom / External URL --
                </SelectItem>
                {images.map((img) => (
                  <SelectItem key={img.id} value={img.imagePath}>
                    {img.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-[#6B7280] font-medium">
              Manual URL / Path
            </label>
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/og-images/..."
              className="text-sm h-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-[#6B7280] font-medium">
            Preview
          </label>
          <div className="aspect-video bg-[#FAF8F7] border border-dashed border-[#E5E7EB] rounded-lg overflow-hidden flex items-center justify-center relative group">
            {value ? (
              <img
                src={cdn(value) || value}
                alt="OG Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/1200x630/f8fafc/94a3b8?text=Invalid+Image+URL";
                }}
              />
            ) : (
              <div className="text-[#4B5563] flex flex-col items-center gap-1">
                <ImageIcon size={24} />
                <span className="text-[10px]">No image selected</span>
              </div>
            )}
            {value && (
              <div className="absolute inset-x-0 bottom-0 bg-white/50 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-[#1F2937] truncate text-center">
                  {value}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
