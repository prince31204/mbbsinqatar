import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const setting = await prisma.websiteSetting.findUnique({
    where: { key: "scholarship_visibility" },
  });

  return NextResponse.json({ visible: setting?.value === "true" });
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { visible } = await req.json();

  await prisma.websiteSetting.upsert({
    where: { key: "scholarship_visibility" },
    update: { value: visible ? "true" : "false" },
    create: {
      key: "scholarship_visibility",
      value: visible ? "true" : "false",
      type: "boolean",
      group: "visibility",
    },
  });

  return NextResponse.json({ success: true });
}
