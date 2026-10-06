"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Calendar } from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Intake = {
  id: number;
  intakeMonth: string;
  intakeYear: number;
  applicationStart: string | null;
  applicationDeadline: string | null;
  classesStart: string | null;
  seats: number | null;
  statusText: string | null;
  isActive: boolean;
};

export default function UniversityIntakesPage() {
  const params = useParams();
  const id = params.id as string;
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("University");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    intakeMonth: "September",
    intakeYear: new Date().getFullYear().toString(),
    applicationStart: "",
    applicationDeadline: "",
    classesStart: "",
    seats: "",
    statusText: "",
    isActive: true,
  });
  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const [iRes, uRes] = await Promise.all([
      fetch(`/api/admin/universities/${id}/intakes`),
      fetch(`/api/admin/universities/${id}`),
    ]);
    if (iRes.ok) setIntakes(await iRes.json());
    if (uRes.ok) {
      const u = await uRes.json();
      setUniversityName(u.name || "University");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!form.intakeMonth || !form.intakeYear) {
      toast.error("Month and year required");
      return;
    }
    setSaving(true);
    const url = editId
      ? `/api/admin/universities/${id}/intakes/${editId}`
      : `/api/admin/universities/${id}/intakes`;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(editId ? "Updated!" : "Added!");
      setShowForm(false);
      setEditId(null);
      load();
    } else toast.error("Failed");
    setSaving(false);
  };

  return (
    <div>
      <UniversitySubNav universityId={id} universityName={universityName} />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#17202A]">Intake Schedule</h2>
            <p className="text-sm text-[#6B7280]">
              Admission intake windows for this university
            </p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({
                intakeMonth: "September",
                intakeYear: new Date().getFullYear().toString(),
                applicationStart: "",
                applicationDeadline: "",
                classesStart: "",
                seats: "",
                statusText: "",
                isActive: true,
              });
            }}
            className="bg-[#102A43] hover:bg-[#102A43]"
          >
            <Plus size={16} className="mr-2" />
            Add Intake
          </Button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-[#17202A]">
              {editId ? "Edit Intake" : "Add Intake"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Month *</Label>
                <Select
                  value={form.intakeMonth}
                  onValueChange={(v) => set("intakeMonth", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Year *</Label>
                <Input
                  type="number"
                  value={form.intakeYear}
                  onChange={(e) => set("intakeYear", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Application Opens</Label>
                <Input
                  type="date"
                  value={form.applicationStart}
                  onChange={(e) => set("applicationStart", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Application Deadline</Label>
                <Input
                  type="date"
                  value={form.applicationDeadline}
                  onChange={(e) => set("applicationDeadline", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Classes Start</Label>
                <Input
                  type="date"
                  value={form.classesStart}
                  onChange={(e) => set("classesStart", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Available Seats</Label>
                <Input
                  type="number"
                  value={form.seats}
                  onChange={(e) => set("seats", e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Status Text</Label>
                <Input
                  value={form.statusText}
                  onChange={(e) => set("statusText", e.target.value)}
                  placeholder="e.g. Open, Limited Seats, Closed"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => set("isActive", v)}
              />
              <Label>Active</Label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#102A43] hover:bg-[#102A43]"
              >
                {saving ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : null}
                {editId ? "Save" : "Add"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : intakes.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-gray-300 rounded-xl">
            <Calendar size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No intakes configured yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FFFDF9] text-left text-[#6B7280]">
                  <th className="px-4 py-3 font-medium">Intake</th>
                  <th className="px-4 py-3 font-medium">Application Period</th>
                  <th className="px-4 py-3 font-medium">Classes Start</th>
                  <th className="px-4 py-3 font-medium">Seats</th>
                  <th className="px-4 py-3 font-medium text-center">Active</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {intakes.map((i) => (
                  <tr
                    key={i.id}
                    className="border-b border-gray-50 hover:bg-[#FFFDF9]"
                  >
                    <td className="px-4 py-3 font-semibold text-[#17202A]">
                      {i.intakeMonth} {i.intakeYear}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs">
                      {i.applicationDeadline
                        ? `Due: ${new Date(i.applicationDeadline).toLocaleDateString()}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] text-xs">
                      {i.classesStart
                        ? new Date(i.classesStart).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {i.seats ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={i.isActive}
                        onCheckedChange={async () => {
                          await fetch(
                            `/api/admin/universities/${id}/intakes/${i.id}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ isActive: !i.isActive }),
                            },
                          );
                          load();
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setEditId(i.id);
                            setForm({
                              intakeMonth: i.intakeMonth,
                              intakeYear: i.intakeYear.toString(),
                              applicationStart:
                                i.applicationStart?.split("T")[0] || "",
                              applicationDeadline:
                                i.applicationDeadline?.split("T")[0] || "",
                              classesStart: i.classesStart?.split("T")[0] || "",
                              seats: i.seats?.toString() || "",
                              statusText: i.statusText || "",
                              isActive: i.isActive,
                            });
                            setShowForm(true);
                          }}
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-[#BC002D] hover:bg-[#102A43]"
                          onClick={async () => {
                            if (confirm("Delete?")) {
                              await fetch(
                                `/api/admin/universities/${id}/intakes/${i.id}`,
                                { method: "DELETE" },
                              );
                              load();
                            }
                          }}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
