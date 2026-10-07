"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  slug: string;
  status: boolean;
  createdAt: string;
};

function makeCategoryPage(
  title: string,
  entityName: string,
  apiPath: string,
  createHref: string,
) {
  const columns: Column<Category>[] = [
    {
      key: "name",
      label: "Category Name",
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

  return function CategoryPage() {
    const [data, setData] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
      setLoading(true);
      const res = await fetch(
        `${apiPath}?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`,
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
        body: JSON.stringify({ model: entityName, ids }),
      });
      toast.success("Deleted.");
      fetchData();
    };

    const handleStatusToggle = async (id: string | number, status: boolean) => {
      await fetch(`${apiPath}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchData();
    };

    return (
      <DataTable
        title={title}
        data={data}
        columns={columns}
        totalCount={total}
        page={page}
        pageSize={pageSize}
        searchQuery={search}
        createHref={createHref}
        createLabel={`Add ${title.replace(" Categories", "").replace("s", "")} Category`}
        actions={[
          {
            label: "Edit",
            icon: <Pencil size={13} />,
            href: (row) => `${createHref.replace("create", "")}${row.id}/edit`,
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
  };
}

export default makeCategoryPage(
  "Blog Categories",
  "blogCategory",
  "/api/admin/blog-categories",
  "/admin/blog-categories/create",
);
