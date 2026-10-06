"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  interestedIn: string | null;
  createdAt: string;
};

const columns: Column<Lead>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-[#17202A] text-sm">{row.name}</p>
        <p className="text-xs text-[#6B7280]">{row.email}</p>
      </div>
    ),
  },
  {
    key: "phone",
    label: "Phone",
    render: (row) => (
      <span className="text-sm text-[#4B5563]">{row.phone ?? "—"}</span>
    ),
  },
  {
    key: "interestedIn",
    label: "Interested In",
    render: (row) => (
      <span className="text-sm text-[#4B5563]">{row.interestedIn ?? "—"}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge
        className={
          row.status === "active"
            ? "bg-red-100 text-[#8F0023]"
            : row.status === "converted"
              ? "bg-[#F9FAFB] text-[#102A43]"
              : "bg-[#F9FAFB] text-[#4B5563]"
        }
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Date",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-[#6B7280]">
        {new Date(row.createdAt).toLocaleDateString("en-IN")}
      </span>
    ),
  },
];

export default function AdminLeadsPage() {
  const [data, setData] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/leads?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`,
    );
    const json = await res.json();
    setData(json.data);
    setTotal(json.total);
    setLoading(false);
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (ids: (string | number)[]) => {
    await fetch("/api/admin/bulk/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "lead", ids }),
    });
    toast.success("Leads deleted.");
    fetchData();
  };

  return (
    <DataTable
      title="Leads (CRM)"
      data={data}
      columns={columns}
      totalCount={total}
      page={page}
      pageSize={pageSize}
      searchQuery={search}
      createHref="/admin/leads/create"
      createLabel="Add Lead"
      actions={[
        {
          label: "View / Edit",
          icon: <Pencil size={13} />,
          href: (row) => `/admin/leads/${row.id}/edit`,
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
      loading={loading}
    />
  );
}
