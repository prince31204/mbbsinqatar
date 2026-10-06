import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// PATCH /api/admin/bulk/status
export async function PATCH(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const {
    model,
    ids,
    status,
    field = "status",
  } = body as {
    model: string;
    ids: string[];
    status: boolean;
    field?: string;
  };

  const modelMap: Record<string, keyof typeof prisma> = {
    university: "university",
    blog: "blog",
    news: "news",
    article: "article",
    scholarship: "scholarship",
    faq: "faq",
    testimonial: "testimonial",
    lead: "lead",
    province: "province",
    city: "city",
    office: "office",
    blogCategory: "blogCategory",
    newsCategory: "newsCategory",
    articleCategory: "articleCategory",
    faqCategory: "faqCategory",
    gallery: "gallery",
  };

  const prismaModel = modelMap[model];
  if (!prismaModel)
    return NextResponse.json({ error: "Unknown model" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma[prismaModel] as any).updateMany({
    where: { id: { in: ids } },
    data: { [field]: status },
  });

  return NextResponse.json({ success: true });
}
