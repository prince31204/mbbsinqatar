import { NextResponse, after } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { deliverLeadWebhook } from "@/lib/leadWebhook";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone: rawPhone,
      password,
    } = registerSchema.parse(body);

    // Sanitize phone number to remove spaces/dashes to fit perfectly into Prisma's @db.VarChar(15)
    const phone = rawPhone.replace(/[^\d+]/g, "");
    if (phone.length > 15) {
      return NextResponse.json(
        { error: "Phone number is too long. Maximum 15 characters allowed." },
        { status: 422 },
      );
    }

    // Check if lead already exists
    const existingLead = await prisma.lead.findUnique({ where: { email } });
    if (existingLead) {
      if (existingLead.emailVerified) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 },
        );
      } else {
        // Resend OTP for unverified account
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.lead.update({
          where: { email },
          data: { otp, otpExpiry }, // only update OTP fields, not phone/name
        });
        try {
          await sendOtpEmail(email, name, otp);
        } catch (emailErr) {
          console.error("OTP resend email failed:", emailErr);
        }
        return NextResponse.json({ message: "OTP resent to your email." });
      }
    }

    // Hash password and create lead
    const hashedPassword = await hash(password, 12);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        otp,
        otpExpiry,
        emailVerified: false,
        source: "account-registration",
      },
    });

    after(() => deliverLeadWebhook(lead));

    // Send OTP email — failure here does NOT block account creation
    try {
      await sendOtpEmail(email, name, otp);
    } catch (emailErr) {
      console.error("OTP email failed (account was still created):", emailErr);
    }

    return NextResponse.json(
      {
        message: "Account created. Please verify your email with the OTP sent.",
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 422 },
      );
    }
    // Prisma unique constraint violation (P2002) — phone or email conflict
    if (
      typeof err === "object" &&
      err !== null &&
      (err as { code?: string }).code === "P2002"
    ) {
      const meta = (err as { meta?: { target?: string[] } }).meta;
      const field = meta?.target?.includes("phone") ? "phone number" : "email";
      return NextResponse.json(
        {
          error: `This ${field} is already registered. Please use a different one.`,
        },
        { status: 409 },
      );
    }
    console.error("Registration error:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
