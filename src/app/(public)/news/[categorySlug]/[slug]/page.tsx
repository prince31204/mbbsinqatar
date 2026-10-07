import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { buildMetadata, articleSchema, breadcrumbSchema } from "@/lib/seo";

interface Props {
  params: Promise<{ categorySlug: string; slug: string }>;
}

export const revalidate = 1800;

export async function generateStaticParams() {
  const items = await prisma.news
    .findMany({
      where: { status: true },
      select: { slug: true, category: { select: { slug: true } } },
    })
    .catch(() => []);
  return items
    .filter((n) => n.slug && n.category?.slug)
    .map((n) => ({ categorySlug: n.category.slug, slug: n.slug! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, slug } = await params;
  const item = await prisma.news
    .findFirst({
      where: { slug, category: { slug: categorySlug } },
      select: {
        title: true,
        shortnote: true,
        thumbnailPath: true,
        metaTitle: true,
        metaDescription: true,
        metaKeyword: true,
      },
    })
    .catch(() => null);
  if (!item) return { title: "News Not Found" };
  return buildMetadata({
    title: item.metaTitle || item.title || undefined,
    description: item.metaDescription || item.shortnote || undefined,
    ogImage: item.thumbnailPath ? cdn(item.thumbnailPath) : undefined,
    entitySeo: { metaKeyword: item.metaKeyword },
    path: `/news/${categorySlug}/${slug}`,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { categorySlug, slug } = await params;

  const item = await prisma.news
    .findFirst({
      where: { slug, status: true, category: { slug: categorySlug } },
      include: {
        category: true,
        author: { select: { name: true, photoPath: true } },
        contents: { orderBy: [{ position: "asc" }, { id: "asc" }] },
        faqs: { orderBy: { id: "asc" } },
      },
    })
    .catch(() => null);

  if (!item) notFound();

  const [relatedNews, categories] = await Promise.all([
    prisma.news
      .findMany({
        where: {
          status: true,
          categoryId: item.categoryId,
          NOT: { id: item.id },
        },
        select: {
          title: true,
          slug: true,
          thumbnailPath: true,
          shortnote: true,
          createdAt: true,
          category: { select: { slug: true } },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []),
    prisma.newsCategory
      .findMany({ where: { status: true }, select: { name: true, slug: true } })
      .catch(() => []),
  ]);

  // Nest content: only top-level contents (parentId == null), children fetched separately
  type NewsContentItem = (typeof item.contents)[0];
  const topLevel = item.contents.filter((c) => !c.parentId);
  const childrenOf = (parentId: number) =>
    item.contents.filter((c) => c.parentId === parentId);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: item.category.name, url: `/news/${item.category.slug}` },
    {
      name: item.title ?? "Article",
      url: `/news/${item.category.slug}/${item.slug}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="min-h-screen bg-[#FAF8F7]">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[#6B7280] flex-wrap">
            <Link href="/" className="hover:text-[#5B0F26]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/news" className="hover:text-[#5B0F26]">
              News
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/news/${item.category.slug}`}
              className="hover:text-[#5B0F26]"
            >
              {item.category.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1F2937] line-clamp-1">{item.title}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-4 gap-10">
            {/* Article */}
            <article className="lg:col-span-3">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
                {/* Hero image */}
                {item.thumbnailPath && (
                  <div className="relative h-72 lg:h-96">
                    <Image
                      src={cdn(item.thumbnailPath)}
                      alt={item.title ?? "News"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 75vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
                <div className="p-8">
                  {/* Category + date */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Link
                      href={`/news/${item.category.slug}`}
                      className="bg-white text-[#5B0F26] text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {item.category.name}
                    </Link>
                    <span className="text-[#6B7280] text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    {item.author?.name && (
                      <span className="text-[#6B7280] text-xs flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.author.name}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-4">
                    {item.title}
                  </h1>
                  {item.shortnote && (
                    <div className="border-l-4 border-[#E5E7EB] pl-4 mb-6">
                      <div
                        className="text-lg text-[#6B7280] italic prose prose-sm max-w-none prose-p:my-0"
                        dangerouslySetInnerHTML={{ __html: item.shortnote }}
                      />
                    </div>
                  )}
                  {item.description && (
                    <div
                      className="prose prose-gray max-w-none mb-6"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}

                  {/* Content sections */}
                  {topLevel.map((section) => (
                    <div key={section.id} className="mb-8">
                      <h2 className="text-xl font-bold text-[#1F2937] mb-3">
                        {section.title}
                      </h2>
                      <div
                        className="prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: section.description,
                        }}
                      />
                      {section.imagePath && (
                        <div className="relative h-64 my-4 rounded-xl overflow-hidden">
                          <Image
                            src={cdn(section.imagePath)}
                            alt={section.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 75vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      {childrenOf(section.id).map((child) => (
                        <div
                          key={child.id}
                          className="ml-4 mt-4 pl-4 border-l-2 border-[#E5E7EB]"
                        >
                          <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                            {child.title}
                          </h3>
                          <div
                            className="prose prose-gray max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: child.description,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* FAQs */}
                  {item.faqs.length > 0 && (
                    <div className="mt-10">
                      <h2 className="text-xl font-bold text-[#1F2937] mb-4">
                        Frequently Asked Questions
                      </h2>
                      <div className="space-y-4">
                        {item.faqs.map((faq) => (
                          <details
                            key={faq.id}
                            className="bg-white rounded-xl p-4 group"
                          >
                            <summary className="font-semibold text-[#1F2937] cursor-pointer list-none flex justify-between items-center">
                              {faq.question}
                              <span className="text-[#8A1538] ml-2 shrink-0 transition-transform group-open:rotate-45">
                                +
                              </span>
                            </summary>
                            <div
                              className="mt-3 text-[#4B5563] text-sm"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                    <Link
                      href={`/news/${item.category.slug}`}
                      className="flex items-center gap-2 text-[#8A1538] hover:text-[#5B0F26] font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to{" "}
                      {item.category.name}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Related news */}
              {relatedNews.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-[#1F2937] mb-4">
                    Related News
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {relatedNews.map((r) => (
                      <Link
                        key={r.title}
                        href={`/news/${r.category?.slug ?? ""}/${r.slug ?? ""}`}
                        className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-shadow group"
                      >
                        <div className="relative h-36 bg-white">
                          {r.thumbnailPath ? (
                            <Image
                              src={cdn(r.thumbnailPath)}
                              alt={r.title ?? ""}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full bg-white" />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-[#1F2937] line-clamp-2 group-hover:text-[#5B0F26] transition-colors">
                            {r.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                <h3 className="font-bold text-[#1F2937] mb-4">
                  News Categories
                </h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <Link
                        href={`/news/${cat.slug}`}
                        className={`flex items-center gap-2 text-sm py-1 border-b border-gray-50 last:border-0 transition-colors ${cat.slug === categorySlug ? "text-[#8A1538] font-semibold" : "text-[#4B5563] hover:text-[#5B0F26]"}`}
                      >
                        <ArrowRight className="w-3 h-3 shrink-0" /> {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#8A1538] rounded-2xl p-6 text-[#1F2937] text-center">
                <h3 className="font-bold text-lg mb-2">Apply for MBBS</h3>
                <p className="text-[#4B5563] text-sm mb-4">
                  Get expert guidance for free
                </p>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 bg-white text-[#5B0F26] font-semibold px-4 py-2 rounded-xl hover:bg-white transition-colors text-sm"
                >
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
