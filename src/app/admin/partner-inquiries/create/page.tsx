"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function PartnerInquiryCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    partnerType: "agency",
    status: "converted",
    message: "",
    studentsPlaced: "",
    experience: "",
    rating: "",
    imageName: "",
    imagePath: "",
  });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/partner-inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Failed to create partner");
      toast.success("Partner created successfully");
      router.push("/admin/partner-inquiries");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error creating partner",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#5B0F26] flex items-center justify-center text-[#8A1538]">
          <Building2 size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Add New Partner</h1>
          <p className="text-sm text-[#6B7280]">
            Manually add a partner to the system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>
                Contact Name <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Email Address <span className="text-[#8A1538]">*</span>
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+1 123 456 7890"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company / Agency Name</Label>
              <Input
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="EduCorp Inc."
              />
            </div>
            <div className="space-y-1.5">
              <Label>City / Location</Label>
              <Input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="e.g. London"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Partner Type</Label>
              <Select
                value={form.partnerType}
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

            {/* Dynamic Stats Section */}
            <div className="space-y-1.5 border-t pt-4 mt-2 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
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
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  value={form.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Star Rating (out of 5)</Label>
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
            <div className="space-y-1.5 border-t pt-4 md:col-span-2">
              <Label>Partner Image / Logo</Label>
              <p className="text-sm text-[#6B7280] mb-2">
                Upload a profile picture or company logo.
              </p>
              <ImageUpload
                value={form.imagePath || ""}
                onChange={(url, name) => {
                  set("imagePath", url || "");
                  set("imageName", name || "");
                }}
              />
            </div>

            <div className="space-y-1.5 pt-4 border-t md:col-span-2">
              <Label>Internal Note / Message</Label>
              <Textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={3}
                placeholder="Optional notes about this partner..."
              />
            </div>

            <div className="space-y-1.5 pt-4 border-t md:col-span-2">
              <Label className="font-semibold text-[#1F2937]">
                Initial Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v)}
              >
                <SelectTrigger className="w-[200px]">
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
                </SelectContent>
              </Select>
              <p className="text-xs text-[#6B7280] mt-1">
                Partners marked as "Converted" will immediately appear on the
                public partner page.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-40 bg-[#5B0F26] hover:bg-[#5B0F26]"
          >
            {loading ? "Saving…" : "Create Partner"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
