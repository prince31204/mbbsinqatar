import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deliverLeadWebhook } from "@/lib/leadWebhook";

// Get agent's leads (leads with this agent's userId as source)
export async function GET(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "agent")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = 20;

  const agentId = Number(session.user?.id);
  const [data, total] = await Promise.all([
    prisma.leadInquiry.findMany({
      where: { agentId },
      include: { lead: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.leadInquiry.count({ where: { agentId } }),
  ]);

  return NextResponse.json({ data, total });
}

// Add a new lead on behalf of the agent
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "agent")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = Number(session.user?.id);
  const body = await req.json();
  const { name, email, phone, universityName, message } = body;

  if (!name || !email)
    return NextResponse.json(
      { error: "Name and email required" },
      { status: 422 },
    );

  // Upsert lead
  const lead = await prisma.lead.upsert({
    where: { email },
    update: { name, phone },
    create: { name, email, phone },
  });

  const inquiry = await prisma.leadInquiry.create({
    data: {
      leadId: lead.id,
      agentId,
      universityName,
      message,
      source: "agent-portal",
      status: "pending",
    },
  });

  after(() => deliverLeadWebhook(lead, inquiry));

  return NextResponse.json(inquiry, { status: 201 });
}
