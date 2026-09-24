"use client";

import clsx from "clsx";
import { motion, type Variants } from "motion/react";
import { Fragment } from "react";
import { EASE } from "@/components/motion/SmoothScroll";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import type { SectionHeadingContent } from "@/data/content";

const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

interface SectionHeadingProps {
  /** Id of the <h2>, referenced by the section's aria-labelledby. */
  id: string;
  content: SectionHeadingContent;
  className?: string;
}

/** Eyebrow ("01 — About") + serif title with masked word reveal + optional subtitle. */
export function SectionHeading({ id, content, className }: SectionHeadingProps) {
  const reduce = useReducedMotion();
  const words = content.title.split(" ");
  const titleEnd = 0.15 + words.length * 0.06;

  const container: Variants = {
    hidden: {},
    visible: { transition: reduce ? {} : { staggerChildren: 0.06, delayChildren: 0.15 } },
  };
  const word: Variants = {
    hidden: { y: "110%" },
    visible: { y: 0, transition: reduce ? { duration: 0 } : { duration: 0.85, ease: EASE } },
  };
  const line: Variants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: reduce ? { duration: 0 } : { duration: 0.8, ease: EASE } },
  };
  const fade: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: titleEnd },
    },
  };

  return (
    <motion.header
      className={clsx("max-w-3xl", className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
        <motion.span
          data-reveal
          aria-hidden="true"
          variants={line}
          className="h-px w-8 origin-left bg-accent"
        />
        <span>
          {content.index} — {content.label}
        </span>
      </p>

      <motion.h2
        id={id}
        variants={container}
        className="mt-5 font-display text-[clamp(2.25rem,4vw+1rem,3.75rem)] leading-[1.05] tracking-tight text-foreground"
      >
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            {i > 0 && " "}
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] pr-[0.06em] align-bottom">
              <motion.span
                data-reveal
                variants={word}
                className={clsx(
                  "inline-block",
                  w.replace(/[^\p{L}\p{N}]/gu, "") === content.highlight && "italic text-accent",
                )}
              >
                {w}
              </motion.span>
            </span>
          </Fragment>
        ))}
      </motion.h2>

      {content.subtitle && (
        <motion.p
          data-reveal
          variants={fade}
          className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {content.subtitle}
        </motion.p>
      )}
    </motion.header>
  );
}
