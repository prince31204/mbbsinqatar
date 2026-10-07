"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, Settings2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        setForm(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = (field: string, value: unknown) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#6B7280]" size={32} />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings2 size={24} className="text-[#6B7280]" />
        <h1 className="text-2xl font-bold text-[#1F2937]">Website Settings</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">General</h2>
          {[
            {
              key: "siteName",
              label: "Site Name",
              placeholder: "MBBS in Qatar",
            },
            {
              key: "tagline",
              label: "Tagline",
              placeholder: "Your trusted MBBS consultant",
            },
            { key: "siteEmail", label: "Contact Email" },
            { key: "sitePhone", label: "Contact Phone" },
            { key: "whatsapp", label: "WhatsApp Number" },
            { key: "address", label: "Office Address" },
            { key: "mapEmbedUrl", label: "Google Maps Embed URL" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input
                value={String(form[key] ?? "")}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Social Media
          </h2>
          {[
            { key: "facebook", label: "Facebook URL" },
            { key: "instagram", label: "Instagram URL" },
            { key: "youtube", label: "YouTube URL" },
            { key: "twitter", label: "Twitter/X URL" },
            { key: "linkedin", label: "LinkedIn URL" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input
                value={String(form[key] ?? "")}
                onChange={(e) => set(key, e.target.value)}
                placeholder={`https://`}
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            SEO & Scripts
          </h2>
          <div className="space-y-1.5">
            <Label>Default Meta Title</Label>
            <Input
              value={String(form.defaultMetaTitle ?? "")}
              onChange={(e) => set("defaultMetaTitle", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Default Meta Description</Label>
            <Textarea
              value={String(form.defaultMetaDesc ?? "")}
              onChange={(e) => set("defaultMetaDesc", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Google Analytics ID</Label>
            <Input
              value={String(form.googleAnalyticsId ?? "")}
              onChange={(e) => set("googleAnalyticsId", e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Header Scripts (&#60;head&#62;)</Label>
            <Textarea
              value={String(form.headerScripts ?? "")}
              onChange={(e) => set("headerScripts", e.target.value)}
              rows={4}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Footer Scripts (before &#60;/body&#62;)</Label>
            <Textarea
              value={String(form.footerScripts ?? "")}
              onChange={(e) => set("footerScripts", e.target.value)}
              rows={4}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Logo & Favicon
          </h2>
          <ImageUpload
            label="Site Logo"
            value={form.logo as string | null}
            onChange={(v) => set("logo", v)}
            folder={`settings/${String((form as Record<string, unknown>).id ?? "_tmp")}/logo`}
          />
        </div>

        <div className="flex justify-end pb-8">
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
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
