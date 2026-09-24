"use client";

import Lenis from "lenis";
import { MotionConfig, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Space kept above an anchored section so the sticky navbar doesn't cover it. */
const NAV_OFFSET = 80;

interface SmoothScrollApi {
  scrollTo: (target: string | number) => void;
  /** Lock/unlock page scroll (e.g. while a modal menu is open). */
  setLocked: (locked: boolean) => void;
}

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null);

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used within SmoothScroll");
  return ctx;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      autoRaf: true,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  const scrollTo = useCallback((target: string | number) => {
    const el =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
    if (typeof target === "string" && !el) return;

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el ?? (target as number), {
        offset: el ? -NAV_OFFSET : 0,
        force: true,
      });
    } else if (el) {
      el.scrollIntoView({ block: "start" }); // honours scroll-margin-top
    } else {
      window.scrollTo({ top: target as number });
    }
  }, []);

  const setLocked = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    document.body.style.overflow = locked ? "hidden" : "";
    if (locked) lenis?.stop();
    else lenis?.start();
  }, []);

  // Smooth in-page anchor navigation for every <a href="#...">.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href^='#']");
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return;

      e.preventDefault();
      // Wait a frame so a closing menu can release the scroll lock first.
      requestAnimationFrame(() => {
        scrollTo(`#${CSS.escape(el.id)}`);
        history.pushState(null, "", hash);
        el.focus({ preventScroll: true });
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  const api = useMemo(() => ({ scrollTo, setLocked }), [scrollTo, setLocked]);

  return (
    <SmoothScrollContext.Provider value={api}>
      <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>
        {children}
      </MotionConfig>
    </SmoothScrollContext.Provider>
  );
}
