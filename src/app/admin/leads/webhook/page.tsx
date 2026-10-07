"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Save, Webhook, KeyRound } from "lucide-react";

type FieldOption = {
  key: string;
  label: string;
  enabled: boolean;
  outgoingName: string;
};

export default function LeadWebhookSettingsPage() {
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [hasSecret, setHasSecret] = useState(false);
  const [secretPreview, setSecretPreview] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/leads/webhook")
      .then((r) => r.json())
      .then((d) => {
        setUrl(d.url ?? "");
        setHasSecret(!!d.hasSecret);
        setSecretPreview(d.secretPreview ?? null);
        setFields(d.fields ?? []);
        setSecret("");
      })
      .catch(() => toast.error("Failed to load webhook settings."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleField = (key: string, enabled: boolean) => {
    setFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled } : f)),
    );
  };

  const setAllFields = (enabled: boolean) => {
    setFields((prev) => prev.map((f) => ({ ...f, enabled })));
  };

  const updateOutgoingName = (key: string, outgoingName: string) => {
    setFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, outgoingName } : f)),
    );
  };

  // Two selected fields sent under the same outgoing name would silently overwrite
  // each other in the JSON — catch that before saving rather than losing data quietly.
  const findDuplicateOutgoingNames = () => {
    const seen = new Map<string, string[]>();
    for (const f of fields) {
      if (!f.enabled) continue;
      const name = (f.outgoingName.trim() || f.key).toLowerCase();
      seen.set(name, [...(seen.get(name) ?? []), f.label]);
    }
    return [...seen.values()].filter((labels) => labels.length > 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const duplicates = findDuplicateOutgoingNames();
    if (duplicates.length > 0) {
      toast.error(
        `These fields share the same outgoing name: ${duplicates.map((d) => d.join(" + ")).join(", ")}`,
      );
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/leads/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, secret, fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save");
      toast.success("Webhook settings saved!");
      load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save webhook settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClearSecret = async () => {
    if (
      !confirm(
        "Remove the saved API key? Leads will stop being delivered until a new key is added.",
      )
    )
      return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/leads/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, clearSecret: true, fields }),
      });
      if (!res.ok) throw new Error();
      toast.success("API key removed.");
      load();
    } catch {
      toast.error("Failed to remove key.");
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Webhook size={24} className="text-[#6B7280]" />
        <h1 className="text-2xl font-bold text-[#1F2937]">
          Lead Export / Webhook
        </h1>
      </div>
      <p className="text-sm text-[#6B7280] -mt-4">
        Every new lead is automatically sent to this URL as JSON, along with the
        API key in the request so the receiving site can verify it came from us.
        Leave the URL blank to stop sending leads.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Connection
          </h2>

          <div className="space-y-1.5">
            <Label>URL</Label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://partner-website.com/api/webhooks/leads"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <KeyRound size={14} /> API Key
            </Label>
            <Input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder={
                hasSecret
                  ? `Currently set (••••${secretPreview}) — leave blank to keep`
                  : "Paste the API key provided by the other website"
              }
            />
            {hasSecret && (
              <button
                type="button"
                onClick={handleClearSecret}
                className="text-xs text-[#8A1538] hover:underline"
              >
                Remove saved key
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-semibold text-[#1F2937]">Fields to Send</h2>
            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => setAllFields(true)}
                className="text-[#8A1538] hover:underline"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setAllFields(false)}
                className="text-[#6B7280] hover:underline"
              >
                Select none
              </button>
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">
            Only the checked fields are included in the JSON sent to the
            webhook. The lead ID and created date are always included.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
            {fields.map((f) => (
              <label
                key={f.key}
                className="flex items-center gap-2 text-sm text-[#4B5563] cursor-pointer"
              >
                <Checkbox
                  checked={f.enabled}
                  onCheckedChange={(checked) =>
                    toggleField(f.key, checked === true)
                  }
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-[#1F2937] border-b pb-3">
            Selected Fields — Outgoing Names
          </h2>
          <p className="text-xs text-[#6B7280]">
            This is the JSON key each selected field is sent under. Set it to
            match whatever field name the receiving website expects — leave
            blank to send it under our own field name (shown as the
            placeholder).
          </p>
          {fields.filter((f) => f.enabled).length === 0 ? (
            <p className="text-sm text-[#6B7280] italic">
              No fields selected above.
            </p>
          ) : (
            <div className="space-y-3">
              {fields
                .filter((f) => f.enabled)
                .map((f) => (
                  <div
                    key={f.key}
                    className="grid grid-cols-[1fr_1fr] gap-3 items-center"
                  >
                    <Label className="text-[#4B5563]">{f.label}</Label>
                    <Input
                      value={f.outgoingName}
                      onChange={(e) =>
                        updateOutgoingName(f.key, e.target.value)
                      }
                      placeholder={f.key}
                      className="font-mono text-xs"
                    />
                  </div>
                ))}
            </div>
          )}
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
                Save
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
