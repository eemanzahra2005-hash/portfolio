"use client";

import { ChartColumn, Cpu, LayoutTemplate, Server, Wrench } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useRef, type ComponentType, type PointerEvent, type SVGProps } from "react";
import { EASE } from "@/components/motion/SmoothScroll";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { skillsSection, type SkillGroup, type SkillIcon } from "@/data/content";

const icons: Record<SkillIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  frontend: LayoutTemplate,
  backend: Server,
  data: ChartColumn,
  tools: Wrench,
  core: Cpu,
};

/** Skill group card: mouse-following spotlight + chips that pop in with the section reveal. */
export function SkillCard({ group }: { group: SkillGroup }) {
  const reduce = useReducedMotion();
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
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden"
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
