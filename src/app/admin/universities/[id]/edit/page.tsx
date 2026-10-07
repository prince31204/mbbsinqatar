"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { SeoFields } from "@/components/admin/SeoFields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { PdfUpload } from "@/components/admin/PdfUpload";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CURRENCY_SYMBOL } from "@/lib/currency";

export default function EditUniversityPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instituteTypes, setInstituteTypes] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    const toLocalPath = (path: string | null | undefined) => {
      if (typeof path !== "string") return null;
      if (path.startsWith("/uploads/")) return path;
      if (path.startsWith("uploads/")) return "/" + path;
      return null;
    };

    fetch(`/api/admin/universities/${id}`)
      .then((r) => r.json())
      .then((data) => {
        // Normalise: expose thumbnailPath as 'thumbnail' and brochurePath as 'brochure' for upload components
        // Only keep local uploads (e.g. /uploads/...) so that files are managed via our upload flow.
        setForm({
          ...data,
          approvedBy: Array.isArray(data.approvedBy)
            ? data.approvedBy.join(", ")
            : data.approvedBy || "",
          thumbnail: toLocalPath(data.thumbnailPath),
          banner: toLocalPath(data.bannerPath),
          brochure: toLocalPath(data.brochurePath),
          universityLicense: toLocalPath(data.universityLicensePath),
          aggregationLetter: toLocalPath(data.aggregationLetterPath),
          section2Image: toLocalPath(data.section2Image),
          ogImagePath: toLocalPath(data.ogImagePath),
          instituteTypeId: data.instituteTypeId?.toString() || "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load university.");
        setLoading(false);
      });

    fetch("/api/admin/institute-types")
      .then((res) => res.json())
      .then((data) => setInstituteTypes(data))
      .catch((err) => console.error("Failed to fetch institute types", err));
  }, [id]);

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.uniqueId) {
      toast.error("Name, Slug, and Unique ID are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        approvedBy:
          typeof form.approvedBy === "string"
            ? form.approvedBy
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : form.approvedBy,
      };
      const res = await fetch(`/api/admin/universities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to save.");
      }
      toast.success("University updated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#6B7280]" size={32} />
      </div>
    );
  }

  const subSections = [
    { label: "Programs", href: `/admin/universities/${id}/programs` },
    { label: "Photos", href: `/admin/universities/${id}/photos` },
    { label: "Rankings", href: `/admin/universities/${id}/rankings` },
    { label: "FMGE Rates", href: `/admin/universities/${id}/fmge-rates` },
    { label: "Intakes", href: `/admin/universities/${id}/intakes` },
    { label: "Testimonials", href: `/admin/universities/${id}/testimonials` },
    { label: "Reviews", href: `/admin/universities/${id}/reviews` },
    { label: "FAQs", href: `/admin/universities/${id}/faqs` },
    { label: "Facilities", href: `/admin/universities/${id}/facilities` },
    { label: "Hospitals", href: `/admin/universities/${id}/hospitals` },
    { label: "Students", href: `/admin/universities/${id}/students` },
    { label: "Links", href: `/admin/universities/${id}/links` },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/universities">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Edit University
            </h1>
            <a
              href={`/universities/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#E5E7EB] hover:text-[#5B0F26] transition-all shadow-sm"
            >
              Live <Eye size={14} />
            </a>
          </div>
          <p className="text-sm text-[#6B7280]">{String(form.name ?? "")}</p>
        </div>
      </div>

      {/* Sub-section navigation */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
          Sub-sections
        </p>
        <div className="flex flex-wrap gap-2">
          {subSections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="px-3 py-1.5 bg-[#F9FAFB] hover:bg-[#5B0F26] hover:text-[#5B0F26] text-xs rounded-lg text-[#4B5563] transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label>University Name</Label>
              <Input
                value={String(form.name ?? "")}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input
                value={String(form.slug ?? "")}
                onChange={(e) => set("slug", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input
                value={String(form.city ?? "")}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Unique ID (for internal/bulk sync){" "}
                <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                value={String(form.uniqueId ?? "")}
                onChange={(e) => set("uniqueId", e.target.value)}
                placeholder="e.g. AST-123"
              />
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Input
                value={String(form.state ?? "")}
                onChange={(e) => set("state", e.target.value)}
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label>
                Apply Now URL{" "}
                <span className="text-xs text-[#6B7280] font-normal">
                  (custom link for the Apply Now button — leave blank to use
                  /apply)
                </span>
              </Label>
              <Input
                value={String(form.applyNowUrl ?? "")}
                onChange={(e) => set("applyNowUrl", e.target.value)}
                placeholder="https://forms.google.com/... or /apply"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Course Duration</Label>
              <Input
                value={String(form.courseDuration ?? "")}
                onChange={(e) => set("courseDuration", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Medium of Instruction</Label>
              <Input
                value={String(form.mediumOfInstruction ?? "")}
                onChange={(e) => set("mediumOfInstruction", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Eligibility</Label>
              <Input
                value={String(form.eligibility ?? "")}
                onChange={(e) => set("eligibility", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Institute Type</Label>
              <Select
                value={String(form.instituteTypeId ?? "")}
                onValueChange={(v) => set("instituteTypeId", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {instituteTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { key: "status", label: "Active" },
              { key: "isFeatured", label: "Featured" },
              { key: "homeView", label: "Show on Home" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <Switch
                  id={`edit-${key}`}
                  checked={!!form[key]}
                  onCheckedChange={(v) => set(key, v)}
                />
                <Label htmlFor={`edit-${key}`} className="cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Academic */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Academic & Financial
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: "rating", label: "Rating (0-5)" },
              { key: "establishedYear", label: "Established Year" },
              { key: "students", label: "Total Students" },
              { key: "tuitionFee", label: "Annual Tuition Fee" },
              { key: "seatsAvailable", label: "Seats Available" },
              { key: "fmgePassRate", label: "FMGE Pass Rate (%)" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type={
                    key === "students" || key === "tuitionFee"
                      ? "text"
                      : "number"
                  }
                  value={String(form[key] ?? "")}
                  onChange={(e) =>
                    set(
                      key,
                      e.target.value
                        ? key === "students" || key === "tuitionFee"
                          ? e.target.value
                          : parseFloat(e.target.value)
                        : null,
                    )
                  }
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>NEET Requirement</Label>
              <Input
                value={String(form.neetRequirement ?? "")}
                onChange={(e) => set("neetRequirement", e.target.value)}
                placeholder="e.g. Required / Not Required"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Scholarship Name</Label>
              <Input
                value={String(form.scholarshipName ?? "")}
                onChange={(e) => set("scholarshipName", e.target.value)}
                placeholder="e.g. Merit Scholarship"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Scholarship Amount</Label>
              <Input
                value={String(form.scholarshipAmount ?? "")}
                onChange={(e) => set("scholarshipAmount", e.target.value)}
                placeholder={`e.g. ${CURRENCY_SYMBOL}500/year`}
              />
            </div>
          </div>
        </div>

        {/* Approvals */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Approvals & Recognitions
          </h2>
          <div className="flex flex-wrap gap-6">
            {[
              "whoListed",
              "nmcApproved",
              "ministryLicensed",
              "faimerListed",
              "mciRecognition",
              "ecfmgEligible",
              "embassyVerified",
            ].map((key) => (
              <div key={key} className="flex items-center gap-2">
                <Switch
                  id={`edit-a-${key}`}
                  checked={!!form[key]}
                  onCheckedChange={(v) => set(key, v)}
                />
                <Label
                  htmlFor={`edit-a-${key}`}
                  className="cursor-pointer text-sm capitalize"
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label>
              Approved By Bodies{" "}
              <span className="text-xs text-[#6B7280] font-normal">
                (comma-separated, e.g. WHO, NMC, FAIMER)
              </span>
            </Label>
            <Input
              value={String(form.approvedBy ?? "")}
              onChange={(e) => set("approvedBy", e.target.value)}
              placeholder="WHO, NMC, FAIMER, WFME"
            />
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            About &amp; Why Choose Us
          </h2>
          <div className="space-y-1.5">
            <Label>Short Note</Label>
            <Textarea
              value={String(form.shortnote ?? "")}
              onChange={(e) => set("shortnote", e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Full About Note{" "}
              <span className="text-xs text-[#6B7280] font-normal">
                (HTML supported)
              </span>
            </Label>
            <Textarea
              value={String(form.aboutNote ?? "")}
              onChange={(e) => set("aboutNote", e.target.value)}
              rows={5}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>
                International Recognition{" "}
                <span className="text-xs text-[#6B7280] font-normal">
                  (short phrase)
                </span>
              </Label>
              <Input
                value={String(form.internationalRecognition ?? "")}
                onChange={(e) =>
                  set("internationalRecognition", e.target.value)
                }
                placeholder="WHO, NMC & FAIMER recognized"
              />
            </div>
            <div className="space-y-1.5">
              <Label>English Medium Text</Label>
              <Input
                value={String(form.englishMedium ?? "")}
                onChange={(e) => set("englishMedium", e.target.value)}
                placeholder="100% English medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Diverse Community Text</Label>
              <Input
                value={String(form.diverseCommunity ?? "")}
                onChange={(e) => set("diverseCommunity", e.target.value)}
                placeholder="Students from 40+ countries"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Section 2 Title</Label>
              <Input
                value={String(form.section2Title ?? "")}
                onChange={(e) => set("section2Title", e.target.value)}
                placeholder='e.g. "Modern Campus & Facilities"'
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label>Section 2 Text</Label>
              <Textarea
                value={String(form.section2Text ?? "")}
                onChange={(e) => set("section2Text", e.target.value)}
                rows={3}
                placeholder="Paragraph shown next to the campus photo..."
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Stats &amp; Rankings
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: "yearOfExcellence", label: "Years of Excellence" },
              { key: "countriesRepresented", label: "Countries Represented" },
              { key: "globalRanking", label: "Global Ranking (#)" },
              { key: "nationalRanking", label: "National Ranking (#)" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type={
                    key === "globalRanking" || key === "nationalRanking"
                      ? "text"
                      : "number"
                  }
                  value={String(form[key] ?? "")}
                  onChange={(e) =>
                    set(
                      key,
                      e.target.value
                        ? key === "globalRanking" || key === "nationalRanking"
                          ? e.target.value
                          : parseInt(e.target.value)
                        : null,
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Campus Details */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Campus Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label>Campus Area</Label>
              <Input
                value={String(form.campusArea ?? "")}
                onChange={(e) => set("campusArea", e.target.value)}
                placeholder="e.g. 150 acres"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Latitude</Label>
              <Input
                type="number"
                step="0.00000001"
                value={String(form.latitude ?? "")}
                onChange={(e) =>
                  set(
                    "latitude",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Longitude</Label>
              <Input
                type="number"
                step="0.00000001"
                value={String(form.longitude ?? "")}
                onChange={(e) =>
                  set(
                    "longitude",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
            {[
              { key: "labs", label: "Labs" },
              { key: "lectureHall", label: "Lecture Halls" },
              { key: "hostelBuilding", label: "Hostel Buildings" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type="number"
                  value={String(form[key] ?? "")}
                  onChange={(e) =>
                    set(key, e.target.value ? parseInt(e.target.value) : null)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ratings Metadata */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Ratings Metadata
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Parent Satisfaction (%)</Label>
              <Input
                type="number"
                value={String(form.parentSatisfaction ?? "")}
                onChange={(e) =>
                  set(
                    "parentSatisfaction",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Total Reviews</Label>
              <Input
                type="number"
                value={String(form.totalReviews ?? "")}
                onChange={(e) =>
                  set(
                    "totalReviews",
                    e.target.value ? parseInt(e.target.value) : null,
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Recommended Rate (%)</Label>
              <Input
                type="number"
                value={String(form.recommendedRate ?? "")}
                onChange={(e) =>
                  set(
                    "recommendedRate",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>SEO Rating</Label>
              <Input
                type="number"
                step="0.1"
                value={String(form.seoRating ?? "")}
                onChange={(e) =>
                  set(
                    "seoRating",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Review Number</Label>
              <Input
                type="number"
                value={String(form.reviewNumber ?? "")}
                onChange={(e) =>
                  set(
                    "reviewNumber",
                    e.target.value ? parseInt(e.target.value) : null,
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Best Rating</Label>
              <Input
                type="number"
                step="0.1"
                value={String(form.bestRating ?? "")}
                onChange={(e) =>
                  set(
                    "bestRating",
                    e.target.value ? parseFloat(e.target.value) : null,
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Thumbnail"
              value={form.thumbnail as string | null}
              onChange={(v) => set("thumbnail", v)}
              folder={`universities/${form.uniqueId}/thumbnail`}
            />
            <ImageUpload
              label="University Banner"
              value={form.banner as string | null}
              onChange={(v) => set("banner", v)}
              folder={`universities/${form.uniqueId}/banner`}
            />
            <ImageUpload
              label="Section 2 Image (optional)"
              value={form.section2Image as string | null}
              onChange={(v) => set("section2Image", v)}
              folder={`universities/${form.uniqueId}/section2`}
            />
            <PdfUpload
              label="Brochure PDF"
              value={form.brochure as string | null}
              onChange={(v) => set("brochure", v)}
              folder={`universities/${form.uniqueId}/docs/brochure`}
            />
            <PdfUpload
              label="University License"
              value={form.universityLicense as string | null}
              onChange={(v) => set("universityLicense", v)}
              folder={`universities/${form.slug || id}/docs/license`}
            />
            <PdfUpload
              label="Aggregation Letter"
              value={form.aggregationLetter as string | null}
              onChange={(v) => set("aggregationLetter", v)}
              folder={`universities/${form.slug || id}/docs/aggregation-letter`}
            />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3 mb-4">
            SEO
          </h2>
          <SeoFields
            values={{
              metaTitle: String(form.metaTitle ?? ""),
              metaKeyword: String(form.metaKeyword ?? ""),
              metaDescription: String(form.metaDescription ?? ""),
              ogImagePath: String(form.ogImagePath ?? ""),
              schema: String(form.schema ?? ""),
            }}
            onChange={(field, value) => set(field, value)}
            hideOgImage={true}
          />
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/universities">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
