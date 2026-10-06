import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { normalizeLocalUpload, promoteTmpUpload } from "@/lib/upload-paths";

// GET /api/admin/settings — returns the first (and only) WebsiteSetting row
export async function GET() {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const settings = await prisma.websiteSetting.findFirst();
  return NextResponse.json(settings ?? {});
}

// POST /api/admin/settings — upsert
export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const normalizedBody = {
    ...body,
    logo: normalizeLocalUpload(body.logo) ?? body.logo ?? null,
  };
  const existing = await prisma.websiteSetting.findFirst();
  if (existing) {
    let updated = await prisma.websiteSetting.update({
      where: { id: existing.id },
      data: normalizedBody,
    });
    const promotedLogo = await promoteTmpUpload(
      (updated as { logo?: string | null }).logo ?? null,
      updated.id,
    );
    if ((updated as { logo?: string | null }).logo !== promotedLogo) {
      updated = await prisma.websiteSetting.update({
        where: { id: updated.id },
        data: { logo: promotedLogo } as never,
      });
    }
    return NextResponse.json(updated);
  } else {
    let created = await prisma.websiteSetting.create({ data: normalizedBody });
    const promotedLogo = await promoteTmpUpload(
      (created as { logo?: string | null }).logo ?? null,
      created.id,
    );
    if ((created as { logo?: string | null }).logo !== promotedLogo) {
      created = await prisma.websiteSetting.update({
        where: { id: created.id },
        data: { logo: promotedLogo } as never,
      });
    }
    return NextResponse.json(created, { status: 201 });
  }
}
