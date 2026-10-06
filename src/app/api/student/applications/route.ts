import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse, after } from "next/server";
import { deliverLeadWebhook } from "@/lib/leadWebhook";

// GET current student's applications
export async function GET() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lead = await prisma.lead.findUnique({
    where: { email: session.user.email },
    include: {
      applications: {
        include: {
          program: {
            include: {
              university: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  thumbnailPath: true,
                },
              },
            },
          },
        },
        orderBy: { appliedAt: "desc" },
      },
    },
  });

  if (!lead) return NextResponse.json({ applications: [] });
  return NextResponse.json({ applications: lead.applications });
}

// POST — submit a new application
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { universityProgramId } = await req.json();
  if (!universityProgramId)
    return NextResponse.json({ error: "Program ID required" }, { status: 400 });

  let lead = await prisma.lead.findUnique({
    where: { email: session.user.email },
  });
  if (!lead) {
    lead = await prisma.lead.create({
      data: { name: session.user.name || "Student", email: session.user.email },
    });
    after(() => deliverLeadWebhook(lead!));
  }

  // Check not already applied
  const existing = await prisma.studentApplication.findFirst({
    where: {
      leadId: lead.id,
      universityProgramId: Number(universityProgramId),
    },
  });
  if (existing)
    return NextResponse.json(
      { error: "Already applied to this program" },
      { status: 409 },
    );

  const application = await prisma.studentApplication.create({
    data: {
      leadId: lead.id,
      universityProgramId: Number(universityProgramId),
      status: "applied",
    },
    include: {
      program: { include: { university: { select: { name: true } } } },
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}
