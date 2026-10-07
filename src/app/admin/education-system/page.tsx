"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  Edit2,
  GraduationCap,
  BookOpen,
  Layers,
  Award,
  Lightbulb,
  Globe,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type EduSystem = Record<string, unknown>;

type Examination = {
  id: number;
  examName: string;
  gradeLevel: string | null;
  type: string | null;
  subjects: string | null;
};

type SchoolLevel = {
  id: number;
  level: string;
  ageRange: string | null;
  durationYears: number | null;
  isCompulsory: boolean;
  numberOfSchools: string | null;
  title: string | null;
  description: string | null;
};

type Degree = {
  id: number;
  degree: string;
  duration: string | null;
  ectsCredits: string | null;
  recognition: string | null;
};

type PopularField = {
  id: number;
  field: string;
  description: string | null;
  numberOfInstitutions: string | null;
  durationYears: string | null;
};

// ─── Sub-module helpers ───────────────────────────────────────────────────────

function blankExam(): Omit<Examination, "id"> {
  return { examName: "", gradeLevel: "", type: "", subjects: "" };
}
function blankLevel(): Omit<SchoolLevel, "id"> {
  return {
    level: "",
    ageRange: "",
    durationYears: null,
    isCompulsory: false,
    numberOfSchools: "",
    title: "",
    description: "",
  };
}
function blankDegree(): Omit<Degree, "id"> {
  return { degree: "", duration: "", ectsCredits: "", recognition: "" };
}
function blankField(): Omit<PopularField, "id"> {
  return {
    field: "",
    description: "",
    numberOfInstitutions: "",
    durationYears: "",
  };
}

// ─── Generic Sub-module CRUD Component ────────────────────────────────────────

function SubmoduleCRUD<T extends { id: number }>({
  title,
  icon,
  endpoint,
  columns,
  blankFn,
  renderForm,
  renderRow,
}: {
  title: string;
  icon: React.ReactNode;
  endpoint: string;
  columns: string[];
  blankFn: () => Omit<T, "id">;
  renderForm: (
    form: Omit<T, "id">,
    set: (k: string, v: unknown) => void,
  ) => React.ReactNode;
  renderRow: (item: T) => React.ReactNode[];
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<T, "id">>(blankFn());

  const set = (k: string, v: unknown) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(endpoint);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    const url = editId ? `${endpoint}/${editId}` : endpoint;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(editId ? "Updated!" : "Added!");
      setShowForm(false);
      setEditId(null);
      setForm(blankFn());
      load();
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to save");
    }
    setSaving(false);
  };

  const handleEdit = (item: T) => {
    const { id, ...rest } = item;
    setForm(rest as Omit<T, "id">);
    setEditId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    } else toast.error("Failed to delete");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold text-[#1F2937]">{title}</h2>
          <span className="ml-2 text-xs bg-[#F9FAFB] text-[#6B7280] px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <Button
          size="sm"
          className="bg-[#5B0F26] hover:bg-[#5B0F26]"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(blankFn());
          }}
        >
          <Plus size={14} className="mr-1" /> Add
        </Button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-[#1F2937]">
            {editId ? `Edit ${title}` : `Add ${title}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderForm(form, set)}
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            >
              {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {editId ? "Save Changes" : `Add ${title}`}
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
          <div className="p-10 text-center">
            <Loader2 size={22} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-[#6B7280]">
            No {title.toLowerCase()} yet. Add one above.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAF8F7] text-left text-[#6B7280]">
                {columns.map((c) => (
                  <th key={c} className="px-4 py-3 font-medium">
                    {c}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-[#FAF8F7]"
                >
                  {renderRow(item).map((cell, i) => (
                    <td key={i} className="px-4 py-3 text-[#4B5563]">
                      {cell}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 size={13} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#8A1538] hover:bg-[#5B0F26] hover:text-white"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={13} />
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
  );
}

// ─── General Info Tab ─────────────────────────────────────────────────────────

function GeneralInfoTab() {
  const [form, setForm] = useState<EduSystem>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/education-system")
      .then((r) => r.json())
      .then((d) => {
        setForm(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/education-system", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) toast.success("Saved!");
    else toast.error("Failed to save");
    setSaving(false);
  };

  if (loading)
    return (
      <div className="p-12 text-center">
        <Loader2 className="animate-spin mx-auto text-[#6B7280]" size={24} />
      </div>
    );

  const textArea = (label: string, field: string, rows = 3) => (
    <div className="space-y-1.5 md:col-span-2">
      <Label>{label}</Label>
      <Textarea
        value={String(form[field] ?? "")}
        onChange={(e) => set(field, e.target.value)}
        rows={rows}
      />
    </div>
  );

  const input = (label: string, field: string, type = "text", colSpan = 1) => (
    <div className={`space-y-1.5${colSpan === 2 ? " md:col-span-2" : ""}`}>
      <Label>{label}</Label>
      <Input
        type={type}
        value={String(form[field] ?? "")}
        onChange={(e) => set(field, e.target.value)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        <h3 className="font-semibold text-[#1F2937] border-b pb-3">
          Page Header
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {input("Page Title", "title", "text", 2)}
          {textArea("Page Description", "description")}
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        <h3 className="font-semibold text-[#1F2937] border-b pb-3">
          Introduction Section
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textArea("Introduction Title", "introductionTitle", 2)}
          {textArea("Introduction Description", "introductionDescription", 4)}
          {textArea("Government Regulation", "governmentRegulation", 3)}
          {textArea("Cultural Importance", "culturalImportance", 3)}
          {textArea("Continuous Development", "continuousDevelopment", 3)}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        <h3 className="font-semibold text-[#1F2937] border-b pb-3">
          Key Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {input("Literacy Rate (%)", "literacyRate", "number")}
          {input("Primary Enrollment (%)", "primaryEnrollment", "number")}
          {input("Secondary Completion (%)", "secondaryCompletion", "number")}
          {input(
            "Higher Institutions Count",
            "higherInstitutionsCount",
            "number",
          )}
          {input("Universities Count", "universitiesCount", "number")}
          {input("Academics Count", "academiesCount", "number")}
          {input("Institutes Count", "institutesCount", "number")}
        </div>
      </div>

      {/* School Education */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        <h3 className="font-semibold text-[#1F2937] border-b pb-3">
          School Education Structure
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textArea(
            "School Education Structure Description",
            "schoolEducationStructureDescription",
            4,
          )}
          {textArea(
            "Examination System Description",
            "examinationSystemDescription",
            3,
          )}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        <h3 className="font-semibold text-[#1F2937] border-b pb-3">
          Languages of Instruction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textArea(
            "Languages Description",
            "languagesInstructionDescription",
            3,
          )}
          {input("Official State Language", "officialStateLanguage")}
          {input(
            "Official State Language %",
            "officialStateLanguagePercentage",
            "number",
          )}
          {input("Official State Language Note", "officialStateLanguageNote")}
          {input("Official Language", "officialLanguage")}
          {input("Official Language %", "officialLanguagePercentage", "number")}
          {input("Official Language Note", "officialLanguageNote")}
          {input("Foreign Language", "foreignLanguage")}
          {input("Foreign Language %", "foreignLanguagePercentage", "number")}
          {input("Foreign Language Note", "foreignLanguageNote")}
        </div>
      </div>

      {/* Higher Education */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        <h3 className="font-semibold text-[#1F2937] border-b pb-3">
          Higher Education
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textArea(
            "Higher Education Description",
            "higherEducationDescription",
            4,
          )}
          {input("Universities Note", "universitiesNote", "text", 2)}
          {input("Academies Note", "academiesNote", "text", 2)}
          {input("Institutes Note", "institutesNote", "text", 2)}
          {textArea("Bologna Process Alignment", "bolognProcessAlignment", 3)}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3 pb-6">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#5B0F26] hover:bg-[#5B0F26]"
        >
          {saving ? (
            <>
              <Loader2 size={14} className="mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={14} className="mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EducationSystemAdminPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap size={24} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Education System
            </h1>
            <p className="text-sm text-[#6B7280]">
              Manage Qatar education system content and sub-sections
            </p>
          </div>
        </div>
        <Link
          href="/education-system"
          target="_blank"
          className="inline-flex items-center gap-2 border border-[#E5E7EB] text-[#4B5563] px-3 py-1.5 rounded-lg text-xs hover:bg-[#FAF8F7] transition-colors"
        >
          <Globe size={13} /> View Public Page
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap gap-1 h-auto bg-[#F9FAFB] p-1 rounded-xl">
          <TabsTrigger
            value="general"
            className="rounded-lg text-xs px-3 py-1.5"
          >
            <BookOpen size={13} className="mr-1.5" />
            General Info
          </TabsTrigger>
          <TabsTrigger
            value="examinations"
            className="rounded-lg text-xs px-3 py-1.5"
          >
            <Layers size={13} className="mr-1.5" />
            Examinations
          </TabsTrigger>
          <TabsTrigger
            value="school-levels"
            className="rounded-lg text-xs px-3 py-1.5"
          >
            <GraduationCap size={13} className="mr-1.5" />
            School Levels
          </TabsTrigger>
          <TabsTrigger
            value="degrees"
            className="rounded-lg text-xs px-3 py-1.5"
          >
            <Award size={13} className="mr-1.5" />
            Degrees
          </TabsTrigger>
          <TabsTrigger
            value="popular-fields"
            className="rounded-lg text-xs px-3 py-1.5"
          >
            <Lightbulb size={13} className="mr-1.5" />
            Popular Fields
          </TabsTrigger>
        </TabsList>

        {/* General Info */}
        <TabsContent value="general" className="mt-6">
          <GeneralInfoTab />
        </TabsContent>

        {/* Examinations */}
        <TabsContent value="examinations" className="mt-6">
          <SubmoduleCRUD<Examination>
            title="Examinations"
            icon={<Layers size={18} className="text-[#8A1538]" />}
            endpoint="/api/admin/education-system/examinations"
            columns={["Exam Name", "Grade Level", "Type", "Subjects"]}
            blankFn={blankExam}
            renderForm={(form, set) => (
              <>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Exam Name *</Label>
                  <Input
                    value={(form as Examination).examName || ""}
                    onChange={(e) => set("examName", e.target.value)}
                    placeholder="e.g. THPT National Exam"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Grade Level</Label>
                  <Input
                    value={(form as Examination).gradeLevel || ""}
                    onChange={(e) => set("gradeLevel", e.target.value)}
                    placeholder="e.g. Grade 12"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Input
                    value={(form as Examination).type || ""}
                    onChange={(e) => set("type", e.target.value)}
                    placeholder="e.g. National, School-based"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Subjects</Label>
                  <Textarea
                    value={(form as Examination).subjects || ""}
                    onChange={(e) => set("subjects", e.target.value)}
                    rows={2}
                    placeholder="Math, Physics, Chemistry..."
                  />
                </div>
              </>
            )}
            renderRow={(item) => [
              <span className="font-medium">{item.examName}</span>,
              item.gradeLevel || "—",
              item.type || "—",
              item.subjects ? (
                <span className="text-xs text-[#6B7280] line-clamp-1">
                  {item.subjects}
                </span>
              ) : (
                "—"
              ),
            ]}
          />
        </TabsContent>

        {/* School Levels */}
        <TabsContent value="school-levels" className="mt-6">
          <SubmoduleCRUD<SchoolLevel>
            title="School Levels"
            icon={<GraduationCap size={18} className="text-[#8A1538]" />}
            endpoint="/api/admin/education-system/school-levels"
            columns={[
              "Level",
              "Age Range",
              "Duration",
              "Compulsory",
              "Schools",
            ]}
            blankFn={blankLevel}
            renderForm={(form, set) => {
              const f = form as SchoolLevel;
              return (
                <>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Level Name *</Label>
                    <Input
                      value={f.level || ""}
                      onChange={(e) => set("level", e.target.value)}
                      placeholder="e.g. Primary Education"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Age Range</Label>
                    <Input
                      value={f.ageRange || ""}
                      onChange={(e) => set("ageRange", e.target.value)}
                      placeholder="e.g. 6–11 years"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Duration (years)</Label>
                    <Input
                      type="number"
                      value={f.durationYears ?? ""}
                      onChange={(e) =>
                        set(
                          "durationYears",
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Number of Schools</Label>
                    <Input
                      value={f.numberOfSchools || ""}
                      onChange={(e) => set("numberOfSchools", e.target.value)}
                      placeholder="e.g. ~15,000"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      id="compulsory"
                      checked={!!f.isCompulsory}
                      onCheckedChange={(v) => set("isCompulsory", v)}
                    />
                    <Label htmlFor="compulsory">Is Compulsory</Label>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Title / Subtitle</Label>
                    <Input
                      value={f.title || ""}
                      onChange={(e) => set("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={f.description || ""}
                      onChange={(e) => set("description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              );
            }}
            renderRow={(item) => [
              <span className="font-medium">{item.level}</span>,
              item.ageRange || "—",
              item.durationYears ? `${item.durationYears} yrs` : "—",
              item.isCompulsory ? (
                <span className="px-2 py-0.5 bg-[#F7E9EE] text-[#5B0F26] text-xs rounded-full">
                  Yes
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-[#F9FAFB] text-[#6B7280] text-xs rounded-full">
                  No
                </span>
              ),
              item.numberOfSchools || "—",
            ]}
          />
        </TabsContent>

        {/* Degrees */}
        <TabsContent value="degrees" className="mt-6">
          <SubmoduleCRUD<Degree>
            title="Degrees"
            icon={<Award size={18} className="text-[#8A1538]" />}
            endpoint="/api/admin/education-system/degrees"
            columns={["Degree", "Duration", "ECTS Credits", "Recognition"]}
            blankFn={blankDegree}
            renderForm={(form, set) => {
              const f = form as Degree;
              return (
                <>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Degree Name *</Label>
                    <Input
                      value={f.degree || ""}
                      onChange={(e) => set("degree", e.target.value)}
                      placeholder="e.g. Bachelor of Medicine (MBBS)"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Duration</Label>
                    <Input
                      value={f.duration || ""}
                      onChange={(e) => set("duration", e.target.value)}
                      placeholder="e.g. 6 years"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>ECTS Credits</Label>
                    <Input
                      value={f.ectsCredits || ""}
                      onChange={(e) => set("ectsCredits", e.target.value)}
                      placeholder="e.g. 360"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Recognition</Label>
                    <Input
                      value={f.recognition || ""}
                      onChange={(e) => set("recognition", e.target.value)}
                      placeholder="e.g. WHO, MCI, NMC recognized"
                    />
                  </div>
                </>
              );
            }}
            renderRow={(item) => [
              <span className="font-medium">{item.degree}</span>,
              item.duration || "—",
              item.ectsCredits || "—",
              item.recognition ? (
                <span className="text-xs text-[#6B7280]">
                  {item.recognition}
                </span>
              ) : (
                "—"
              ),
            ]}
          />
        </TabsContent>

        {/* Popular Fields */}
        <TabsContent value="popular-fields" className="mt-6">
          <SubmoduleCRUD<PopularField>
            title="Popular Fields"
            icon={<Lightbulb size={18} className="text-[#8A1538]" />}
            endpoint="/api/admin/education-system/popular-fields"
            columns={["Field", "Institutions", "Duration", "Description"]}
            blankFn={blankField}
            renderForm={(form, set) => {
              const f = form as PopularField;
              return (
                <>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Field Name *</Label>
                    <Input
                      value={f.field || ""}
                      onChange={(e) => set("field", e.target.value)}
                      placeholder="e.g. Medicine & Healthcare"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Number of Institutions</Label>
                    <Input
                      value={f.numberOfInstitutions || ""}
                      onChange={(e) =>
                        set("numberOfInstitutions", e.target.value)
                      }
                      placeholder="e.g. 20+"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Duration (years)</Label>
                    <Input
                      value={f.durationYears || ""}
                      onChange={(e) => set("durationYears", e.target.value)}
                      placeholder="e.g. 4–6 years"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={f.description || ""}
                      onChange={(e) => set("description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              );
            }}
            renderRow={(item) => [
              <span className="font-medium">{item.field}</span>,
              item.numberOfInstitutions || "—",
              item.durationYears || "—",
              item.description ? (
                <span className="text-xs text-[#6B7280] line-clamp-1">
                  {item.description}
                </span>
              ) : (
                "—"
              ),
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
