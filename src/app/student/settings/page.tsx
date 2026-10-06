"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Loader2 } from "lucide-react";

const INPUT =
  "w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#17202A] focus:outline-none focus:ring-2 focus:ring-[#102A43]/500";
const LABEL = "block text-sm font-medium text-[#4B5563] mb-1";

interface Profile {
  name?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  neetScore?: number;
  interestedUniversity?: string;
  interestedProgram?: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((data) => setProfile(data.profile || {}))
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof Profile, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) setSuccess(true);
      else {
        const d = await res.json();
        setError(d.error || "Failed to save");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border h-24 border-[#E5E7EB]"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-[#BC002D]" />
        <h1 className="text-2xl font-bold text-[#17202A]">Profile Settings</h1>
      </div>

      {error && (
        <div className="bg-white border border-[#E5E7EB] text-[#102A43] px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-red-50 border border-red-200 text-[#8F0023] px-4 py-3 rounded-xl mb-4 text-sm">
          ✓ Profile saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h2 className="font-semibold text-[#17202A] mb-4">
            Personal Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Full Name</label>
              <input
                className={INPUT}
                value={profile.name || ""}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className={LABEL}>Phone Number</label>
              <input
                className={INPUT}
                value={profile.phone || ""}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className={LABEL}>Gender</label>
              <select
                className={INPUT}
                value={profile.gender || ""}
                onChange={(e) => set("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>City</label>
              <input
                className={INPUT}
                value={profile.city || ""}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Your city"
              />
            </div>
            <div>
              <label className={LABEL}>State</label>
              <input
                className={INPUT}
                value={profile.state || ""}
                onChange={(e) => set("state", e.target.value)}
                placeholder="Your state"
              />
            </div>
            <div>
              <label className={LABEL}>Country</label>
              <input
                className={INPUT}
                value={profile.country || ""}
                onChange={(e) => set("country", e.target.value)}
                placeholder="India"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h2 className="font-semibold text-[#17202A] mb-4">Family Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Father&apos;s Name</label>
              <input
                className={INPUT}
                value={profile.fatherName || ""}
                onChange={(e) => set("fatherName", e.target.value)}
                placeholder="Father's full name"
              />
            </div>
            <div>
              <label className={LABEL}>Mother&apos;s Name</label>
              <input
                className={INPUT}
                value={profile.motherName || ""}
                onChange={(e) => set("motherName", e.target.value)}
                placeholder="Mother's full name"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <h2 className="font-semibold text-[#17202A] mb-4">
            Academic Preferences
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>NEET Score</label>
              <input
                type="number"
                className={INPUT}
                value={profile.neetScore || ""}
                onChange={(e) => set("neetScore", e.target.value)}
                placeholder="e.g. 520"
              />
            </div>
            <div>
              <label className={LABEL}>Preferred Program</label>
              <input
                className={INPUT}
                value={profile.interestedProgram || ""}
                onChange={(e) => set("interestedProgram", e.target.value)}
                placeholder="e.g. MBBS"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Interested University</label>
              <input
                className={INPUT}
                value={profile.interestedUniversity || ""}
                onChange={(e) => set("interestedUniversity", e.target.value)}
                placeholder="e.g. Japan State Medical Academy"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#BC002D] hover:bg-[#8F0023] text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-60 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
