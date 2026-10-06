import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { deliverLeadWebhook } from "@/lib/leadWebhook";

export async function GET(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "25");
  const search = searchParams.get("search") ?? "";
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "desc";
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : { deletedAt: null };
  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: sortDir },
    }),
    prisma.lead.count({ where }),
  ]);
  return NextResponse.json({ data, total });
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  try {
    const body = await req.json();
    const lead = await prisma.lead.create({ data: body });
    after(() => deliverLeadWebhook(lead));
    return NextResponse.json(lead, { status: 201 });
  } catch (err: unknown) {
    console.error("Lead create error:", err);
    const msg = err instanceof Error ? err.message : "Failed to create lead";
    // Unique constraint violation
    if (
      typeof msg === "string" &&
      (msg.includes("Unique constraint") || msg.includes("unique"))
    ) {
      return NextResponse.json(
        { error: "A lead with this email or phone already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
