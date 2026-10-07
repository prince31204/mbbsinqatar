"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  MoreHorizontal,
  Trash2,
  Download,
  Upload,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { StatusToggle } from "./StatusToggle";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export type DataTableAction<T> = {
  label: string;
  icon?: React.ReactNode;
  href?: (row: T) => string;
  onClick?: (row: T) => void;
  variant?: "default" | "destructive";
};

type DataTableProps<T extends { id: string | number }> = {
  title: string;
  data: T[];
  columns: Column<T>[];
  totalCount: number;
  page: number;
  pageSize: number;
  searchQuery?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  createHref?: string;
  createLabel?: string;
  actions?: DataTableAction<T>[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (q: string) => void;
  onSortChange?: (col: string, dir: "asc" | "desc") => void;
  onDelete?: (ids: (string | number)[]) => Promise<void>;
  onStatusToggle?: (id: string | number, status: boolean) => Promise<void>;
  statusKey?: keyof T;
  loading?: boolean;
  importHref?: string;
  exportHref?: string;
  extraHeaderActions?: React.ReactNode;
};

export function DataTable<T extends { id: string | number }>({
  title,
  data,
  columns,
  totalCount,
  page,
  pageSize,
  searchQuery = "",
  sortBy,
  sortDir = "asc",
  createHref,
  createLabel = "Add New",
  actions = [],
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortChange,
  onDelete,
  onStatusToggle,
  statusKey,
  loading,
  importHref,
  exportHref,
  extraHeaderActions,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<(string | number)[] | null>(
    null,
  );
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const totalPages = Math.ceil(totalCount / pageSize);
  const currentIds = useMemo(() => new Set(data.map((r) => r.id)), [data]);
  const selectedVisible = useMemo(
    () => selected.filter((id) => currentIds.has(id)),
    [selected, currentIds],
  );
  const deleteTargetVisible = useMemo(() => {
    if (!deleteTarget) return null;
    const next = deleteTarget.filter((id) => currentIds.has(id));
    return next.length > 0 ? next : null;
  }, [deleteTarget, currentIds]);

  const toggleSelect = (id: string | number) => {
    setSelected((prev) => {
      const validPrev = prev.filter((x) => currentIds.has(x));
      return validPrev.includes(id)
        ? validPrev.filter((x) => x !== id)
        : [...validPrev, id];
    });
  };

  const toggleAll = () => {
    setSelected((prev) => {
      const validPrev = prev.filter((id) => currentIds.has(id));
      return validPrev.length === data.length ? [] : data.map((r) => r.id);
    });
  };

  const handleSort = (col: string) => {
    if (!onSortChange) return;
    if (sortBy === col) {
      onSortChange(col, sortDir === "asc" ? "desc" : "asc");
    } else {
      onSortChange(col, "asc");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete || !deleteTargetVisible) return;
    await onDelete(deleteTargetVisible);
    setDeleteTarget(null);
    setSelected([]);
  };

  const getCellValue = (row: T, key: keyof T | string) => {
    return (row as Record<string, unknown>)[key as string];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1F2937]">{title}</h1>
        <div className="flex items-center gap-2">
          {extraHeaderActions}
          {importHref && (
            <Button variant="outline" size="sm" asChild>
              <Link href={importHref}>
                <Upload size={14} className="mr-1.5" />
                Import
              </Link>
            </Button>
          )}
          {exportHref && (
            <Button variant="outline" size="sm" asChild>
              <Link href={exportHref}>
                <Download size={14} className="mr-1.5" />
                Export
              </Link>
            </Button>
          )}
          {createHref && (
            <Button size="sm" className="bg-[#5B0F26] hover:bg-[#5B0F26]" asChild>
              <Link href={createHref}>
                <Plus size={14} className="mr-1.5" />
                {createLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
          {/* Search */}
          <div className="relative w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <Input
              placeholder="Search..."
              className="pl-9 h-9 text-sm"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchChange(localSearch);
              }}
            />
          </div>

          {/* Bulk actions */}
          {selectedVisible.length > 0 && onDelete && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6B7280]">
                {selectedVisible.length} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteTarget(selectedVisible)}
              >
                <Trash2 size={13} className="mr-1.5" /> Delete Selected
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAF8F7]/60">
                {onDelete && (
                  <TableHead className="w-10">
                    <Checkbox
                      checked={
                        selectedVisible.length === data.length &&
                        data.length > 0
                      }
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                )}
                {columns.map((col) => (
                  <TableHead
                    key={String(col.key)}
                    className={cn(
                      "text-xs font-semibold text-[#4B5563] uppercase tracking-wider",
                      col.className,
                    )}
                  >
                    {col.sortable ? (
                      <button
                        className="flex items-center gap-1 hover:text-[#1F2937]"
                        suppressHydrationWarning
                        onClick={() => handleSort(String(col.key))}
                      >
                        {col.label}
                        {sortBy === String(col.key) ? (
                          sortDir === "asc" ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          )
                        ) : (
                          <ChevronUp size={12} className="text-[#4B5563]" />
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </TableHead>
                ))}
                {(actions.length > 0 || onStatusToggle || onDelete) && (
                  <TableHead className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider text-right">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (onDelete ? 1 : 0) + 1}
                    className="text-center py-16 text-[#6B7280]"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (onDelete ? 1 : 0) + 1}
                    className="text-center py-16 text-[#6B7280]"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} className="hover:bg-[#FAF8F7]/50">
                    {onDelete && (
                      <TableCell>
                        <Checkbox
                          checked={selectedVisible.includes(row.id)}
                          onCheckedChange={() => toggleSelect(row.id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={cn("text-sm", col.className)}
                      >
                        {col.render
                          ? col.render(row)
                          : String(getCellValue(row, col.key) ?? "-")}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {statusKey && onStatusToggle && (
                          <StatusToggle
                            id={row.id}
                            status={!!getCellValue(row, statusKey as string)}
                            onToggle={onStatusToggle}
                          />
                        )}
                        {actions.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {actions.map((action, i) =>
                                action.href ? (
                                  <DropdownMenuItem key={i} asChild>
                                    <Link href={action.href(row)}>
                                      {action.icon && (
                                        <span className="mr-2">
                                          {action.icon}
                                        </span>
                                      )}
                                      {action.label}
                                    </Link>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    key={i}
                                    onClick={() => {
                                      if (action.variant === "destructive") {
                                        setDeleteTarget([row.id]);
                                      } else {
                                        action.onClick?.(row);
                                      }
                                    }}
                                    className={
                                      action.variant === "destructive"
                                        ? "text-[#8A1538]"
                                        : ""
                                    }
                                  >
                                    {action.icon && (
                                      <span className="mr-2">
                                        {action.icon}
                                      </span>
                                    )}
                                    {action.label}
                                  </DropdownMenuItem>
                                ),
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#6B7280]">
              Showing {Math.min((page - 1) * pageSize + 1, totalCount)}–
              {Math.min(page * pageSize, totalCount)} of {totalCount}
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
            >
              <ChevronsLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-sm text-[#4B5563] px-2">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight size={14} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
            >
              <ChevronsRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete confirm */}
      <DeleteConfirmDialog
        open={!!deleteTargetVisible}
        count={deleteTargetVisible?.length ?? 0}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
