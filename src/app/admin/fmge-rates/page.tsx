"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  BarChart3,
  FileDown,
  FileUp,
} from "lucide-react";

type FmgeRate = {
  id: number;
  year: number;
  appeared: number | null;
  passed: number | null;
  passPercentage: string | null;
  firstAttemptPassRate: string | null;
  rank: number | null;
  notes: string | null;
  source: string | null;
  universityId: number;
  university: { name: string; id: number };
};

type University = { id: number; name: string };

export default function AdminFmgeRatesPage() {
  const [rates, setRates] = useState<FmgeRate[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterUni, setFilterUni] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading and processing Excel file...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/fmge-rates/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      toast.success(
        `Bulk upload complete! ${json.success} processed, ${json.failed} failed.`,
        { id: toastId, duration: 5000 },
      );
      if (json.errors?.length > 0) {
        console.group("Bulk Upload Errors");
        json.errors.forEach((err: string) => console.warn(err));
        console.groupEnd();
      }
      load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process bulk upload.",
        { id: toastId },
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const [form, setForm] = useState({
    universityId: "",
    year: new Date().getFullYear(),
    appeared: "",
    passed: "",
    passPercentage: "",
    firstAttemptPassRate: "",
    rank: "",
    notes: "",
    source: "",
  });

  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const [rRes, uRes] = await Promise.all([
      fetch("/api/admin/fmge-rates"),
      fetch("/api/admin/universities?limit=200"),
    ]);
    if (rRes.ok) setRates(await rRes.json());
    if (uRes.ok) {
      const d = await uRes.json();
      setUniversities(Array.isArray(d) ? d : d.data || d.universities || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const blank = {
    universityId: "",
    year: new Date().getFullYear(),
    appeared: "",
    passed: "",
    passPercentage: "",
    firstAttemptPassRate: "",
    rank: "",
    notes: "",
    source: "",
  };

  const handleSave = async () => {
    if (!form.universityId || !form.year) {
      toast.error("University and year are required");
      return;
    }
    setSaving(true);
    const payload = {
      universityId: Number(form.universityId),
      year: Number(form.year),
      appeared: form.appeared ? Number(form.appeared) : null,
      passed: form.passed ? Number(form.passed) : null,
      passPercentage: form.passPercentage || null,
      firstAttemptPassRate: form.firstAttemptPassRate || null,
      rank: form.rank ? Number(form.rank) : null,
      notes: form.notes || null,
      source: form.source || null,
    };

    const url = editId
      ? `/api/admin/fmge-rates/${editId}`
      : "/api/admin/fmge-rates";
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editId ? "Updated!" : "Added!");
      setShowForm(false);
      setEditId(null);
      setForm(blank);
      load();
    } else toast.error("Failed to save");
    setSaving(false);
  };

  const handleEdit = (r: FmgeRate) => {
    setForm({
      universityId: r.universityId.toString(),
      year: r.year,
      appeared: r.appeared?.toString() || "",
      passed: r.passed?.toString() || "",
      passPercentage: r.passPercentage || "",
      firstAttemptPassRate: r.firstAttemptPassRate || "",
      rank: r.rank?.toString() || "",
      notes: r.notes || "",
      source: r.source || "",
    });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FMGE rate record?")) return;
    const res = await fetch(`/api/admin/fmge-rates/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    } else toast.error("Failed");
  };

  const filtered =
    filterUni === "all"
      ? rates
      : rates.filter((r) => r.universityId === Number(filterUni));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 size={22} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              FMGE Pass Rates
            </h1>
            <p className="text-sm text-[#6B7280]">
              Foreign Medical Graduates Examination results by university and
              year
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white h-10 p-1 px-2 rounded-lg border border-[#E5E7EB] shadow-sm gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-[#E5E7EB] text-[#4B5563] hover:text-[#5B0F26] hover:border-[#E5E7EB] hover:bg-[#5B0F26] text-xs font-bold shadow-xs bg-white"
              asChild
            >
              <a href="/api/admin/fmge-rates/bulk-template" download>
                <FileDown size={14} className="mr-1.5 text-[#8A1538]" />
                Template
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-8 border-[#E5E7EB] text-[#8A1538] hover:bg-[#5B0F26] hover:text-[#1F2937] transition-all text-xs font-bold"
            >
              {isUploading ? (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              ) : (
                <FileUp size={14} className="mr-1.5" />
              )}
              {isUploading ? "Uploading..." : "Upload Excel"}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept=".xlsx"
              className="hidden"
            />
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm(blank);
            }}
            className="bg-[#5B0F26] hover:bg-[#5B0F26] h-10"
          >
            <Plus size={16} className="mr-2" />
            Add Rate
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Label className="text-sm text-[#4B5563] shrink-0">
          Filter by University:
        </Label>
        <Select value={filterUni} onValueChange={setFilterUni}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Universities</SelectItem>
            {universities.map((u) => (
              <SelectItem key={u.id} value={u.id.toString()}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-[#1F2937]">
            {editId ? "Edit FMGE Rate" : "Add FMGE Rate"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1.5 md:col-span-2">
              <Label>University *</Label>
              <Select
                value={form.universityId}
                onValueChange={(v) => set("universityId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select university..." />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Year *</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                min={2000}
                max={2100}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Appeared</Label>
              <Input
                type="number"
                value={form.appeared}
                onChange={(e) => set("appeared", e.target.value)}
                placeholder="120"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Passed</Label>
              <Input
                type="number"
                value={form.passed}
                onChange={(e) => set("passed", e.target.value)}
                placeholder="90"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Pass % (override)</Label>
              <Input
                value={form.passPercentage}
                onChange={(e) => set("passPercentage", e.target.value)}
                placeholder="75.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label>1st Attempt Pass %</Label>
              <Input
                value={form.firstAttemptPassRate}
                onChange={(e) => set("firstAttemptPassRate", e.target.value)}
                placeholder="60.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label>National Rank</Label>
              <Input
                type="number"
                value={form.rank}
                onChange={(e) => set("rank", e.target.value)}
                placeholder="5"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Input
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
                placeholder="NMC, NBE..."
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            >
              {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {editId ? "Save Changes" : "Add Rate"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <BarChart3 size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No FMGE rate records found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAF8F7] text-left text-[#6B7280]">
                <th className="px-4 py-3 font-medium">University</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium text-center">Appeared</th>
                <th className="px-4 py-3 font-medium text-center">Passed</th>
                <th className="px-4 py-3 font-medium text-center">Pass %</th>
                <th className="px-4 py-3 font-medium text-center">Rank</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const pct = r.passPercentage
                  ? r.passPercentage
                  : r.appeared && r.passed
                    ? ((r.passed / r.appeared) * 100).toFixed(1)
                    : null;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 hover:bg-[#FAF8F7]"
                  >
                    <td className="px-4 py-3 font-medium text-[#1F2937]">
                      {r.university?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#4B5563]">{r.year}</td>
                    <td className="px-4 py-3 text-center text-[#4B5563]">
                      {r.appeared ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-[#4B5563]">
                      {r.passed ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {pct ? (
                        <span className="font-semibold text-[#5B0F26]">
                          {pct}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-[#4B5563]">
                      {r.rank ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(r)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-[#8A1538] hover:bg-[#5B0F26]"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
