"use client";

import clsx from "clsx";
import { ArrowRight, ArrowUpRight, Briefcase, Layers, Plus, Rocket } from "lucide-react";
import {
  cubicBezier,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type RefObject,
  type SVGProps,
} from "react";
import { EASE, useSmoothScroll } from "@/components/motion/SmoothScroll";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { experience, projects, skills, story, type Project } from "@/data/content";
import { stageGradient } from "@/lib/projects";
import { monogram } from "@/lib/site";

/* ------------------------------------------------------------------ data */

const words = story.headline.split(" ");
const briefProjects = projects.slice(0, story.briefCount);
const projectCount = projects.length;

interface StoryStat {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
  unit: string;
}

const stats: StoryStat[] = [
  {
    Icon: Rocket,
    label: story.stats.shipped,
    value: projects.filter((p) => p.live).length,
    unit: story.stats.shippedUnit,
  },
  {
    Icon: Layers,
    label: story.stats.technologies,
    value: skills.reduce((sum, g) => sum + g.items.length, 0),
    unit: story.stats.technologiesUnit,
  },
  {
    Icon: Briefcase,
    label: story.stats.experience,
    value: experience.length,
    unit: story.stats.roles(experience.length),
  },
];

function cardStats(project: Project) {
  const second = project.year
    ? { value: project.year, label: story.card.year }
    : project.tags[0]
      ? { value: project.tags[0], label: story.card.mainTech }
      : null;
  return [{ value: String(project.tags.length), label: story.card.tech }, ...(second ? [second] : [])];
}

const easeOut = cubicBezier(...EASE);

/* ------------------------------------------------------------------ hooks */

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktop(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Hydration-safe breakpoint check (mobile layout until hydrated). */
function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

/* ------------------------------------------------------------------ shared pieces */

const glowText: CSSProperties = {
  backgroundImage:
    "linear-gradient(100deg, color-mix(in srgb, var(--color-accent) 55%, white), color-mix(in srgb, var(--color-glow-violet) 55%, white))",
};

function isHighlight(word: string) {
  return word.replace(/[^\p{L}\p{N}'’-]/gu, "") === story.highlight;
}

const headlineClass =
  "mx-auto max-w-5xl text-center font-display text-[2.75rem] leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl";

function HighlightWord({ word }: { word: string }) {
  return (
    <span className="bg-clip-text pr-[0.06em] text-transparent italic" style={glowText}>
      {word}
    </span>
  );
}

function AppTile({ count, className }: { count: ReactNode; className?: string }) {
  return (
    <div className={clsx("relative", className)}>
      <div
        aria-hidden="true"
        className="grid size-28 place-items-center rounded-[1.75rem] border border-white/10 bg-stage-raised shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_30px_60px_-20px_rgb(0_0_0/0.8),0_0_80px_-10px_color-mix(in_srgb,var(--color-accent)_55%,transparent)] sm:size-36 sm:rounded-[2.25rem]"
      >
        <span
          className="bg-clip-text font-sans text-4xl font-semibold tracking-tight text-transparent drop-shadow-[0_0_18px_color-mix(in_srgb,var(--color-accent)_80%,transparent)] sm:text-5xl"
          style={glowText}
        >
          {monogram}
        </span>
      </div>
      {count}
    </div>
  );
}

const badgeClass =
  "absolute -top-2.5 -right-2.5 grid h-9 min-w-9 place-items-center rounded-full bg-white px-2 text-sm font-semibold text-stage tabular-nums shadow-[0_8px_24px_-6px_rgb(0_0_0/0.6)]";

function BriefCardBody({ project }: { project: Project }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="relative h-full w-16 shrink-0 overflow-hidden rounded-xl md:h-28 md:w-full"
        style={stageGradient(project.title)}
      >
        <span className="absolute top-2 right-2 hidden size-7 place-items-center rounded-full bg-white/15 text-white md:grid">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col md:mt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-white md:line-clamp-2 md:text-base">
            {project.title}
          </h3>
          <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-white/60 md:hidden" />
        </div>
        <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-white/60 md:line-clamp-2 md:text-sm">
          {project.summary}
        </p>
        <dl className="mt-auto flex gap-5 pt-2 md:pt-4">
          {cardStats(project).map((s) => (
            <div key={s.label} className="min-w-0">
              <dt className="text-[11px] text-white/60">{s.label}</dt>
              <dd className="truncate text-sm font-semibold text-white md:text-base">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

const briefCardClass =
  "flex gap-3 rounded-2xl border border-white/10 bg-stage-raised p-3 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_30px_60px_-24px_rgb(0_0_0/0.85)] md:flex-col md:gap-0 md:p-4";

function StatCardBody({
  stat,
  number,
  ring,
}: {
  stat: StoryStat;
  number: ReactNode;
  ring: MotionValue<number> | number;
}) {
  const { Icon } = stat;
  return (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white md:size-11">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1 md:mt-5">
        <p className="text-sm text-white/60">{stat.label}</p>
        <p className="mt-0.5 flex items-baseline gap-1.5">
          <span aria-hidden="true" className="font-display text-4xl leading-none text-white md:text-6xl">
            {number}
          </span>
          <span aria-hidden="true" className="text-sm text-white/60">
            {stat.unit}
          </span>
          <span className="sr-only">{`${stat.value} ${stat.unit}`}</span>
        </p>
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="size-11 shrink-0 -rotate-90 md:absolute md:top-5 md:right-5 md:size-12"
      >
        <circle cx="24" cy="24" r="20" fill="none" strokeWidth="3" className="stroke-white/10" />
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-accent"
          style={{ pathLength: ring }}
        />
      </svg>
    </>
  );
}

const statCardClass =
  "relative flex items-center gap-4 rounded-2xl border border-white/10 bg-stage-raised p-4 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_30px_60px_-24px_rgb(0_0_0/0.85)] md:w-[min(16rem,28vw)] md:flex-col md:items-start md:gap-0 md:p-5";

function PlusDisc({ children }: { children?: ReactNode }) {
  return (
    <div aria-hidden="true" className="relative grid size-20 place-items-center sm:size-24">
      {children}
      <span className="relative grid size-full place-items-center rounded-full bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_0_60px_4px_color-mix(in_srgb,var(--color-accent)_70%,transparent)]">
        <Plus className="size-8 sm:size-10" strokeWidth={2.25} />
      </span>
    </div>
  );
}

const ctaClass =
  "group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-stage shadow-[0_10px_40px_-10px_color-mix(in_srgb,var(--color-accent)_80%,transparent)] transition-transform duration-300 ease-out-soft hover:-translate-y-0.5 focus-visible:outline-white motion-reduce:transition-none";

function CtaLabel() {
  return (
    <>
      {story.cta.label}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </>
  );
}

function StageBackdrop({ children }: { children?: ReactNode }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {children}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-stage)_100%)]" />
      <div className="bg-grain absolute inset-0 opacity-[0.07]" />
    </div>
  );
}

const glowBackground: CSSProperties = {
  backgroundImage: [
    "radial-gradient(38% 38% at 32% 42%, color-mix(in srgb, var(--color-accent) 55%, transparent), transparent 70%)",
    "radial-gradient(34% 34% at 68% 58%, color-mix(in srgb, var(--color-glow-indigo) 45%, transparent), transparent 70%)",
    "radial-gradient(28% 28% at 56% 28%, color-mix(in srgb, var(--color-glow-violet) 38%, transparent), transparent 70%)",
  ].join(", "),
};

const stadiumBackground: CSSProperties = {
  backgroundImage:
    "linear-gradient(90deg, var(--color-accent), var(--color-glow-indigo), var(--color-glow-violet))",
};

/* ------------------------------------------------------------------ entry */

export function Story() {
  const reduce = useReducedMotion();
  return (
    <section id="story" tabIndex={-1} aria-label={story.label} className="outline-none">
      {/* CSS picks the version, so reduced motion is static even before hydration. */}
      <div className="hidden motion-reduce:block">
        <StaticStory />
      </div>
      {!reduce && (
        <div className="motion-reduce:hidden">
          <AnimatedStory />
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ static (reduced motion) */

function StaticStory() {
  return (
    <div className="px-2 py-2 sm:px-4 sm:py-4">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-stage px-5 py-20 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-28">
        <StageBackdrop>
          <div className="absolute inset-[-20%]" style={glowBackground} />
        </StageBackdrop>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-24 text-center">
          <h2 className={headlineClass}>
            {words.map((w, i) => (
              <Fragment key={i}>
                {isHighlight(w) ? <HighlightWord word={w} /> : w}
                {i < words.length - 1 && " "}
              </Fragment>
            ))}
          </h2>

          <div className="flex flex-col items-center gap-10">
            <p className="font-display text-6xl text-white sm:text-7xl">{story.pause}</p>
            <AppTile
              count={
                <>
                  <span aria-hidden="true" className={badgeClass}>
                    {projectCount}
                  </span>
                  <span className="sr-only">{story.tileLabel(projectCount)}</span>
                </>
              }
            />
          </div>

          <div className="w-full">
            <p className="text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
              {story.briefLabel}
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4">
              {briefProjects.map((project) => (
                <article key={project.slug} className={clsx(briefCardClass, "h-32 md:h-auto")}>
                  <BriefCardBody project={project} />
                </article>
              ))}
            </div>
          </div>

          <div className="w-full">
            <h3 className="sr-only">{story.stats.label}</h3>
            <div className="flex flex-col gap-3 md:flex-row md:justify-center md:gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className={statCardClass}>
                  <StatCardBody stat={stat} number={stat.value} ring={1} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <PlusDisc />
            <h3 className="font-display text-5xl leading-none text-white sm:text-6xl">
              {story.closing}
            </h3>
            <a href={story.cta.href} className={ctaClass}>
              <CtaLabel />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ animated */

const sceneClass =
  "pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 will-change-[transform,opacity] sm:px-10";

function AnimatedStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 34,
    mass: 0.4,
    restDelta: 0.0005,
  });

  const nearView = useInView(wrapperRef, { margin: "150px 0px" });
  const headlineIn = useInView(stageRef, { amount: 0.5, once: true });

  // Scene 5's decorative layers only mount once the story gets close to them.
  const [finaleNear, setFinaleNear] = useState(false);
  const [ctaActive, setCtaActive] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    setFinaleNear(v > 0.7);
    setCtaActive(v > 0.93);
  });

  const desktop = useIsDesktop();
  const layout = useMotionValue(0);
  useEffect(() => layout.set(desktop ? 1 : 0), [desktop, layout]);

  return (
    <div ref={wrapperRef} className="relative h-[300vh] md:h-[400vh]">
      <div className="sticky top-0 h-svh p-2 sm:p-4">
        <div
          ref={stageRef}
          data-story-paused={nearView ? undefined : ""}
          className="relative isolate h-full overflow-hidden rounded-[1.75rem] bg-stage text-white sm:rounded-[2.5rem]"
        >
          <AnimatedBackdrop p={p} />
          <SceneHeadline p={p} show={headlineIn} />
          <SceneTile p={p} />
          <SceneBrief p={p} layout={layout} />
          <SceneStats p={p} />
          <SceneFinale
            p={p}
            decor={finaleNear}
            ctaActive={ctaActive}
            wrapperRef={wrapperRef}
          />
        </div>
      </div>
    </div>
  );
}

type P = { p: MotionValue<number> };

function AnimatedBackdrop({ p }: P) {
  const rotate = useTransform(p, [0, 1], [0, 30]);
  const scale = useTransform(p, [0, 0.5, 1], [1, 1.18, 1.05]);
  // Stadium-shaped glow behind scene 2 (the tile) and scene 5 (the finale).
  const pillOpacity = useTransform(
    p,
    [0.17, 0.25, 0.33, 0.37, 0.8, 0.87],
    [0, 0.85, 0.85, 0, 0, 0.9],
  );
  const pillScale = useTransform(
    p,
    [0.17, 0.26, 0.33, 0.37, 0.8, 0.88],
    [0.3, 1, 1, 0.6, 0.3, 1],
    { ease: easeOut },
  );

  return (
    <StageBackdrop>
      <motion.div
        className="absolute inset-[-25%] will-change-transform"
        style={{ rotate, scale }}
      >
        <div
          className="absolute inset-0 will-change-transform motion-safe:animate-drift"
          style={glowBackground}
        />
      </motion.div>
      <motion.div
        className="absolute inset-x-[8%] inset-y-[32%] rounded-full blur-[70px] will-change-[transform,opacity] md:inset-x-[18%] md:inset-y-[37%]"
        style={{ ...stadiumBackground, opacity: pillOpacity, scale: pillScale }}
      />
    </StageBackdrop>
  );
}

/* Scene 1 (0 – 0.2): kinetic headline. */

const headlineVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

function SceneHeadline({ p, show }: P & { show: boolean }) {
  const opacity = useTransform(p, [0.13, 0.2], [1, 0]);
  const scale = useTransform(p, [0.13, 0.2], [1, 0.92]);
  const filter = useTransform(p, [0.13, 0.2], ["blur(0px)", "blur(10px)"]);

  return (
    <motion.div
      className={clsx(sceneClass, "will-change-[transform,opacity,filter]")}
      style={{ opacity, scale, filter }}
    >
      <motion.h2
        className={headlineClass}
        variants={headlineVariants}
        initial="hidden"
        animate={show ? "show" : "hidden"}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <motion.span variants={wordVariants} className="inline-block will-change-transform">
              {isHighlight(w) ? <HighlightWord word={w} /> : w}
            </motion.span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </motion.h2>
    </motion.div>
  );
}

/* Scene 2 (0.2 – 0.35): "But…" + app tile with a counting badge. */

function SceneTile({ p }: P) {
  const opacity = useTransform(p, [0.19, 0.23, 0.33, 0.36], [0, 1, 1, 0]);
  const exitScale = useTransform(p, [0.33, 0.36], [1, 0.9]);

  const pauseY = useTransform(p, [0.19, 0.24], [30, 0], { ease: easeOut });
  const pauseFilter = useTransform(p, [0.19, 0.24], ["blur(10px)", "blur(0px)"]);

  const tileOpacity = useTransform(p, [0.23, 0.26], [0, 1]);
  // Springs with low damping give the "pop" overshoot.
  const tileScale = useSpring(useTransform(p, [0.23, 0.27], [0.4, 1]), {
    stiffness: 260,
    damping: 14,
  });
  const badgeScale = useSpring(useTransform(p, [0.27, 0.29], [0, 1]), {
    stiffness: 400,
    damping: 15,
  });
  const count = useTransform(p, [0.28, 0.33], [0, projectCount]);
  const rounded = useTransform(count, (v) => Math.round(v));

  return (
    <motion.div className={sceneClass} style={{ opacity, scale: exitScale }}>
      <motion.p
        className="font-display text-6xl text-white will-change-[transform,filter] sm:text-8xl"
        style={{ y: pauseY, filter: pauseFilter }}
      >
        {story.pause}
      </motion.p>
      <motion.div
        className="mt-10 will-change-[transform,opacity] sm:mt-12"
        style={{ opacity: tileOpacity, scale: tileScale }}
      >
        <AppTile
          count={
            <>
              <motion.span
                aria-hidden="true"
                className={clsx(badgeClass, "will-change-transform")}
                style={{ scale: badgeScale }}
              >
                {rounded}
              </motion.span>
              <span className="sr-only">{story.tileLabel(projectCount)}</span>
            </>
          }
        />
      </motion.div>
    </motion.div>
  );
}

/* Scene 3 (0.35 – 0.6): stacked project-brief cards that fan out. */

function SceneBrief({ p, layout }: P & { layout: MotionValue<number> }) {
  const opacity = useTransform(p, [0.34, 0.39, 0.57, 0.61], [0, 1, 1, 0]);
  const y = useTransform(p, [0.34, 0.4], [60, 0], { ease: easeOut });
  const fan = useTransform(p, [0.4, 0.53], [0, 1], { ease: easeOut });

  return (
    <motion.div className={sceneClass} style={{ opacity, y }}>
      <p className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
        {story.briefLabel}
      </p>
      <div className="relative mt-6 grid h-[27rem] w-full place-items-center [perspective:1200px] md:mt-10 md:h-[21rem]">
        {briefProjects.map((project, i) => (
          <BriefCard key={project.slug} project={project} index={i} fan={fan} layout={layout} />
        ))}
      </div>
    </motion.div>
  );
}

function BriefCard({
  project,
  index,
  fan,
  layout,
}: {
  project: Project;
  index: number;
  fan: MotionValue<number>;
  layout: MotionValue<number>;
}) {
  const slot = index - 1; // -1, 0, 1 → left/top, middle, right/bottom
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Stacked: pile behind the first card. Fanned: a row on desktop, a column on mobile.
  const x = useTransform(() => `${lerp(0, slot * 106, fan.get()) * layout.get()}%`);
  const y = useTransform(() => {
    const f = fan.get();
    const stacked = -index * 7;
    const fanned = layout.get() ? Math.abs(slot) * 5 : slot * 108;
    return `${lerp(stacked, fanned, f)}%`;
  });
  const scale = useTransform(() => lerp(1 - index * 0.06, 1, fan.get()));
  const rotate = useTransform(() => fan.get() * slot * 4 * layout.get());
  const tilt = index === 0 ? 1 : 0;
  const rotateX = useTransform(() => tilt * lerp(14, 5, fan.get()));
  const rotateY = useTransform(() => tilt * lerp(-16, -4, fan.get()) * (layout.get() || 0.4));

  return (
    <motion.article
      className={clsx(
        briefCardClass,
        "col-start-1 row-start-1 h-32 w-[min(21rem,calc(100vw-3rem))] will-change-transform md:h-[20rem] md:w-[min(17rem,28vw)]",
      )}
      style={{ x, y, scale, rotate, rotateX, rotateY, zIndex: briefProjects.length - index }}
    >
      <BriefCardBody project={project} />
    </motion.article>
  );
}

/* Scene 4 (0.6 – 0.8): stat cards sliding up with counters and rings. */

function SceneStats({ p }: P) {
  const opacity = useTransform(p, [0.59, 0.62, 0.78, 0.82], [0, 1, 1, 0]);
  const exitY = useTransform(p, [0.78, 0.82], [0, -40]);

  return (
    <motion.div className={sceneClass} style={{ opacity, y: exitY }}>
      <h3 className="sr-only">{story.stats.label}</h3>
      <div className="flex w-full max-w-sm flex-col gap-3 md:max-w-none md:flex-row md:justify-center md:gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} p={p} stat={stat} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function StatCard({ p, stat, index }: P & { stat: StoryStat; index: number }) {
  const start = 0.61 + index * 0.04;
  const y = useTransform(p, [start, start + 0.06], [80, 0], { ease: easeOut });
  const opacity = useTransform(p, [start, start + 0.05], [0, 1]);
  const progress = useTransform(p, [start + 0.02, start + 0.1], [0, 1], { ease: easeOut });
  const number = useTransform(progress, (v) => Math.round(v * stat.value));

  return (
    <motion.div className={clsx(statCardClass, "will-change-transform")} style={{ y, opacity }}>
      <StatCardBody stat={stat} number={<motion.span>{number}</motion.span>} ring={progress} />
    </motion.div>
  );
}

/* Scene 5 (0.8 – 1): a cursor clicks the glowing "+", then the call to action. */

function SceneFinale({
  p,
  decor,
  ctaActive,
  wrapperRef,
}: P & {
  decor: boolean;
  ctaActive: boolean;
  wrapperRef: RefObject<HTMLDivElement | null>;
}) {
  const { scrollTo } = useSmoothScroll();

  const opacity = useTransform(p, [0.8, 0.84], [0, 1]);
  const discIn = useSpring(useTransform(p, [0.8, 0.85], [0.5, 1]), {
    stiffness: 220,
    damping: 16,
  });
  const press = useTransform(p, [0.9, 0.915, 0.93], [1, 0.88, 1]);

  const cursorX = useTransform(p, [0.83, 0.9], [170, 10], { ease: easeOut });
  const cursorY = useTransform(p, [0.83, 0.9], [150, 12], { ease: easeOut });
  const cursorOpacity = useTransform(p, [0.82, 0.85], [0, 1]);
  const cursorScale = useTransform(p, [0.9, 0.915, 0.93], [1, 0.78, 1]);
  const trailX = useSpring(cursorX, { stiffness: 90, damping: 18 });
  const trailY = useSpring(cursorY, { stiffness: 90, damping: 18 });

  const rippleScale = useTransform(p, [0.91, 0.97], [1, 2.6], { ease: easeOut });
  const rippleOpacity = useTransform(p, [0.91, 0.915, 0.97], [0, 0.7, 0]);

  const textOpacity = useTransform(p, [0.92, 0.97], [0, 1]);
  const textY = useTransform(p, [0.92, 0.97], [24, 0], { ease: easeOut });

  // Keyboard users can reach the link before it's revealed: jump to the end of the story.
  const revealOnFocus = () => {
    const el = wrapperRef.current;
    if (!el || p.get() > 0.9) return;
    scrollTo(el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight);
  };

  return (
    <motion.div className={sceneClass} style={{ opacity }}>
      <div className="relative">
        <motion.div className="will-change-transform" style={{ scale: discIn }}>
          <motion.div className="will-change-transform" style={{ scale: press }}>
            <PlusDisc>
              {decor && (
                <>
                  <span className="absolute inset-0 rounded-full border border-accent/60 motion-safe:animate-pulse-ring" />
                  <span className="absolute inset-0 rounded-full border border-accent/40 motion-safe:animate-pulse-ring [animation-delay:1.2s]" />
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-white/80 will-change-[transform,opacity]"
                    style={{ scale: rippleScale, opacity: rippleOpacity }}
                  />
                </>
              )}
            </PlusDisc>
          </motion.div>
        </motion.div>

        {decor && (
          <div aria-hidden="true" className="absolute top-1/2 left-1/2">
            <motion.span
              className="absolute -top-1 -left-1 size-8 rounded-full bg-glow-indigo/60 blur-md will-change-transform"
              style={{ x: trailX, y: trailY, opacity: cursorOpacity }}
            />
            <motion.svg
              viewBox="0 0 24 24"
              className="absolute -top-0.5 -left-1 size-8 origin-top-left drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-glow-indigo)_90%,transparent)] will-change-transform"
              style={{ x: cursorX, y: cursorY, scale: cursorScale, opacity: cursorOpacity }}
            >
              <path
                d="M4 2.5v17.2l4.7-4.3 3.1 6.6 3-1.4-3-6.4h6.4z"
                fill="white"
                stroke="var(--color-stage)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>
        )}
      </div>

      <motion.div
        className="mt-10 flex flex-col items-center gap-7 text-center will-change-[transform,opacity]"
        style={{ opacity: textOpacity, y: textY }}
      >
        <h3 className="font-display text-5xl leading-none text-white sm:text-7xl">
          {story.closing}
        </h3>
        <a
          href={story.cta.href}
          onFocus={revealOnFocus}
          className={clsx(ctaClass, ctaActive ? "pointer-events-auto" : "pointer-events-none")}
        >
          <CtaLabel />
        </a>
      </motion.div>
    </motion.div>
  );
}
