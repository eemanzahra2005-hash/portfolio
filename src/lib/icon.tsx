import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { monogram } from "@/lib/site";

const ACCENT = "#2563eb";
const geistSemiBold = await readFile(join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf"));

interface MonogramOptions {
  size: number;
  /** Corner radius in px; 0 = full-bleed square (iOS masks apple-touch icons itself). */
  radius: number;
}

/** White monogram ("EZ") on an accent square, used by app/icon.tsx and app/apple-icon.tsx. */
export function renderMonogram({ size, radius }: MonogramOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ACCENT,
          borderRadius: radius,
          color: "#ffffff",
          fontFamily: "Geist",
          fontWeight: 600,
          fontSize: Math.round(size * 0.46),
          letterSpacing: -size * 0.02,
        }}
      >
        {monogram}
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Geist", data: geistSemiBold, style: "normal", weight: 600 }],
    },
  );
}
