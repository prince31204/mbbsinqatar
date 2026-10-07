"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ROLES = ["admin", "employee"] as const;

export default function UserEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    role: "employee" as "admin" | "employee",
    status: true,
  });

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((d) =>
        setForm({
          name: d.name ?? "",
          email: d.email ?? "",
          password: "",
          phone: d.phone ?? "",
          designation: d.designation ?? "",
          role: d.role ?? "employee",
          status: d.status ?? true,
        }),
      )
      .catch(() => toast.error("Failed to load user"))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password && form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone,
        designation: form.designation,
        role: form.role,
        status: form.status,
      };
      if (form.password) body.password = form.password;
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast.success("User updated");
      router.push("/admin/users");
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
        <Skeleton className="h-72 w-full" />
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#1F2937] mb-6">Edit User</h1>
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
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>
              New Password{" "}
              <span className="text-[#6B7280] font-normal text-xs">
                (leave blank to keep current)
              </span>
            </Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Designation</Label>
            <Input
              value={form.designation}
              onChange={(e) => set("designation", e.target.value)}
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
            {loading ? "Saving…" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
