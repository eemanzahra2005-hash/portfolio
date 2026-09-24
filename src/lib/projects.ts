import type { CSSProperties } from "react";
import type { Project } from "@/data/content";

/** "React 19" → "React", "Next.js 16" → "Next.js", ".NET 8" → ".NET". */
export function normalizeTag(tag: string) {
  return tag.replace(/\s+\d[\d.]*$/, "");
}

export function matchesFilter(project: Project, filter: string) {
  return project.tags.some((t) => normalizeTag(t) === filter);
}

/** Repo name from a GitHub URL ("https://github.com/user/repo" → "repo"). */
export function repoName(url: string) {
  return url.replace(/\/+$/, "").split("/").pop() ?? "";
}

/** Two-digit display index: 0 → "01". */
export function projectIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}

/** FNV-1a: small, stable string hash. */
function hash(input: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Deterministic header background seeded by the project title.
 * Built only from the accent/surface tokens, so every card stays on-palette.
 */
export function projectGradient(title: string): CSSProperties {
  const h = hash(title);
  const pick = (shift: number, min: number, max: number) =>
    min + ((h >>> shift) % (max - min + 1));
  const blob = (x: number, y: number, strength: number, size: number) =>
    `radial-gradient(circle at ${x}% ${y}%, color-mix(in srgb, var(--color-accent) ${strength}%, transparent), transparent ${size}%)`;

  return {
    backgroundColor: "var(--color-accent-soft)",
    backgroundImage: [
      blob(pick(0, 5, 45), pick(4, 0, 60), pick(8, 14, 24), pick(12, 45, 65)),
      blob(pick(16, 55, 95), pick(20, 40, 100), pick(24, 8, 16), pick(28, 40, 60)),
      `linear-gradient(${pick(2, 100, 260)}deg, var(--color-surface), var(--color-accent-soft))`,
    ].join(", "),
  };
}
