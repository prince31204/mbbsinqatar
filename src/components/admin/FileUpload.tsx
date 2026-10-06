"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { cdn } from "@/lib/cdn";

type FileUploadProps = {
  label?: string;
  value?: string | null;
  fileName?: string | null;
  onChange: (url: string | null, filename?: string) => void;
  folder?: string;
  accept?: string;
};

export function FileUpload({
  label = "File",
  value,
  fileName,
  onChange,
  folder = "general",
  accept = ".pdf,.doc,.docx",
}: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF or Word documents are allowed.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB.");
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
        throw new Error(errData.error || `Upload failed (HTTP ${res.status})`);
      }
      const data = await res.json();
      onChange(data.url, data.filename);
      toast.success("File uploaded successfully.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const displayName = fileName || (value ? value.split("/").pop() : null);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#4B5563]">{label}</Label>

      {value ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="p-2 bg-red-100 rounded-lg">
            <FileText size={20} className="text-[#8F0023]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#17202A] truncate">
              {displayName || "Uploaded file"}
            </p>
            <a
              href={cdn(value)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#8F0023] hover:underline mt-0.5"
            >
              <Download size={11} /> View / Download
            </a>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              title="Replace file"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={() => onChange(null)}
              title="Remove"
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
            <FileText size={24} className="mx-auto text-[#4B5563] mb-2" />
          )}
          <p className="text-sm text-[#6B7280]">
            {loading ? "Uploading..." : "Drop PDF here or click to browse"}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">
            PDF, DOC, DOCX up to 20MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
