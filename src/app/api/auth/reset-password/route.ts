import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, password } = await req.json();
    if (!email || !otp || !password)
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );
    if (password.length < 8)
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user || !user.otp || !user.otpExpireAt) {
      return NextResponse.json(
        { error: "Invalid or expired reset code" },
        { status: 400 },
      );
    }
    if (user.otp !== otp) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
    }
    if (new Date() > user.otpExpireAt) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, otp: null, otpExpireAt: null },
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
