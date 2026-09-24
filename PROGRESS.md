# Progress

- [x] Phase 0 — Setup (Next.js 16, TypeScript, Tailwind v4, motion, lenis, lucide-react, clsx)
- [x] Phase 1 — Foundation (rules, design system, content data, motion utilities, navbar, placeholder sections)
- [x] Phase 2 — Hero (word-mask name reveal, clip-path photo reveal + parallax, floating badges, magnetic CTAs, dotted grid + drifting blobs, scroll cue)
- [x] Phase 3 — About + Skills (shared SectionHeading, count-up stats derived from content, education/cert cards, spotlight skill cards, two-row marquee with static reduced-motion fallback)
- [x] Phase 4 — Experience (alternating centre-line timeline on lg / left-line on mobile, scroll-drawn accent line with spring, dots that fill + pulse when reached, "Current" badge, side slide-in cards, staggered bullets with Show more/less, tag chips)
- [x] Phase 5 — Projects (6 README-backed featured projects, tech filter chips with layout animations, title-seeded gradient cards with mouse-only 3D tilt + spotlight, accessible details dialog with shared-layout title, server-fetched "More on GitHub" list revalidated daily)
- [x] Phase 6 — Contact + Footer (contact cards with copy-email toast + live Islamabad clock, floating-label form with inline validation sent via a Server Action to Web3Forms, animated button states, footer with closing line + drawn-underline email, floating back-to-top with scroll-progress ring)
- [x] Phase 7 — Polish / SEO (full metadata + canonical, OG/Twitter image with photo and brand fonts, EZ monogram icons, sitemap/robots/manifest, Person JSON-LD, floating 404, performance, accessibility, reduced-motion and responsive audit)
- [ ] Phase 8 — Deploy

## Notes

- `public/eeman.jpg` and `public/Syeda-Eeman-Zahra-CV.pdf` are referenced in `src/data/content.ts` — make sure both files exist in `public/`.
- lucide-react v1 ships no brand icons, so the GitHub mark is an inline SVG in `src/components/icons/GithubIcon.tsx`.
- Next.js 16 deprecates `next/image` `priority`; the hero photo uses `preload` instead.
- Reduced motion before hydration: `[data-reveal]` (opacity/transform) and `[data-reveal-clip]` (clip-path) are forced visible in `globals.css`.
- Every remaining section uses `src/components/ui/SectionHeading.tsx`; add its copy to `sectionHeadings` in `content.ts` (`03 — Experience`, `04 — Projects`, `05 — Contact`).
- About stats are computed from `experience`, `projects`, `skills` and `education[0].detail` — nothing is hard-coded.
- The skills marquee is decorative (`aria-hidden`); the cards carry the accessible list. With reduced motion it's replaced by a static wrapped list via `motion-reduce:` CSS, so it works before hydration too.
- Experience entries have `location`, optional `current` and optional `tags` in `content.ts`; the "(Remote, …)" suffixes moved out of `role`/`company` into `location`.
- Timeline dots fill when the spring-smoothed line tip passes their centre (measured live), so they un-fill on scroll-up; the pulse ring plays only once.
- The "Current" badge uses Tailwind emerald (requested green) — the one intentional exception to the accent-only colour rule.
- Cards remount when the lg breakpoint resolves after hydration so the slide-in comes from the correct side.
- Featured projects live in `projects` (`content.ts`); every description/bullet comes from the repo's README. NEHRI has no `year` (not stated anywhere) — it's hidden until filled in.
- "More on GitHub" (`src/components/projects/MoreOnGithub.tsx`) is a server component: GitHub API with `next: { revalidate: 86400 }`, excluding forks, featured repos (matched by repo URL) and `hiddenRepos`. If GitHub is unreachable it shows only the "View all on GitHub" link. This makes `/` ISR (1 day).
- Filter chips come from `projectsSection.filters` but only render when a featured project's tags match (`"React 19"` → `"React"` via `normalizeTag` in `src/lib/projects.ts`).
- Card header gradients are generated from the title using only accent/surface tokens (`projectGradient`).
- The details dialog is portalled to `<body>`, locks scroll through `useSmoothScroll().setLocked`, traps focus, closes on Esc/backdrop/close, and restores focus to the trigger.
- Contact form: `src/app/actions/contact.ts` (Server Action) posts to Web3Forms with `WEB3FORMS_KEY` from the server env (copy `.env.example` → `.env.local`; also set it in Vercel). Without the key the action returns an error and the UI shows the "email me directly" mailto fallback. The key/endpoint never reach client bundles.
- Validation rules live in `src/lib/contact.ts` and are shared by the client (inline messages after blur/submit) and the server (re-validated). All fields are required; message min 10 chars.
- Spam: hidden `botcheck` honeypot; if filled, the action reports success without sending.
- The form submits through `onSubmit` → `startTransition(formAction)` so React doesn't auto-reset fields on error; it resets only on success. `action={formAction}` stays for no-JS.
- Form errors use Tailwind red (with an icon, so not colour-only) — a second intentional exception to the accent-only rule.
- The live clock uses `useSyncExternalStore` (empty on the server, so no hydration mismatch) and ticks on minute boundaries.
- `devIndicators: false` in `next.config.ts`.
- SEO: `metadataBase` comes from `NEXT_PUBLIC_SITE_URL` (`src/lib/site.ts`, falls back to localhost). SEO copy lives in `site` / `personSchema` in `content.ts`.
- OG/Twitter images (`src/lib/og.tsx`) and icons (`src/lib/icon.tsx`) are built at build time with `next/og`. `ImageResponse` can't read woff2, so TTFs are vendored in `assets/fonts/` (OFL). The apple-touch icon is full-bleed because iOS applies its own rounded mask. The 32px favicon is a rounded square.
- `useReducedMotion` comes from `src/components/motion/useReducedMotion.ts`, not `motion/react`. Motion's hook reads the media query during the first client render, which caused a hydration mismatch (#418) for reduced-motion users.
- `ScrollProgress` is rendered in `page.tsx`, not the root layout, so it doesn't show a full bar on the non-scrolling 404 page.
- The project dialog loads through `next/dynamic` (a separate ~4 kB chunk fetched on first open).

## Phase 7 audit

**Fixed**
- Contrast: `muted` changed from `#78716c` to `#716a65`. It was 4.41:1 on `accent-soft` and chip backgrounds, and now passes AA everywhere (≥4.87:1). The project year badge background became more opaque for the same reason.
- Hydration: fixed the React #418 hydration mismatch on the home page when reduced motion is on (see the `useReducedMotion` note above).
- Mobile menu: was `role="dialog" aria-modal` while its close button sat outside the dialog. It's now a disclosure with focus kept inside the toggle and links (Tab/Shift+Tab loop), and Esc still returns focus to the toggle.
- Label-in-name (WCAG 2.5.3): the navbar "Download CV" and "View all on GitHub" links had aria-labels that didn't include their visible text. They now use visible text plus an sr-only "(opens in a new tab)".
- Reduced motion: `ScrollProgress` now follows the scroll directly without a spring, and the mouse spotlights on skill/project cards are hidden.
- Responsive: at 1024–1279px the "Air University" hero badge was cut off at the viewport edge. It's pulled in on `lg` and gets its original offset back from `xl`.
- 404: removed the full-width scroll-progress bar.
- Performance: the Skills section is now a server component, with only `SkillCard` on the client. The project dialog is lazy-loaded, and the hero image `sizes` match its real rendered width (≤416px).
- Cleanup: removed the default `favicon.ico` and the unused `next.svg`, `vercel.svg`, `file.svg`, `globe.svg` and `window.svg`. Removed unused `ui.openCvNewTab` and `projectsSection.viewAllLabel`. Rewrote the README.

**Verified (headless Chrome against `next start`)**
- No horizontal scroll and no hero badge overlap or clipping at 360, 390, 768, 1024, 1280, 1536 and 1920px. No console errors or warnings.
- Exactly one `h1`. The skip link moves focus to `<main>`. The dialog fits a 360×640 screen and scrolls inside, and Esc and the focus trap work, with focus returning to the trigger.
- Reduced motion: no running animations, nothing moves over 1.5 s, every reveal is visible and Lenis is off.
- Hover effects (tilt, magnetic, spotlight) run only for `pointerType === "mouse"`, and Tailwind v4 `hover:` applies only on devices that can hover.
- First-load JS (gzip, not counting the `noModule` polyfills): `/` ≈ 226 kB, of which ≈ 37 kB is page-specific. The 404 page ≈ 189 kB.
