"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "./useReducedMotion";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
      // Reduced motion: track the scroll position exactly, without spring easing.
      style={{ scaleX: reduce ? scrollYProgress : smoothed }}
    />
  );
}
