import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = schema.parse(body);

    const lead = await prisma.lead.findUnique({ where: { email } });

    if (!lead) {
      return NextResponse.json(
        { error: "No account found with this email." },
        { status: 404 },
      );
    }

    if (lead.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified. Please login." },
        { status: 400 },
      );
    }

    if (lead.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again." },
        { status: 400 },
      );
    }

    if (!lead.otpExpiry || new Date() > lead.otpExpiry) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // Mark as verified and clear OTP
    await prisma.lead.update({
      where: { email },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        otp: null,
        otpExpiry: null,
      },
    });

    return NextResponse.json({ message: "Email verified successfully!" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 422 },
      );
    }
    console.error("OTP verification error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
