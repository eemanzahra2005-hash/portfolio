import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { notFoundPage } from "@/data/content";

export const metadata: Metadata = {
  title: notFoundPage.title,
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_20%,transparent_75%)]"
      />

      <Reveal>
        <h1 className="font-display text-[clamp(7rem,22vw,14rem)] leading-none tracking-tight text-foreground motion-safe:animate-float">
          <span aria-hidden="true">
            {[...notFoundPage.code].map((ch, i, all) => (
              // Middle digit in italic accent, like the highlighted word in section titles.
              <span key={i} className={i === Math.floor(all.length / 2) ? "italic text-accent" : undefined}>
                {ch}
              </span>
            ))}
          </span>
          <span className="sr-only">
            {notFoundPage.code} — {notFoundPage.title}
          </span>
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-6 text-lg text-muted sm:text-xl">{notFoundPage.message}</p>
      </Reveal>

      <Reveal delay={0.2} className="mt-10">
        <Magnetic>
          <Link
            href="/"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-accent"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-out-soft motion-safe:group-hover:-translate-x-1"
            />
            {notFoundPage.cta}
          </Link>
        </Magnetic>
      </Reveal>
    </main>
  );
}
