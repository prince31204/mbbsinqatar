"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Scholarship = {
  id: string;
  title: string;
  type: string;
  isActive: boolean;
  deadline: string | null;
  university: { name: string } | null;
  createdAt: string;
};

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const columns: Column<Scholarship>[] = [
  {
    key: "title",
    label: "Scholarship",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-[#1F2937] text-sm">{row.title}</p>
        <p className="text-xs text-[#6B7280]">
          {row.university?.name ?? "General"}
        </p>
      </div>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (row) => <Badge variant="outline">{row.type}</Badge>,
  },
  {
    key: "deadline",
    label: "Deadline",
    render: (row) => (
      <span className="text-sm text-[#4B5563]">
        {row.deadline
          ? new Date(row.deadline).toLocaleDateString("en-IN")
          : "—"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-[#6B7280]">
        {new Date(row.createdAt).toLocaleDateString("en-IN")}
      </span>
    ),
  },
];

export default function AdminScholarshipsPage() {
  const [data, setData] = useState<Scholarship[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSectionVisible, setIsSectionVisible] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/scholarships?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`,
    );
    const json = await res.json();
    setData(json.data);
    setTotal(json.total);
    setLoading(false);
  }, [page, pageSize, search]);

  const fetchVisibility = useCallback(async () => {
    const res = await fetch("/api/admin/settings/scholarship-visibility");
    const json = await res.json();
    setIsSectionVisible(json.visible);
  }, []);

  useEffect(() => {
    fetchData();
    fetchVisibility();
  }, [fetchData, fetchVisibility]);

  const handleVisibilityToggle = async (checked: boolean) => {
    setIsSectionVisible(checked);
    try {
      const res = await fetch("/api/admin/settings/scholarship-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: checked }),
      });
      if (res.ok) {
        toast.success(
          `Scholarship section is now ${checked ? "visible" : "hidden"} on public site.`,
        );
      } else {
        toast.error("Failed to update visibility.");
        setIsSectionVisible(!checked);
      }
    } catch (error) {
      toast.error("An error occurred.");
      setIsSectionVisible(!checked);
    }
  };

  const handleDelete = async (ids: (string | number)[]) => {
    await fetch("/api/admin/bulk/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "scholarship", ids }),
    });
    toast.success("Deleted.");
    fetchData();
  };

  const handleStatusToggle = async (id: string | number, status: boolean) => {
    await fetch(`/api/admin/scholarships/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: status }),
    });
    fetchData();
  };

  return (
    <DataTable
      title="Scholarships"
      data={data}
      columns={columns}
      totalCount={total}
      page={page}
      pageSize={pageSize}
      searchQuery={search}
      createHref="/admin/scholarships/create"
      createLabel="Add Scholarship"
      extraHeaderActions={
        <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] px-3 h-9 rounded-lg shadow-sm mr-2">
          <div className="flex flex-col justify-center">
            <Label
              htmlFor="scholarship-visibility"
              className="text-sm uppercase tracking-wider text-[#6B7280] font-semibold leading-none mb-1"
            >
              Public Visibility
            </Label>
          </div>
          <Switch
            id="scholarship-visibility"
            checked={isSectionVisible}
            onCheckedChange={handleVisibilityToggle}
            className="scale-75 data-[state=checked]:bg-[#5B0F26]"
          />
        </div>
      }
      actions={[
        {
          label: "Edit",
          icon: <Pencil size={13} />,
          href: (row) => `/admin/scholarships/${row.id}/edit`,
        },
        {
          label: "Delete",
          icon: <Trash2 size={13} />,
          variant: "destructive" as const,
          onClick: () => {},
        },
      ]}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      onSearchChange={setSearch}
      onDelete={handleDelete}
      onStatusToggle={handleStatusToggle}
      statusKey="isActive"
      loading={loading}
    />
  );
}
