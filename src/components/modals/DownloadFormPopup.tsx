"use client";

import { useState } from "react";
import {
  X,
  Download,
  CheckCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { useDownloadModal } from "@/lib/modalContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  universityName?: string;
  brochureUrl?: string;
  title?: string;
  buttonText?: string;
  description?: string;
}

const PHONE_CODES = [
  { code: "+91", country: "India" },
  { code: "+996", country: "Japan" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+92", country: "Pakistan" },
  { code: "+880", country: "Bangladesh" },
  { code: "+977", country: "Nepal" },
];

export function GlobalDownloadModal() {
  const { modal, closeModal } = useDownloadModal();
  return (
    <DownloadFormPopup
      isOpen={modal.isOpen}
      onClose={closeModal}
      universityName={modal.universityName}
      brochureUrl={modal.brochureUrl}
      title={modal.title}
      buttonText={modal.buttonText}
      description={modal.description}
    />
  );
}

export default function DownloadFormPopup({
  isOpen,
  onClose,
  universityName,
  brochureUrl,
  title,
  buttonText,
  description,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    nationality: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setForm({
      name: "",
      email: "",
      countryCode: "+91",
      phone: "",
      nationality: "",
    });
    setSuccess(false);
    setError(null);
    onClose();
  };

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: `${form.countryCode}${form.phone}`,
          nationality: form.nationality || undefined,
          universityName: universityName,
          message: `Brochure download request for ${universityName || "university"}`,
          leadSource: universityName
            ? `brochure-download: ${universityName}`
            : "brochure-download",
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to submit");
      }
      setSuccess(true);
      if (brochureUrl) {
        // Trigger PDF download
        const a = document.createElement("a");
        a.href = brochureUrl;
        a.download = brochureUrl.split("/").pop() || "brochure.pdf";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
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

  const inputCls =
    "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#102A43]/500 focus:border-transparent transition text-sm outline-none text-[#17202A] placeholder:text-[#6B7280] bg-white";

  return (
    <div
      className="fixed inset-0 bg-white/60 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#6B7280] hover:text-[#4B5563] transition-colors"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-[#8F0023]" />
            </div>
            <h3 className="text-xl font-bold text-[#17202A] mb-2">Thank You!</h3>
            <p className="text-[#4B5563] mb-6">
              {brochureUrl
                ? "Your brochure download has started. Our counsellors will get in touch shortly."
                : "Your request has been received. Our counsellors will send the brochure to your email shortly."}
            </p>
            <button
              onClick={handleClose}
              className="bg-[#BC002D] hover:bg-[#8F0023] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#F9FAFB] p-3 rounded-xl">
                <Download className="w-6 h-6 text-[#BC002D]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#17202A]">
                  {title || "Download Brochure"}
                </h3>
                {description ? (
                  <p className="text-sm text-[#6B7280]">{description}</p>
                ) : universityName && !title ? (
                  <p className="text-sm text-[#6B7280]">
                    Fill in the details to download the brochure for{" "}
                    {universityName}.
                  </p>
                ) : (
                  <p className="text-sm text-[#6B7280]">
                    Fill in the details to download the requested document.
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-3.5 text-[#6B7280]"
                />
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#102A43]/500 focus:border-transparent transition text-sm outline-none text-[#17202A] placeholder:text-[#6B7280] bg-white"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-3.5 text-[#6B7280]"
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#102A43]/500 focus:border-transparent transition text-sm outline-none text-[#17202A] placeholder:text-[#6B7280] bg-white"
                />
              </div>

              {/* Phone */}
              <div className="flex gap-2">
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-3.5 text-[#6B7280]"
                  />
                  <select
                    value={form.countryCode}
                    onChange={(e) => set("countryCode", e.target.value)}
                    className="pl-9 pr-2 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#102A43]/500 text-sm outline-none w-28 bg-white text-[#17202A]"
                  >
                    {PHONE_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} {c.country}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="1234567890"
                  className={`${inputCls} flex-1`}
                />
              </div>

              {/* Nationality */}
              <div className="relative">
                <Globe
                  size={16}
                  className="absolute left-3.5 top-3.5 text-[#6B7280]"
                />
                <input
                  type="text"
                  value={form.nationality}
                  onChange={(e) => set("nationality", e.target.value)}
                  placeholder="Your Nationality"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#102A43]/500 focus:border-transparent transition text-sm outline-none text-[#17202A] placeholder:text-[#6B7280] bg-white"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-white border border-[#E5E7EB] px-4 py-3 text-sm text-[#102A43]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[#BC002D] hover:bg-[#8F0023] text-white font-semibold py-3.5 rounded-xl shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <Download size={18} /> {buttonText || "Download Brochure"}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#6B7280]">
                By submitting, you agree to be contacted by our counsellors.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
