"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Search, Hospital } from "lucide-react";
import Link from "next/link";

type Hospital = {
  id: number;
  name: string;
  city: string | null;
  state: string | null;
  beds: number | null;
  status: boolean;
};

export default function HospitalsPage() {
  const [items, setItems] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/hospitals?search=${encodeURIComponent(search)}`,
    );
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this hospital?")) return;
    const res = await fetch(`/api/admin/hospitals/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    } else toast.error("Cannot delete — it may be linked to universities");
  };

  const handleStatusToggle = async (item: Hospital) => {
    await fetch(`/api/admin/hospitals/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, status: !item.status }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hospital size={22} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Hospitals</h1>
            <p className="text-sm text-[#6B7280]">
              {items.length} hospital{items.length !== 1 ? "s" : ""} registered
            </p>
          </div>
        </div>
        <Button asChild className="bg-[#5B0F26] hover:bg-[#5B0F26]">
          <Link href="/admin/hospitals/create">
            <Plus size={16} className="mr-2" />
            Add Hospital
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />
        <Input
          placeholder="Search hospitals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Hospital size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No hospitals found.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/admin/hospitals/create">
                <Plus size={14} className="mr-1" />
                Add First Hospital
              </Link>
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAF8F7] text-left text-[#6B7280]">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Beds</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-[#FAF8F7]"
                >
                  <td className="px-4 py-3 font-medium text-[#1F2937]">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {[item.city, item.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {item.beds ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={item.status}
                      onCheckedChange={() => handleStatusToggle(item)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        asChild
                      >
                        <Link href={`/admin/hospitals/${item.id}/edit`}>
                          <Edit2 size={14} />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#8A1538] hover:bg-[#5B0F26] hover:text-white"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
