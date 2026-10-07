import type { Lead, LeadInquiry } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// The set of lead fields that can be individually turned on/off from the admin
// panel (Leads → Export / Webhook). `id` and `createdAt` are always sent —
// they identify the record and aren't really "lead data".
export const LEAD_WEBHOOK_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "phoneCode", label: "Phone Code" },
  { key: "gender", label: "Gender" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "fatherName", label: "Father's Name" },
  { key: "fatherMobile", label: "Father's Mobile" },
  { key: "motherName", label: "Mother's Name" },
  { key: "motherMobile", label: "Mother's Mobile" },
  { key: "firstLanguage", label: "First Language" },
  { key: "countryOfCitizenship", label: "Nationality" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "homeContactNumber", label: "Home Contact Number" },
  { key: "university", label: "Interested University" },
  { key: "program", label: "Interested Program" },
  { key: "countryOfEducation", label: "Country of Education" },
  { key: "educationLevel", label: "Education Level" },
  { key: "gradingScheme", label: "Grading Scheme" },
  { key: "gradeAverage", label: "Percentage / CGPA" },
  { key: "neetScore", label: "NEET Score" },
  { key: "neetQualificationStatus", label: "NEET Qualified" },
  { key: "englishExamType", label: "English Exam Type" },
  { key: "dateOfExam", label: "Date of Exam" },
  { key: "listeningScore", label: "Listening Score" },
  { key: "readingScore", label: "Reading Score" },
  { key: "writingScore", label: "Writing Score" },
  { key: "speakingScore", label: "Speaking Score" },
  { key: "message", label: "Message" },
  { key: "sourcePath", label: "Source URL / Landing Page" },
  { key: "source", label: "Lead Source (sent as 'event')" },
] as const;

export type LeadWebhookFieldKey = (typeof LEAD_WEBHOOK_FIELDS)[number]["key"];

const ALL_FIELD_KEYS: LeadWebhookFieldKey[] = LEAD_WEBHOOK_FIELDS.map(
  (f) => f.key,
);

// Our own field keys don't always match the receiving CRM's column/alias names
// (Tutelage's inbound lead API — see backend/src/routes/inbound.routes.ts on
// their side). Where they differ, this is the outgoing key we send by default;
// the admin panel can still override any of these per field.
const DEFAULT_OUTGOING_KEYS: Partial<Record<LeadWebhookFieldKey, string>> = {
  program: "course",
  educationLevel: "highestLevelOfEducation",
  countryOfCitizenship: "nationality",
  neetQualificationStatus: "neetQualified",
  sourcePath: "sourceUrl",
  // Tutelage's own "source" column is reserved for a fixed per-site identifier
  // (see deliverLeadWebhook below), so our internal source/form tracking value
  // goes out under "event" instead.
  source: "event",
};

// Generic payload shape for delivering a lead to an external website/CRM.
// Flat (not nested) because the receiving system (Tutelage's inbound lead API)
// expects top-level fields. Only the fields turned on in the admin panel are
// present, and each one is keyed by whatever outgoing name the admin assigned
// it (defaulting to our own field key, or the override above) so the JSON can
// match the receiving site's expected field names.
export type LeadWebhookPayload = {
  id: number;
  createdAt: string;
} & Record<string, string | number | null>;

function mapLeadToWebhookPayload(
  lead: Lead,
  inquiry: LeadInquiry | undefined,
  enabledFields: Set<string>,
  fieldNames: Record<string, string>,
): LeadWebhookPayload {
  const values: Record<LeadWebhookFieldKey, string | number | null> = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    phoneCode: lead.phoneCode,
    gender: lead.gender,
    dateOfBirth: lead.dateOfBirth
      ? lead.dateOfBirth.toISOString().slice(0, 10)
      : null,
    fatherName: lead.fatherName,
    fatherMobile: lead.fatherMobile,
    motherName: lead.motherName,
    motherMobile: lead.motherMobile,
    firstLanguage: lead.firstLanguage,
    countryOfCitizenship: lead.countryOfCitizenship,
    country: lead.country,
    city: lead.city,
    state: lead.state,
    homeContactNumber: lead.homeContactNumber,
    university: inquiry?.universityName ?? lead.interestedUniversity,
    program: lead.interestedProgram,
    countryOfEducation: lead.countryOfEducation,
    educationLevel: lead.highestLevelOfEducation,
    gradingScheme: lead.gradingScheme,
    gradeAverage: lead.gradeAverage,
    neetScore: lead.neetScore,
    neetQualificationStatus: lead.neetQualificationStatus
      ? lead.neetQualificationStatus === "qualified"
        ? "Yes"
        : "No"
      : null,
    englishExamType: lead.englishExamType,
    dateOfExam: lead.dateOfExam,
    listeningScore: lead.listeningScore,
    readingScore: lead.readingScore,
    writingScore: lead.writingScore,
    speakingScore: lead.speakingScore,
    message: inquiry?.message ?? null,
    sourcePath: lead.sourcePath,
    source: inquiry?.source ?? lead.source,
  };

  const payload: LeadWebhookPayload = {
    id: lead.id,
    createdAt: lead.createdAt.toISOString(),
  };

  for (const key of ALL_FIELD_KEYS) {
    if (!enabledFields.has(key)) continue;
    const outgoingKey =
      fieldNames[key]?.trim() || DEFAULT_OUTGOING_KEYS[key] || key;
    payload[outgoingKey] = values[key];
  }

  return payload;
}

// Tutelage's CRM identifies which partner site a lead came from by this fixed
// per-site domain, sent as the payload's "source" value.
const WEBHOOK_SOURCE_SITE = "mbbsinqatar.com";

// Connection details are configured from the admin panel (Leads → Export / Webhook),
// which stores them in the website_settings table. LEAD_WEBHOOK_URL / LEAD_WEBHOOK_SECRET
// env vars are kept as a fallback for environments where the admin UI hasn't been used yet.
async function getWebhookConfig(): Promise<{
  url: string | null;
  secret: string | null;
  enabledFields: Set<string>;
  fieldNames: Record<string, string>;
}> {
  const [urlSetting, secretSetting, fieldsSetting, fieldNamesSetting] =
    await Promise.all([
      prisma.websiteSetting.findUnique({ where: { key: "lead_webhook_url" } }),
      prisma.websiteSetting.findUnique({
        where: { key: "lead_webhook_secret" },
      }),
      prisma.websiteSetting.findUnique({
        where: { key: "lead_webhook_fields" },
      }),
      prisma.websiteSetting.findUnique({
        where: { key: "lead_webhook_field_names" },
      }),
    ]);

  let enabledFields = new Set<string>(ALL_FIELD_KEYS);
  if (fieldsSetting?.value) {
    try {
      const parsed = JSON.parse(fieldsSetting.value);
      if (Array.isArray(parsed)) enabledFields = new Set(parsed);
    } catch {
      // malformed value — fall back to sending every field rather than dropping data
    }
  }

  let fieldNames: Record<string, string> = {};
  if (fieldNamesSetting?.value) {
    try {
      const parsed = JSON.parse(fieldNamesSetting.value);
      if (parsed && typeof parsed === "object") fieldNames = parsed;
    } catch {
      // malformed value — fall back to our own field keys
    }
  }

  return {
    url: urlSetting?.value || process.env.LEAD_WEBHOOK_URL || null,
    secret: secretSetting?.value || process.env.LEAD_WEBHOOK_SECRET || null,
    enabledFields,
    fieldNames,
  };
}

// Fire-and-forget delivery of a newly created lead to an external website's webhook URL.
// No-op if no webhook URL is configured. Never throws - a delivery failure must not
// break lead capture on this site.
export async function deliverLeadWebhook(
  lead: Lead,
  inquiry?: LeadInquiry,
): Promise<void> {
  const { url, secret, enabledFields, fieldNames } = await getWebhookConfig();
  if (!url) return;

  const payload = mapLeadToWebhookPayload(
    lead,
    inquiry,
    enabledFields,
    fieldNames,
  );
  payload.source = WEBHOOK_SOURCE_SITE;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error(
        `[LEAD_WEBHOOK] Delivery failed for lead ${lead.id}: ${res.status} ${res.statusText}`,
      );
    }
  } catch (err) {
    console.error(`[LEAD_WEBHOOK] Delivery error for lead ${lead.id}:`, err);
  }
}
