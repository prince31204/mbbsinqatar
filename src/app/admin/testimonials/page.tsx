"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Testimonial = {
  id: string;
  name: string;
  designation: string | null;
  rating: number | null;
  status: boolean;
  createdAt: string;
};

const columns: Column<Testimonial>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-[#1F2937] text-sm">{row.name}</p>
        <p className="text-xs text-[#6B7280]">{row.designation ?? "—"}</p>
      </div>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    render: (row) => (
      <span className="text-sm">{row.rating ? `⭐ ${row.rating}/5` : "—"}</span>
    ),
  },
  {
    key: "createdAt",
    label: "Added",
    render: (row) => (
      <span className="text-xs text-[#6B7280]">
        {new Date(row.createdAt).toLocaleDateString("en-IN")}
      </span>
    ),
  },
];

export default function AdminTestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/testimonials?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`,
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
      body: JSON.stringify({ model: "testimonial", ids }),
    });
    toast.success("Deleted.");
    fetchData();
  };

  const handleStatusToggle = async (id: string | number, status: boolean) => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  return (
    <DataTable
      title="Testimonials"
      data={data}
      columns={columns}
      totalCount={total}
      page={page}
      pageSize={pageSize}
      searchQuery={search}
      createHref="/admin/testimonials/create"
      createLabel="Add Testimonial"
      actions={[
        {
          label: "Edit",
          icon: <Pencil size={13} />,
          href: (row) => `/admin/testimonials/${row.id}/edit`,
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
