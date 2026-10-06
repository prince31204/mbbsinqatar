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
  X,
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
} from "lucide-react";
import Link from "next/link";

type University = { id: number; name: string };
type Program = { id: number; programName: string };

const PHONE_CODES = [
  { code: "+91", country: "India" },
  { code: "+996", country: "Japan" },
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
  "Japan",
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
  (new Date().getFullYear() - i).toString(),
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
  universityId: "",
  programId: "",
  agreed: false,
};

const Card = ({
  icon,
  color,
  title,
  children,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className={`${color} p-2 rounded-lg`}>{icon}</div>
      <h2 className="text-lg font-bold text-[#17202A]">{title}</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Full = ({ children }: { children: React.ReactNode }) => (
  <div className="sm:col-span-2">{children}</div>
);

export default function ApplyForm() {
  const [form, setForm] = useState(EMPTY);
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(true);
  const [loadingProgs, setLoadingProgs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/universities")
      .then((r) => r.json())
      .then((d) => setUniversities(d?.universities ?? d ?? []))
      .catch(() => {})
      .finally(() => setLoadingUnis(false));
  }, []);

  useEffect(() => {
    if (!form.universityId) {
      setPrograms([]);
      return;
    }
    setLoadingProgs(true);
    setForm((p) => ({ ...p, programId: "" }));
    fetch(`/api/universities/${form.universityId}/programs`)
      .then((r) => r.json())
      .then((d) => setPrograms(d?.programs ?? d ?? []))
      .catch(() => setPrograms([]))
      .finally(() => setLoadingProgs(false));
  }, [form.universityId]);

  const set = (field: string, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));
  const uni = universities.find((u) => u.id.toString() === form.universityId);

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
          universityId: uni ? parseInt(form.universityId) : undefined,
          universityName: uni?.name,
          programId: form.programId ? parseInt(form.programId) : undefined,
          source: "general_application",
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to submit");
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
    "w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#102A43]/500 focus:border-transparent transition text-sm outline-none bg-white text-[#17202A] placeholder:text-[#6B7280]";
  const lbl = "block text-sm font-semibold text-[#4B5563] mb-1.5";
  const req = <span className="text-red-500">*</span>;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card
          icon={<User size={18} className="text-[#BC002D]" />}
          color="bg-[#F9FAFB]"
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
                className="px-2 py-3 border border-[#E5E7EB] rounded-xl text-sm outline-none bg-white text-[#17202A] focus:ring-2 focus:ring-[#102A43]/500 w-28 shrink-0"
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

        <Card
          icon={<Users size={18} className="text-purple-600" />}
          color="bg-purple-100"
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

        <Card
          icon={<MapPin size={18} className="text-[#8F0023]" />}
          color="bg-red-100"
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

        <Card
          icon={<Award size={18} className="text-[#BC002D]" />}
          color="bg-[#F9FAFB]"
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
        </Card>

        <Card
          icon={<Building2 size={18} className="text-orange-600" />}
          color="bg-orange-100"
          title="University Preference"
        >
          <div>
            <label className={lbl}>Preferred University</label>
            <div className="relative">
              <Building2
                size={14}
                className="absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none"
              />
              <select
                value={form.universityId}
                onChange={(e) => set("universityId", e.target.value)}
                disabled={loadingUnis}
                className={`${inp} pl-10 appearance-none disabled:bg-[#FFFDF9]`}
              >
                <option value="">
                  {loadingUnis ? "Loading…" : "Any university"}
                </option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              {loadingUnis && (
                <Loader2
                  size={14}
                  className="absolute right-3 top-3.5 animate-spin text-[#6B7280]"
                />
              )}
            </div>
          </div>
          <div>
            <label className={lbl}>Preferred Program</label>
            <div className="relative">
              <BookOpen
                size={14}
                className="absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none"
              />
              <select
                value={form.programId}
                onChange={(e) => set("programId", e.target.value)}
                disabled={!form.universityId || loadingProgs}
                className={`${inp} pl-10 appearance-none disabled:bg-[#FFFDF9]`}
              >
                <option value="">
                  {!form.universityId
                    ? "Select university first"
                    : loadingProgs
                      ? "Loading…"
                      : "Select program"}
                </option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.programName}
                  </option>
                ))}
              </select>
              {loadingProgs && (
                <Loader2
                  size={14}
                  className="absolute right-3 top-3.5 animate-spin text-[#6B7280]"
                />
              )}
            </div>
          </div>
        </Card>

        {/* Required Documents */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white border border-amber-200 p-2 rounded-lg shadow-sm">
              <ClipboardList size={18} className="text-[#BC002D]" />
            </div>
            <h2 className="text-lg font-bold text-black">
              Required Documents
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REQUIRED_DOCS.map((doc) => (
              <div
                key={doc}
                className="flex items-center gap-2 text-sm text-black font-medium"
              >
                <CheckCircle size={14} className="text-[#102A43] shrink-0" />{" "}
                {doc}
              </div>
            ))}
          </div>
          <p className="text-xs text-black font-medium mt-3">
            * Please have these documents ready. Our counsellor will guide you on
            submission.
          </p>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.agreed}
            onChange={(e) => set("agreed", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#BC002D] focus:ring-[#102A43]/500"
          />
          <span className="text-sm text-[#4B5563]">
            I agree to the{" "}
            <Link
              href="/privacy-policy"
              className="text-[#BC002D] hover:underline"
            >
              terms and conditions
            </Link>{" "}
            and authorize the university to contact me.
          </span>
        </label>

        {error && (
          <div className="rounded-xl bg-white border border-[#E5E7EB] px-4 py-3 text-sm text-[#102A43]">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !form.agreed}
          className="w-full flex items-center justify-center gap-2 bg-[#BC002D] hover:bg-[#8F0023] text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base"
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

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative">
            <button
              onClick={() => setSuccess(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#4B5563]"
            >
              <X size={20} />
            </button>
            <div className="w-20 h-20 bg-[#BC002D] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg ">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#17202A] mb-2">
              Application Submitted!
            </h3>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-5">
              <p className="text-[#102A43] text-sm font-medium">
                Thank you! Our counsellors will contact you within 24 hours to
                guide you through the next steps.
              </p>
            </div>
            <Link
              href="/universities"
              className="inline-block bg-[#BC002D] hover:bg-[#8F0023] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Explore Universities
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
