import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";

const schema = z.object({ email: z.string().email() });

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const lead = await prisma.lead.findUnique({ where: { email } });
    if (!lead) {
      return NextResponse.json(
        { error: "No account found with this email." },
        { status: 404 },
      );
    }
    if (lead.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified." },
        { status: 400 },
      );
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.lead.update({ where: { email }, data: { otp, otpExpiry } });

    await sendOtpEmail(email, lead.name, otp);

    return NextResponse.json({
      message: "A new OTP has been sent to your email.",
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
