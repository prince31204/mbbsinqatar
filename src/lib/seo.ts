import type { Metadata } from "next";
import { prisma } from "./prisma";

// Always use www canonical — canonical source of truth for production
const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mbbsinqatar.com";
const SITE_URL = RAW_SITE_URL.includes("localhost")
  ? RAW_SITE_URL
  : RAW_SITE_URL.replace(/^(https?:\/\/)(www\.)?/, "$1www.");
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "MBBS in Qatar";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export const APP_YEAR =
  new Date().getFullYear() >= 2026 ? new Date().getFullYear() : 2026;
export const ADMISSION_YEAR = `${APP_YEAR}-${(APP_YEAR + 1).toString().slice(2)}`;

/** Normalises a path into a clean canonical URL with www */
function canonicalUrl(path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  // Remove trailing slash unless it's the root
  const normalised = clean.length > 1 ? clean.replace(/\/$/, "") : clean;
  return `${SITE_URL}${normalised}`;
}

interface SeoData {
  metaTitle?: string | null;
  metaKeyword?: string | null;
  metaDescription?: string | null;
  ogImagePath?: string | null;
  seoRating?: number | null;
  reviewNumber?: number | null;
  bestRating?: number | null;
}

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  pageKey?: string; // key for StaticPageSeo lookup
  entitySeo?: SeoData; // from the entity's own fields
  ogImage?: string;
  noIndex?: boolean;
  openGraphType?: "website" | "article" | "profile";
}

export async function buildMetadata(
  options: BuildMetadataOptions,
): Promise<Metadata> {
  const {
    title: fallbackTitle,
    description: fallbackDescription,
    path = "/",
    pageKey,
    entitySeo,
    ogImage,
    noIndex = false,
    openGraphType = "website",
  } = options;

  // 1. Start with entity-level SEO (highest priority)
  let title = entitySeo?.metaTitle || fallbackTitle || SITE_NAME;
  let description = entitySeo?.metaDescription || fallbackDescription || "";
  let keywords = entitySeo?.metaKeyword || "";
  let imageUrl = ogImage || entitySeo?.ogImagePath || DEFAULT_OG_IMAGE;

  // 2. Optionally override with StaticPageSeo from DB
  if (pageKey && !entitySeo?.metaTitle) {
    try {
      const pageSeo = await prisma.staticPageSeo.findUnique({
        where: { page: pageKey, status: true },
      });
      if (pageSeo) {
        title = pageSeo.metaTitle || title;
        description = pageSeo.metaDescription || description;
        keywords = pageSeo.metaKeyword || keywords;
        imageUrl = pageSeo.ogImagePath || imageUrl;
      }
    } catch {
      // DB not available during build
    }
  }

  // 3. Build canonical URL (always www)
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const canonical = canonicalUrl(path);
  const resolvedImage = imageUrl.startsWith("http")
    ? imageUrl
    : `${SITE_URL.replace(/\/$/, "")}/${imageUrl.replace(/^\//, "")}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        { url: resolvedImage, width: 1200, height: 630, alt: fullTitle },
      ],
      locale: "en_US",
      type: openGraphType,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [resolvedImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

/**
 * Generate JSON-LD structured data for Organization (global)
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "EP-41, Jesus & Mary Marg, Chanakyapuri",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110021",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-11-2410-2161",
      contactType: "customer support",
      availableLanguage: "English",
    },
    sameAs: [
      "https://facebook.com/mbbsinQatar",
      "https://twitter.com/mbbsinQatar",
      "https://instagram.com/mbbsinQatar",
      "https://youtube.com/@mbbsinQatar",
    ],
  };
}

/**
 * Generate JSON-LD for a University page
 */
export function universitySchema(university: {
  name: string;
  slug: string;
  city?: string | null;
  rating?: number | null;
  totalReviews?: number | null;
  bestRating?: number | null;
  thumbnailPath?: string | null;
  description?: string | null;
  foundingDate?: string | number | null;
  numberOfStudents?: string | number | null;
  sameAs?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: university.name,
    url: `${SITE_URL}/universities/${university.slug}`,
    image: university.thumbnailPath || DEFAULT_OG_IMAGE,
    description: university.description || undefined,
    foundingDate: university.foundingDate?.toString() || undefined,
    numberOfStudents: university.numberOfStudents?.toString() || undefined,
    sameAs: university.sameAs ? [university.sameAs] : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: university.city || "Qatar",
      addressCountry: "MU",
    },
    ...(university.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: university.rating,
        bestRating: university.bestRating || 5,
        reviewCount: university.totalReviews || 1,
      },
    }),
  };
}

/**
 * Generate JSON-LD for an Article/Blog page
 */
export function articleSchema(post: {
  title?: string | null;
  description?: string | null;
  slug?: string | null;
  createdAt: Date;
  updatedAt: Date;
  imagePath?: string | null;
  authorName?: string;
  type?: "Article" | "NewsArticle";
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": post.type || "Article",
    headline: post.title,
    description: post.description,
    image: post.imagePath || DEFAULT_OG_IMAGE,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${SITE_URL}${post.path}`,
    author: {
      "@type": "Person",
      name: post.authorName || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}

/**
 * Generate JSON-LD for FAQ sections
 */
export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD BreadcrumbList
 */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
