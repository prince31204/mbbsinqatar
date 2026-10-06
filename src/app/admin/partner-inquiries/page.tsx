"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type PartnerInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  city: string | null;
  partnerType: string | null;
  status: string;
  createdAt: string;
};

const columns: Column<PartnerInquiry>[] = [
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
    key: "company",
    label: "Company",
    render: (row) => (
      <span className="text-sm text-[#4B5563]">{row.company ?? "—"}</span>
    ),
  },
  {
    key: "city",
    label: "City",
    render: (row) => (
      <span className="text-sm text-[#4B5563]">{row.city ?? "—"}</span>
    ),
  },
  {
    key: "partnerType",
    label: "Type",
    render: (row) => (
      <span className="text-sm text-[#4B5563]">{row.partnerType ?? "—"}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge
        className={
          row.status === "pending"
            ? "bg-red-400 text-[#BC002D]"
            : row.status === "contacted"
              ? "bg-[#F9FAFB] text-[#102A43]"
              : row.status === "converted"
                ? "bg-red-100 text-[#8F0023]"
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

export default function AdminPartnerInquiriesPage() {
  const [data, setData] = useState<PartnerInquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/partner-inquiries?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`,
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
      body: JSON.stringify({ model: "partnerInquiry", ids }),
    });
    toast.success("Partner inquiries deleted.");
    fetchData();
  };

  return (
    <DataTable
      title="Partner Inquiries"
      data={data}
      columns={columns}
      totalCount={total}
      page={page}
      pageSize={pageSize}
      searchQuery={search}
      createHref="/admin/partner-inquiries/create"
      createLabel="Add Partner"
      actions={[
        {
          label: "View / Edit",
          icon: <Pencil size={13} />,
          href: (row) => `/admin/partner-inquiries/${row.id}/edit`,
        },
        {
          label: "Delete",
          icon: <Trash2 size={13} />,
          variant: "destructive" as const,
          onClick: (row) => handleDelete([row.id]),
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
