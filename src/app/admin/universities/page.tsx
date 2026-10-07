"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Eye,
  Trash2,
  Settings,
  FileDown,
  FileUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRef } from "react";

type University = {
  id: string;
  name: string;
  slug: string;
  city: string;
  rating: number | null;
  tuitionFee: string | null;
  status: boolean;
  isFeatured: boolean;
  nmcApproved: boolean;
  instituteType: { name: string } | null;
};

const columns: Column<University>[] = [
  {
    key: "name",
    label: "University",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-[#1F2937] text-sm">{row.name}</p>
        <p className="text-xs text-[#6B7280]">{row.city}</p>
      </div>
    ),
  },
  {
    key: "instituteType",
    label: "Type",
    render: (row) => (
      <span className="text-xs text-[#6B7280]">
        {row.instituteType?.name ?? "—"}
      </span>
    ),
  },
  {
    key: "tuitionFee",
    label: "Fee/yr",
    render: (row) => (
      <span className="text-sm text-[#4B5563]">
        {row.tuitionFee ? String(row.tuitionFee) : "—"}
      </span>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    render: (row) => (
      <span className="text-sm text-[#4B5563]">
        {row.rating ? `⭐ ${row.rating}` : "—"}
      </span>
    ),
  },
  {
    key: "nmcApproved",
    label: "NMC",
    render: (row) => (
      <Badge
        variant={row.nmcApproved ? "default" : "secondary"}
        className={row.nmcApproved ? "bg-[#F7E9EE] text-[#5B0F26]" : ""}
      >
        {row.nmcApproved ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    key: "isFeatured",
    label: "Featured",
    render: (row) => (
      <Badge
        variant={row.isFeatured ? "default" : "outline"}
        className={row.isFeatured ? "bg-[#8A1538] text-[#8A1538]" : ""}
      >
        {row.isFeatured ? "Yes" : "No"}
      </Badge>
    ),
  },
];

export default function AdminUniversitiesPage() {
  const [data, setData] = useState<University[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading and processing ZIP...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/universities/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      toast.success(
        `Bulk upload complete! ${json.success} processed, ${json.failed} failed.`,
        { id: toastId, duration: 5000 },
      );
      if (json.errors?.length > 0) {
        console.group("Bulk Upload Errors");
        json.errors.forEach((err: string) => console.warn(err));
        console.groupEnd();
      }
      fetchData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process bulk upload.",
        { id: toastId },
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/universities?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortDir=${sortDir}`,
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Failed to load universities.");
      }
      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
    } catch (err) {
      setData([]);
      setTotal(0);
      toast.error(
        err instanceof Error ? err.message : "Failed to load universities.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortDir]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (ids: (string | number)[]) => {
    await fetch("/api/admin/bulk/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "university", ids }),
    });
    fetchData();
  };

  const handleStatusToggle = async (id: string | number, status: boolean) => {
    await fetch(`/api/admin/universities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  return (
    <DataTable
      title="Universities"
      data={data}
      columns={columns}
      totalCount={total}
      page={page}
      pageSize={pageSize}
      searchQuery={search}
      sortBy={sortBy}
      sortDir={sortDir}
      createHref="/admin/universities/create"
      createLabel="Add University"
      extraHeaderActions={
        <div className="flex items-center bg-white h-10 p-1 px-2 rounded-lg border border-[#E5E7EB] shadow-sm gap-3">
          <div className="flex items-center gap-2 px-2 border-r border-[#E5E7EB]">
            <div className="w-2 h-2 rounded-full bg-[#5B0F26] animate-pulse" />
            <span className="text-xs font-bold text-[#4B5563] uppercase tracking-tight">
              Bulk Actions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-[#E5E7EB] text-[#4B5563] hover:text-[#5B0F26] hover:border-[#E5E7EB] hover:bg-[#5B0F26] text-xs font-bold shadow-xs bg-white"
              asChild
            >
              <a href="/api/admin/universities/bulk-template" download>
                <FileDown size={14} className="mr-1.5 text-[#8A1538]" />
                Template
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-8 border-[#E5E7EB] text-[#8A1538] hover:bg-[#5B0F26] hover:text-[#1F2937] transition-all text-xs font-bold"
            >
              {isUploading ? (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              ) : (
                <FileUp size={14} className="mr-1.5" />
              )}
              {isUploading ? "Uploading..." : "Upload ZIP"}
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept=".zip"
            className="hidden"
          />
        </div>
      }
      actions={[
        {
          label: "Edit",
          icon: <Pencil size={13} />,
          href: (row) => `/admin/universities/${row.id}/edit`,
        },
        {
          label: "Manage Sub-sections",
          icon: <Settings size={13} />,
          href: (row) => `/admin/universities/${row.id}/programs`,
        },
        {
          label: "View on Site",
          icon: <Eye size={13} />,
          href: (row) => `/universities/${row.slug}`,
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
