import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const item = await prisma.hospital.findUnique({
    where: { id: parseInt(id) },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  const item = await prisma.hospital.update({
    where: { id: parseInt(id) },
    data: {
      name: body.name,
      slug: body.slug,
      city: body.city || null,
      state: body.state || null,
      beds: body.beds ? parseInt(body.beds) : null,
      establishedYear: body.establishedYear
        ? parseInt(body.establishedYear)
        : null,
      accreditation: body.accreditation || null,
      status: body.status,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.hospital.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
