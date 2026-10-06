/**
 * CDN URL Builder
 *
 * Generates public URLs for stored files.
 *
 * CDN_PROVIDER options (set in .env):
 * - "local" → Files are in /public/uploads/, served by Next.js at /uploads/...
 * No external CDN needed. This is the default for local development.
 * - "r2" → Cloudflare R2. Requires R2_PUBLIC_URL env var.
 * - "s3" → AWS S3. Requires AWS_BUCKET_NAME + AWS_REGION env vars.
 *
 * NOTE: NEXT_PUBLIC_CDN_BASE_URL is NOT used in "local" mode.
 * It is only used if you add a custom provider case below.
 */

const CDN_PROVIDER = (process.env.CDN_PROVIDER || "local").replace(/"/g, "");
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/"/g, "");
const AWS_BUCKET = (process.env.AWS_BUCKET_NAME || "").replace(/"/g, "");
const AWS_REGION = (process.env.AWS_REGION || "").replace(/"/g, "");

/**
 * Build a public CDN URL from a stored file path.
 * Input: "uploads/universities/123/thumbnail/abc-uuid.jpg"
 * Output (local): "/uploads/universities/123/thumbnail/abc-uuid.jpg"
 *
 * To switch CDN providers, add a new case to the switch below.
 * Local files live in /public/uploads/ and are served by Next.js at /uploads/...
 */
export function cdn(filePath: string | null | undefined): string {
  if (!filePath) return "";

  // Already a full URL — return as HTTPS enforced
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath.replace(/^http:\/\//i, "https://");
  }

  // Remove leading slash if present
  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

  switch (CDN_PROVIDER) {
    case "r2":
      return `${R2_PUBLIC_URL}/${cleanPath}`;
    case "s3":
      return `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${cleanPath}`;
    case "local":
    default:
      // Serve from /public/uploads locally via Next.js
      return `/${cleanPath}`;
  }
}

/**
 * Get CDN URL for a thumbnail (uses same path logic)
 */
export function cdnThumb(thumbnailPath: string | null | undefined): string {
  return cdn(thumbnailPath);
}

/**
 * Get placeholder image URL
 */
export function placeholder(width = 400, height = 300): string {
  return `https://placehold.co/${width}x${height}/e2e8f0/64748b?text=No+Image`;
}

/**
 * Get university thumbnail URL with fallback
 */
export function universityImage(
  thumbnailPath: string | null | undefined,
): string {
  return thumbnailPath ? cdn(thumbnailPath) : placeholder(800, 450);
}

/**
 * Get blog/article image URL with fallback
 */
export function blogImage(imagePath: string | null | undefined): string {
  return imagePath ? cdn(imagePath) : placeholder(800, 450);
}
