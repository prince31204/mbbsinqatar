import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import OurPartnersContent from "@/components/partners/OurPartnersContent";

import { prisma } from "@/lib/prisma";

export const metadata: Promise<Metadata> = buildMetadata({
  title: "Our Partners - Universities and Organizations | mbbsinjapan.com",
  description:
    "Meet our official partner medical universities and international organizations that support transparent MBBS admissions in Japan.",
  entitySeo: {
    metaKeyword:
      "mbbs Japan partners, partner universities Japan, official mbbs partners",
  },
  path: "/our-partners",
});

export default async function OurPartnersPage() {
  const partners = await prisma.partnerInquiry.findMany({
    where: { status: "converted" },
    orderBy: { createdAt: "desc" },
  });

  // Convert Decimal fields to plain numbers for Client Component serialization
  const convertedPartners = partners.map((p) => ({
    ...p,
    rating: p.rating ? Number(p.rating) : null,
  }));

  return <OurPartnersContent dynamicPartners={convertedPartners} />;
}
