import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ChevronRight, Tag, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 1800;

interface Props {
  params: Promise<{ categorySlug: string }>;
}

export async function generateStaticParams() {
  const cats = await prisma.blogCategory
    .findMany({
      where: { status: true },
      select: { slug: true },
    })
    .catch(() => []);
  return cats.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const cat = await prisma.blogCategory
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
  if (!cat) return { title: "Blog Category Not Found" };
  return buildMetadata({
    title: cat.metaTitle || `${cat.name} — MBBS Qatar Blog`,
    description:
      cat.metaDescription ||
      cat.description ||
      `Read articles about ${cat.name} — MBBS in Qatar. Tips, guides, and student experiences.`,
    path: `/blog/${categorySlug}`,
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const { categorySlug } = await params;

  const [category, categories] = await Promise.all([
    prisma.blogCategory
      .findUnique({
        where: { slug: categorySlug },
        include: {
          blogs: {
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
    prisma.blogCategory
      .findMany({
        where: { status: true },
        select: {
          name: true,
          slug: true,
          _count: { select: { blogs: { where: { status: true } } } },
        },
      })
      .catch(() => []),
  ]);

  if (!category) notFound();

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: category.name, url: `/blog/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-[#FAF8F7] border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-2 text-sm text-[#4B5563]">
          <Link href="/" className="hover:text-[#5B0F26]">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-[#5B0F26]">
            Blog
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1F2937] font-medium">{category.name}</span>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white text-[#1F2937] py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F9FAFB] px-4 py-1.5 rounded-full text-sm mb-4">
            <Tag className="w-4 h-4" />
            {category.name}
          </div>
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-[#4B5563] max-w-2xl mx-auto text-lg">
              {category.description}
            </p>
          )}
          <p className="text-[#6B7280] mt-4">
            {category.blogs.length} article
            {category.blogs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Article List */}
          <div className="lg:col-span-3">
            {category.blogs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB]">
                <p className="text-[#6B7280] text-lg">
                  No articles in this category yet.
                </p>
                <Link
                  href="/blog"
                  className="mt-4 inline-block text-[#8A1538] hover:underline"
                >
                  ← All Articles
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {category.blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${category.slug}/${blog.slug ?? ""}`}
                    className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[1023/614] bg-[#F9FAFB]">
                      {blog.thumbnailPath ? (
                        <Image
                          src={cdn(blog.thumbnailPath) || ""}
                          alt={blog.title ?? "Blog post"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-white">
                          <span className="text-[#8A1538] text-4xl font-bold">
                            {(blog.title ?? "B")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="font-bold text-[#1F2937] mb-2 line-clamp-2 group-hover:text-[#5B0F26] transition-colors">
                        {blog.title}
                      </h2>
                      {blog.shortnote && (
                        <div
                          className="text-sm text-[#6B7280] line-clamp-2 mb-3 prose prose-sm max-w-none prose-p:my-0"
                          dangerouslySetInnerHTML={{ __html: blog.shortnote }}
                        />
                      )}
                      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                        {blog.author?.name && (
                          <span className="flex items-center gap-1 text-[#8A1538]">
                            <User className="w-3 h-3" />
                            {blog.author.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
              <h3 className="font-bold text-[#1F2937] mb-4">All Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/blog/${cat.slug}`}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-sm transition-colors ${cat.slug === categorySlug ? "bg-white text-[#8A1538] font-medium" : "hover:bg-[#FAF8F7] text-[#4B5563]"}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs bg-[#F9FAFB] px-2 py-0.5 rounded-full">
                      {cat._count.blogs}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center">
              <h3 className="font-bold text-[#1F2937] mb-2">Ready to Apply?</h3>
              <p className="text-sm text-[#4B5563] mb-4">
                Talk to our counsellors for free guidance.
              </p>
              <Link
                href="/contact-us"
                className="block bg-[#8A1538] hover:bg-[#5B0F26] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Contact Us <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
