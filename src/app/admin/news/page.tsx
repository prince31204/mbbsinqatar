"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Search,
  Newspaper,
  Eye,
} from "lucide-react";
import Link from "next/link";

type NewsItem = {
  id: number;
  title: string | null;
  slug: string | null;
  status: boolean;
  createdAt: string;
  category: { name: string; slug: string } | null;
};

export default function NewsListPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/news?search=${encodeURIComponent(search)}`,
    );
    if (res.ok) {
      const d = await res.json();
      setItems(d.items);
      setTotal(d.total);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this news article?")) return;
    const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!");
      load();
    } else toast.error("Failed");
  };

  const toggleStatus = async (item: NewsItem) => {
    await fetch(`/api/admin/news/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !item.status }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Newspaper size={22} className="text-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">News</h1>
            <p className="text-sm text-[#6B7280]">
              {total} article{total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button asChild className="bg-[#5B0F26] hover:bg-[#5B0F26]">
          <Link href="/admin/news/create">
            <Plus size={16} className="mr-2" />
            Add Article
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />
        <Input
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={20} className="animate-spin mx-auto text-[#6B7280]" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Newspaper size={36} className="mx-auto mb-3 text-[#4B5563]" />
            <p className="text-[#6B7280]">No news articles found.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/admin/news/create">
                <Plus size={14} className="mr-1" />
                Write First Article
              </Link>
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAF8F7] text-left text-[#6B7280]">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-[#FAF8F7]"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#1F2937] line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#6B7280] font-mono">
                      {item.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {item.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={item.status}
                      onCheckedChange={() => toggleStatus(item)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        asChild
                        title="View on Site"
                      >
                        <a
                          href={`/news/${item.category?.slug}/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye size={14} />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        asChild
                      >
                        <Link href={`/admin/news/${item.id}/edit`}>
                          <Edit2 size={14} />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-[#8A1538] hover:bg-[#5B0F26]"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
