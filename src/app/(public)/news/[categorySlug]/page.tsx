import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  User,
  ChevronRight,
  ArrowRight,
  Newspaper,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 1800;

interface Props {
  params: Promise<{ categorySlug: string }>;
}

export async function generateStaticParams() {
  const cats = await prisma.newsCategory
    .findMany({
      where: { status: true },
      select: { slug: true },
    })
    .catch(() => []);
  return cats.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const cat = await prisma.newsCategory
    .findUnique({
      where: { slug: categorySlug },
      select: {
        name: true,
        description: true,
        metaTitle: true,
        metaDescription: true,
      },
    })
    .catch(() => null);
  if (!cat) return { title: "News Category Not Found" };
  return buildMetadata({
    title: cat.metaTitle || `${cat.name} — MBBS Japan News`,
    description:
      cat.metaDescription ||
      cat.description ||
      `Latest news about ${cat.name} — MBBS in Japan.`,
    path: `/news/${categorySlug}`,
  });
}

export default async function NewsCategoryPage({ params }: Props) {
  const { categorySlug } = await params;

  const [category, categories] = await Promise.all([
    prisma.newsCategory
      .findUnique({
        where: { slug: categorySlug },
        include: {
          news: {
            where: { status: true },
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              title: true,
              slug: true,
              shortnote: true,
              thumbnailPath: true,
              createdAt: true,
              author: { select: { name: true } },
              category: { select: { slug: true } },
            },
          },
        },
      })
      .catch(() => null),
    prisma.newsCategory
      .findMany({
        where: { status: true },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { news: { where: { status: true } } } },
        },
      })
      .catch(() => []),
  ]);

  if (!category) notFound();

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: category.name, url: `/news/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#FFFDF9]">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[#6B7280]">
            <Link href="/" className="hover:text-[#102A43]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/news" className="hover:text-[#102A43]">
              News
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#17202A] font-medium">{category.name}</span>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-white text-[#17202A] py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-[#4B5563] max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <p className="text-[#4B5563] text-sm mt-2">
              {category.news.length} article
              {category.news.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {category.news.length === 0 ? (
                <div className="text-center py-16 text-[#6B7280]">
                  <Newspaper className="w-12 h-12 mx-auto mb-3 text-[#4B5563]" />
                  <p>No news in this category yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {category.news.map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/${category.slug}/${item.slug ?? ""}`}
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
                            <span className="text-blue-300 text-4xl font-bold">
                              {(item.title ?? "N")[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h2 className="font-bold text-[#17202A] mb-2 line-clamp-2 group-hover:text-[#102A43] transition-colors">
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
                <h3 className="font-bold text-[#17202A] mb-4">All Categories</h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/news/${cat.slug}`}
                        className={`flex items-center justify-between text-sm py-1 border-b border-gray-50 last:border-0 transition-colors ${cat.slug === categorySlug ? "text-[#BC002D] font-semibold" : "text-[#4B5563] hover:text-[#102A43]"}`}
                      >
                        <span>{cat.name}</span>
                        <span className="bg-white text-[#BC002D] text-xs px-2 py-0.5 rounded-full">
                          {cat._count.news}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#BC002D] rounded-2xl p-6 text-[#17202A] text-center">
                <h3 className="font-bold text-lg mb-2">
                  Study MBBS in Japan
                </h3>
                <p className="text-[#4B5563] text-sm mb-4">
                  Get free expert counseling today
                </p>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 bg-white text-[#102A43] font-semibold px-4 py-2 rounded-xl hover:bg-white transition-colors text-sm"
                >
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
