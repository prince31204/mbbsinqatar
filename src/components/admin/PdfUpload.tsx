"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

type PdfUploadProps = {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
};

export function PdfUpload({
  label = "PDF File",
  value,
  onChange,
  folder = "brochures",
}: PdfUploadProps) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("PDF must be under 20MB.");
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
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange(data.url);
      toast.success("PDF uploaded successfully.");
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get just the filename from the URL
  const filename = value ? value.split("/").pop() : null;

  // We only allow previewing local uploads (stored under /uploads/).
  const isLocalFile = Boolean(
    value && (value.startsWith("/") || value.startsWith("uploads/")),
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#4B5563]">{label}</Label>
      {value ? (
        <div className="flex items-center gap-3 p-4 bg-[#102A43] border border-[#E5E7EB] rounded-xl">
          <div className="bg-[#102A43] p-2 rounded-lg shrink-0">
            <FileText size={20} className="text-[#BC002D]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#17202A] truncate">
              {filename}
            </p>
            {isLocalFile ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#BC002D] hover:underline"
              >
                Preview PDF ↗
              </a>
            ) : (
              <p className="text-xs text-[#6B7280]">
                Uploaded file will be stored locally (no public URL).
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={() => inputRef.current?.click()}
              title="Replace PDF"
            >
              <Upload size={14} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={() => onChange(null)}
              title="Remove PDF"
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center cursor-pointer hover:border-[#E5E7EB] hover:bg-[#F9FAFB]/10 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? (
            <Loader2
              size={24}
              className="mx-auto text-[#6B7280] animate-spin mb-2"
            />
          ) : (
            <FileText size={24} className="mx-auto text-[#4B5563] mb-2" />
          )}
          <p className="text-sm text-[#6B7280]">
            {loading ? "Uploading PDF..." : "Drop PDF here or click to browse"}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">PDF up to 20MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
