import nodemailer from "nodemailer";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "MBBS in Qatar";
const FROM_NAME = process.env.EMAIL_FROM_NAME || SITE_NAME;

/** Build a Gmail SMTP transporter, or null if creds not configured */
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass || user.trim() === "" || pass.trim() === "") {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/**
 * Send a 6-digit OTP for email verification.
 */
export async function sendOtpEmail(
  email: string,
  name: string | null | undefined,
  otp: string,
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    // Dev fallback — print OTP to terminal when Gmail not configured
    console.log(
      `\n📧 [DEV] OTP EMAIL\nTo: ${email}\nName: ${name}\nOTP Code: ${otp}\n(Add GMAIL_USER + GMAIL_APP_PASSWORD to .env to send real emails)\n`,
    );
    return;
  }

  const info = await transporter.sendMail({
    from: `"${FROM_NAME}" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Your ${SITE_NAME} verification code: ${otp}`,
    html: `
 <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FAF8F7;border-radius:8px">
 <h2 style="color:#1F2937;margin-bottom:8px">Verify your email</h2>
 <p style="color:#4B5563;margin-bottom:24px">Hi${name ? ` ${name}` : ""},</p>
 <p style="color:#4B5563">Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
 <div style="margin:32px auto;width:fit-content;background:#8A1538;color:#fff;font-size:36px;font-weight:700;letter-spacing:10px;padding:16px 32px;border-radius:8px">
 ${otp}
 </div>
 <p style="color:#6B7280;font-size:13px;margin-top:32px">If you didn't create an account, you can safely ignore this email.</p>
 </div>`,
  });
  console.log(`📧 OTP email sent → ${info.messageId} to: ${email}`);
}

/**
 * Send a password-reset OTP email.
 */
export async function sendPasswordResetEmail(
  email: string,
  otp: string,
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(
      `\n📧 [DEV] PASSWORD RESET EMAIL\nTo: ${email}\nOTP Code: ${otp}\n(Add GMAIL_USER + GMAIL_APP_PASSWORD to .env to send real emails)\n`,
    );
    return;
  }

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Your ${SITE_NAME} password reset code: ${otp}`,
    html: `
 <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FAF8F7;border-radius:8px">
 <h2 style="color:#1F2937;margin-bottom:8px">Reset your password</h2>
 <p style="color:#4B5563;margin-bottom:24px">We received a request to reset the password for <strong>${email}</strong>.</p>
 <p style="color:#4B5563">Use this code to reset your password. It expires in <strong>15 minutes</strong>.</p>
 <div style="margin:32px auto;width:fit-content;background:#8A1538;color:#fff;font-size:36px;font-weight:700;letter-spacing:10px;padding:16px 32px;border-radius:8px">
 ${otp}
 </div>
 <p style="color:#6B7280;font-size:13px;margin-top:32px">If you didn't request a password reset, you can safely ignore this email.</p>
 </div>`,
  });
}
