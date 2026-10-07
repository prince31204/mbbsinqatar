"use client";

import { useState, FormEvent } from "react";
import { X, User, Mail, Phone, MapPin, Send, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { indianStates, stateCitiesMap } from "@/lib/location-data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  onSuccess: () => void;
}

export default function PartnerLeadModal({
  isOpen,
  onClose,
  partnerName,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    message: "",
  });

  if (!isOpen) return null;

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: `Partner Reveal: ${partnerName}`,
          leadSource: "Partner Page",
        }),
      });
      const json = await res.json();
      if (!res.ok && res.status !== 409) {
        throw new Error(json.error || "Something went wrong");
      }

      if (res.status === 409) {
        toast.info("Welcome back! Your details are already with us.");
      } else {
        toast.success(
          "Details submitted! You can now see the partner contact info.",
        );
      }

      onSuccess();
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-white/60 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9FAFB]/10 rounded-full translate-x-16 -translate-y-16 hidden" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F9FAFB]/10 rounded-full -translate-x-12 translate-y-12 hidden" />

        <div className="relative p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937] leading-tight">
                Partner Contact Info
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Reach out to{" "}
                <span className="font-semibold text-[#8A1538]">
                  {partnerName}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F9FAFB] transition-all text-[#6B7280] hover:text-[#1F2937]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-xs text-[#4B5563] mb-6 bg-white border-l-4 border-[#E5E7EB] p-3 rounded-r-xl">
            Fill in your details to instantly reveal the contact number and
            email.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Name */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F7] border border-[#E5E7EB] rounded-xl text-sm focus:ring-4 focus:ring-[#5B0F26]/500/10 focus:border-[#E5E7EB] outline-none transition-all placeholder:text-[#6B7280]"
                  placeholder="Full Name"
                />
              </div>

              {/* Email + Phone in a row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F7] border border-[#E5E7EB] rounded-xl text-sm focus:ring-4 focus:ring-[#5B0F26]/500/10 focus:border-[#E5E7EB] outline-none transition-all placeholder:text-[#6B7280]"
                    placeholder="Email"
                  />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F7] border border-[#E5E7EB] rounded-xl text-sm focus:ring-4 focus:ring-[#5B0F26]/500/10 focus:border-[#E5E7EB] outline-none transition-all placeholder:text-[#6B7280]"
                    placeholder="Phone"
                  />
                </div>
              </div>

              {/* State + City in a row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-red-500 transition-colors pointer-events-none" />
                  <select
                    required
                    value={form.state}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => ({ ...prev, state: val, city: "" }));
                    }}
                    className="w-full pl-10 pr-10 py-3 bg-[#FAF8F7] border border-[#E5E7EB] rounded-xl text-sm focus:ring-4 focus:ring-[#5B0F26]/500/10 focus:border-[#E5E7EB] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {indianStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                </div>

                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-red-500 transition-colors pointer-events-none" />
                  <select
                    required
                    disabled={!form.state}
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#FAF8F7] border border-[#E5E7EB] rounded-xl text-sm focus:ring-4 focus:ring-[#5B0F26]/500/10 focus:border-[#E5E7EB] outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {(stateCitiesMap[form.state] || []).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8A1538] hover:bg-[#5B0F26] disabled:bg-blue-300 text-[#1F2937] font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  Reveal Details
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-[#6B7280] mt-4 px-4 uppercase tracking-wider">
            Quick & Secure Lead Generation
          </p>
        </div>
      </div>
    </div>
  );
}
