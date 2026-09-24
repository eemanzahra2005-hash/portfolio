"use client";

import clsx from "clsx";
import { Download, FileText } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { navLinks, profile, ui, type SectionId } from "@/data/content";
import { EASE, useSmoothScroll } from "@/components/motion/SmoothScroll";

const SCROLLED_AT = 20;
const HIDE_AFTER = 120;

function useActiveSection(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Pick the last section (in document order) crossing the middle band.
        const current = ids.filter((id) => visible.has(id)).pop() ?? null;
        setActive(current);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const menuVariants: Variants = {
  closed: { opacity: 0 },
  open: {
    opacity: 1,
    transition: { duration: 0.3, ease: EASE, staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const menuItemVariants: Variants = {
  closed: { opacity: 0, y: 16 },
  open: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const trackedIds = navLinks.map((l) => l.id);

export function Navbar() {
  const { scrollY } = useScroll();
  const { setLocked } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(trackedIds);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > SCROLLED_AT);
    if (y > prev && y > HIDE_AFTER) setHidden(true);
    else if (y < prev) setHidden(false);
  });

  // Scroll lock, Escape to close, focus management for the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    setLocked(true);
    firstLinkRef.current?.focus();
    const button = menuButtonRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        button?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      setLocked(false);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen, setLocked]);

  const showBar = !hidden || menuOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-surface px-4 py-2 text-sm font-medium text-foreground shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {ui.skipToContent}
      </a>

      <motion.header
        initial={false}
        animate={{ y: showBar ? 0 : "-100%" }}
        transition={{ duration: 0.4, ease: EASE }}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled && !menuOpen
            ? "border-border bg-surface/80 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label={ui.mainNav}
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
        >
          <a
            href="#hero"
            aria-label={`${profile.shortName} — ${ui.homeLink}`}
            className="font-display text-2xl leading-none tracking-tight text-foreground"
          >
            {profile.shortName}
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-accent-soft"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={clsx(
                      "relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                      isActive ? "text-accent" : "text-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <CvActions className="hidden md:flex" />

            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? ui.closeMenu : ui.openMenu}
              onClick={() => setMenuOpen((o) => !o)}
              className="relative -mr-2 grid size-11 place-items-center rounded-full text-foreground md:hidden"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <motion.span
                  className="absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current"
                  animate={menuOpen ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current"
                  animate={menuOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={ui.mobileNav}
            data-lenis-prevent
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 flex flex-col bg-background px-5 pt-24 pb-10 sm:px-8 md:hidden"
          >
            <nav aria-label={ui.mobileNav} className="flex-1">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.li key={link.id} variants={menuItemVariants}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={`#${link.id}`}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active === link.id ? "location" : undefined}
                      className={clsx(
                        "block py-2 font-display text-5xl leading-tight tracking-tight",
                        active === link.id ? "text-accent" : "text-foreground",
                      )}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div variants={menuItemVariants}>
              <CvActions />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** "Download CV" opens the PDF in a new tab; the icon button downloads it directly. */
function CvActions({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-1.5", className)}>
      <a
        href={profile.cv}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ui.openCvNewTab}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-surface transition-colors duration-200 hover:bg-accent"
      >
        <FileText className="size-4" aria-hidden="true" />
        {ui.downloadCv}
      </a>
      <a
        href={profile.cv}
        download
        aria-label={ui.downloadCvFile}
        title={ui.downloadCvFile}
        className="grid size-10 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
      >
        <Download className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
