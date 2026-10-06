"use client";

import { useState } from "react";
import {
  Upload,
  ClipboardCopy,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { cdn } from "@/lib/cdn";

export default function UploadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ path: string; url: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        setResult({ path: data.path, url: cdn(data.path) || data.path });
      } else {
        const d = await res.json();
        setError(d.error || "Upload failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setUploading(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Upload size={22} className="text-[#BC002D]" />
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">Upload Files</h1>
          <p className="text-sm text-[#6B7280]">
            Upload images and get CDN paths for use in content
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        {/* Folder selection */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#4B5563]">
            Destination Folder
          </label>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43]/500"
          >
            <option value="general">General</option>
            <option value="universities">Universities</option>
            <option value="scholarships">Scholarships</option>
            <option value="blogs">Blogs</option>
            <option value="news">News</option>
            <option value="testimonials">Testimonials</option>
            <option value="gallery">Gallery</option>
            <option value="offices">Offices</option>
            <option value="og-images">OG Images</option>
          </select>
        </div>

        {/* File input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#4B5563]">
            Select Image
          </label>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${file ? "border-[#E5E7EB] bg-[#102A43]" : "border-[#E5E7EB] hover:border-gray-300"}`}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="preview"
                className="max-h-40 mx-auto rounded-lg object-contain mb-3"
              />
            ) : (
              <ImageIcon size={36} className="mx-auto text-[#4B5563] mb-2" />
            )}
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-sm text-[#BC002D] font-medium hover:text-[#102A43]"
            >
              {file ? file.name : "Click to choose file"}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            {file && (
              <p className="text-xs text-[#6B7280] mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-[#BC002D] bg-[#102A43] border border-[#E5E7EB] px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-[#102A43] hover:bg-[#102A43] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload Image
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#8F0023] font-semibold text-sm">
            <CheckCircle size={16} />
            Upload successful!
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-[#6B7280] mb-1">
                DB Path (store in database):
              </p>
              <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2">
                <code className="text-xs text-[#4B5563] flex-1 break-all">
                  {result.path}
                </code>
                <button
                  onClick={() => copy(result.path)}
                  className="text-[#6B7280] hover:text-[#102A43] shrink-0"
                >
                  {copied ? (
                    <CheckCircle size={14} className="text-[#BC002D]" />
                  ) : (
                    <ClipboardCopy size={14} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Full CDN URL:</p>
              <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2">
                <code className="text-xs text-[#4B5563] flex-1 break-all">
                  {result.url}
                </code>
                <button
                  onClick={() => copy(result.url)}
                  className="text-[#6B7280] hover:text-[#102A43] shrink-0"
                >
                  {copied ? (
                    <CheckCircle size={14} className="text-[#BC002D]" />
                  ) : (
                    <ClipboardCopy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
