"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, BookOpen, Eye } from "lucide-react";

type Level = { id: number; name: string };
type Program = {
  id: number;
  programName: string;
  programSlug: string;
  duration: string | null;
  annualTuitionFee: number | null;
  currency: string;
  isActive: boolean;
  level: Level | null;
};

const blankForm = () => ({
  programName: "MBBS",
  programSlug: "mbbs",
  duration: "6 Years",
  levelId: "",
  annualTuitionFee: "",
  totalFee: "",
  totalTuitionFee: "",
  currency: "USD",
  applicationDeadline: "",
  overview: "",
  eligibility: "",
  mediumOfInstruction: "English",
  recognition: "",
  intake: "",
  isActive: true,
  whyChooseVietnam: "",
  additionalInformation: "",
  year1Syllabus: "",
  year2Syllabus: "",
  year3Syllabus: "",
  year4Syllabus: "",
  year5Syllabus: "",
  year6Syllabus: "",
  metaTitle: "",
  metaKeyword: "",
  metaDescription: "",
});

export default function UniversityProgramsPage() {
  const params = useParams();
  const id = params.id as string;
  const [programs, setPrograms] = useState<Program[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("University");
  const [universitySlug, setUniversitySlug] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [form, setForm] = useState(blankForm());

  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes, lRes, uRes] = await Promise.all([
      fetch(`/api/admin/universities/${id}/programs`),
      fetch(`/api/admin/levels`),
      fetch(`/api/admin/universities/${id}`),
    ]);
    if (pRes.ok) setPrograms(await pRes.json());
    if (lRes.ok) setLevels(await lRes.json());
    if (uRes.ok) {
      const u = await uRes.json();
      setUniversityName(u.name || "University");
      setUniversitySlug(u.slug || "");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!form.programName) {
      toast.error("Program name required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      levelId: form.levelId || null,
      annualTuitionFee: form.annualTuitionFee || null,
      totalFee: form.totalFee || null,
      totalTuitionFee: form.totalTuitionFee || null,
    };
    const url = editId
      ? `/api/admin/universities/${id}/programs/${editId}`
      : `/api/admin/universities/${id}/programs`;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editId ? "Updated!" : "Created!");
      setShowForm(false);
      setEditId(null);
      load();
    } else toast.error("Failed to save");
    setSaving(false);
  };

  const handleEdit = async (p: Program) => {
    setLoadingEdit(true);
    setShowForm(true);
    setEditId(p.id);
    // Fetch full program data to get all fields including syllabuses
    const res = await fetch(`/api/admin/universities/${id}/programs/${p.id}`);
    if (res.ok) {
      const full = await res.json();
      setForm({
        programName: full.programName || "",
        programSlug: full.programSlug || "",
        duration: full.duration || "",
        levelId: full.levelId?.toString() || "",
        annualTuitionFee: full.annualTuitionFee?.toString() || "",
        totalFee: full.totalFee?.toString() || "",
        totalTuitionFee: full.totalTuitionFee?.toString() || "",
        currency: full.currency || "USD",
        applicationDeadline: full.applicationDeadline || "",
        overview: full.overview || "",
        eligibility: full.eligibility || "",
        mediumOfInstruction: full.mediumOfInstruction || "English",
        recognition: full.recognition || "",
        intake: full.intake || "",
        isActive: full.isActive ?? true,
        whyChooseVietnam: full.whyChooseVietnam || "",
        additionalInformation: full.additionalInformation || "",
        year1Syllabus: full.year1Syllabus || "",
        year2Syllabus: full.year2Syllabus || "",
        year3Syllabus: full.year3Syllabus || "",
        year4Syllabus: full.year4Syllabus || "",
        year5Syllabus: full.year5Syllabus || "",
        year6Syllabus: full.year6Syllabus || "",
        metaTitle: full.metaTitle || "",
        metaKeyword: full.metaKeyword || "",
        metaDescription: full.metaDescription || "",
      });
    } else {
      toast.error("Failed to load program data");
    }
    setLoadingEdit(false);
  };

  const handleDelete = async (pid: number) => {
    if (!confirm("Delete this program?")) return;
    const res = await fetch(`/api/admin/universities/${id}/programs/${pid}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    } else toast.error("Failed");
  };

  return (
    <div>
      <UniversitySubNav universityId={id} universityName={universityName} />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">
              Programs / Courses
            </h2>
            <p className="text-sm text-[#6B7280]">
              {programs.length} program{programs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm(blankForm());
            }}
            className="bg-[#5B0F26] hover:bg-[#5B0F26]"
          >
            <Plus size={16} className="mr-2" />
            Add Program
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-5">
            <h3 className="font-semibold text-[#1F2937]">
              {editId ? "Edit Program" : "Add New Program"}
            </h3>

            {loadingEdit ? (
              <div className="flex justify-center py-6">
                <Loader2 size={24} className="animate-spin text-[#8A1538]" />
              </div>
            ) : (
              <>
                {/* Basic */}
                <div>
                  <p className="text-xs font-semibold text-[#5B0F26] uppercase tracking-wider mb-2">
                    Basic Info
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label>Program Name *</Label>
                      <Input
                        value={form.programName}
                        onChange={(e) => {
                          set("programName", e.target.value);
                          set(
                            "programSlug",
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-"),
                          );
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Slug</Label>
                      <Input
                        value={form.programSlug}
                        onChange={(e) => set("programSlug", e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Duration</Label>
                      <Input
                        value={form.duration}
                        onChange={(e) => set("duration", e.target.value)}
                        placeholder="6 Years"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Level</Label>
                      <Select
                        value={form.levelId}
                        onValueChange={(v) => set("levelId", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level..." />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((l) => (
                            <SelectItem key={l.id} value={l.id.toString()}>
                              {l.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Medium of Instruction</Label>
                      <Input
                        value={form.mediumOfInstruction}
                        onChange={(e) =>
                          set("mediumOfInstruction", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Intake (e.g. September)</Label>
                      <Input
                        value={form.intake}
                        onChange={(e) => set("intake", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Application Deadline</Label>
                      <Input
                        value={form.applicationDeadline}
                        onChange={(e) =>
                          set("applicationDeadline", e.target.value)
                        }
                        placeholder="e.g. 31 August"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Recognition</Label>
                      <Input
                        value={form.recognition}
                        onChange={(e) => set("recognition", e.target.value)}
                        placeholder="WHO, NMC, FAIMER"
                      />
                    </div>
                  </div>
                </div>

                {/* Fees */}
                <div>
                  <p className="text-xs font-semibold text-[#5B0F26] uppercase tracking-wider mb-2">
                    Fees
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label>Annual Fee</Label>
                      <Input
                        type="text"
                        value={form.annualTuitionFee}
                        onChange={(e) =>
                          set("annualTuitionFee", e.target.value)
                        }
                        placeholder="e.g. USD 4500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Total Tuition Fee</Label>
                      <Input
                        type="text"
                        value={form.totalTuitionFee}
                        onChange={(e) => set("totalTuitionFee", e.target.value)}
                        placeholder="e.g. USD 27000"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Total Fee (all-in)</Label>
                      <Input
                        type="text"
                        value={form.totalFee}
                        onChange={(e) => set("totalFee", e.target.value)}
                        placeholder="e.g. USD 30000"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <p className="text-xs font-semibold text-[#5B0F26] uppercase tracking-wider mb-2">
                    Program Content
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1.5">
                      <Label>Overview</Label>
                      <Textarea
                        value={form.overview}
                        onChange={(e) => set("overview", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Eligibility</Label>
                      <Textarea
                        value={form.eligibility}
                        onChange={(e) => set("eligibility", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Why Choose Qatar</Label>
                      <Textarea
                        value={form.whyChooseVietnam}
                        onChange={(e) =>
                          set("whyChooseVietnam", e.target.value)
                        }
                        rows={3}
                        placeholder="Reasons why students should choose Qatar for MBBS..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Additional Information</Label>
                      <Textarea
                        value={form.additionalInformation}
                        onChange={(e) =>
                          set("additionalInformation", e.target.value)
                        }
                        rows={3}
                        placeholder="Any extra info about the course..."
                      />
                    </div>
                  </div>
                </div>

                {/* Syllabus */}
                <div>
                  <p className="text-xs font-semibold text-[#5B0F26] uppercase tracking-wider mb-2">
                    Year-wise Syllabus
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((yr) => (
                      <div key={yr} className="space-y-1.5">
                        <Label>Year {yr} Syllabus</Label>
                        <Textarea
                          value={
                            (form as unknown as Record<string, string>)[
                              `year${yr}Syllabus`
                            ]
                          }
                          onChange={(e) =>
                            set(`year${yr}Syllabus`, e.target.value)
                          }
                          rows={3}
                          placeholder={`Subjects covered in year ${yr}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEO */}
                <div>
                  <p className="text-xs font-semibold text-[#5B0F26] uppercase tracking-wider mb-2">
                    SEO
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Meta Title</Label>
                      <Input
                        value={form.metaTitle}
                        onChange={(e) => set("metaTitle", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Meta Keywords</Label>
                      <Input
                        value={form.metaKeyword}
                        onChange={(e) => set("metaKeyword", e.target.value)}
                      />
                    </div>
                    <div className="col-span-full space-y-1.5">
                      <Label>Meta Description</Label>
                      <Textarea
                        value={form.metaDescription}
                        onChange={(e) => set("metaDescription", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(v) => set("isActive", v)}
                  />
                  <Label className="cursor-pointer">Active</Label>
                </div>
              </>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving || loadingEdit}
                className="bg-[#5B0F26] hover:bg-[#5B0F26]"
              >
                {saving ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : null}
                {editId ? "Save Changes" : "Create Program"}
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

        {/* List */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2
                size={20}
                className="animate-spin mx-auto text-[#6B7280]"
              />
            </div>
          ) : programs.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen size={36} className="mx-auto mb-3 text-[#4B5563]" />
              <p className="text-[#6B7280]">
                No programs yet. Add MBBS or other courses above.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAF8F7] text-left text-[#6B7280]">
                  <th className="px-4 py-3 font-medium">Program</th>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Annual Fee</th>
                  <th className="px-4 py-3 font-medium text-center">Active</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 hover:bg-[#FAF8F7]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1F2937]">
                        {p.programName}
                      </div>
                      <div className="text-xs text-[#6B7280] font-mono">
                        {p.programSlug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {p.level?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {p.duration ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {p.annualTuitionFee ? String(p.annualTuitionFee) : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? "bg-[#F7E9EE] text-[#5B0F26]" : "bg-[#F9FAFB] text-[#6B7280]"}`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          asChild
                          title="View on Site"
                        >
                          <a
                            href={`/universities/${universitySlug}/courses/${p.programSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye size={14} />
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(p)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-[#8A1538] hover:bg-[#5B0F26]"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
