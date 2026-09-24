"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { EASE, useSmoothScroll } from "@/components/motion/SmoothScroll";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { projectsSection, type Project } from "@/data/content";
import { ProjectLinks, ProjectVisual } from "./ProjectParts";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface ProjectDialogProps {
  project: Project;
  index: number;
  onClose: () => void;
}

/** Only mounted on the client after a click, so rendering into document.body is safe. */
export function ProjectDialog({ project, index, onClose }: ProjectDialogProps) {
  const reduce = useReducedMotion();
  const { setLocked } = useSmoothScroll();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Scroll lock, initial focus, Esc to close, focus trap, focus restore.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    setLocked(true);
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      setLocked(false);
      trigger?.focus({ preventScroll: true });
    };
  }, [setLocked]);

  const fade = reduce ? { duration: 0 } : { duration: 0.3, ease: EASE };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={fade}
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        data-lenis-prevent
        className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
      >
        <ProjectVisual project={project} index={index} className="h-36 sm:h-44" />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={projectsSection.closeLabel}
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <div className="p-6 sm:p-8">
          <motion.h2
            id={titleId}
            layoutId={`project-title-${project.slug}`}
            className="font-display text-3xl leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            {project.title}
          </motion.h2>

          <p id={descId} className="mt-4 text-base leading-relaxed text-foreground/80">
            {project.description}
          </p>

          <h3 className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {projectsSection.builtHeading}
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-[15px]">
            {project.built.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {projectsSection.techHeading}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground/80"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <ProjectLinks project={project} />
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
