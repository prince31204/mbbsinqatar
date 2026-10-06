/**
 * Slug Utility
 * Generates URL-friendly slugs from text.
 * Matches Laravel's Str::slug() output.
 */

/**
 * Convert a string to a URL-friendly slug.
 * Example: "Japan State Medical Academy" -> "Japan-state-medical-academy"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/[^\w-]+/g, "") // remove non-word chars
    .replace(/--+/g, "-") // collapse multiple hyphens
    .replace(/^-+/, "") // trim leading hyphen
    .replace(/-+$/, ""); // trim trailing hyphen
}

/**
 * Generate a unique slug by appending a counter if base slug exists.
 * @param baseSlug - the initial slug
 * @param existsCheck - async function that returns true if slug is taken
 */
export async function uniqueSlug(
  baseSlug: string,
  existsCheck: (slug: string) => Promise<boolean>,
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await existsCheck(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
