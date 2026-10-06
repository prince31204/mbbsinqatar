import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    // Always return success to prevent email enumeration
    if (!user)
      return NextResponse.json({
        message: "If that email exists, a reset link has been sent.",
      });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store OTP in DB
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { otp, otpExpireAt: expiresAt },
    });

    // Send OTP via Resend email
    await sendPasswordResetEmail(email, otp);

    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
