"use client";

import clsx from "clsx";
import { Building2, ChevronDown, MapPin } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useId, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { EASE } from "@/components/motion/SmoothScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  experience,
  experienceSection,
  sectionHeadings,
  type Experience as Job,
} from "@/data/content";

const VIEWPORT = { once: true, margin: "0px 0px -15% 0px" } as const;
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** lg+ layout flag; false during SSR (mobile-first). */
function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

export function Experience() {
  const reduce = useReducedMotion() ?? false;
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section
      id="experience"
      tabIndex={-1}
      aria-labelledby="experience-title"
      className="overflow-x-clip border-b border-border py-24 outline-none sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading id="experience-title" content={sectionHeadings.experience} />

        <div ref={timelineRef} className="relative mt-14 lg:mt-20">
          {/* Line: left gutter on mobile/tablet, centred on lg. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-[11px] w-0.5 rounded-full bg-border lg:left-[calc(50%-1px)]"
          />
          <motion.div
            data-reveal
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : progress }}
            className="absolute inset-y-0 left-[11px] w-0.5 origin-top rounded-full bg-accent lg:left-[calc(50%-1px)]"
          />

          <ol className="relative space-y-10 lg:space-y-16">
            {experience.map((job, i) => (
              <TimelineItem
                key={`${job.company}-${job.period}`}
                job={job}
                side={i % 2 === 0 ? "left" : "right"}
                progress={progress}
                timelineRef={timelineRef}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

interface TimelineItemProps {
  job: Job;
  /** Card side on lg+. */
  side: "left" | "right";
  progress: MotionValue<number>;
  timelineRef: RefObject<HTMLDivElement | null>;
}

function TimelineItem({ job, side, progress, timelineRef }: TimelineItemProps) {
  const reduce = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();
  const dotRef = useRef<HTMLSpanElement>(null);
  const [reached, setReached] = useState(false);
  const [pulsed, setPulsed] = useState(false);

  // Fill the dot once the tip of the accent line passes its centre.
  useMotionValueEvent(progress, "change", (v) => {
    const timeline = timelineRef.current;
    const dot = dotRef.current;
    if (!timeline || !dot) return;
    const t = timeline.getBoundingClientRect();
    const d = dot.getBoundingClientRect();
    const next = v * t.height >= d.top + d.height / 2 - t.top;
    if (next !== reached) setReached(next);
    if (next && !pulsed) setPulsed(true);
  });

  const filled = reduce || reached;
  const cardLeft = isDesktop && side === "left";

  return (
    <li className="relative pl-10 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:pl-0">
      {/* Dot */}
      <span
        ref={dotRef}
        aria-hidden="true"
        className="absolute left-1 top-7 size-4 rounded-full border-2 border-border bg-surface ring-4 ring-background lg:left-1/2 lg:-ml-2"
      >
        <motion.span
          data-reveal
          className="absolute -inset-0.5 rounded-full bg-accent"
          initial={{ scale: 0, opacity: 0 }}
          animate={filled ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
        />
        {pulsed && !reduce && (
          <motion.span
            className="absolute -inset-0.5 rounded-full bg-accent"
            initial={{ scale: 1, opacity: 0.45 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
          />
        )}
      </span>

      {/* Date on the opposite side (lg+) */}
      <div
        className={clsx(
          "hidden pt-4 lg:row-start-1 lg:block",
          side === "left" ? "lg:col-start-2" : "lg:col-start-1 lg:text-right",
        )}
      >
        <p className="font-display text-3xl italic leading-tight text-muted xl:text-4xl">
          {job.period}
        </p>
      </div>

      <div
        className={clsx(
          "lg:row-start-1",
          side === "left" ? "lg:col-start-1" : "lg:col-start-2",
        )}
      >
        {/* Remount when the breakpoint resolves so the slide-in starts from the correct side. */}
        <ExperienceCard key={isDesktop ? "lg" : "sm"} job={job} fromX={cardLeft ? -40 : 40} />
      </div>
    </li>
  );
}

function ExperienceCard({ job, fromX }: { job: Job; fromX: number }) {
  const reduce = useReducedMotion() ?? false;
  const listId = useId();
  const [expanded, setExpanded] = useState(false);
  const limit = experienceSection.collapsedCount;
  const collapsible = job.points.length > limit;
  const visiblePoints = collapsible ? job.points.slice(0, limit) : job.points;
  const extraPoints = collapsible ? job.points.slice(limit) : [];

  const card: Variants = {
    hidden: { opacity: 0, x: fromX },
    visible: {
      opacity: 1,
      x: 0,
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.8, ease: EASE, when: "beforeChildren", staggerChildren: 0.06 },
    },
  };
  const bullet: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduce ? { duration: 0 } : { duration: 0.5, ease: EASE },
    },
  };

  return (
    <motion.article
      data-reveal
      variants={card}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="rounded-2xl border border-border bg-surface p-5 transition duration-300 ease-out-soft hover:-translate-y-1 hover:border-accent hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h3 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
            {job.role}
          </h3>
          {job.current && <CurrentBadge />}
        </div>

        <p className="mt-2 flex items-center gap-2 text-sm text-foreground/80 sm:text-base">
          <Building2 className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <span>{job.company}</span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
            <MapPin className="size-3.5" aria-hidden="true" />
            {job.location}
          </span>
          <span className="font-display text-lg italic text-muted lg:hidden">{job.period}</span>
        </div>

        <ul id={listId} className="mt-5 text-sm leading-relaxed text-foreground/80 sm:text-[15px]">
          {visiblePoints.map((point) => (
            <motion.li data-reveal key={point} variants={bullet} className="pt-2.5 first:pt-0">
              <Bullet>{point}</Bullet>
            </motion.li>
          ))}
          <AnimatePresence initial={false}>
            {expanded &&
              extraPoints.map((point) => (
                <motion.li
                  key={point}
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
                >
                  <div className="pt-2.5">
                    <Bullet>{point}</Bullet>
                  </div>
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>

        {collapsible && (
          <motion.div data-reveal variants={bullet}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={listId}
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-accent transition-colors hover:text-foreground"
            >
              {expanded ? experienceSection.showLess : experienceSection.showMore}
              <span className="sr-only">
                {" "}
                {experienceSection.toggleContext(job.role, job.company)}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={clsx(
                  "size-4 transition-transform duration-300 ease-out-soft motion-reduce:transition-none",
                  expanded && "rotate-180",
                )}
              />
            </button>
          </motion.div>
        )}

        {job.tags && job.tags.length > 0 && (
          <motion.ul
            data-reveal
            variants={bullet}
            aria-label={experienceSection.tagsLabel(job.company)}
            className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5"
          >
            {job.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted"
              >
                {tag}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.article>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <span className="flex gap-3">
      <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
      <span>{children}</span>
    </span>
  );
}

function CurrentBadge() {
  const reduce = useReducedMotion() ?? false;
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <span aria-hidden="true" className="relative flex size-2">
        {!reduce && (
          <motion.span
            className="absolute inset-0 rounded-full bg-emerald-500 motion-reduce:hidden"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 2, ease: EASE, repeat: Infinity, repeatDelay: 0.4 }}
          />
        )}
        <span className="relative size-2 rounded-full bg-emerald-500" />
      </span>
      {experienceSection.current}
    </span>
  );
}
