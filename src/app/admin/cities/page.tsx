"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type City = {
  id: string;
  name: string;
  slug: string;
  status: boolean;
  province: { name: string } | null;
  createdAt: string;
};

const columns: Column<City>[] = [
  {
    key: "name",
    label: "City Name",
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
    key: "province",
    label: "Province",
    render: (row) => (
      <span className="text-sm text-[#4B5563]">{row.province?.name ?? "—"}</span>
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

export default function AdminCitiesPage() {
  const [data, setData] = useState<City[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/cities?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`,
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
      body: JSON.stringify({ model: "city", ids }),
    });
    toast.success("Deleted.");
    fetchData();
  };

  return (
    <DataTable
      title="Cities"
      data={data}
      columns={columns}
      totalCount={total}
      page={page}
      pageSize={pageSize}
      searchQuery={search}
      createHref="/admin/cities/create"
      createLabel="Add City"
      actions={[
        {
          label: "Edit",
          icon: <Pencil size={13} />,
          href: (row) => `/admin/cities/${row.id}/edit`,
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
      statusKey="status"
      loading={loading}
    />
  );
}
