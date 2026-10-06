import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse, after } from "next/server";
import { deliverLeadWebhook } from "@/lib/leadWebhook";

// GET student profile (lead record)
export async function GET() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lead = await prisma.lead.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      state: true,
      country: true,
      phoneCode: true,
      fatherName: true,
      motherName: true,
      gender: true,
      dateOfBirth: true,
      neetScore: true,
      neetQualificationStatus: true,
      interestedUniversity: true,
      interestedProgram: true,
    },
  });

  return NextResponse.json({ profile: lead });
}

// PATCH update student profile
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed = [
    "name",
    "phone",
    "city",
    "state",
    "country",
    "phoneCode",
    "fatherName",
    "motherName",
    "gender",
    "dateOfBirth",
    "neetScore",
    "interestedUniversity",
    "interestedProgram",
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  let lead = await prisma.lead.findUnique({
    where: { email: session.user.email },
  });
  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        name: session.user.name || body.name || "Student",
        email: session.user.email,
        ...data,
      },
    });
    after(() => deliverLeadWebhook(lead!));
  } else {
    lead = await prisma.lead.update({ where: { id: lead.id }, data });
  }

  return NextResponse.json({ profile: lead });
}

// DELETE — soft-delete student account
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lead = await prisma.lead.findUnique({
    where: { email: session.user.email },
  });
  if (!lead)
    return NextResponse.json({ error: "Account not found" }, { status: 404 });

  // Soft delete — keep data for admin records
  await prisma.lead.update({
    where: { id: lead.id },
    data: { deletedAt: new Date(), status: "inactive" },
  });

  return NextResponse.json({ message: "Account deleted successfully" });
}
