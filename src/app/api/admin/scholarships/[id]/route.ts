import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

type Params = { params: Promise<{ id: string }> };
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

function optionalString(value: unknown, fieldName: string): string | null {
  if (value === null || value === "") return null;
  if (typeof value !== "string") throw new Error(`Invalid ${fieldName}.`);
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function optionalNumber(value: unknown, fieldName: string): number | null {
  if (value === null || value === "") return null;
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) throw new Error(`Invalid ${fieldName}.`);
  return numberValue;
}

function optionalInt(value: unknown, fieldName: string): number | null {
  const numberValue = optionalNumber(value, fieldName);
  if (numberValue === null) return null;
  if (!Number.isInteger(numberValue)) throw new Error(`Invalid ${fieldName}.`);
  return numberValue;
}

function optionalBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") throw new Error(`Invalid ${fieldName}.`);
  return value;
}

function normalizeScholarshipBody(
  body: unknown,
): Prisma.ScholarshipUncheckedUpdateInput {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Invalid request payload.");
  }

  const payload = body as Record<string, unknown>;
  const data: Prisma.ScholarshipUncheckedUpdateInput = {};

  if ("title" in payload) data.title = requiredString(payload.title, "Title");
  if ("slug" in payload) data.slug = requiredString(payload.slug, "Slug");

  if ("scholarshipType" in payload)
    data.scholarshipType = optionalString(
      payload.scholarshipType,
      "scholarshipType",
    );
  if ("amountMin" in payload)
    data.amountMin = optionalNumber(payload.amountMin, "amountMin");
  if ("amountMax" in payload)
    data.amountMax = optionalNumber(payload.amountMax, "amountMax");
  if ("discountPercentage" in payload)
    data.discountPercentage = optionalInt(
      payload.discountPercentage,
      "discountPercentage",
    );
  if ("availableSeats" in payload)
    data.availableSeats = optionalInt(payload.availableSeats, "availableSeats");
  if ("program" in payload)
    data.program = optionalString(payload.program, "program");
  if ("applicationMode" in payload)
    data.applicationMode = optionalString(
      payload.applicationMode,
      "applicationMode",
    );
  if ("deadline" in payload) data.deadline = parseDeadline(payload.deadline);
  if ("shortnote" in payload)
    data.shortnote = optionalString(payload.shortnote, "shortnote");
  if ("isActive" in payload)
    data.isActive = optionalBoolean(payload.isActive, "isActive");
  if ("universityId" in payload)
    data.universityId = optionalInt(payload.universityId, "universityId");
  if ("metaTitle" in payload)
    data.metaTitle = optionalString(payload.metaTitle, "metaTitle");
  if ("metaKeyword" in payload)
    data.metaKeyword = optionalString(payload.metaKeyword, "metaKeyword");
  if ("metaDescription" in payload)
    data.metaDescription = optionalString(
      payload.metaDescription,
      "metaDescription",
    );

  return data;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const item = await prisma.scholarship.findUnique({
    where: { id: parseInt(id) },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  try {
    const body = await req.json();
    const data = normalizeScholarshipBody(body);
    return NextResponse.json(
      await prisma.scholarship.update({ where: { id: parseInt(id) }, data }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update scholarship.";
    const status =
      message.includes("Invalid deadline date") ||
      message.includes("Invalid request payload")
        ? 400
        : 500;
    if (status === 500) console.error("Scholarship update error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.scholarship.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
