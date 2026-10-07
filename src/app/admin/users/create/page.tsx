"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ROLES = ["admin", "employee"] as const;

export default function UserCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    role: "employee" as "admin" | "employee",
    status: true,
  });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.password || form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone || undefined,
          designation: form.designation || undefined,
          role: form.role,
          status: form.status,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("User created");
      router.push("/admin/users");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6">Add User</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label>Full Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+996…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Password *</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Min 6 characters"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Designation</Label>
            <Input
              value={form.designation}
              onChange={(e) => set("designation", e.target.value)}
              placeholder="e.g. Content Manager"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => set("role", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Label>Active</Label>
            <Switch
              checked={form.status}
              onCheckedChange={(v) => set("status", v)}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#5B0F26] hover:bg-[#5B0F26]"
          >
            {loading ? "Creating…" : "Create User"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
