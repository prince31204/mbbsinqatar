import path from "path";
import { mkdir, rename } from "fs/promises";
import { existsSync } from "fs";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

export function normalizeLocalUpload(
  url: string | null | undefined,
): string | null {
  if (typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return null;
  if (url.startsWith("/uploads/")) return url.slice(1);
  if (url.startsWith("uploads/")) return url;
  return null;
}

export function filenameFromPath(
  filePath: string | null | undefined,
): string | null {
  if (!filePath) return null;
  const clean = filePath.split("?")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || null;
}

export async function promoteTmpUpload(
  filePath: string | null | undefined,
  entityId: number | string,
): Promise<string | null> {
  if (!filePath) return null;
  const normalized =
    normalizeLocalUpload(filePath) || filePath.replace(/^\//, "");

  if (!normalized.includes("/_tmp/")) return normalized;

  const newPath = normalized.replace("/_tmp/", `/${entityId}/`);
  const oldAbs = path.join(process.cwd(), "public", ...normalized.split("/"));
  const newAbs = path.join(process.cwd(), "public", ...newPath.split("/"));

  if (existsSync(oldAbs)) {
    const newDir = path.dirname(newAbs);
    if (!existsSync(newDir)) {
      await mkdir(newDir, { recursive: true });
    }
    await rename(oldAbs, newAbs);
    return newPath;
  }

  // If old file is missing but new file exists, return the new path.
  if (existsSync(newAbs)) return newPath;

  // Otherwise, keep original path to avoid breaking references.
  return normalized;
}

export function buildUploadFolder(folder: string): string {
  const clean = folder
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  if (!clean || clean.includes("..")) {
    throw new Error("Invalid upload folder.");
  }
  return clean;
}

export function getUploadsRoot(): string {
  return UPLOADS_ROOT;
}
