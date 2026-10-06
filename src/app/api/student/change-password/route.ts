import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword)
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  if (newPassword.length < 8)
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );

  const user =
    (await prisma.user.findUnique({ where: { email: session.user.email } })) ||
    (await prisma.lead.findUnique({ where: { email: session.user.email } }));

  if (!user || !user.password)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid)
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );

  const hashed = await bcrypt.hash(newPassword, 12);

  // Update correct table based on role
  if (session.user.email) {
    const leadUser = await prisma.lead.findUnique({
      where: { email: session.user.email },
    });
    if (leadUser) {
      await prisma.lead.update({
        where: { id: leadUser.id },
        data: { password: hashed },
      });
    } else {
      const adminUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (adminUser)
        await prisma.user.update({
          where: { id: adminUser.id },
          data: { password: hashed },
        });
    }
  }

  return NextResponse.json({ message: "Password changed successfully" });
}
