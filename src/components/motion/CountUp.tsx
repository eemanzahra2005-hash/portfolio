"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface CountUpProps {
  value: number;
  /** Appended to the number, e.g. "+". */
  suffix?: string;
  /** Render as an English ordinal (1st, 2nd, 5th…). */
  ordinal?: boolean;
  className?: string;
}

function ordinalSuffix(n: number) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  return ["th", "st", "nd", "rd"][n % 10] ?? "th";
}

function formatValue(n: number, suffix: string, ordinal: boolean) {
  return `${n}${ordinal ? ordinalSuffix(n) : ""}${suffix}`;
}

/**
 * Counts from 0 to `value` the first time it scrolls into view. Server HTML holds the final
 * value (no-JS / reduced motion show it as-is); screen readers only ever get the final value.
 */
export function CountUp({ value, suffix = "", ordinal = false, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion() ?? false;
  const final = formatValue(value, suffix, ordinal);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = formatValue(value, suffix, ordinal);
      return;
    }
    if (!inView) {
      el.textContent = formatValue(0, suffix, ordinal);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = formatValue(Math.round(v), suffix, ordinal);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix, ordinal]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
