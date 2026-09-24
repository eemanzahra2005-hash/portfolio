# Progress

- [x] Phase 0 — Setup (Next.js 16, TypeScript, Tailwind v4, motion, lenis, lucide-react, clsx)
- [x] Phase 1 — Foundation (rules, design system, content data, motion utilities, navbar, placeholder sections)
- [x] Phase 2 — Hero (word-mask name reveal, clip-path photo reveal + parallax, floating badges, magnetic CTAs, dotted grid + drifting blobs, scroll cue)
- [x] Phase 3 — About + Skills (shared SectionHeading, count-up stats derived from content, education/cert cards, spotlight skill cards, two-row marquee with static reduced-motion fallback)
- [x] Phase 4 — Experience (alternating centre-line timeline on lg / left-line on mobile, scroll-drawn accent line with spring, dots that fill + pulse when reached, "Current" badge, side slide-in cards, staggered bullets with Show more/less, tag chips)
- [x] Phase 5 — Projects (6 README-backed featured projects, tech filter chips with layout animations, title-seeded gradient cards with mouse-only 3D tilt + spotlight, accessible details dialog with shared-layout title, server-fetched "More on GitHub" list revalidated daily)
- [ ] Phase 6 — Contact + Footer
- [ ] Phase 7 — Polish / SEO
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
