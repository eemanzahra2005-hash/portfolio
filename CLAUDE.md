@AGENTS.md

# Project rules — Syeda Eeman Zahra portfolio

- **Design:** light, clean, minimal, professional. Use only the design tokens in `src/app/globals.css` (background, surface, foreground, muted, border, accent, accent-soft). `accent` (#2563EB) is the only accent colour.
- **Fonts:** Geist (`font-sans`) for body/UI; Instrument Serif (`font-display`, has italic) for large display headings.
- **Motion:** every animation is subtle and smooth, ease `[0.22, 1, 0.36, 1]` (`EASE` in `src/components/motion/SmoothScroll.tsx`). Animate `transform`/`opacity` only. Always respect `prefers-reduced-motion` (content must show instantly). Import from `"motion/react"`.
- **Content:** all text comes ONLY from `src/data/content.ts`. No hardcoded copy in components, and no fake or placeholder data (no invented metrics, testimonials, or links). Empty values (e.g. `linkedin: ""`) are hidden in the UI.
- **Accessibility:** semantic HTML, visible focus states, alt text on every image, WCAG AA contrast, keyboard operable.
- **Responsive:** mobile-first.
- **Images:** always use `next/image`.
- **Progress:** keep `PROGRESS.md` updated at the end of each phase.
