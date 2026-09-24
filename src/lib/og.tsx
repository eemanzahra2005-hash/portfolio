import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile, site } from "@/data/content";

// Shared by app/opengraph-image.tsx and app/twitter-image.tsx (rendered once at build time).
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt = site.ogImage.alt;

const COLORS = {
  background: "#fafaf9",
  surface: "#ffffff",
  foreground: "#1c1917",
  muted: "#716a65",
  border: "#e7e5e4",
  accent: "#2563eb",
  accentSoft: "#eff6ff",
};

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

// ImageResponse can't read woff2, so the TTFs are vendored in assets/fonts (SIL OFL).
const [serif, serifItalic, sans, sansMedium, photo] = await Promise.all([
  font("InstrumentSerif-Regular.ttf"),
  font("InstrumentSerif-Italic.ttf"),
  font("Geist-Regular.ttf"),
  font("Geist-Medium.ttf"),
  readFile(join(process.cwd(), "public", profile.photo.replace(/^\//, "")), "base64"),
]);
const photoSrc = `data:image/jpeg;base64,${photo}`;

const PHOTO_W = 368;
const PHOTO_H = Math.round((PHOTO_W * profile.photoHeight) / profile.photoWidth);

const nameParts = profile.name.split(" ");
const lastName = nameParts.pop();

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 88px",
          background: COLORS.background,
          backgroundImage: `radial-gradient(circle at 88% 12%, ${COLORS.accentSoft} 0%, rgba(239,246,255,0) 45%)`,
          fontFamily: "Geist",
          color: COLORS.foreground,
          position: "relative",
        }}
      >
        {/* Accent rule along the top edge. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: COLORS.accent,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 2, background: COLORS.accent }} />
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: COLORS.muted,
              }}
            >
              {profile.role}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 28,
              fontFamily: "Instrument Serif",
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            <span style={{ marginRight: 24 }}>{nameParts.join(" ")}</span>
            <span style={{ fontStyle: "italic", color: COLORS.accent }}>{lastName}</span>
          </div>

          <div style={{ marginTop: 36, fontSize: 32, fontWeight: 500 }}>{profile.role}</div>
          <div style={{ marginTop: 12, fontSize: 28, color: COLORS.muted }}>
            {site.ogImage.stack}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 44,
              fontSize: 22,
              color: COLORS.muted,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, background: COLORS.accent }} />
            {profile.location}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            padding: 10,
            borderRadius: 44,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 24px 60px -20px rgba(28,25,23,0.25)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain <img>. */}
          <img
            src={photoSrc}
            alt={profile.photoAlt}
            width={PHOTO_W}
            height={PHOTO_H}
            style={{ borderRadius: 34, objectFit: "cover" }}
          />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serifItalic, style: "italic", weight: 400 },
        { name: "Geist", data: sans, style: "normal", weight: 400 },
        { name: "Geist", data: sansMedium, style: "normal", weight: 500 },
      ],
    },
  );
}
