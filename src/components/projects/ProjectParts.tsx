import clsx from "clsx";
import { ArrowUpRight, Layers, Lock } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { projectsSection, type Project } from "@/data/content";
import { normalizeTag, projectGradient, projectIndex } from "@/lib/projects";

/** Title-seeded gradient panel with a faint index number and the main technology. */
export function ProjectVisual({
  project,
  index,
  className,
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={clsx("relative overflow-hidden border-b border-border", className)}
      style={projectGradient(project.title)}
    >
      <div className="absolute inset-0 [background-image:radial-gradient(color-mix(in_srgb,var(--color-accent)_14%,transparent)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <span className="absolute -bottom-6 right-4 select-none font-display text-[8rem] leading-none text-accent/10 sm:text-[9rem]">
        {projectIndex(index)}
      </span>
      <div className="relative flex items-start justify-between gap-3 p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/15 bg-surface/80 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm">
          <Layers className="size-3.5" />
          {normalizeTag(project.tags[0] ?? "")}
        </span>
        {project.year && (
          <span className="rounded-full bg-surface/70 px-2.5 py-1 text-xs tabular-nums text-muted backdrop-blur-sm">
            {project.year}
          </span>
        )}
      </div>
    </div>
  );
}

/** GitHub / Live buttons, or a "Private repository" badge when there are no public links. */
export function ProjectLinks({ project }: { project: Project }) {
  const linkClass =
    "group/link inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent";
  const arrowClass =
    "size-3.5 transition-transform duration-300 ease-out-soft group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none";

  if (!project.repo && !project.live) {
    return project.note ? (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-sm text-muted">
        <Lock className="size-3.5" aria-hidden="true" />
        {project.note}
      </span>
    ) : null;
  }

  return (
    <>
      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={projectsSection.githubLabel(project.title)}
          className={linkClass}
        >
          <GithubIcon className="size-4" />
          {projectsSection.github}
        </a>
      )}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={projectsSection.liveLabel(project.title)}
          className={linkClass}
        >
          {projectsSection.live}
          <ArrowUpRight aria-hidden="true" className={arrowClass} />
        </a>
      )}
    </>
  );
}
