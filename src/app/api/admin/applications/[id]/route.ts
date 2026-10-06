import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const { status } = await req.json();

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  try {
    const application = await prisma.studentApplication.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    return NextResponse.json(application);
  } catch (err) {
    console.error("Failed to update application status:", err);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 },
    );
  }
}
