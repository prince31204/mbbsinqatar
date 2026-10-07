import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { buildMetadata } from "@/lib/seo";

export const metadata: Promise<Metadata> = buildMetadata({
  title: "News — MBBS Qatar Medical Education Updates",
  description:
    "Stay updated with the latest news about MBBS in Qatar, medical education policies, university announcements, and student success stories.",
  entitySeo: {
    metaKeyword:
      "MBBS Qatar news, medical education news, Qatar university news",
  },
  path: "/news",
  pageKey: "news",
});

export const revalidate = 1800;

export default async function NewsPage() {
  const [categories, recentNews] = await Promise.all([
    prisma.newsCategory
      .findMany({
        where: { status: true },
        include: { _count: { select: { news: { where: { status: true } } } } },
        orderBy: { id: "asc" },
      })
      .catch(() => []),
    prisma.news
      .findMany({
        where: { status: true },
        include: {
          category: { select: { name: true, slug: true } },
          author: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      })
      .catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-[#FAF8F7]">
      {/* Header */}
      <div className="bg-white text-[#1F2937] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper className="w-10 h-10 text-[#4B5563]" />
            <h1 className="text-4xl lg:text-5xl font-bold">Latest News</h1>
          </div>
          <p className="text-xl text-[#4B5563] max-w-3xl mx-auto">
            Stay informed with the latest updates on MBBS in Qatar, medical
            education, and university announcements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main news */}
          <div className="lg:col-span-3">
            {recentNews.length === 0 ? (
              <div className="text-center py-16 text-[#6B7280]">
                <Newspaper className="w-12 h-12 mx-auto mb-3 text-[#4B5563]" />
                <p>No news articles published yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {recentNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.category?.slug ?? ""}/${item.slug ?? ""}`}
                    className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-48 bg-white">
                      {item.thumbnailPath ? (
                        <Image
                          src={cdn(item.thumbnailPath)}
                          alt={item.title ?? "News"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-white">
                          <Newspaper className="w-12 h-12 text-[#4B5563]" />
                        </div>
                      )}
                      {item.category && (
                        <span className="absolute top-3 left-3 bg-[#8A1538] text-white text-xs px-2 py-1 rounded-full font-medium">
                          {item.category.name}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="font-bold text-[#1F2937] mb-2 line-clamp-2 group-hover:text-[#5B0F26] transition-colors">
                        {item.title}
                      </h2>
                      {item.shortnote && (
                        <div
                          className="text-sm text-[#6B7280] line-clamp-2 mb-3 prose prose-sm max-w-none prose-p:my-0"
                          dangerouslySetInnerHTML={{ __html: item.shortnote }}
                        />
                      )}
                      <div className="flex items-center justify-between text-xs text-[#6B7280] pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{item.author?.name ?? "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
              <h3 className="font-bold text-[#1F2937] mb-4">News Categories</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/news/${cat.slug}`}
                      className="flex items-center justify-between text-sm text-[#4B5563] hover:text-[#5B0F26] transition-colors py-1 border-b border-gray-50 last:border-0"
                    >
                      <span>{cat.name}</span>
                      <span className="bg-white text-[#8A1538] text-xs px-2 py-0.5 rounded-full">
                        {cat._count.news}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#8A1538] rounded-2xl p-6 text-[#1F2937] text-center">
              <h3 className="font-bold text-lg mb-2">Want to Study MBBS?</h3>
              <p className="text-[#4B5563] text-sm mb-4">
                Get free counseling from our experts
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-white text-[#5B0F26] font-semibold px-4 py-2 rounded-xl hover:bg-white transition-colors text-sm"
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
