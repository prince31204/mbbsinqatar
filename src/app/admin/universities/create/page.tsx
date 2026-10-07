"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { CURRENCY_SYMBOL } from "@/lib/currency";

type FormData = {
  // Basic
  name: string;
  slug: string;
  uniqueId: string;
  city: string;
  state: string;
  courseDuration: string;
  mediumOfInstruction: string;
  eligibility: string;
  neetRequirement: string;
  applyNowUrl: string;
  status: boolean;
  isFeatured: boolean;
  homeView: boolean;
  // Academic & Financial
  rating: string;
  establishedYear: string;
  students: string;
  tuitionFee: string;
  seatsAvailable: string;
  fmgePassRate: string;
  scholarshipName: string;
  scholarshipAmount: string;
  // Approvals
  embassyVerified: boolean;
  whoListed: boolean;
  nmcApproved: boolean;
  ministryLicensed: boolean;
  faimerListed: boolean;
  mciRecognition: boolean;
  ecfmgEligible: boolean;
  approvedBy: string;
  // About & Why Choose Us
  shortnote: string;
  aboutNote: string;
  internationalRecognition: string;
  englishMedium: string;
  diverseCommunity: string;
  section2Title: string;
  section2Text: string;
  // Stats & Rankings
  yearOfExcellence: string;
  countriesRepresented: string;
  globalRanking: string;
  // Campus Details
  campusArea: string;
  labs: string;
  lectureHall: string;
  hostelBuilding: string;
  // Ratings Metadata
  parentSatisfaction: string;
  totalReviews: string;
  recommendedRate: string;
  seoRating: string;
  reviewNumber: string;
  bestRating: string;
  // Media
  thumbnail: string | null;
  banner: string | null;
  section2Image: string | null;
  brochure: string | null;
  universityLicense: string | null;
  aggregationLetter: string | null;
  // SEO
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  schema: string;
  // Map Coordinates
  latitude: string;
  longitude: string;
  // Relations
  instituteTypeId: string;
};

const defaultForm: FormData = {
  name: "",
  slug: "",
  uniqueId: "",
  city: "",
  state: "",
  courseDuration: "6 Years",
  mediumOfInstruction: "English",
  eligibility: "50% in PCB, NEET qualified",
  neetRequirement: "Mandatory",
  applyNowUrl: "",
  status: true,
  isFeatured: false,
  homeView: false,
  rating: "",
  establishedYear: "",
  students: "",
  tuitionFee: "",
  seatsAvailable: "",
  fmgePassRate: "",
  scholarshipName: "",
  scholarshipAmount: "",
  embassyVerified: false,
  whoListed: false,
  nmcApproved: false,
  ministryLicensed: false,
  faimerListed: false,
  mciRecognition: false,
  ecfmgEligible: false,
  approvedBy: "",
  shortnote: "",
  aboutNote: "",
  internationalRecognition: "",
  englishMedium: "",
  diverseCommunity: "",
  section2Title: "",
  section2Text: "",
  yearOfExcellence: "",
  countriesRepresented: "",
  globalRanking: "",
  campusArea: "",
  labs: "",
  lectureHall: "",
  hostelBuilding: "",
  parentSatisfaction: "",
  totalReviews: "",
  recommendedRate: "",
  seoRating: "",
  reviewNumber: "",
  bestRating: "",
  thumbnail: null,
  banner: null,
  section2Image: null,
  brochure: null,
  universityLicense: null,
  aggregationLetter: null,
  metaTitle: "",
  metaKeyword: "",
  metaDescription: "",
  schema: "",
  latitude: "",
  longitude: "",
  instituteTypeId: "",
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateUniversityPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [instituteTypes, setInstituteTypes] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/admin/institute-types")
      .then((res) => res.json())
      .then((data) => setInstituteTypes(data))
      .catch((err) => console.error("Failed to fetch institute types", err));
  }, []);

  const set = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.uniqueId) {
      toast.error("Name, Slug, and Unique ID are required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        rating: form.rating ? parseFloat(form.rating) : null,
        establishedYear: form.establishedYear
          ? parseInt(form.establishedYear)
          : null,
        students: form.students || null,
        tuitionFee: form.tuitionFee || null,
        seatsAvailable: form.seatsAvailable
          ? parseInt(form.seatsAvailable)
          : null,
        fmgePassRate: form.fmgePassRate ? parseFloat(form.fmgePassRate) : null,
        yearOfExcellence: form.yearOfExcellence
          ? parseInt(form.yearOfExcellence)
          : null,
        countriesRepresented: form.countriesRepresented
          ? parseInt(form.countriesRepresented)
          : null,
        globalRanking: form.globalRanking || null,
        labs: form.labs ? parseInt(form.labs) : null,
        lectureHall: form.lectureHall ? parseInt(form.lectureHall) : null,
        hostelBuilding: form.hostelBuilding
          ? parseInt(form.hostelBuilding)
          : null,
        parentSatisfaction: form.parentSatisfaction
          ? parseFloat(form.parentSatisfaction)
          : null,
        totalReviews: form.totalReviews ? parseInt(form.totalReviews) : null,
        recommendedRate: form.recommendedRate
          ? parseFloat(form.recommendedRate)
          : null,
        seoRating: form.seoRating ? parseFloat(form.seoRating) : null,
        reviewNumber: form.reviewNumber ? parseInt(form.reviewNumber) : null,
        bestRating: form.bestRating ? parseFloat(form.bestRating) : null,
        approvedBy: form.approvedBy
          ? form.approvedBy
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      };
      const res = await fetch("/api/admin/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        const message = json?.error || "Failed to create university.";
        throw new Error(message);
      }
      toast.success("University created successfully!");
      router.push("/admin/universities");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create university.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/universities">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Add University</h1>
          <p className="text-sm text-[#6B7280]">
            Create a new university profile
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label>
                University Name <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="e.g. Qatar State Medical Academy"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Slug <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="Qatar-state-medical-academy"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                City <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Curepipe"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Unique ID (for internal/bulk sync){" "}
                <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                value={form.uniqueId}
                onChange={(e) => set("uniqueId", e.target.value)}
                placeholder="e.g. AST-123"
              />
            </div>
            <div className="space-y-1.5">
              <Label>State / Province</Label>
              <Input
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="Chui Region"
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
                value={form.applyNowUrl}
                onChange={(e) => set("applyNowUrl", e.target.value)}
                placeholder="https://forms.google.com/... or /apply"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Course Duration</Label>
              <Input
                value={form.courseDuration}
                onChange={(e) => set("courseDuration", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Medium of Instruction</Label>
              <Input
                value={form.mediumOfInstruction}
                onChange={(e) => set("mediumOfInstruction", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>NEET Requirement</Label>
              <Select
                value={form.neetRequirement}
                onValueChange={(v) => set("neetRequirement", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mandatory">Mandatory</SelectItem>
                  <SelectItem value="Not Required">Not Required</SelectItem>
                  <SelectItem value="Recommended">Recommended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Eligibility</Label>
              <Input
                value={form.eligibility}
                onChange={(e) => set("eligibility", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Institute Type</Label>
              <Select
                value={form.instituteTypeId}
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
                  id={key}
                  checked={form[key as keyof FormData] as boolean}
                  onCheckedChange={(v) => set(key as keyof FormData, v)}
                />
                <Label htmlFor={key} className="cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Academic & Financial */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Academic &amp; Financial Info
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: "rating", label: "Rating (0-5)", placeholder: "4.8" },
              {
                key: "establishedYear",
                label: "Established Year",
                placeholder: "1902",
              },
              {
                key: "students",
                label: "Total Students",
                placeholder: "12000",
              },
              {
                key: "tuitionFee",
                label: "Annual Tuition Fee",
                placeholder: "e.g. 4500 USD, 30000 RM",
              },
              {
                key: "seatsAvailable",
                label: "Seats Available",
                placeholder: "200",
              },
              {
                key: "fmgePassRate",
                label: "FMGE Pass Rate (%)",
                placeholder: "82.5",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type={
                    key === "students" || key === "tuitionFee"
                      ? "text"
                      : "number"
                  }
                  value={form[key as keyof FormData] as string}
                  onChange={(e) => set(key as keyof FormData, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Scholarship Name</Label>
              <Input
                value={form.scholarshipName}
                onChange={(e) => set("scholarshipName", e.target.value)}
                placeholder="e.g. Merit Scholarship"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Scholarship Amount</Label>
              <Input
                value={form.scholarshipAmount}
                onChange={(e) => set("scholarshipAmount", e.target.value)}
                placeholder={`e.g. ${CURRENCY_SYMBOL}500/year`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Approvals */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Approvals &amp; Recognitions
          </h2>
          <div className="flex flex-wrap gap-6">
            {[
              { key: "whoListed", label: "WHO Listed" },
              { key: "nmcApproved", label: "NMC Approved" },
              { key: "ministryLicensed", label: "Ministry Licensed" },
              { key: "faimerListed", label: "FAIMER Listed" },
              { key: "mciRecognition", label: "MCI Recognition" },
              { key: "ecfmgEligible", label: "ECFMG Eligible" },
              { key: "embassyVerified", label: "Embassy Verified" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <Switch
                  id={key}
                  checked={form[key as keyof FormData] as boolean}
                  onCheckedChange={(v) => set(key as keyof FormData, v)}
                />
                <Label htmlFor={key} className="cursor-pointer text-sm">
                  {label}
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
              value={form.approvedBy}
              onChange={(e) => set("approvedBy", e.target.value)}
              placeholder="WHO, NMC, FAIMER, WFME"
            />
          </div>
        </div>

        {/* Section 4: About & Why Choose Us */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            About &amp; Why Choose Us
          </h2>
          <div className="space-y-1.5">
            <Label>Short Note (used in cards)</Label>
            <Textarea
              value={form.shortnote}
              onChange={(e) => set("shortnote", e.target.value)}
              rows={2}
              placeholder="Brief 1-2 line description for cards"
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
              value={form.aboutNote}
              onChange={(e) => set("aboutNote", e.target.value)}
              rows={5}
              placeholder="Detailed description"
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
                value={form.internationalRecognition}
                onChange={(e) =>
                  set("internationalRecognition", e.target.value)
                }
                placeholder="WHO, NMC & FAIMER recognized"
              />
            </div>
            <div className="space-y-1.5">
              <Label>English Medium Text</Label>
              <Input
                value={form.englishMedium}
                onChange={(e) => set("englishMedium", e.target.value)}
                placeholder="100% English medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Diverse Community Text</Label>
              <Input
                value={form.diverseCommunity}
                onChange={(e) => set("diverseCommunity", e.target.value)}
                placeholder="Students from 40+ countries"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Section 2 Title</Label>
              <Input
                value={form.section2Title}
                onChange={(e) => set("section2Title", e.target.value)}
                placeholder='e.g. "Modern Campus & Facilities"'
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label>Section 2 Text</Label>
              <Textarea
                value={form.section2Text}
                onChange={(e) => set("section2Text", e.target.value)}
                rows={3}
                placeholder="Paragraph shown next to the campus photo..."
              />
            </div>
          </div>
        </div>

        {/* Section 5: Stats & Rankings */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Stats &amp; Rankings
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                key: "yearOfExcellence",
                label: "Years of Excellence",
                placeholder: "25",
              },
              {
                key: "countriesRepresented",
                label: "Countries Represented",
                placeholder: "40",
              },
              {
                key: "globalRanking",
                label: "Global Ranking (#)",
                placeholder: "150",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type={key === "globalRanking" ? "text" : "number"}
                  value={form[key as keyof FormData] as string}
                  onChange={(e) => set(key as keyof FormData, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Campus Details */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Campus Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label>Campus Area</Label>
              <Input
                value={form.campusArea}
                onChange={(e) => set("campusArea", e.target.value)}
                placeholder="e.g. 150 acres"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Latitude</Label>
              <Input
                type="number"
                step="0.00000001"
                value={form.latitude}
                onChange={(e) => set("latitude", e.target.value)}
                placeholder="e.g. 41.311081"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Longitude</Label>
              <Input
                type="number"
                step="0.00000001"
                value={form.longitude}
                onChange={(e) => set("longitude", e.target.value)}
                placeholder="e.g. 69.240562"
              />
            </div>
            {[
              { key: "labs", label: "Labs", placeholder: "20" },
              { key: "lectureHall", label: "Lecture Halls", placeholder: "15" },
              {
                key: "hostelBuilding",
                label: "Hostel Buildings",
                placeholder: "5",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type="number"
                  value={form[key as keyof FormData] as string}
                  onChange={(e) => set(key as keyof FormData, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Ratings Metadata */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Ratings Metadata
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                key: "parentSatisfaction",
                label: "Parent Satisfaction (%)",
                placeholder: "98",
                step: "0.1",
              },
              {
                key: "totalReviews",
                label: "Total Reviews",
                placeholder: "500",
                step: "1",
              },
              {
                key: "recommendedRate",
                label: "Recommended Rate (%)",
                placeholder: "97",
                step: "0.1",
              },
              {
                key: "seoRating",
                label: "SEO Rating",
                placeholder: "4.8",
                step: "0.1",
              },
              {
                key: "reviewNumber",
                label: "Review Number",
                placeholder: "500",
                step: "1",
              },
              {
                key: "bestRating",
                label: "Best Rating",
                placeholder: "5",
                step: "0.1",
              },
            ].map(({ key, label, placeholder, step }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type="number"
                  step={step}
                  value={form[key as keyof FormData] as string}
                  onChange={(e) => set(key as keyof FormData, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 8: Media */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Thumbnail Image"
              value={form.thumbnail}
              onChange={(v) => set("thumbnail", v)}
              folder="universities/_tmp/thumbnail"
            />
            <ImageUpload
              label="University Banner Image"
              value={form.banner}
              onChange={(v) => set("banner", v)}
              folder="universities/_tmp/banner"
            />
            <ImageUpload
              label="Section 2 Image (optional)"
              value={form.section2Image}
              onChange={(v) => set("section2Image", v)}
              folder="universities/_tmp/section2"
            />
            <PdfUpload
              label="Brochure PDF"
              value={form.brochure}
              onChange={(v) => set("brochure", v)}
              folder="universities/_tmp/docs/brochure"
            />
            <PdfUpload
              label="University License"
              value={form.universityLicense}
              onChange={(v) => set("universityLicense", v)}
              folder="universities/_tmp/docs/license"
            />
            <PdfUpload
              label="Aggregation Letter"
              value={form.aggregationLetter}
              onChange={(v) => set("aggregationLetter", v)}
              folder="universities/_tmp/docs/aggregation-letter"
            />
          </div>
        </div>

        {/* Section 9: SEO */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3 mb-4">
            SEO
          </h2>
          <SeoFields
            values={{
              metaTitle: form.metaTitle,
              metaKeyword: form.metaKeyword,
              metaDescription: form.metaDescription,
              schema: form.schema,
            }}
            onChange={(field, value) => set(field as keyof FormData, value)}
            hideOgImage={true}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/universities">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-[#5B0F26] hover:bg-[#5B0F26]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} className="mr-2" />
                Create University
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
