"use client";

import clsx from "clsx";
import { ChartColumn, Cpu, LayoutTemplate, Server, Wrench } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useRef, type ComponentType, type PointerEvent, type SVGProps } from "react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { EASE } from "@/components/motion/SmoothScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  sectionHeadings,
  skills,
  skillsSection,
  type SkillGroup,
  type SkillIcon,
} from "@/data/content";

const icons: Record<SkillIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  frontend: LayoutTemplate,
  backend: Server,
  data: ChartColumn,
  tools: Wrench,
  core: Cpu,
};

/** 6-col grid on lg: first row 3 cards, second row 2 wider cards. */
function cardSpan(index: number, total: number) {
  const lastRowStart = total - (total % 3 || 3);
  return clsx(
    index >= lastRowStart && total % 3 === 2 ? "lg:col-span-3" : "lg:col-span-2",
    total % 2 === 1 && index === total - 1 && "sm:col-span-2",
  );
}

const allSkills = skills.flatMap((g) => g.items);
const marqueeRows = [allSkills, [...allSkills].reverse()];

export function Skills() {
  return (
    <section
      id="skills"
      tabIndex={-1}
      aria-labelledby="skills-title"
      className="overflow-x-clip border-b border-border py-24 outline-none sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading id="skills-title" content={sectionHeadings.skills} />

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
          {skills.map((group, i) => (
            <RevealItem key={group.title} className={cardSpan(i, skills.length)}>
              <SkillCard group={group} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <SkillsMarquee />
    </section>
  );
}

function SkillCard({ group }: { group: SkillGroup }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const Icon = icons[group.icon];

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  const chipList: Variants = {
    hidden: {},
    visible: { transition: reduce ? {} : { staggerChildren: 0.04, delayChildren: 0.2 } },
  };
  const chip: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: reduce ? { duration: 0 } : { duration: 0.45, ease: EASE },
    },
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in srgb, var(--color-accent) 9%, transparent), transparent 70%)",
        }}
      />

      <div className="relative flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
        <span className="ml-auto rounded-full border border-border px-2.5 py-0.5 text-xs tabular-nums text-muted">
          {skillsSection.countLabel(group.items.length)}
        </span>
      </div>

      <motion.ul variants={chipList} className="relative mt-6 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <motion.li
            key={item}
            data-reveal
            variants={chip}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground/80 transition-colors duration-300 hover:border-accent/20 hover:bg-accent-soft hover:text-accent"
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

/** Decorative: the same skills are listed in the cards above, so it's hidden from assistive tech. */
function SkillsMarquee() {
  const chipClass =
    "shrink-0 rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-foreground/80 sm:text-base";

  return (
    <div aria-hidden="true" className="mt-16 lg:mt-20">
      <div className="group space-y-3 overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:hidden">
        {marqueeRows.map((row, r) => (
          <div
            key={r}
            className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
            style={{ animationDirection: r % 2 ? "reverse" : "normal" }}
          >
            {[...row, ...row].map((item, i) => (
              <span key={i} className={clsx(chipClass, "mr-3")}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto hidden w-full max-w-6xl flex-wrap gap-2 px-5 motion-reduce:flex sm:px-8">
        {allSkills.map((item) => (
          <span key={item} className={chipClass}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
