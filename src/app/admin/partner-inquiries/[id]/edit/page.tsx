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
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  User,
  Star,
  Award,
  GraduationCap,
} from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function PartnerInquiryEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inquiry, setInquiry] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    partnerType: "",
    status: "pending",
    message: "",
    studentsPlaced: "",
    experience: "",
    rating: "",
    imageName: "",
    imagePath: "",
  });

  useEffect(() => {
    fetch(`/api/admin/partner-inquiries/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setInquiry(d);
        setForm({
          name: d.name ?? "",
          email: d.email ?? "",
          phone: d.phone ?? "",
          company: d.company ?? "",
          city: d.city ?? "",
          partnerType: d.partnerType ?? "",
          status: d.status ?? "pending",
          message: d.message ?? "",
          studentsPlaced: d.studentsPlaced?.toString() ?? "",
          experience: d.experience?.toString() ?? "",
          rating: d.rating?.toString() ?? "",
          imageName: d.imageName ?? "",
          imagePath: d.imagePath ?? "",
        });
      })
      .catch(() => toast.error("Failed to load inquiry"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/partner-inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Failed to update");
      toast.success("Partner inquiry updated successfully");
      router.push("/admin/partner-inquiries");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error updating inquiry",
      );
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
  if (!inquiry)
    return <div className="p-6 text-[#BC002D]">Inquiry not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#17202A]">
          Review Partner Inquiry
        </h1>
        <Badge
          className={
            inquiry.status === "pending"
              ? "bg-red-400 text-[#BC002D] hover:bg-red-400"
              : inquiry.status === "contacted"
                ? "bg-[#F9FAFB] text-[#102A43] hover:bg-[#F9FAFB]"
                : inquiry.status === "converted"
                  ? "bg-red-100 text-[#8F0023] hover:bg-red-100"
                  : "bg-[#F9FAFB] text-[#4B5563] hover:bg-[#F9FAFB]"
          }
        >
          <span className="capitalize">{inquiry.status}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Snapshot */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <h2 className="font-semibold text-[#4B5563] mb-4">Snapshot</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-[#4B5563]">
                <User size={14} className="text-[#6B7280]" />
                <span>{inquiry.name}</span>
              </div>
              <div className="flex items-center gap-2 text-[#4B5563]">
                <Mail size={14} className="text-[#6B7280]" />
                <span className="truncate">{inquiry.email}</span>
              </div>
              {inquiry.phone && (
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <Phone size={14} className="text-[#6B7280]" />
                  <span>{inquiry.phone}</span>
                </div>
              )}
              {inquiry.company && (
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <Building2 size={14} className="text-[#6B7280]" />
                  <span>{inquiry.company}</span>
                </div>
              )}
              {inquiry.city && (
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <MapPin size={14} className="text-[#6B7280]" />
                  <span>{inquiry.city}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Calendar size={14} className="text-[#6B7280]" />
                <span>
                  {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <h2 className="font-semibold text-[#4B5563] mb-4">Partner Stats</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-[#4B5563]">
                <GraduationCap size={14} className="text-[#6B7280]" />
                <span>
                  Students Placed:{" "}
                  <strong>{inquiry.studentsPlaced || 0}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#4B5563]">
                <Award size={14} className="text-[#6B7280]" />
                <span>
                  Experience: <strong>{inquiry.experience || 0} Yrs</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#4B5563]">
                <Star size={14} className="text-[#BC002D] fill-yellow-500" />
                <span>
                  Rating: <strong>{inquiry.rating || "N/A"}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="col-span-1 md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-4 shadow-sm">
              <h2 className="font-semibold text-[#4B5563] border-b pb-2">
                Inquiry Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Contact Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Company / Agency</Label>
                  <Input
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Partner Type</Label>
                  <Select
                    value={form.partnerType || "agency"}
                    onValueChange={(v) => set("partnerType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agency">Education Agency</SelectItem>
                      <SelectItem value="counselor">
                        Independent Counselor
                      </SelectItem>
                      <SelectItem value="school">School / College</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dynamic Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                <div className="space-y-1.5">
                  <Label>Students Placed</Label>
                  <Input
                    type="number"
                    value={form.studentsPlaced}
                    onChange={(e) => set("studentsPlaced", e.target.value)}
                    placeholder="e.g. 150"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Years Experience</Label>
                  <Input
                    type="number"
                    value={form.experience}
                    onChange={(e) => set("experience", e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Rating (out of 5)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    max="5"
                    min="1"
                    value={form.rating}
                    onChange={(e) => set("rating", e.target.value)}
                    placeholder="e.g. 4.8"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-1.5 border-t pt-4">
                <Label>Partner Image / Logo</Label>
                <ImageUpload
                  value={form.imagePath || ""}
                  onChange={(url, name) => {
                    set("imagePath", url || "");
                    set("imageName", name || "");
                  }}
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <Label>Message / Notes</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={4}
                  placeholder="Initial inquiry message..."
                />
              </div>

              <div className="space-y-1.5 pt-4 border-t">
                <Label className="text-[#17202A] font-semibold mb-2 block">
                  Resolution Status
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set("status", v)}
                >
                  <SelectTrigger className="w-full sm:w-[250px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="contacted">
                      Contacted / In Progress
                    </SelectItem>
                    <SelectItem value="converted">
                      Converted to Partner
                    </SelectItem>
                    <SelectItem value="rejected">
                      Rejected / Not Interested
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#102A43] hover:bg-[#102A43]"
              >
                {loading ? "Saving…" : "Save Changes"}
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
        </div>
      </div>
    </div>
  );
}
