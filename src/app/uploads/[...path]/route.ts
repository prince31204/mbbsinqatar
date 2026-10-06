import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

function getUploadsRoot(): string {
  return path.resolve(process.cwd(), "public", "uploads");
}

function resolveRequestedPath(parts: string[]): string | null {
  const uploadsRoot = getUploadsRoot();
  const absolutePath = path.resolve(uploadsRoot, ...parts);

  // Block path traversal attempts outside uploads root.
  if (
    !absolutePath.startsWith(uploadsRoot + path.sep) &&
    absolutePath !== uploadsRoot
  ) {
    return null;
  }

  return absolutePath;
}

async function serveFile(parts: string[]) {
  const absolutePath = resolveRequestedPath(parts);
  if (!absolutePath) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const buffer = await readFile(absolutePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": getContentType(absolutePath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return serveFile(params.path || []);
}

export async function HEAD(
  _req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  const response = await serveFile(params.path || []);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}
