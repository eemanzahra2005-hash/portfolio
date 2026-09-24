"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE } from "./SmoothScroll";

const DURATION = 0.7;
const STAGGER = 0.08;
const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds. */
  delay?: number;
}

/** Fades and slides content up 24px the first time it enters the viewport. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className={className}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={reduce ? { duration: 0 } : { duration: DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its RevealItem children (0.08s apart). */
export function RevealGroup({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: reduce
            ? { staggerChildren: 0 }
            : { staggerChildren: STAGGER, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: Omit<RevealProps, "delay">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className={className}
      variants={itemVariants}
      transition={reduce ? { duration: 0 } : { duration: DURATION, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
