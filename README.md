# Syeda Eeman Zahra — Portfolio

Personal portfolio of **Syeda Eeman Zahra**, Full-Stack Developer in Islamabad, Pakistan. It's a single page with Hero, About, Skills, Experience, Projects and Contact sections. The design is light and minimal, with subtle motion, and it works fully with `prefers-reduced-motion`.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions) + React 19
- TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- [Motion](https://motion.dev) (`motion/react`) for animation, [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- lucide-react icons, `next/font` (Geist + Instrument Serif), `next/og` for social images and icons
- [Web3Forms](https://web3forms.com) for the contact form

## Getting started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command         | What it does                   |
| --------------- | ------------------------------ |
| `npm run build` | Production build               |
| `npm start`     | Serve the production build     |
| `npm run lint`  | ESLint                         |

## Environment variables

| Variable               | Required    | Purpose                                                                                                                                                                    |
| ---------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WEB3FORMS_KEY`        | For contact | Web3Forms access key. Used only on the server (never prefix it with `NEXT_PUBLIC_`). Without it, the form shows an "email me directly" fallback.                              |
| `NEXT_PUBLIC_SITE_URL` | Production  | Public URL of the site with no trailing slash, e.g. `https://example.vercel.app`. Used for canonical URLs, Open Graph images, `sitemap.xml`, `robots.txt` and JSON-LD. Falls back to `http://localhost:3000`. |

On Vercel, add both under **Project → Settings → Environment Variables**. `NEXT_PUBLIC_SITE_URL` is read at build time, so redeploy after changing it.

## Editing content

All text on the site comes from **`src/data/content.ts`**. Components contain no copy of their own. The main exports are:

- `profile`: name, role, location, email, phone, GitHub/LinkedIn, CV path, photo, tagline and about text
- `skills`, `experience`, `projects`, `education`, `certifications`
- `hero`, `sectionHeadings`, `aboutSection`, `projectsSection`, `contactSection`, `footer`, `ui`: section copy and accessible labels
- `site`, `personSchema`: SEO title/description/keywords, manifest colours, and structured data

Notes:

- **Empty values are hidden.** For example, while `linkedin: ""` is empty, no LinkedIn link appears anywhere, including the JSON-LD `sameAs`.
- **Stats compute themselves.** The About numbers come from the lengths of `experience`, `projects` and `skills` and from `education[0].detail`.
- **Files:** the photo (`public/eeman.jpg`) and CV (`public/Syeda-Eeman-Zahra-CV.pdf`) live in `public/`. If you replace the photo, update `photoWidth`/`photoHeight`.
- **Featured projects:** the first item in `projects` is shown as the large card. A project with no `repo`/`live` shows its `note` instead (e.g. "Private repository").

### Hiding a GitHub repo

The "More on GitHub" list fetches public repos from the GitHub API and refreshes once a day. It already leaves out forks and any repo used in `projects`. To hide another repo, add its name to `hiddenRepos` (not case-sensitive):

```ts
export const hiddenRepos: string[] = ["old-experiment", "homework-2023"];
```

## Project structure

```
src/
  app/            layout, page, not-found, metadata routes (OG/Twitter image, icons,
                  sitemap, robots, manifest), contact Server Action
  components/     sections/, projects/, contact/, skills/, motion/, ui/, icons/
  data/content.ts all site content
  lib/            helpers (contact validation, project utils, site URL, OG/icon renderers)
assets/fonts/     TTFs for next/og (Geist, Instrument Serif — SIL Open Font License)
```

## Deployment

Built for [Vercel](https://vercel.com). Import the repo, set the two environment variables, and deploy.
