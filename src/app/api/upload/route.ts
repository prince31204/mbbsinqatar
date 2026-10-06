import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { uploadFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAdmin();
  if (authError) {
    console.error("[upload] Unauthorized — no admin session");
    return authError;
  }

  try {
    const formData = await req.formData();

    // Debug logging to see what CKEditor is actually sending
    const keys = Array.from(formData.keys());
    console.log("[upload] FormData keys received:", keys);

    const file = formData.get("file") as File | null;
    const upload = formData.get("upload") as File | null; // CKEditor default fallback

    const effectiveFile = file || upload;
    const folder =
      (formData.get("folder") as string) ||
      req.nextUrl.searchParams.get("folder") ||
      "general";

    if (!effectiveFile) {
      console.error("[upload] No file found in keys:", keys);
      return NextResponse.json(
        { error: "No file provided", keys },
        { status: 400 },
      );
    }

    const result = await uploadFile(effectiveFile, folder, {
      maxSize: 20 * 1024 * 1024,
    });

    console.log(
      `[upload] Success: ${result.publicUrl} (${effectiveFile.size} bytes, user: ${session.user?.email})`,
    );
    return NextResponse.json(
      { url: `/${result.filePath}`, filename: result.fileName },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[upload] Error:", message);

    // Return proper status for validation errors
    if (message.includes("not allowed"))
      return NextResponse.json({ error: message }, { status: 415 });
    if (message.includes("exceeds"))
      return NextResponse.json({ error: message }, { status: 413 });

    return NextResponse.json(
      { error: "Upload failed", detail: message },
      { status: 500 },
    );
  }
}
