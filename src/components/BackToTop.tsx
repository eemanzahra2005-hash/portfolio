"use client";

import clsx from "clsx";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState, type ReactNode } from "react";
import { EASE, useSmoothScroll } from "@/components/motion/SmoothScroll";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { footer } from "@/data/content";

const SHOW_AFTER = 600;
const RING_RADIUS = 22;

/** Scrolls to the top (through Lenis) and moves focus back to the start of the page. */
function useBackToTop() {
  const { scrollTo } = useSmoothScroll();
  return () => {
    scrollTo(0);
    document.getElementById("main")?.focus({ preventScroll: true });
  };
}

interface BackToTopButtonProps {
  className?: string;
  children?: ReactNode;
}

/** Inline "Back to top" button used in the footer; the arrow nudges up on hover. */
export function BackToTopButton({ className, children }: BackToTopButtonProps) {
  const toTop = useBackToTop();
  return (
    <button type="button" onClick={toTop} className={clsx("group", className)}>
      {children}
      <ArrowUp
        aria-hidden="true"
        className="size-4 motion-safe:group-hover:animate-nudge-up"
      />
    </button>
  );
}

/** Floating circular button with a scroll-progress ring; appears after 600px of scroll. */
export function BackToTopFloating() {
  const reduce = useReducedMotion();
  const toTop = useBackToTop();
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > SHOW_AFTER));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={toTop}
          aria-label={footer.backToTop}
          title={footer.backToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }}
          className="group fixed right-4 bottom-4 z-30 grid size-12 place-items-center rounded-full bg-surface/90 text-foreground shadow-[0_8px_24px_-12px_rgb(28_25_23/0.3)] backdrop-blur transition-colors duration-200 hover:text-accent sm:right-6 sm:bottom-6"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="absolute inset-0 size-full -rotate-90"
          >
            <circle
              cx="24"
              cy="24"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="2"
              className="stroke-border"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-accent"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp
            aria-hidden="true"
            className="relative size-4 motion-safe:group-hover:animate-nudge-up"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
