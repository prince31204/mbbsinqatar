import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

function parseDeadline(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = dateOnlyPattern.test(trimmed)
      ? new Date(`${trimmed}T00:00:00.000Z`)
      : new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  throw new Error("Invalid deadline date. Use YYYY-MM-DD.");
}

function requiredString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required.`);
  }
  return value.trim();
}

function optionalString(
  value: unknown,
  fieldName: string,
): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") throw new Error(`Invalid ${fieldName}.`);
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function optionalNumber(
  value: unknown,
  fieldName: string,
): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) throw new Error(`Invalid ${fieldName}.`);
  return numberValue;
}

function optionalInt(
  value: unknown,
  fieldName: string,
): number | null | undefined {
  const numberValue = optionalNumber(value, fieldName);
  if (numberValue === undefined || numberValue === null) return numberValue;
  if (!Number.isInteger(numberValue)) throw new Error(`Invalid ${fieldName}.`);
  return numberValue;
}

function optionalBoolean(
  value: unknown,
  fieldName: string,
): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") throw new Error(`Invalid ${fieldName}.`);
  return value;
}

function normalizeScholarshipBody(
  body: unknown,
): Prisma.ScholarshipUncheckedCreateInput {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Invalid request payload.");
  }

  const payload = body as Record<string, unknown>;
  const data: Prisma.ScholarshipUncheckedCreateInput = {
    title: requiredString(payload.title, "Title"),
    slug: requiredString(payload.slug, "Slug"),
  };

  const scholarshipType = optionalString(
    payload.scholarshipType,
    "scholarshipType",
  );
  if (scholarshipType !== undefined) data.scholarshipType = scholarshipType;

  const amountMin = optionalNumber(payload.amountMin, "amountMin");
  if (amountMin !== undefined) data.amountMin = amountMin;

  const amountMax = optionalNumber(payload.amountMax, "amountMax");
  if (amountMax !== undefined) data.amountMax = amountMax;

  const discountPercentage = optionalInt(
    payload.discountPercentage,
    "discountPercentage",
  );
  if (discountPercentage !== undefined)
    data.discountPercentage = discountPercentage;

  const availableSeats = optionalInt(payload.availableSeats, "availableSeats");
  if (availableSeats !== undefined) data.availableSeats = availableSeats;

  const program = optionalString(payload.program, "program");
  if (program !== undefined) data.program = program;

  const applicationMode = optionalString(
    payload.applicationMode,
    "applicationMode",
  );
  if (applicationMode !== undefined) data.applicationMode = applicationMode;

  if ("deadline" in payload) data.deadline = parseDeadline(payload.deadline);

  const shortnote = optionalString(payload.shortnote, "shortnote");
  if (shortnote !== undefined) data.shortnote = shortnote;

  const isActive = optionalBoolean(payload.isActive, "isActive");
  if (isActive !== undefined) data.isActive = isActive;

  const universityId = optionalInt(payload.universityId, "universityId");
  if (universityId !== undefined) data.universityId = universityId;

  const metaTitle = optionalString(payload.metaTitle, "metaTitle");
  if (metaTitle !== undefined) data.metaTitle = metaTitle;

  const metaKeyword = optionalString(payload.metaKeyword, "metaKeyword");
  if (metaKeyword !== undefined) data.metaKeyword = metaKeyword;

  const metaDescription = optionalString(
    payload.metaDescription,
    "metaDescription",
  );
  if (metaDescription !== undefined) data.metaDescription = metaDescription;

  return data;
}

export async function GET(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "25");
  const search = searchParams.get("search") ?? "";
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "desc";
  const where = search
    ? { OR: [{ title: { contains: search, mode: "insensitive" as const } }] }
    : { isActive: true };
  const [data, total] = await Promise.all([
    prisma.scholarship.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: sortDir },
      include: { university: { select: { name: true } } },
    }),
    prisma.scholarship.count({ where }),
  ]);
  return NextResponse.json({ data, total });
}

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  try {
    const body = await req.json();
    const data = normalizeScholarshipBody(body);
    const scholarship = await prisma.scholarship.create({ data });
    return NextResponse.json(scholarship, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create scholarship.";
    const status =
      message.includes("Invalid deadline date") ||
      message.includes("Invalid request payload")
        ? 400
        : 500;
    if (status === 500) console.error("Scholarship create error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
