import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSource(source: string | null) {
  if (!source) return "Website";
  const parts = source.split(":");
  const type = parts[0]
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const detail = parts[1]?.trim();
  return detail ? `${type}: ${detail}` : type;
}
