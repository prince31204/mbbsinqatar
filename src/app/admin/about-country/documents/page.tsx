"use client";

import { useState, useEffect, useCallback } from "react";
import { FileUpload } from "@/components/admin/FileUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, FileText, Trash2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { cdn } from "@/lib/cdn";

type DocType = "embassy_letter" | "nmc_guidelines";

interface CountryDoc {
  id: number;
  type: DocType;
  title: string | null;
  fileName: string | null;
  filePath: string;
  isActive: boolean;
}

const DOC_CONFIGS: {
  type: DocType;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    type: "embassy_letter",
    label: "Embassy Letter",
    icon: "🏛️",
    desc: "Issued by the Qatar embassy — applies to all universities in the country",
  },
  {
    type: "nmc_guidelines",
    label: "NMC Guidelines",
    icon: "📋",
    desc: "National Medical Commission guidelines for studying MBBS in Qatar",
  },
];

export default function CountryDocumentsPage() {
  const [docs, setDocs] = useState<CountryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<DocType | null>(null);

  // Temporary upload state (before save)
  const [staged, setStaged] = useState<
    Record<DocType, { filePath: string; fileName: string } | null>
  >({
    embassy_letter: null,
    nmc_guidelines: null,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/country-documents");
    if (res.ok) setDocs(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getDoc = (type: DocType) => docs.find((d) => d.type === type) ?? null;

  const handleSave = async (type: DocType) => {
    const s = staged[type];
    if (!s?.filePath) return toast.error("Upload a file first");
    setSaving(type);
    try {
      const res = await fetch("/api/admin/country-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          filePath: s.filePath,
          fileName: s.fileName,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Document saved successfully");
      setStaged((prev) => ({ ...prev, [type]: null }));
      load();
    } catch {
      toast.error("Failed to save document");
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (type: DocType) => {
    const doc = getDoc(type);
    if (!doc) return;
    if (!confirm("Remove this document?")) return;
    const res = await fetch(`/api/admin/country-documents/${doc.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Removed");
      load();
    } else toast.error("Failed to remove");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/about-country">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            📄 Country Documents
          </h1>
          <p className="text-sm text-[#6B7280]">
            Qatar-wide documents shared across all universities
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#6B7280]">Loading...</div>
      ) : (
        <div className="space-y-6">
          {DOC_CONFIGS.map(({ type, label, icon, desc }) => {
            const existing = getDoc(type);
            const hasPending = !!staged[type]?.filePath;

            return (
              <div
                key={type}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4"
              >
                {/* Title */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-[#1F2937] text-lg">
                      {icon} {label}
                    </h2>
                    <p className="text-sm text-[#6B7280] mt-0.5">{desc}</p>
                  </div>
                  {existing && (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-[#F7E9EE] text-[#5B0F26] text-xs font-medium rounded-full border border-[#F7E9EE]">
                      ✓ Uploaded
                    </span>
                  )}
                </div>

                {/* Current file if exists */}
                {existing && !hasPending && (
                  <div className="flex items-center gap-3 p-3 bg-[#FAF8F7] rounded-xl border border-[#E5E7EB]">
                    <FileText size={18} className="text-[#8A1538] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#4B5563] truncate">
                        {existing.fileName ||
                          existing.filePath.split("/").pop()}
                      </p>
                      <a
                        href={cdn(existing.filePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#8A1538] hover:underline"
                      >
                        View / Download
                      </a>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setStaged((prev) => ({
                            ...prev,
                            [type]: { filePath: "", fileName: "" },
                          }))
                        }
                        className="text-xs"
                      >
                        <RefreshCcw size={13} className="mr-1" /> Replace
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#8A1538] hover:text-[#5B0F26]"
                        onClick={() => handleDelete(type as DocType)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Upload zone — shown if no file, or replacing */}
                {(!existing ||
                  hasPending ||
                  (staged[type] !== null && staged[type]?.filePath === "")) && (
                  <div className="space-y-3">
                    <FileUpload
                      label={`Upload ${label}`}
                      value={staged[type]?.filePath || null}
                      fileName={staged[type]?.fileName || null}
                      folder="country-documents"
                      onChange={(url, name) => {
                        setStaged((prev) => ({
                          ...prev,
                          [type]: url
                            ? { filePath: url, fileName: name || "" }
                            : null,
                        }));
                      }}
                    />
                    {hasPending && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(type as DocType)}
                          disabled={saving === type}
                          className="bg-[#5B0F26] hover:bg-[#5B0F26]"
                        >
                          {saving === type ? "Saving..." : "Save Document"}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setStaged((prev) => ({ ...prev, [type]: null }))
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
