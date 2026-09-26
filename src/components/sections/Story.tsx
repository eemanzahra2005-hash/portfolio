"use client";

import clsx from "clsx";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Layers,
  Pause,
  Play,
  Plus,
  Rocket,
} from "lucide-react";
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
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
  type SVGProps,
} from "react";
import { EASE } from "@/components/motion/SmoothScroll";
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

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** False while the browser tab is hidden. */
function usePageVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
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

function HighlightWord({ word }: { word: string }) {
  return (
    <span className="bg-clip-text pr-[0.06em] text-transparent italic" style={glowText}>
      {word}
    </span>
  );
}

function AppTile({ count }: { count: ReactNode }) {
  return (
    <div className="relative">
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
          <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-white/70 md:hidden" />
        </div>
        <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-white/70 md:line-clamp-2 md:text-sm">
          {project.summary}
        </p>
        <dl className="mt-auto flex gap-5 pt-2 md:pt-4">
          {cardStats(project).map((s) => (
            <div key={s.label} className="min-w-0">
              <dt className="text-[11px] text-white/70">{s.label}</dt>
              <dd className="truncate text-sm font-semibold text-white md:text-base">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
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

/** Counts from 0 to `value` on mount (instant with reduced motion). */
function Counter({ value, delay, reduce }: { value: number; delay: number; reduce: boolean }) {
  const count = useMotionValue(reduce ? value : 0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (reduce) return;
    const controls = animate(count, value, { duration: 1.2, delay, ease: EASE });
    return () => controls.stop();
  }, [count, value, delay, reduce]);

  return <motion.span className="tabular-nums">{rounded}</motion.span>;
}

/* ------------------------------------------------------------------ timeline */

interface SceneProps {
  reduce: boolean;
  desktop: boolean;
  onCtaFocus: (focused: boolean) => void;
}

interface SceneDef {
  /** Seconds on screen while playing. */
  duration: number;
  title: string;
  Component: ComponentType<SceneProps>;
}

const scenes: SceneDef[] = [
  { duration: 3.4, title: story.headline, Component: SceneHeadline },
  { duration: 3, title: story.tileLabel(projectCount), Component: SceneTile },
  { duration: 3.6, title: story.briefLabel, Component: SceneBrief },
  { duration: 3.2, title: story.stats.label, Component: SceneStats },
  { duration: 4, title: story.closing, Component: SceneFinale },
];

/* Backdrop glow per scene, plus the stadium glow behind the tile (2) and the finale (5). */
const glowByScene = [
  { rotate: 0, scale: 1 },
  { rotate: 8, scale: 1.12 },
  { rotate: 14, scale: 1.18 },
  { rotate: 20, scale: 1.1 },
  { rotate: 28, scale: 1.04 },
];
const pillByScene = [false, true, false, false, true];

/* Each scene blurs in from a slight zoom, is fully sharp at rest, and blurs out. */
const sceneVariants: Variants = {
  hidden: { opacity: 0, scale: 1.04, filter: "blur(16px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
    transitionEnd: { filter: "none" },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    filter: "blur(10px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

/* ------------------------------------------------------------------ entry */

export function Story() {
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const pageVisible = usePageVisible();

  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  const seen = useInView(stageRef, { amount: 0.4, once: true });

  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  // Hold the timeline while the CTA has keyboard focus, so it doesn't vanish under the user.
  const [ctaFocused, setCtaFocused] = useState(false);
  const active = !reduce && playing && inView && pageVisible && !ctaFocused;

  // Progress through the current scene (0–1), kept across pauses.
  const progress = useMotionValue(0);
  const elapsed = useRef(0);

  useEffect(() => {
    if (!active) return;
    const duration = scenes[sceneIndex].duration * 1000;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      elapsed.current += now - last;
      last = now;
      if (elapsed.current >= duration) {
        elapsed.current = 0;
        progress.set(0);
        setSceneIndex((i) => (i + 1) % scenes.length);
        return;
      }
      progress.set(elapsed.current / duration);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [active, sceneIndex, progress]);

  const goTo = (index: number) => {
    elapsed.current = 0;
    progress.set(0);
    setSceneIndex(index);
  };

  const { Component } = scenes[sceneIndex];
  const scene = (
    <motion.div
      // Remount on a reduced-motion switch so the scene renders in its final state.
      key={`${sceneIndex}-${reduce}`}
      role="group"
      aria-label={story.controls.scene(sceneIndex + 1, scenes.length)}
      data-story-reveal
      className="absolute inset-x-0 top-0 bottom-16 flex flex-col items-center justify-center px-5 sm:px-10"
      variants={sceneVariants}
      initial={reduce ? false : "hidden"}
      animate={seen || reduce ? "show" : "hidden"}
      exit="exit"
    >
      <Component reduce={reduce} desktop={desktop} onCtaFocus={setCtaFocused} />
    </motion.div>
  );

  return (
    <section id="story" tabIndex={-1} aria-label={story.label} className="px-2 py-2 outline-none sm:px-4 sm:py-4">
      <div
        ref={stageRef}
        data-story-stage
        data-playing={playing && !reduce ? "" : undefined}
        data-story-paused={active ? undefined : ""}
        className="relative isolate h-[70svh] min-h-[520px] overflow-hidden rounded-[1.75rem] bg-stage text-white sm:rounded-[2.5rem] md:h-[80svh]"
      >
        <StageBackdrop>
          <motion.div
            className="absolute inset-[-25%]"
            initial={false}
            animate={glowByScene[sceneIndex]}
            transition={reduce ? { duration: 0 } : { duration: 2.4, ease: EASE }}
          >
            <div className="absolute inset-0 motion-safe:animate-drift" style={glowBackground} />
          </motion.div>
          <motion.div
            className="absolute inset-x-[8%] inset-y-[32%] rounded-full blur-[70px] md:inset-x-[18%] md:inset-y-[37%]"
            style={stadiumBackground}
            initial={false}
            animate={pillByScene[sceneIndex] ? { opacity: 0.85, scale: 1 } : { opacity: 0, scale: 0.4 }}
            transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE }}
          />
        </StageBackdrop>

        {/* Announce scene changes only when the user is driving them. */}
        <div aria-live={active ? "off" : "polite"}>
          {reduce ? scene : <AnimatePresence initial={false}>{scene}</AnimatePresence>}
        </div>

        <StoryControls
          sceneIndex={sceneIndex}
          progress={progress}
          playing={playing}
          reduce={reduce}
          onToggle={() => setPlaying((p) => !p)}
          onSelect={goTo}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ controls */

const controlFocus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function StoryControls({
  sceneIndex,
  progress,
  playing,
  reduce,
  onToggle,
  onSelect,
}: {
  sceneIndex: number;
  progress: MotionValue<number>;
  playing: boolean;
  reduce: boolean;
  onToggle: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      data-story-controls
      className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 transition-opacity duration-300 ease-out-soft motion-reduce:transition-none sm:px-5 sm:pb-4"
    >
      <div
        role="group"
        aria-label={story.controls.label}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-stage/70 py-1 pr-4 pl-1 text-white/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] sm:gap-3"
      >
        {!reduce && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={playing ? story.controls.pause : story.controls.play}
            className={clsx(
              "grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ease-out-soft hover:bg-white/10 hover:text-white",
              controlFocus,
            )}
          >
            {playing ? (
              <Pause aria-hidden="true" className="size-4" fill="currentColor" />
            ) : (
              <Play aria-hidden="true" className="size-4 translate-x-px" fill="currentColor" />
            )}
          </button>
        )}
        <ol className={clsx("flex flex-1 items-center gap-1.5", reduce && "pl-3")}>
          {scenes.map((s, i) => (
            <li key={i} className="flex-1">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={story.controls.goTo(i + 1, scenes.length, s.title)}
                aria-current={i === sceneIndex ? "step" : undefined}
                className={clsx("group/seg block w-full rounded-full py-3.5", controlFocus)}
              >
                <span className="block h-1 overflow-hidden rounded-full bg-white/20 transition-colors duration-300 group-hover/seg:bg-white/35">
                  <motion.span
                    className="block h-full origin-left rounded-full bg-white/80"
                    style={{
                      scaleX:
                        i < sceneIndex || (reduce && i === sceneIndex)
                          ? 1
                          : i === sceneIndex
                            ? progress
                            : 0,
                    }}
                  />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ scene 1: kinetic headline */

const headlineVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
    transitionEnd: { filter: "none" },
  },
};

function SceneHeadline() {
  return (
    <motion.p
      className="mx-auto max-w-5xl text-center font-display text-[2.75rem] leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
      variants={headlineVariants}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <motion.span data-story-reveal variants={wordVariants} className="inline-block">
            {isHighlight(w) ? <HighlightWord word={w} /> : w}
          </motion.span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </motion.p>
  );
}

/* ------------------------------------------------------------------ scene 2: "But…" + app tile */

const pauseVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay: 0.1, ease: EASE },
    transitionEnd: { filter: "none" },
  },
};

// A low-damping spring gives the tile and badge their "pop" overshoot.
const tileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      scale: { type: "spring", stiffness: 260, damping: 14, delay: 0.5 },
      opacity: { duration: 0.3, delay: 0.5 },
    },
  },
};

const badgeVariants: Variants = {
  hidden: { scale: 0 },
  show: { scale: 1, transition: { type: "spring", stiffness: 400, damping: 15, delay: 0.95 } },
};

function SceneTile({ reduce }: SceneProps) {
  return (
    <>
      <motion.p className="font-display text-6xl text-white sm:text-8xl" variants={pauseVariants}>
        {story.pause}
      </motion.p>
      <motion.div className="mt-10 sm:mt-12" variants={tileVariants}>
        <AppTile
          count={
            <>
              <motion.span
                aria-hidden="true"
                variants={badgeVariants}
                className="absolute -top-2.5 -right-2.5 grid h-9 min-w-9 place-items-center rounded-full bg-white px-2 text-sm font-semibold text-stage shadow-[0_8px_24px_-6px_rgb(0_0_0/0.6)]"
              >
                <Counter value={projectCount} delay={1.05} reduce={reduce} />
              </motion.span>
              <span className="sr-only">{story.tileLabel(projectCount)}</span>
            </>
          }
        />
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ scene 3: project cards fan out */

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: EASE } },
};

interface BriefCustom {
  index: number;
  desktop: boolean;
}

/* Rise in as a tilted stack, then fan out: a row on desktop, a column on mobile. Flat at rest. */
const briefCardVariants: Variants = {
  hidden: ({ index }: BriefCustom) => ({
    opacity: 0,
    x: "0%",
    y: `${40 - index * 7}%`,
    scale: 1 - index * 0.06,
    rotate: 0,
    rotateX: index === 0 ? 14 : 0,
    rotateY: index === 0 ? -16 : 0,
  }),
  show: ({ index, desktop }: BriefCustom) => {
    const slot = index - 1; // -1, 0, 1 → left/top, middle, right/bottom
    const stackedY = `${-index * 7}%`;
    const stackedScale = 1 - index * 0.06;
    const tilt = index === 0 ? 1 : 0;
    return {
      opacity: [0, 1, 1],
      x: ["0%", "0%", desktop ? `${slot * 106}%` : "0%"],
      y: [`${40 - index * 7}%`, stackedY, desktop ? `${Math.abs(slot) * 5}%` : `${slot * 108}%`],
      scale: [stackedScale, stackedScale, 1],
      rotate: [0, 0, desktop ? slot * 3 : 0],
      rotateX: [tilt * 14, tilt * 14, 0],
      rotateY: [tilt * -16, tilt * -16, 0],
      transition: { duration: 2, times: [0, 0.35, 1], ease: EASE, delay: 0.25 + index * 0.06 },
    };
  },
};

function SceneBrief({ desktop }: SceneProps) {
  return (
    <>
      <motion.p
        variants={labelVariants}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-white/70 uppercase"
      >
        {story.briefLabel}
      </motion.p>
      <div className="relative mt-6 grid h-[22rem] w-full place-items-center [perspective:1200px] md:mt-10 md:h-[21rem]">
        {briefProjects.map((project, i) => (
          <motion.article
            // Remount on a breakpoint change so the cards fan into the new layout.
            key={`${project.slug}-${desktop}`}
            custom={{ index: i, desktop } satisfies BriefCustom}
            variants={briefCardVariants}
            className="col-start-1 row-start-1 flex h-28 w-[min(21rem,calc(100vw-3rem))] gap-3 rounded-2xl border border-white/10 bg-stage-raised p-3 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_30px_60px_-24px_rgb(0_0_0/0.85)] md:h-[20rem] md:w-[min(17rem,28vw)] md:flex-col md:gap-0 md:p-4"
            style={{ zIndex: briefProjects.length - i }}
          >
            <BriefCardBody project={project} />
          </motion.article>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ scene 4: stat cards + count-up */

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 80 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.2 + index * 0.15, ease: EASE },
  }),
};

const ringVariants: Variants = {
  hidden: { pathLength: 0 },
  show: (index: number) => ({
    pathLength: 1,
    transition: { duration: 1.2, delay: 0.4 + index * 0.15, ease: EASE },
  }),
};

function SceneStats({ reduce }: SceneProps) {
  return (
    <>
      <h3 className="sr-only">{story.stats.label}</h3>
      <div className="flex w-full max-w-sm flex-col gap-3 md:max-w-none md:flex-row md:justify-center md:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={statCardVariants}
            className="relative flex items-center gap-4 rounded-2xl border border-white/10 bg-stage-raised p-4 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_30px_60px_-24px_rgb(0_0_0/0.85)] md:w-[min(16rem,28vw)] md:flex-col md:items-start md:gap-0 md:p-5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white md:size-11">
              <stat.Icon aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0 flex-1 md:mt-5">
              <p className="text-sm text-white/70">{stat.label}</p>
              <p className="mt-0.5 flex items-baseline gap-1.5">
                <span aria-hidden="true" className="font-display text-4xl leading-none text-white md:text-6xl">
                  <Counter value={stat.value} delay={0.4 + i * 0.15} reduce={reduce} />
                </span>
                <span aria-hidden="true" className="text-sm text-white/70">
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
                custom={i}
                variants={ringVariants}
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ scene 5: cursor clicks "+" → CTA */

const CLICK = 1.55; // seconds into the scene when the cursor clicks

const discVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      scale: { type: "spring", stiffness: 220, damping: 16, delay: 0.1 },
      opacity: { duration: 0.4, delay: 0.1 },
    },
  },
};

const pressVariants: Variants = {
  hidden: { scale: 1 },
  show: { scale: [1, 0.88, 1], transition: { duration: 0.35, delay: CLICK, times: [0, 0.4, 1] } },
};

const rippleVariants: Variants = {
  hidden: { opacity: 0, scale: 1 },
  show: {
    opacity: [0, 0.7, 0],
    scale: [1, 2.6],
    transition: { duration: 0.9, delay: CLICK + 0.1, ease: EASE },
  },
};

function cursorVariants(duration: number, delay: number): Variants {
  return {
    hidden: { opacity: 0, x: 170, y: 150, scale: 1 },
    show: {
      opacity: 1,
      x: 10,
      y: 12,
      scale: [1, 0.78, 1],
      transition: {
        default: { duration, delay, ease: EASE },
        opacity: { duration: 0.3, delay },
        scale: { duration: 0.35, delay: CLICK, times: [0, 0.4, 1] },
      },
    },
  };
}

const pointerVariants = cursorVariants(1, 0.45);
const trailVariants = cursorVariants(1.25, 0.5);

const closingVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: CLICK + 0.3, ease: EASE } },
};

function SceneFinale({ reduce, onCtaFocus }: SceneProps) {
  // Release the hold if the scene unmounts while the link is focused.
  useEffect(() => () => onCtaFocus(false), [onCtaFocus]);

  return (
    <>
      <div className="relative">
        <motion.div variants={discVariants}>
          <motion.div variants={pressVariants}>
            <div aria-hidden="true" className="relative grid size-20 place-items-center sm:size-24">
              {!reduce && (
                <>
                  <span className="absolute inset-0 rounded-full border border-accent/60 animate-pulse-ring" />
                  <span className="absolute inset-0 rounded-full border border-accent/40 animate-pulse-ring [animation-delay:1.2s]" />
                  <motion.span
                    variants={rippleVariants}
                    className="absolute inset-0 rounded-full border-2 border-white/80"
                  />
                </>
              )}
              <span className="relative grid size-full place-items-center rounded-full bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_0_60px_4px_color-mix(in_srgb,var(--color-accent)_70%,transparent)]">
                <Plus className="size-8 sm:size-10" strokeWidth={2.25} />
              </span>
            </div>
          </motion.div>
        </motion.div>

        {!reduce && (
          <div aria-hidden="true" className="absolute top-1/2 left-1/2">
            <motion.span
              variants={trailVariants}
              className="absolute -top-1 -left-1 size-8 rounded-full bg-glow-indigo/60 blur-md"
            />
            <motion.svg
              viewBox="0 0 24 24"
              variants={pointerVariants}
              className="absolute -top-0.5 -left-1 size-8 origin-top-left drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-glow-indigo)_90%,transparent)]"
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

      <motion.div variants={closingVariants} className="mt-10 flex flex-col items-center gap-7 text-center">
        <h3 className="font-display text-5xl leading-none text-white sm:text-7xl">{story.closing}</h3>
        <a
          href={story.cta.href}
          onFocus={() => onCtaFocus(true)}
          onBlur={() => onCtaFocus(false)}
          className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-stage shadow-[0_10px_40px_-10px_color-mix(in_srgb,var(--color-accent)_80%,transparent)] transition-transform duration-300 ease-out-soft hover:-translate-y-0.5 focus-visible:outline-white motion-reduce:transition-none"
        >
          {story.cta.label}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </a>
      </motion.div>
    </>
  );
}
