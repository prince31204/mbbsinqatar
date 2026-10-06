"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit2, Check, X, Users } from "lucide-react";
import Link from "next/link";

type Student = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  course: string | null;
  year: string | null;
  country: string | null;
  status: boolean;
};

export default function UniversityStudentsPage() {
  const params = useParams<{ id: string }>();
  const universityId = params.id;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Student>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    year: "",
    country: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/universities/${universityId}/students`);
    if (res.ok) setStudents(await res.json());
    setLoading(false);
  }, [universityId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    setSaving(true);
    const res = await fetch(
      `/api/admin/universities/${universityId}/students`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      },
    );
    if (res.ok) {
      toast.success("Student added");
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        course: "",
        year: "",
        country: "",
      });
      setShowAdd(false);
      load();
    } else {
      toast.error("Failed to add student");
    }
    setSaving(false);
  };

  const handleSaveEdit = async (id: number) => {
    const res = await fetch(
      `/api/admin/universities/${universityId}/students/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      },
    );
    if (res.ok) {
      toast.success("Saved");
      setEditId(null);
      load();
    } else toast.error("Failed");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this student record?")) return;
    const res = await fetch(
      `/api/admin/universities/${universityId}/students/${id}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      toast.success("Deleted");
      load();
    }
  };

  const toggleStatus = async (s: Student) => {
    await fetch(`/api/admin/universities/${universityId}/students/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !s.status }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-[#BC002D]" />
          <div>
            <h1 className="text-2xl font-bold text-[#17202A]">
              Student Records
            </h1>
            <p className="text-sm text-[#6B7280]">{students.length} students</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/universities/${universityId}/edit`}>
              ← University
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-[#102A43] hover:bg-[#102A43]"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={14} className="mr-1" /> Add Student
          </Button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-3">
          <h3 className="font-medium text-[#17202A]">Add New Student</h3>
          <div className="grid grid-cols-3 gap-3">
            <Input
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
            />
            <Input
              placeholder="Phone"
              value={newStudent.phone}
              onChange={(e) =>
                setNewStudent({ ...newStudent, phone: e.target.value })
              }
            />
            <Input
              placeholder="Course (e.g. MBBS)"
              value={newStudent.course}
              onChange={(e) =>
                setNewStudent({ ...newStudent, course: e.target.value })
              }
            />
            <Input
              placeholder="Year (e.g. 2024)"
              value={newStudent.year}
              onChange={(e) =>
                setNewStudent({ ...newStudent, year: e.target.value })
              }
            />
            <Input
              placeholder="Country"
              value={newStudent.country}
              onChange={(e) =>
                setNewStudent({ ...newStudent, country: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={saving}
              className="bg-[#102A43] hover:bg-[#102A43]"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : (
                <Check size={14} className="mr-1" />
              )}{" "}
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No student records yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FFFDF9] text-left text-[#6B7280]">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Course / Year</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-50 hover:bg-[#FFFDF9]"
                >
                  {editId === s.id ? (
                    <>
                      <td className="px-4 py-2">
                        <Input
                          value={editData.name ?? ""}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="h-7 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1">
                          <Input
                            value={editData.course ?? ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                course: e.target.value,
                              })
                            }
                            placeholder="Course"
                            className="h-7 text-xs"
                          />
                          <Input
                            value={editData.year ?? ""}
                            onChange={(e) =>
                              setEditData({ ...editData, year: e.target.value })
                            }
                            placeholder="Year"
                            className="h-7 text-xs w-20"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          value={editData.country ?? ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              country: e.target.value,
                            })
                          }
                          className="h-7 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          value={editData.email ?? ""}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          className="h-7 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">—</td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-[#8F0023]"
                            onClick={() => handleSaveEdit(s.id)}
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => setEditId(null)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-[#17202A]">
                        {s.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#4B5563]">
                        {s.course || "—"} {s.year ? `· ${s.year}` : ""}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {s.country || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] text-xs">
                        {s.email || s.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Switch
                          checked={s.status}
                          onCheckedChange={() => toggleStatus(s)}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setEditId(s.id);
                              setEditData({
                                name: s.name ?? "",
                                course: s.course ?? "",
                                year: s.year ?? "",
                                country: s.country ?? "",
                                email: s.email ?? "",
                              });
                            }}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-[#BC002D] hover:bg-[#102A43]"
                            onClick={() => handleDelete(s.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
