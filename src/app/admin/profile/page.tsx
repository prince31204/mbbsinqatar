"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save, KeyRound, User } from "lucide-react";

type Profile = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  description: string | null;
  photoPath: string | null;
  role: string;
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setDesignation(data.designation || "");
        setDescription(data.description || "");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, designation, description }),
    });
    if (res.ok) {
      toast.success("Profile updated!");
    } else {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setChangingPassword(true);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(data.error || "Failed to change password");
    }
    setChangingPassword(false);
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 size={24} className="animate-spin mx-auto text-[#6B7280]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <User size={22} className="text-[#BC002D]" />
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">My Profile</h1>
          <p className="text-sm text-[#6B7280]">
            {profile?.email} · {profile?.role}
          </p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        <h2 className="font-semibold text-[#17202A] border-b pb-2">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+996 xxx xxx xxx"
            />
          </div>
          <div className="space-y-1">
            <Label>Designation</Label>
            <Input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Content Manager"
            />
          </div>
          <div className="space-y-1 col-span-2">
            <Label>Bio / Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43]/500"
              placeholder="Brief bio..."
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#102A43] hover:bg-[#102A43]"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : (
            <Save size={16} className="mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4">
        <h2 className="font-semibold text-[#17202A] border-b pb-2 flex items-center gap-2">
          <KeyRound size={16} /> Change Password
        </h2>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
              />
            </div>
            <div className="space-y-1">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handlePasswordChange}
          disabled={changingPassword}
          variant="outline"
        >
          {changingPassword ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : (
            <KeyRound size={16} className="mr-2" />
          )}
          Update Password
        </Button>
      </div>
    </div>
  );
}
