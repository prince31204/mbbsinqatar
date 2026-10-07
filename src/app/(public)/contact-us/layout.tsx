import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Contact Us — Get Free MBBS Counselling",
    description:
      "Contact our expert counselors for MBBS admission in Qatar. Drop us a message, email, or call now.",
    entitySeo: {
      metaKeyword: "contact mbbs Qatar, study abroad counselling contact",
    },
    path: "/contact-us",
    pageKey: "contact-us",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
