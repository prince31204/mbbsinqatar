"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import { formatSource } from "@/lib/utils";
import { format } from "date-fns";

const LEAD_STATUSES = ["active", "inactive", "blocked"] as const;
const LEAD_TYPES = [
  "general",
  "university",
  "scholarship",
  "hot",
  "follow-up",
  "converted",
] as const;

export default function LeadEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lead, setLead] = useState<any>(null);
  const [form, setForm] = useState({
    status: "active" as "active" | "inactive" | "blocked",
    leadStatus: "",
    leadType: "none",
    subStatus: "",
    note: "",
    interestedUniversity: "",
    interestedProgram: "",
    assignedTo: "",
  });

  useEffect(() => {
    fetch(`/api/admin/leads/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setLead(d);
        setForm({
          status: d.status ?? "active",
          leadStatus: d.leadStatus ?? "",
          leadType: d.leadType ?? "none",
          subStatus: d.subStatus ?? "",
          note: d.note ?? "",
          interestedUniversity: d.interestedUniversity ?? "",
          interestedProgram: d.interestedProgram ?? "",
          assignedTo: d.assignedTo ? String(d.assignedTo) : "",
        });
      })
      .catch(() => toast.error("Failed to load lead"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const updateAppStatus = async (appId: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setLead((prev: any) => ({
        ...prev,
        applications: prev.applications.map((a: any) =>
          a.id === appId ? { ...a, status } : a,
        ),
      }));
      toast.success("Application status updated");
    } catch {
      toast.error("Failed to update application status");
    }
  };

  const updateInqStatus = async (inqId: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${inqId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setLead((prev: any) => ({
        ...prev,
        inquiries: prev.inquiries.map((i: any) =>
          i.id === inqId ? { ...i, status } : i,
        ),
      }));
      toast.success("Inquiry status updated");
    } catch {
      toast.error("Failed to update inquiry status");
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: form.status,
          leadStatus: form.leadStatus,
          leadType: form.leadType === "none" ? null : form.leadType,
          subStatus: form.subStatus,
          note: form.note,
          interestedUniversity: form.interestedUniversity,
          interestedProgram: form.interestedProgram,
          assignedTo: form.assignedTo ? parseInt(form.assignedTo) : null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("Lead updated");
      router.push("/admin/leads");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (fetching)
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  if (!lead) return <div className="p-6 text-[#8A1538]">Lead not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">
          Lead Details — {lead.name}
        </h1>
        <Badge
          variant={lead.status === "active" ? "default" : "secondary"}
          className="capitalize"
        >
          {lead.status}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Profile Info (read-only) */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <h2 className="font-semibold text-[#4B5563] mb-4">Contact Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-[#4B5563]">
                <User size={14} className="text-[#6B7280]" />
                <span>{lead.name}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <Mail size={14} className="text-[#6B7280]" />
                  <span className="truncate">{lead.email}</span>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <Phone size={14} className="text-[#6B7280]" />
                  <span>
                    {lead.phoneCode} {lead.phone}
                  </span>
                </div>
              )}
              {(lead.city || lead.state) && (
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <MapPin size={14} className="text-[#6B7280]" />
                  <span>
                    {[lead.city, lead.state].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Calendar size={14} className="text-[#6B7280]" />
                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
              {lead.source && (
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <p className="text-[10px] uppercase font-bold text-[#6B7280] mb-1">
                    Lead Source
                  </p>
                  <Badge
                    variant="outline"
                    className="text-xs font-medium bg-[#F7E9EE] text-[#8A1538] border-[#E5E7EB] whitespace-normal text-left h-auto py-1 px-3"
                  >
                    {formatSource(lead.source)}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Academics */}
          {(lead.neetScore || lead.neetQualificationStatus) && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
              <h2 className="font-semibold text-[#4B5563] mb-3">Academic</h2>
              <div className="space-y-2 text-sm text-[#4B5563]">
                {lead.neetScore && (
                  <div>
                    <span className="text-[#6B7280]">NEET Score:</span>{" "}
                    <strong>{lead.neetScore}</strong>
                  </div>
                )}
                {lead.neetQualificationStatus && (
                  <div>
                    <span className="text-[#6B7280]">NEET:</span>{" "}
                    <Badge className="text-xs capitalize ml-1">
                      {lead.neetQualificationStatus}
                    </Badge>
                  </div>
                )}
                {lead.highestLevelOfEducation && (
                  <div>
                    <span className="text-[#6B7280]">Education:</span>{" "}
                    {lead.highestLevelOfEducation}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Editable CRM Fields */}
        <div className="col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-4 shadow-sm">
              <h2 className="font-semibold text-[#4B5563] border-b pb-2">
                CRM Management
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Account Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => set("status", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Lead Type</Label>
                  <Select
                    value={form.leadType}
                    onValueChange={(v) => set("leadType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— None —</SelectItem>
                      {LEAD_TYPES.map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Lead Status</Label>
                  <Input
                    value={form.leadStatus}
                    onChange={(e) => set("leadStatus", e.target.value)}
                    placeholder="e.g. Documents Pending"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Sub Status</Label>
                  <Input
                    value={form.subStatus}
                    onChange={(e) => set("subStatus", e.target.value)}
                    placeholder="e.g. Follow Up"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Interested University</Label>
                  <Input
                    value={form.interestedUniversity}
                    onChange={(e) =>
                      set("interestedUniversity", e.target.value)
                    }
                    placeholder="University slug or name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Interested Program</Label>
                  <Input
                    value={form.interestedProgram}
                    onChange={(e) => set("interestedProgram", e.target.value)}
                    placeholder="e.g. MBBS"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Assigned To (ID)</Label>
                  <Input
                    value={form.assignedTo}
                    onChange={(e) => set("assignedTo", e.target.value)}
                    placeholder="User ID"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Internal Note</Label>
                <Textarea
                  value={form.note}
                  onChange={(e) => set("note", e.target.value)}
                  rows={4}
                  placeholder="Add notes about this lead (visible to admins only)…"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#5B0F26] hover:bg-[#5B0F26]"
              >
                {loading ? "Saving…" : "Update Lead"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Inquiries & Applications */}
          <div className="mt-6 bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-[#4B5563] border-b pb-2">
              Student Inquiries & Applications
            </h2>

            {lead.applications?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">
                  Program Applications
                </h3>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {lead.applications.map((app: any) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-[#FAF8F7] p-3 rounded-lg border border-[#E5E7EB]"
                  >
                    <div>
                      <div className="font-semibold text-[#1F2937] text-sm">
                        {app.program?.programName || "Unknown Program"}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {app.program?.university?.name || "Unknown University"}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">
                        Applied:{" "}
                        {format(new Date(app.appliedAt), "dd MMM yyyy")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Select
                        value={app.status || "applied"}
                        onValueChange={(v) => updateAppStatus(app.id, v)}
                      >
                        <SelectTrigger className="h-8 text-xs w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="shortlisted">
                            Shortlisted
                          </SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lead.inquiries?.length > 0 && (
              <div className="space-y-3 mt-4">
                <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">
                  General Inquiries
                </h3>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {lead.inquiries.map((inq: any) => (
                  <div
                    key={inq.id}
                    className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-[#FAF8F7] p-3 rounded-lg border border-[#E5E7EB]"
                  >
                    <div>
                      <div className="font-semibold text-[#1F2937] text-sm">
                        {inq.universityName || "General Inquiry"}
                      </div>
                      {inq.message && (
                        <div className="text-xs text-[#4B5563] mt-0.5 line-clamp-2">
                          {inq.message}
                        </div>
                      )}
                      <div className="text-xs text-[#6B7280] mt-1">
                        Submitted:{" "}
                        {format(new Date(inq.createdAt), "dd MMM yyyy")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Select
                        value={inq.status || "pending"}
                        onValueChange={(v) => updateInqStatus(inq.id, v)}
                      >
                        <SelectTrigger className="h-8 text-xs w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!lead.applications?.length && !lead.inquiries?.length && (
              <div className="text-center py-6 text-sm text-[#6B7280]">
                No inquiries or applications found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
