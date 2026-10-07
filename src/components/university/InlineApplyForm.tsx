"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Loader2,
  FileText,
  Globe,
  ClipboardList,
  Calendar,
  Users,
  MapPin,
  Award,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";

interface Props {
  universityId: number;
  universityName: string;
  universitySlug: string;
}

const PHONE_CODES = [
  { code: "+91", country: "India" },
  { code: "+996", country: "Qatar" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+92", country: "Pakistan" },
  { code: "+880", country: "Bangladesh" },
  { code: "+977", country: "Nepal" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+971", country: "UAE" },
  { code: "+60", country: "Malaysia" },
  { code: "+65", country: "Singapore" },
  { code: "+86", country: "China" },
];

const COUNTRIES = [
  "India",
  "Bangladesh",
  "Nepal",
  "Pakistan",
  "Sri Lanka",
  "UAE",
  "Malaysia",
  "Nigeria",
  "Kenya",
  "Ghana",
  "Qatar",
  "China",
  "USA",
  "Canada",
  "UK",
  "Other",
];

const EDUCATION_LEVELS = [
  "High School (10+2)",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Other",
];

const REQUIRED_DOCS = [
  "10th & 12th Mark Sheets",
  "Passport Copy",
  "NEET Scorecard",
  "Birth Certificate",
  "Passport Size Photos",
  "Medical Certificate",
  "Bank Statement",
  "Police Clearance",
];

const GRAD_YEARS = Array.from({ length: 10 }, (_, i) =>
  String(new Date().getFullYear() - i),
);

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  dateOfBirth: "",
  gender: "",
  fatherName: "",
  motherName: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  previousEducation: "",
  schoolName: "",
  graduationYear: "",
  percentage: "",
  neetScore: "",
  passportNumber: "",
  programId: "",
  agreed: false,
};

function Card({
  icon,
  bg,
  title,
  children,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${bg} p-2 rounded-lg`}>{icon}</div>
        <h3 className="text-lg font-bold text-[#1F2937]">{title}</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Full({ children }: { children: React.ReactNode }) {
  return <div className="md:col-span-2">{children}</div>;
}

export default function InlineApplyForm({
  universityId,
  universityName,
  universitySlug,
}: Props) {
  const [form, setForm] = useState(EMPTY);
  const [mounted, setMounted] = useState(false);
  const [programs, setPrograms] = useState<
    { id: number; programName: string }[]
  >([]);
  const [loadingProgs, setLoadingProgs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load programs for this university on mount
  useEffect(() => {
    if (!universityId) return;
    setLoadingProgs(true);
    fetch(`/api/universities/${universityId}/programs`)
      .then((r) => r.json())
      .then((d) => setPrograms(d?.programs ?? d ?? []))
      .catch(() => setPrograms([]))
      .finally(() => setLoadingProgs(false));
  }, [universityId]);

  const set = (field: string, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !form.agreed) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: `${form.countryCode}${form.phone}`,
          dateOfBirth: form.dateOfBirth || undefined,
          gender: form.gender || undefined,
          fatherName: form.fatherName || undefined,
          motherName: form.motherName || undefined,
          address: form.address || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          country: form.country || undefined,
          postalCode: form.postalCode || undefined,
          previousEducation: form.previousEducation || undefined,
          schoolName: form.schoolName || undefined,
          graduationYear: form.graduationYear || undefined,
          percentage: form.percentage || undefined,
          neetScore: form.neetScore || undefined,
          passportNumber: form.passportNumber || undefined,
          universityId,
          universityName,
          source: `university_page: ${universityName}`,
          programId: form.programId ? parseInt(form.programId) : undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed");
      }
      setSuccess(true);
      setForm(EMPTY);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inp =
    "w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-transparent transition text-sm outline-none bg-white text-[#1F2937] placeholder:text-[#6B7280]";
  const lbl = "block text-sm font-semibold text-[#4B5563] mb-1.5";
  const req = <span className="text-[#8A1538]">*</span>;

  if (!mounted) return null;

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-[#8A1538] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg ">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
          Application Submitted!
        </h3>
        <p className="text-[#4B5563] mb-6">
          Our counsellors will contact you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-[#8A1538] hover:underline text-sm"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* University — pre-filled */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
        <Building2 size={16} className="text-[#8A1538] shrink-0" />
        <div>
          <p className="text-xs text-[#6B7280]">Applying to</p>
          <p className="font-bold text-[#1F2937] text-sm">{universityName}</p>
        </div>
      </div>

      {/* Personal Information */}
      <Card
        icon={<User size={17} className="text-[#8A1538]" />}
        bg="bg-[#F9FAFB]"
        title="Personal Information"
      >
        <div>
          <label className={lbl}>First Name {req}</label>
          <input
            required
            type="text"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="First Name"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Last Name {req}</label>
          <input
            required
            type="text"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Last Name"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Email Address {req}</label>
          <div className="relative">
            <Mail
              size={14}
              className="absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
              className={`${inp} pl-10`}
            />
          </div>
        </div>
        <div>
          <label className={lbl}>Phone Number {req}</label>
          <div className="flex gap-2">
            <select
              value={form.countryCode}
              onChange={(e) => set("countryCode", e.target.value)}
              className="px-2 py-3 border border-[#E5E7EB] rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-[#5B0F26]/500 w-28 shrink-0"
            >
              {PHONE_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.country}
                </option>
              ))}
            </select>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="Phone number"
              className={`${inp} flex-1`}
            />
          </div>
        </div>
        <div>
          <label className={lbl}>Date of Birth {req}</label>
          <div className="relative">
            <Calendar
              size={14}
              className="absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none"
            />
            <input
              required
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => set("dateOfBirth", e.target.value)}
              className={`${inp} pl-10`}
            />
          </div>
        </div>
        <div>
          <label className={lbl}>Gender {req}</label>
          <select
            required
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
            className={`${inp} appearance-none`}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </Card>

      {/* Family Information */}
      <Card
        icon={<Users size={17} className="text-purple-600" />}
        bg="bg-purple-100"
        title="Family Information"
      >
        <div>
          <label className={lbl}>Father&apos;s Name {req}</label>
          <input
            required
            type="text"
            value={form.fatherName}
            onChange={(e) => set("fatherName", e.target.value)}
            placeholder="Father's full name"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Mother&apos;s Name {req}</label>
          <input
            required
            type="text"
            value={form.motherName}
            onChange={(e) => set("motherName", e.target.value)}
            placeholder="Mother's full name"
            className={inp}
          />
        </div>
      </Card>

      {/* Address Information */}
      <Card
        icon={<MapPin size={17} className="text-[#5B0F26]" />}
        bg="bg-[#F7E9EE]"
        title="Address Information"
      >
        <Full>
          <label className={lbl}>Full Address {req}</label>
          <textarea
            required
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="House/Flat No, Street, Area"
            rows={2}
            className={`${inp} resize-none`}
          />
        </Full>
        <div>
          <label className={lbl}>City {req}</label>
          <input
            required
            type="text"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="City"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>State / Province {req}</label>
          <input
            required
            type="text"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            placeholder="State / Province"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Country {req}</label>
          <div className="relative">
            <Globe
              size={14}
              className="absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none"
            />
            <select
              required
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className={`${inp} pl-10 appearance-none`}
            >
              <option value="">Select Country</option>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={lbl}>Postal Code {req}</label>
          <input
            required
            type="text"
            value={form.postalCode}
            onChange={(e) => set("postalCode", e.target.value)}
            placeholder="Postal / ZIP code"
            className={inp}
          />
        </div>
      </Card>

      {/* Academic Information */}
      <Card
        icon={<Award size={17} className="text-[#8A1538]" />}
        bg="bg-[#F9FAFB]"
        title="Academic Information"
      >
        <div>
          <label className={lbl}>Previous Education {req}</label>
          <select
            required
            value={form.previousEducation}
            onChange={(e) => set("previousEducation", e.target.value)}
            className={`${inp} appearance-none`}
          >
            <option value="">Select Education Level</option>
            {EDUCATION_LEVELS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>School / College Name {req}</label>
          <input
            required
            type="text"
            value={form.schoolName}
            onChange={(e) => set("schoolName", e.target.value)}
            placeholder="Institution name"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Graduation Year {req}</label>
          <select
            required
            value={form.graduationYear}
            onChange={(e) => set("graduationYear", e.target.value)}
            className={`${inp} appearance-none`}
          >
            <option value="">Select Year</option>
            {GRAD_YEARS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>Percentage / CGPA {req}</label>
          <input
            required
            type="text"
            value={form.percentage}
            onChange={(e) => set("percentage", e.target.value)}
            placeholder="e.g., 85% or 8.5 CGPA"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>
            NEET Score{" "}
            <span className="text-[#6B7280] font-normal">(if applicable)</span>
          </label>
          <input
            type="text"
            value={form.neetScore}
            onChange={(e) => set("neetScore", e.target.value)}
            placeholder="Enter NEET score"
            className={inp}
          />
        </div>
        <div>
          <label className={lbl}>Passport Number {req}</label>
          <input
            required
            type="text"
            value={form.passportNumber}
            onChange={(e) => set("passportNumber", e.target.value)}
            placeholder="e.g. A1234567"
            className={inp}
          />
        </div>
        {programs.length > 0 && (
          <Full>
            <label className={lbl}>Preferred Program</label>
            <div className="relative">
              <BookOpen
                size={14}
                className="absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none"
              />
              <select
                value={form.programId}
                onChange={(e) => set("programId", e.target.value)}
                disabled={loadingProgs}
                className={`${inp} pl-10 appearance-none disabled:bg-[#FAF8F7]`}
              >
                <option value="">
                  {loadingProgs ? "Loading…" : "Select a program (optional)"}
                </option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.programName}
                  </option>
                ))}
              </select>
            </div>
          </Full>
        )}
      </Card>

      {/* Required Documents */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white border border-amber-200 p-2 rounded-lg shadow-sm">
            <ClipboardList size={17} className="text-[#8A1538]" />
          </div>
          <h3 className="font-bold text-[#1F2937]">Required Documents</h3>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {REQUIRED_DOCS.map((doc) => (
            <div
              key={doc}
              className="flex items-center gap-2 text-sm text-[#4B5563]"
            >
              <CheckCircle size={13} className="text-[#5B0F26] shrink-0" /> {doc}
            </div>
          ))}
        </div>
        <p className="text-xs text-[#4B5563] mt-3 font-medium">
          * Please have these documents ready. Our counsellor will guide you on
          submission.
        </p>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer mb-4">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(e) => set("agreed", e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#8A1538] focus:ring-[#5B0F26]/500"
        />
        <span className="text-sm text-[#4B5563]">
          I agree to the{" "}
          <Link
            href="/privacy-policy"
            className="text-[#8A1538] hover:underline"
          >
            terms and conditions
          </Link>{" "}
          and authorize the university to contact me.
        </span>
      </label>

      {error && (
        <div className="rounded-xl bg-white border border-[#E5E7EB] px-4 py-3 text-sm text-[#5B0F26] mb-4">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !form.agreed}
        className="w-full flex items-center justify-center gap-2 bg-[#8A1538] hover: text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base"
      >
        {submitting ? (
          <>
            <Loader2 size={20} className="animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <ShieldCheck size={20} />
            <span>Submit Application</span>
            <ChevronRight size={20} />
          </>
        )}
      </button>
    </form>
  );
}
