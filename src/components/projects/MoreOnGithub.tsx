import { ArrowUpRight, Star } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { hiddenRepos, profile, projects, projectsSection, ui } from "@/data/content";
import { repoName } from "@/lib/projects";

interface GithubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}

const username = repoName(profile.github);
const excluded = new Set(
  [...projects.flatMap((p) => (p.repo ? [repoName(p.repo)] : [])), ...hiddenRepos].map((n) =>
    n.toLowerCase(),
  ),
);
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Public repos, refreshed at most once a day. Returns [] if GitHub is unreachable. */
async function getRepos(): Promise<GithubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as GithubRepo[]) : [];
  } catch {
    return [];
  }
}

export async function MoreOnGithub() {
  const repos = (await getRepos())
    .filter((r) => !r.fork && !excluded.has(r.name.toLowerCase()))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, projectsSection.moreLimit);

  return (
    <div className="mt-20 lg:mt-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            {projectsSection.moreHeading}
          </h3>
          {repos.length > 0 && (
            <p className="mt-2 text-sm text-muted sm:text-base">{projectsSection.moreSubtitle}</p>
          )}
        </div>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <GithubIcon className="size-4" />
          {projectsSection.viewAll}
          <span className="sr-only"> {ui.opensInNewTab}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </a>
      </Reveal>

      {repos.length > 0 && (
        <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <RevealItem key={repo.name}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition duration-300 ease-out-soft hover:-translate-y-1 hover:border-accent hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0 break-words font-medium text-foreground transition-colors group-hover:text-accent">
                    {repo.name}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
                  />
                  <span className="sr-only"> {ui.opensInNewTab}</span>
                </span>
                <span
                  className={
                    repo.description
                      ? "mt-2 line-clamp-2 text-sm leading-relaxed text-muted"
                      : "mt-2 text-sm italic text-muted"
                  }
                >
                  {repo.description ?? projectsSection.noDescription}
                </span>
                <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-muted">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                      {repo.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Star aria-hidden="true" className="size-3.5" />
                    <span className="sr-only">{projectsSection.stars(repo.stargazers_count)}</span>
                    <span aria-hidden="true" className="tabular-nums">
                      {repo.stargazers_count}
                    </span>
                  </span>
                  <span>
                    {projectsSection.updated}{" "}
                    <time dateTime={repo.pushed_at}>
                      {dateFormat.format(new Date(repo.pushed_at))}
                    </time>
                  </span>
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
