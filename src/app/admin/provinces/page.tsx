"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Province = {
  id: string;
  name: string;
  slug: string;
  status: boolean;
  createdAt: string;
};

const columns: Column<Province>[] = [
  {
    key: "name",
    label: "Province Name",
    sortable: true,
    render: (row) => (
      <span className="font-medium text-[#1F2937]">{row.name}</span>
    ),
  },
  {
    key: "slug",
    label: "Slug",
    render: (row) => (
      <span className="text-xs font-mono text-[#6B7280]">{row.slug}</span>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    render: (row) => (
      <span className="text-xs text-[#6B7280]">
        {new Date(row.createdAt).toLocaleDateString("en-IN")}
      </span>
    ),
  },
];

export default function AdminProvincesPage() {
  const [data, setData] = useState<Province[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/provinces?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`,
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
      body: JSON.stringify({ model: "province", ids }),
    });
    toast.success("Deleted.");
    fetchData();
  };

  const handleStatusToggle = async (id: string | number, status: boolean) => {
    await fetch(`/api/admin/provinces/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  return (
    <DataTable
      title="Provinces"
      data={data}
      columns={columns}
      totalCount={total}
      page={page}
      pageSize={pageSize}
      searchQuery={search}
      createHref="/admin/provinces/create"
      createLabel="Add Province"
      actions={[
        {
          label: "Edit",
          icon: <Pencil size={13} />,
          href: (row) => `/admin/provinces/${row.id}/edit`,
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
      statusKey="status"
      loading={loading}
    />
  );
}
