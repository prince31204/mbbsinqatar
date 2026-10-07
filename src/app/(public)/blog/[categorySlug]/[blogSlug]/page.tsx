import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  TrendingUp,
  User,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import {
  buildMetadata,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo";
import { getExpertProfile } from "@/data/experts";
import AuthorProfile from "@/components/blog/AuthorProfile";

interface Props {
  params: Promise<{ categorySlug: string; blogSlug: string }>;
}

export const revalidate = 1800;

export async function generateStaticParams() {
  const blogs = await prisma.blog
    .findMany({
      where: { status: true },
      select: { slug: true, category: { select: { slug: true } } },
    })
    .catch(() => []);
  return blogs.map((b) => ({
    categorySlug: b.category.slug,
    blogSlug: b.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, blogSlug } = await params;
  const blog = await prisma.blog
    .findFirst({
      where: { slug: blogSlug, category: { slug: categorySlug } },
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

  if (!blog) return { title: "Blog Post Not Found" };
  return buildMetadata({
    title: blog.metaTitle || blog.title || undefined,
    description: blog.metaDescription || blog.shortnote || undefined,
    path: `/blog/${categorySlug}/${blogSlug}`,
    ogImage: blog.thumbnailPath
      ? (cdn(blog.thumbnailPath) ?? undefined)
      : undefined,
    entitySeo: { metaKeyword: blog.metaKeyword },
    openGraphType: "article",
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { categorySlug, blogSlug } = await params;

  const blog = await prisma.blog
    .findFirst({
      where: { slug: blogSlug, status: true, category: { slug: categorySlug } },
      include: {
        category: true,
        author: { select: { name: true } },
        contents: { orderBy: [{ position: "asc" }, { id: "asc" }] },
        faqs: { orderBy: { id: "asc" } },
      },
    })
    .catch(() => null);

  if (!blog) notFound();

  const relatedBlogs = await prisma.blog
    .findMany({
      where: {
        status: true,
        categoryId: blog.categoryId,
        NOT: { id: blog.id },
      },
      select: {
        title: true,
        slug: true,
        thumbnailPath: true,
        shortnote: true,
        createdAt: true,
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  // Use database value or estimate reading time if not set
  const wordCount = (blog.description ?? "")
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime =
    blog.readingTime || Math.max(1, Math.round(wordCount / 200));

  // Top-level vs child content sections
  const topLevel = blog.contents.filter((c) => !c.parentId);
  const childrenOf = (parentId: number) =>
    blog.contents.filter((c) => c.parentId === parentId);

  const jsonLd: any[] = [
    articleSchema({
      title: blog.title ?? undefined,
      description: blog.description ?? undefined,
      slug: blog.slug ?? undefined,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      imagePath: blog.imagePath ?? undefined,
      authorName: blog.author?.name ?? undefined,
      path: `/blog/${categorySlug}/${blogSlug}`,
    }),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: blog.category.name, url: `/blog/${categorySlug}` },
      {
        name: blog.title ?? blogSlug,
        url: `/blog/${categorySlug}/${blogSlug}`,
      },
    ]),
  ];

  if (blog.faqs && blog.faqs.length > 0) {
    jsonLd.push(faqSchema(blog.faqs));
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1.5 text-sm text-[#6B7280] flex-wrap">
          <Link href="/" className="hover:text-[#5B0F26] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#4B5563]" />
          <Link href="/blog" className="hover:text-[#5B0F26] transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#4B5563]" />
          <Link
            href={`/blog/${categorySlug}`}
            className="hover:text-[#5B0F26] transition-colors"
          >
            {blog.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#4B5563]" />
          <span className="text-[#1F2937] font-medium line-clamp-1">
            {blog.title}
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ── Main article ── */}
          <article className="lg:col-span-2 min-w-0">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden p-8">
              {/* Category pill + badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Link
                  href={`/blog/${categorySlug}`}
                  className="inline-flex items-center bg-white text-[#8A1538] border border-[#E5E7EB] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#F9FAFB] transition-colors"
                >
                  {blog.category.name}
                </Link>
                <span className="inline-flex items-center bg-[#F7E9EE] text-[#5B0F26] border border-[#F7E9EE] text-xs font-semibold px-3 py-1 rounded-full">
                  Published
                </span>
                {blog.trending && (
                  <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold px-3 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </span>
                )}
                {blog.homeView && (
                  <span className="inline-flex items-center bg-white text-[#8A1538] border border-[#E5E7EB] text-xs font-semibold px-3 py-1 rounded-full">
                    Home Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-[#1F2937] leading-snug mb-5">
                {blog.title}
              </h1>
              {/* Author + date + reading time */}
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-6 pb-6 border-b border-[#E5E7EB]">
                {blog.author && (
                  <span className="flex items-center gap-1.5 text-[#8A1538]">
                    <User className="w-4 h-4" /> {blog.author.name}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5 text-orange-600">
                  <Clock className="w-4 h-4" /> {readingTime} min read
                </span>
              </div>

              {/* Hero image */}
              {(blog.thumbnailPath || blog.imagePath) && (
                <div className="relative aspect-[1023/614] rounded-2xl overflow-hidden mb-8 shadow-sm">
                  <Image
                    src={cdn(blog.thumbnailPath || blog.imagePath)!}
                    alt={blog.title || "Blog post"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Short note / excerpt */}
              {blog.shortnote && (
                <div className="border-l-4 border-[#E5E7EB] pl-4 mb-8 bg-white/50 py-3 rounded-r-xl">
                  <div
                    className="text-[#4B5563] text-lg leading-relaxed prose prose-sm max-w-none prose-p:my-1"
                    dangerouslySetInnerHTML={{ __html: blog.shortnote }}
                  />
                </div>
              )}

              {/* Main description */}
              {blog.description && (
                <div
                  className="prose max-w-none prose-headings:font-bold prose-headings:text-[#1F2937] prose-a:text-[#8A1538] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-gray-300 text-[#4B5563] mb-10"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
              )}

              {/* Content sections */}
              {topLevel.length > 0 && (
                <div className="space-y-10">
                  {topLevel.map((section) => (
                    <div key={section.id}>
                      {section.title && (
                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                          <span className="w-1 h-6 bg-[#5B0F26] rounded-full inline-block shrink-0" />
                          {section.title}
                        </h2>
                      )}
                      {section.description && (
                        <div
                          className="prose max-w-none text-[#4B5563] prose-headings:text-[#1F2937] prose-a:text-[#8A1538]"
                          dangerouslySetInnerHTML={{
                            __html: section.description,
                          }}
                        />
                      )}
                      {section.imagePath && (
                        <div className="relative h-64 rounded-xl overflow-hidden mt-5 shadow-sm">
                          <Image
                            src={cdn(section.imagePath)!}
                            alt={section.title || ""}
                            fill
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Child sections */}
                      {childrenOf(section.id).length > 0 && (
                        <div className="mt-6 space-y-6 pl-4 border-l-2 border-[#E5E7EB]">
                          {childrenOf(section.id).map((child) => (
                            <div key={child.id}>
                              {child.title && (
                                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                                  {child.title}
                                </h3>
                              )}
                              {child.description && (
                                <div
                                  className="prose max-w-none text-[#4B5563]"
                                  dangerouslySetInnerHTML={{
                                    __html: child.description,
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* FAQs */}
              {blog.faqs.length > 0 && (
                <div className="bg-[#FAF8F7] rounded-2xl p-8 mt-12 border border-[#E5E7EB]">
                  <h2 className="text-2xl font-bold text-[#1F2937] mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {blog.faqs.map((faq) => (
                      <details
                        key={faq.id}
                        className="group bg-white border border-[#E5E7EB] rounded-xl overflow-hidden"
                      >
                        <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[#1F2937] list-none select-none hover:text-[#5B0F26] transition-colors">
                          {faq.question}
                          <span className="ml-4 shrink-0 text-[#6B7280] group-open:rotate-45 transition-transform duration-200 text-xl leading-none">
                            +
                          </span>
                        </summary>
                        <p className="px-5 pb-5 text-[#4B5563] text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Expert Author Profile */}
              {blog.authorId && getExpertProfile(blog.authorId) && (
                <AuthorProfile profile={getExpertProfile(blog.authorId)!} />
              )}

              {/* Back */}
              <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[#8A1538] hover:text-[#5B0F26] font-medium text-sm transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back to Blog Index
                </Link>
                <Link
                  href={`/blog/${categorySlug}`}
                  className="text-[#6B7280] hover:text-[#4B5563] text-sm font-medium"
                >
                  View Category: {blog.category.name}
                </Link>
              </div>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Related articles */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
                <h3 className="font-bold text-[#1F2937] mb-5 text-base">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {relatedBlogs.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${categorySlug}/${rel.slug}`}
                      className="flex gap-3 group"
                    >
                      <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#F9FAFB]">
                        <Image
                          src={
                            cdn(rel.thumbnailPath) ||
                            "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=200"
                          }
                          alt={rel.title || "Related post"}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1F2937] group-hover:text-[#5B0F26] transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          {new Date(rel.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/blog/${categorySlug}`}
                  className="flex items-center gap-1 text-[#8A1538] text-sm font-medium mt-5 hover:text-[#5B0F26] transition-colors"
                >
                  See all in {blog.category.name}{" "}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* CTA */}
            <div className="bg-[#8A1538] text-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2">
                Interested in MBBS Qatar?
              </h3>
              <p className="text-[#4B5563] text-sm mb-5">
                Get free counselling from our experts today.
              </p>
              <Link
                href="/contact-us"
                className="block bg-white text-[#8A1538] py-2.5 rounded-xl font-semibold text-center text-sm hover:bg-white transition-colors"
              >
                Talk to Counsellor
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
