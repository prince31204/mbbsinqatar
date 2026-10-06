"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Blog = {
  id: string;
  title: string;
  slug: string;
  status: boolean;
  isFeatured: boolean;
  category: { name: string; slug: string } | null;
  createdAt: string;
};

const columns: Column<Blog>[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-[#17202A] text-sm line-clamp-1">
          {row.title}
        </p>
        <p className="text-xs text-[#6B7280]">
          {row.category?.name ?? "Uncategorized"}
        </p>
      </div>
    ),
  },
  {
    key: "slug",
    label: "Slug",
    render: (row) => (
      <span className="text-xs font-mono text-[#6B7280]">/blog/{row.slug}</span>
    ),
  },
  {
    key: "isFeatured",
    label: "Featured",
    render: (row) =>
      row.isFeatured ? (
        <Badge className="bg-red-400 text-[#BC002D]">Featured</Badge>
      ) : null,
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

export default function AdminBlogsPage() {
  const [data, setData] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/blogs?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortDir=${sortDir}`,
    );
    const json = await res.json();
    setData(json.data);
    setTotal(json.total);
    setLoading(false);
  }, [page, pageSize, search, sortBy, sortDir]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (ids: (string | number)[]) => {
    await fetch("/api/admin/bulk/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "blog", ids }),
    });
    toast.success("Deleted successfully.");
    fetchData();
  };

  const handleStatusToggle = async (id: string | number, status: boolean) => {
    await fetch(`/api/admin/blogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  return (
    <DataTable
      title="Blog Posts"
      data={data}
      columns={columns}
      totalCount={total}
      page={page}
      pageSize={pageSize}
      searchQuery={search}
      sortBy={sortBy}
      sortDir={sortDir}
      createHref="/admin/blogs/create"
      createLabel="New Post"
      actions={[
        {
          label: "Edit",
          icon: <Pencil size={13} />,
          href: (row) => `/admin/blogs/${row.id}/edit`,
        },
        {
          label: "View on Site",
          icon: <Eye size={13} />,
          href: (row) => `/blog/${row.category?.slug}/${row.slug}`,
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
      onSortChange={(col, dir) => {
        setSortBy(col);
        setSortDir(dir);
      }}
      onDelete={handleDelete}
      onStatusToggle={handleStatusToggle}
      statusKey="status"
      loading={loading}
    />
  );
}
