import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Search } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export const metadata = { title: "Registered Users" };

export default async function RegisteredUsersPage({ searchParams }: PageProps) {
  const { search = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page));
  const pageSize = 25;
  const skip = (pageNum - 1) * pageSize;

  const where = {
    emailVerified: true,
    deletedAt: null as null,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerifiedAt: true,
        createdAt: true,
        status: true,
      },
    }),
    prisma.lead.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
            <Users size={22} className="text-indigo-600" /> Registered Users
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Students who signed up via the website and verified their email.
          </p>
        </div>
        <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
          {total} total
        </span>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
          />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name, email or phone..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 text-[#1F2937] rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
        {search && (
          <Link
            href="/admin/registered-users"
            className="px-4 py-2.5 bg-[#F9FAFB] text-[#4B5563] rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF8F7] border-b border-[#E5E7EB]">
            <tr>
              <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">
                User
              </th>
              <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">
                Phone
              </th>
              <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">
                Verified On
              </th>
              <th className="text-left text-xs font-semibold text-[#6B7280] px-4 py-3">
                Registered
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-[#6B7280]">
                  <Users size={32} className="mx-auto mb-2 text-[#4B5563]" />
                  {search
                    ? `No users found for "${search}"`
                    : "No registered users yet."}
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAF8F7] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-indigo-600 font-bold text-xs">
                          {u.name?.substring(0, 2).toUpperCase() || "??"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#1F2937]">
                          {u.name}
                        </div>
                        <div className="text-xs text-[#6B7280]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#4B5563]">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        u.status === "active"
                          ? "bg-[#F7E9EE] text-[#5B0F26]"
                          : "bg-[#F7E9EE] text-[#8A1538]"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">
                    {u.emailVerifiedAt
                      ? new Date(u.emailVerifiedAt).toLocaleDateString(
                          "en-IN",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )
                      : new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB] bg-[#FAF8F7]">
            <p className="text-xs text-[#6B7280]">
              Showing {skip + 1}–{Math.min(skip + pageSize, total)} of {total}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/registered-users?search=${search}&page=${p}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    p === pageNum
                      ? "bg-indigo-600 text-[#1F2937]"
                      : "text-[#4B5563] hover:bg-gray-200"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
