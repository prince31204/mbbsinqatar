"use client";

import { useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronUp,
  ChevronDown,
  Calendar,
  Filter,
} from "lucide-react";

interface FmgeRow {
  universityName: string;
  slug: string;
  year: number;
  appeared: number | null; // = Total Applications
  passed: number | null; // = Accepted Students
  passPercentage: number | null; // = Acceptance Rate
}

interface Props {
  data: FmgeRow[];
}

type SortField =
  "universityName" | "year" | "appeared" | "passed" | "passPercentage";
type SortDir = "asc" | "desc";

function getRateColor(rate: number | null) {
  if (!rate) return "text-[#6B7280] bg-[#FAF8F7]";
  if (rate >= 30) return "text-[#5B0F26] bg-[#F7E9EE]";
  if (rate >= 15) return "text-[#8A1538] bg-white";
  if (rate > 0) return "text-orange-600 bg-orange-50";
  return "text-[#8A1538] bg-white";
}

export default function FmgeRatesTable({ data }: Props) {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [universityFilter, setUniversityFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("appeared");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const years = useMemo(
    () => [...new Set(data.map((r) => r.year.toString()))].sort().reverse(),
    [data],
  );
  const availableUniversities = useMemo(
    () => [...new Set(data.map((r) => r.universityName))].sort(),
    [data],
  );

  const filtered = useMemo(() => {
    let rows = data.filter((r) => {
      const matchSearch = r.universityName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchYear =
        yearFilter === "all" || r.year.toString() === yearFilter;
      const matchUni =
        universityFilter === "all" || r.universityName === universityFilter;
      return matchSearch && matchYear && matchUni;
    });
    rows = [...rows].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return rows;
  }, [data, search, yearFilter, universityFilter, sortField, sortDir]);

  // Summary stats matching old React Newanup.tsx
  const totalApplications = filtered.reduce((s, r) => s + (r.appeared ?? 0), 0);
  const totalAccepted = filtered.reduce((s, r) => s + (r.passed ?? 0), 0);
  const overallRate =
    totalApplications > 0 ? (totalAccepted / totalApplications) * 100 : 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  // Active filters display
  const hasActiveFilters =
    universityFilter !== "all" || yearFilter !== "all" || search;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#E5E7EB] bg-white/65 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-hidden">
      {/* Header — matches old React Newanup.tsx exactly */}
      <div className="relative overflow-hidden bg-[#5B0F26] px-8 py-6 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%)]" />
        <div className="relative">
          <h3 className="text-3xl font-bold mb-2">
            Qatar Medical Universities
          </h3>
          <p className="text-[#F7E9EE] mb-4">
            FMGE (Foreign Medical Graduate Exam) Acceptance Rates &amp;
            Performance Data
          </p>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {[
              {
                label: "Selected Year",
                value: yearFilter === "all" ? "All Years" : yearFilter,
              },
              {
                label: "Total Applications",
                value: totalApplications.toLocaleString(),
              },
              {
                label: "Total Accepted",
                value: totalAccepted.toLocaleString(),
              },
              {
                label: "Overall Acceptance Rate",
                value: `${overallRate.toFixed(2)}%`,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg shadow-black/5 "
              >
                <p className="text-[#F7E9EE] text-sm">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-[#E5E7EB] bg-[#FAF8F7] p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-5 h-5"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white py-3 pl-10 pr-4 shadow-sm transition-all focus:border-[#5B0F26] focus:ring-1 focus:ring-[#5B0F26]"
              suppressHydrationWarning={true}
              aria-label="Search universities"
            />
          </div>

          {/* University Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-5 h-5"
              aria-hidden="true"
            />
            <select
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              className="min-w-[200px] rounded-xl border border-[#E5E7EB] bg-white py-3 pl-10 pr-8 shadow-sm focus:border-[#5B0F26] focus:ring-1 focus:ring-[#5B0F26]"
              suppressHydrationWarning={true}
              aria-label="Filter by University"
            >
              <option value="all">All Universities</option>
              {availableUniversities.map((u) => (
                <option key={u} value={u}>
                  {u.length > 40 ? u.substring(0, 40) + "..." : u}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-5 h-5"
              aria-hidden="true"
            />
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="min-w-[150px] rounded-xl border border-[#E5E7EB] bg-white py-3 pl-10 pr-8 shadow-sm focus:border-[#5B0F26] focus:ring-1 focus:ring-[#5B0F26]"
              suppressHydrationWarning={true}
              aria-label="Filter by Year"
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Result count */}
          <div className="flex items-center gap-2 text-sm text-[#4B5563]">
            <Filter className="w-4 h-4" />
            <span>Showing {filtered.length} results</span>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-[#4B5563]">Active filters:</span>
            {universityFilter !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F9FAFB] text-[#5B0F26]">
                University:{" "}
                {universityFilter.length > 30
                  ? universityFilter.substring(0, 30) + "..."
                  : universityFilter}
                <button
                  onClick={() => setUniversityFilter("all")}
                  className="ml-2 text-[#8A1538] hover:text-[#5B0F26]"
                  suppressHydrationWarning={true}
                >
                  ×
                </button>
              </span>
            )}
            {yearFilter !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F7E9EE] text-green-800">
                Year: {yearFilter}
                <button
                  onClick={() => setYearFilter("all")}
                  className="ml-2 text-[#5B0F26] hover:text-red-800"
                  suppressHydrationWarning={true}
                >
                  ×
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Search: &ldquo;{search}&rdquo;
                <button
                  onClick={() => setSearch("")}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                  suppressHydrationWarning={true}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full">
          <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F2937]">
                <button
                  onClick={() => handleSort("universityName")}
                  className="flex items-center gap-2 hover:text-[#5B0F26] transition-colors"
                  suppressHydrationWarning={true}
                >
                  University Name {renderSortIcon("universityName")}
                </button>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F2937]">
                Year
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F2937]">
                <button
                  onClick={() => handleSort("appeared")}
                  className="flex items-center gap-2 hover:text-[#5B0F26] transition-colors"
                  suppressHydrationWarning={true}
                >
                  Total Applications {renderSortIcon("appeared")}
                </button>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F2937]">
                <button
                  onClick={() => handleSort("passed")}
                  className="flex items-center gap-2 hover:text-[#5B0F26] transition-colors"
                  suppressHydrationWarning={true}
                >
                  Accepted Students {renderSortIcon("passed")}
                </button>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F2937]">
                <button
                  onClick={() => handleSort("passPercentage")}
                  className="flex items-center gap-2 hover:text-[#5B0F26] transition-colors"
                  suppressHydrationWarning={true}
                >
                  Acceptance Rate {renderSortIcon("passPercentage")}
                </button>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F2937]">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/70">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                  No FMGE data found.
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => {
                const rate = row.passPercentage;
                return (
                  <tr
                    key={`${row.universityName}-${row.year}-${i}`}
                    className="transition-colors duration-150 hover:bg-white/55"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F9FAFB]/85 shadow-sm">
                          <span className="text-sm font-medium text-[#5B0F26]">
                            {i + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-[#1F2937] leading-5">
                            {row.universityName}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F9FAFB] text-[#5B0F26]">
                        {row.year}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-[#1F2937]">
                        {row.appeared?.toLocaleString() ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-[#1F2937]">
                        {row.passed?.toLocaleString() ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {rate != null ? (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRateColor(rate)}`}
                        >
                          {Number(rate).toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-[#6B7280]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {rate == null ? (
                          <Minus className="w-4 h-4 text-[#6B7280]" />
                        ) : rate >= 30 ? (
                          <TrendingUp className="w-4 h-4 text-[#8A1538]" />
                        ) : rate >= 15 ? (
                          <Minus className="w-4 h-4 text-[#8A1538]" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-[#8A1538]" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-[#E5E7EB] bg-white/45 px-6 py-4 ">
        <p className="text-sm text-[#4B5563] text-center">
          Showing {filtered.length} results
          {yearFilter !== "all" && ` for ${yearFilter}`}
          {universityFilter !== "all" &&
            ` for ${universityFilter.length > 40 ? universityFilter.substring(0, 40) + "..." : universityFilter}`}
          {search && ` matching "${search}"`}
        </p>
      </div>
    </div>
  );
}
