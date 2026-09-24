"use client";

import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useInView, useSpring } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { EASE } from "@/components/motion/SmoothScroll";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { projects, projectsSection, type Project } from "@/data/content";
import { matchesFilter } from "@/lib/projects";
import { ProjectLinks, ProjectVisual } from "./ProjectParts";

// Only needed after a click, so it's split out of the initial bundle.
const ProjectDialog = dynamic(() => import("./ProjectDialog").then((m) => m.ProjectDialog), {
  ssr: false,
});

const ALL = projectsSection.allFilter;
/** Only offer filters that at least one featured project actually uses. */
const filters = [
  ALL,
  ...projectsSection.filters.filter((f) => projects.some((p) => matchesFilter(p, f))),
];
const MAX_CARD_TAGS = 4;
const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

export function FeaturedProjects() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<string>(ALL);
  const [interacted, setInteracted] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "0px 0px -10% 0px" });

  const visible = projects.filter((p) => filter === ALL || matchesFilter(p, filter));

  const selectFilter = (f: string) => {
    setInteracted(true);
    setFilter(f);
  };

  return (
    <LayoutGroup>
      <div
        role="group"
        aria-label={projectsSection.filterLabel}
        className="mt-10 flex flex-wrap gap-2 lg:mt-14"
      >
        {filters.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(f)}
              className={clsx(
                "relative rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
                active
                  ? "border-accent text-white"
                  : "border-border bg-surface text-foreground/80 hover:border-accent hover:text-accent",
              )}
            >
              {active && (
                <motion.span
                  layoutId="project-filter-pill"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f}</span>
            </button>
          );
        })}
      </div>

      <motion.ul ref={gridRef} layout className="mt-8 grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <motion.li
              key={project.slug}
              layout
              data-reveal
              className={clsx(i === 0 && "md:col-span-2")}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.6, ease: EASE, delay: interacted ? 0 : i * 0.08 }
              }
            >
              <ProjectCard
                project={project}
                index={projects.indexOf(project)}
                large={i === 0}
                onOpen={() => setSelected(project)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {selected && (
          <ProjectDialog
            key={selected.slug}
            project={selected}
            index={projects.indexOf(selected)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  large: boolean;
  onOpen: () => void;
}

function ProjectCard({ project, index, large, onOpen }: ProjectCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const maxTilt = large ? 3 : 6;

  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const lift = useSpring(0, SPRING);

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    lift.set(0);
  };

  // Tilt, lift and spotlight follow a real mouse only (not touch / pen), never with reduced motion.
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * maxTilt * 2);
    rotateX.set(-py * maxTilt * 2);
    lift.set(-6);
    ref.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  const open = () => {
    reset();
    onOpen();
  };

  // Whole-card click is a mouse shortcut; the "Details" button is the accessible trigger.
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("a, button")) return;
    open();
  };

  const extraTags = project.tags.length - MAX_CARD_TAGS;

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onClick={onClick}
      style={{ rotateX, rotateY, y: lift, transformPerspective: 1200 }}
      className={clsx(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/5",
        large && "lg:flex-row",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 70%)",
        }}
      />

      <ProjectVisual
        project={project}
        index={index}
        className={clsx("h-44 sm:h-48", large && "lg:h-auto lg:min-h-80 lg:w-1/2 lg:shrink-0")}
      />

      <div className={clsx("relative flex flex-1 flex-col p-6 sm:p-7", large && "lg:p-10")}>
        <motion.h3
          layoutId={`project-title-${project.slug}`}
          className={clsx(
            "font-display leading-tight tracking-tight text-foreground",
            large ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[1.75rem]",
          )}
        >
          {project.title}
        </motion.h3>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{project.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.slice(0, MAX_CARD_TAGS).map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
          {extraTags > 0 && (
            <li className="rounded-full px-1 py-1 text-xs text-muted">+{extraTags}</li>
          )}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <ProjectLinks project={project} />
          <button
            type="button"
            onClick={open}
            aria-label={projectsSection.detailsLabel(project.title)}
            aria-haspopup="dialog"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent-soft"
          >
            {projectsSection.details}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
