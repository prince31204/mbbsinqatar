"use client";

import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const partnerTypes = [
  "University Partner",
  "Counseling Agency",
  "Education Consultant",
  "Student Support Organization",
  "Other",
];

export default function PartnerInquiryModal({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    partnerType: "",
    message: "",
  });

  if (!isOpen) return null;

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/partner-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      toast.success(
        "Your partner inquiry has been submitted! We'll get back to you shortly.",
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        partnerType: "",
        message: "",
      });
      onClose();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to submit. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-white/60 " onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[94vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">
              Become a Partner
            </h2>
            <p className="text-sm text-[#6B7280] mt-0.5">
              Fill in your details and we&apos;ll reach out
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors text-[#6B7280] hover:text-[#4B5563]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* name + email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1">
                Full Name <span className="text-[#8A1538]">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-[#E5E7EB] outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1">
                Email <span className="text-[#8A1538]">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-[#E5E7EB] outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* phone + company */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-[#E5E7EB] outline-none transition-all"
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-[#E5E7EB] outline-none transition-all"
                placeholder="Acme Education Pvt Ltd"
              />
            </div>
          </div>

          {/* city + partner type */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1">
                City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-[#E5E7EB] outline-none transition-all"
                placeholder="New Delhi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1">
                Partner Type
              </label>
              <select
                value={form.partnerType}
                onChange={(e) => update("partnerType", e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-[#E5E7EB] outline-none transition-all bg-white"
              >
                <option value="">Select type…</option>
                {partnerTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* message */}
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1">
              Message
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#5B0F26]/500 focus:border-[#E5E7EB] outline-none transition-all resize-none"
              placeholder="Tell us about your interest in partnering…"
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A1538] hover:bg-[#5B0F26] disabled:bg-red-400 text-[#1F2937] font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? "Submitting…" : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
