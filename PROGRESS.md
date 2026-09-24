# Progress

- [x] Phase 0 — Setup (Next.js 16, TypeScript, Tailwind v4, motion, lenis, lucide-react, clsx)
- [x] Phase 1 — Foundation (rules, design system, content data, motion utilities, navbar, placeholder sections)
- [x] Phase 2 — Hero (word-mask name reveal, clip-path photo reveal + parallax, floating badges, magnetic CTAs, dotted grid + drifting blobs, scroll cue)
- [x] Phase 3 — About + Skills (shared SectionHeading, count-up stats derived from content, education/cert cards, spotlight skill cards, two-row marquee with static reduced-motion fallback)
- [x] Phase 4 — Experience (alternating centre-line timeline on lg / left-line on mobile, scroll-drawn accent line with spring, dots that fill + pulse when reached, "Current" badge, side slide-in cards, staggered bullets with Show more/less, tag chips)
- [ ] Phase 5 — Projects
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
