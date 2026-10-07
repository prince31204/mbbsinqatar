"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, TrendingUp } from "lucide-react";

type FmgeRate = {
  id: number;
  year: number;
  appeared: number | null;
  passed: number | null;
  passPercentage: number | null;
  firstAttemptPassRate: number | null;
  rank: number | null;
};

export default function UniversityFmgeRatesPage() {
  const params = useParams();
  const id = params.id as string;
  const [rates, setRates] = useState<FmgeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("University");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    year: new Date().getFullYear().toString(),
    appeared: "",
    passed: "",
    passPercentage: "",
    firstAttemptPassRate: "",
    rank: "",
  });
  const set = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const [rRes, uRes] = await Promise.all([
      fetch(`/api/admin/universities/${id}/fmge-rates`),
      fetch(`/api/admin/universities/${id}`),
    ]);
    if (rRes.ok) setRates(await rRes.json());
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
    if (!form.year) {
      toast.error("Year is required");
      return;
    }
    setSaving(true);
    const url = editId
      ? `/api/admin/universities/${id}/fmge-rates/${editId}`
      : `/api/admin/universities/${id}/fmge-rates`;
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
            <h2 className="text-xl font-bold text-[#1F2937]">FMGE Pass Rates</h2>
            <p className="text-sm text-[#6B7280]">
              Foreign Medical Graduate Examination history
            </p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({
                year: new Date().getFullYear().toString(),
                appeared: "",
                passed: "",
                passPercentage: "",
                firstAttemptPassRate: "",
                rank: "",
              });
            }}
            className="bg-[#5B0F26] hover:bg-[#5B0F26]"
          >
            <Plus size={16} className="mr-2" />
            Add Year
          </Button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-[#1F2937]">
              {editId ? "Edit FMGE Rate" : "Add FMGE Rate"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Year *</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Students Appeared</Label>
                <Input
                  type="number"
                  value={form.appeared}
                  onChange={(e) => set("appeared", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Students Passed</Label>
                <Input
                  type="number"
                  value={form.passed}
                  onChange={(e) => set("passed", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Pass % (Total)</Label>
                <Input
                  type="number"
                  value={form.passPercentage}
                  onChange={(e) => set("passPercentage", e.target.value)}
                  placeholder="82.5"
                />
              </div>
              <div className="space-y-1.5">
                <Label>First Attempt Pass %</Label>
                <Input
                  type="number"
                  value={form.firstAttemptPassRate}
                  onChange={(e) => set("firstAttemptPassRate", e.target.value)}
                  placeholder="76.3"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Rank in Qatar</Label>
                <Input
                  type="number"
                  value={form.rank}
                  onChange={(e) => set("rank", e.target.value)}
                  placeholder="1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#5B0F26] hover:bg-[#5B0F26]"
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
        ) : rates.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-gray-300 rounded-xl">
            <TrendingUp size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No FMGE data added yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAF8F7] text-left text-[#6B7280]">
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Appeared</th>
                  <th className="px-4 py-3 font-medium">Passed</th>
                  <th className="px-4 py-3 font-medium">Pass %</th>
                  <th className="px-4 py-3 font-medium">1st Attempt %</th>
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 hover:bg-[#FAF8F7]"
                  >
                    <td className="px-4 py-3 font-bold text-[#1F2937]">
                      {r.year}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {r.appeared ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {r.passed ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#5B0F26]">
                        {r.passPercentage ? `${r.passPercentage}%` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {r.firstAttemptPassRate
                        ? `${r.firstAttemptPassRate}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {r.rank ? `#${r.rank}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setEditId(r.id);
                            setForm({
                              year: r.year.toString(),
                              appeared: r.appeared?.toString() || "",
                              passed: r.passed?.toString() || "",
                              passPercentage:
                                r.passPercentage?.toString() || "",
                              firstAttemptPassRate:
                                r.firstAttemptPassRate?.toString() || "",
                              rank: r.rank?.toString() || "",
                            });
                            setShowForm(true);
                          }}
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-[#8A1538] hover:bg-[#5B0F26]"
                          onClick={async () => {
                            if (confirm("Delete?")) {
                              await fetch(
                                `/api/admin/universities/${id}/fmge-rates/${r.id}`,
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
