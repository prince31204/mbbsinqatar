import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { LEAD_WEBHOOK_FIELDS } from "@/lib/leadWebhook";

const URL_KEY = "lead_webhook_url";
const SECRET_KEY = "lead_webhook_secret";
const FIELDS_KEY = "lead_webhook_fields";
const FIELD_NAMES_KEY = "lead_webhook_field_names";
const ALL_FIELD_KEYS = LEAD_WEBHOOK_FIELDS.map((f) => f.key) as string[];

export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const [urlSetting, secretSetting, fieldsSetting, fieldNamesSetting] =
    await Promise.all([
      prisma.websiteSetting.findUnique({ where: { key: URL_KEY } }),
      prisma.websiteSetting.findUnique({ where: { key: SECRET_KEY } }),
      prisma.websiteSetting.findUnique({ where: { key: FIELDS_KEY } }),
      prisma.websiteSetting.findUnique({ where: { key: FIELD_NAMES_KEY } }),
    ]);

  const secretValue = secretSetting?.value ?? "";

  let enabledFields: string[] = ALL_FIELD_KEYS;
  if (fieldsSetting?.value) {
    try {
      const parsed = JSON.parse(fieldsSetting.value);
      if (Array.isArray(parsed)) enabledFields = parsed;
    } catch {
      // malformed value — default to every field selected
    }
  }

  let fieldNames: Record<string, string> = {};
  if (fieldNamesSetting?.value) {
    try {
      const parsed = JSON.parse(fieldNamesSetting.value);
      if (parsed && typeof parsed === "object") fieldNames = parsed;
    } catch {
      // malformed value — default to no custom names
    }
  }

  return NextResponse.json({
    url: urlSetting?.value ?? "",
    hasSecret: secretValue.length > 0,
    secretPreview: secretValue ? secretValue.slice(-4) : null,
    fields: LEAD_WEBHOOK_FIELDS.map((f) => ({
      ...f,
      enabled: enabledFields.includes(f.key),
      outgoingName: fieldNames[f.key] ?? "",
    })),
  });
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const url = typeof body.url === "string" ? body.url.trim() : "";
  const secret = typeof body.secret === "string" ? body.secret.trim() : "";
  const clearSecret = body.clearSecret === true;

  type FieldInput = { key: unknown; enabled: unknown; outgoingName: unknown };
  const rawFields: FieldInput[] = Array.isArray(body.fields) ? body.fields : [];
  const validFields = rawFields.filter(
    (f): f is { key: string; enabled: boolean; outgoingName: string } =>
      typeof f?.key === "string" && ALL_FIELD_KEYS.includes(f.key),
  );

  const enabledFieldKeys = validFields
    .filter((f) => f.enabled === true)
    .map((f) => f.key);
  const fieldNames: Record<string, string> = {};
  for (const f of validFields) {
    const name =
      typeof f.outgoingName === "string" ? f.outgoingName.trim() : "";
    if (name) fieldNames[f.key] = name;
  }

  if (url) {
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Enter a valid webhook URL." },
        { status: 400 },
      );
    }
  }

  await Promise.all([
    prisma.websiteSetting.upsert({
      where: { key: URL_KEY },
      create: { key: URL_KEY, value: url, group: "leads" },
      update: { value: url },
    }),
    prisma.websiteSetting.upsert({
      where: { key: FIELDS_KEY },
      create: {
        key: FIELDS_KEY,
        value: JSON.stringify(enabledFieldKeys),
        group: "leads",
      },
      update: { value: JSON.stringify(enabledFieldKeys) },
    }),
    prisma.websiteSetting.upsert({
      where: { key: FIELD_NAMES_KEY },
      create: {
        key: FIELD_NAMES_KEY,
        value: JSON.stringify(fieldNames),
        group: "leads",
      },
      update: { value: JSON.stringify(fieldNames) },
    }),
  ]);

  // Empty secret field means "leave the existing key untouched" — the current
  // key is never sent back to the browser, so an empty submit can't mean "clear it".
  // clearSecret is the explicit opt-in for removing a saved key.
  if (clearSecret) {
    await prisma.websiteSetting.upsert({
      where: { key: SECRET_KEY },
      create: { key: SECRET_KEY, value: "", group: "leads" },
      update: { value: "" },
    });
  } else if (secret) {
    await prisma.websiteSetting.upsert({
      where: { key: SECRET_KEY },
      create: { key: SECRET_KEY, value: secret, group: "leads" },
      update: { value: secret },
    });
  }

  return NextResponse.json({ success: true });
}
