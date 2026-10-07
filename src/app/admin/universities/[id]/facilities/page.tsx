"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { toast } from "sonner";
import { Loader2, Trash2, Wrench, Link2, Save } from "lucide-react";

type LinkedFacility = {
  id: number;
  facilityId: number;
  description: string | null;
  facility: { id: number; name: string };
};
type Facility = { id: number; name: string };

export default function UniversityFacilitiesPage() {
  const params = useParams();
  const id = params.id as string;
  const [linked, setLinked] = useState<LinkedFacility[]>([]);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("University");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [lRes, aRes, uRes] = await Promise.all([
      fetch(`/api/admin/universities/${id}/facilities`),
      fetch(`/api/admin/facilities`),
      fetch(`/api/admin/universities/${id}`),
    ]);
    if (lRes.ok) setLinked(await lRes.json());
    if (aRes.ok) setAllFacilities(await aRes.json());
    if (uRes.ok) {
      const u = await uRes.json();
      setUniversityName(u.name || "University");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const linkedIds = linked.map((l) => l.facilityId);
  const available = allFacilities.filter((f) => !linkedIds.includes(f.id));

  const handleLink = async () => {
    if (!selectedFacility) {
      toast.error("Please select a facility");
      return;
    }
    setAdding(true);
    const res = await fetch(`/api/admin/universities/${id}/facilities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        facilityId: parseInt(selectedFacility),
        description: newDescription,
      }),
    });
    if (res.ok) {
      toast.success("Facility linked!");
      setSelectedFacility("");
      setNewDescription("");
      load();
    } else toast.error("Failed");
    setAdding(false);
  };

  const handleUpdateDescription = async (facilityId: number) => {
    setSaving(true);
    const res = await fetch(
      `/api/admin/universities/${id}/facilities/${facilityId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: editValue }),
      },
    );
    if (res.ok) {
      toast.success("Description updated!");
      setEditingId(null);
      load();
    } else toast.error("Update failed");
    setSaving(false);
  };

  const handleUnlink = async (facilityId: number) => {
    if (!confirm("Remove this facility?")) return;
    const res = await fetch(
      `/api/admin/universities/${id}/facilities/${facilityId}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      toast.success("Unlinked!");
      load();
    } else toast.error("Failed");
  };

  return (
    <div>
      <UniversitySubNav universityId={id} universityName={universityName} />
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Facilities</h2>
          <p className="text-sm text-[#6B7280]">
            {linked.length} facilit{linked.length !== 1 ? "ies" : "y"} linked
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <Label className="text-sm font-medium text-[#4B5563]">
                Link a facility to this university
              </Label>
              <Select
                value={selectedFacility}
                onValueChange={setSelectedFacility}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select facility..." />
                </SelectTrigger>
                <SelectContent>
                  {available.length === 0 ? (
                    <SelectItem value="none" disabled>
                      All facilities already linked
                    </SelectItem>
                  ) : (
                    available.map((f) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleLink}
              disabled={adding || !selectedFacility}
              className="bg-[#5B0F26] hover:bg-[#5B0F26] shrink-0"
            >
              {adding ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : (
                <Link2 size={14} className="mr-2" />
              )}
              Link
            </Button>
          </div>
          {selectedFacility && (
            <div className="space-y-1.5 pt-2 border-t border-[#E5E7EB]">
              <Label className="text-xs text-[#6B7280]">
                Facility Description (Optional)
              </Label>
              <Input
                placeholder="e.g. 24/7 library access with 50,000+ books"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : linked.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-gray-300 rounded-xl">
            <Wrench size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No facilities linked yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {linked.map((l) => (
              <div
                key={l.id}
                className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow group relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F2937]">
                    {l.facility.name}
                  </span>
                  <button
                    onClick={() => handleUnlink(l.facilityId)}
                    className="text-[#6B7280] hover:text-[#5B0F26] transition-colors"
                    title="Unlink"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {editingId === l.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="text-xs h-8"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-7 text-[10px] px-2"
                        onClick={() => handleUpdateDescription(l.facilityId)}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 size={10} className="animate-spin mr-1" />
                        ) : (
                          <Save size={10} className="mr-1" />
                        )}
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] px-2"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer hover:bg-[#FAF8F7] p-2 rounded -m-2 transition-colors"
                    onClick={() => {
                      setEditingId(l.id);
                      setEditValue(l.description || "");
                    }}
                  >
                    <p className="text-sm text-[#4B5563] italic">
                      {l.description || "No description. Click to add one..."}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
