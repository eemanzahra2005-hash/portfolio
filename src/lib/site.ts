import { profile } from "@/data/content";

/** Public origin of the site, without a trailing slash (set NEXT_PUBLIC_SITE_URL in production). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

/** "Eeman Zahra" → "EZ". */
export const monogram = profile.shortName
  .split(/\s+/)
  .map((w) => w[0]?.toUpperCase() ?? "")
  .join("");
