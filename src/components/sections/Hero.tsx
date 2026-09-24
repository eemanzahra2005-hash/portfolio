"use client";

import { ArrowRight, Briefcase, Download, GraduationCap, Mail, Phone } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Transition,
  type Variants,
} from "motion/react";
import Image from "next/image";
import { Fragment, useRef, type ComponentType, type SVGProps } from "react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE } from "@/components/motion/SmoothScroll";
import { hero, profile, ui, type HeroBadge } from "@/data/content";

const WORD_STAGGER = 0.08;
const NAME_DELAY = 0.2;
const PHOTO_DELAY = 0.2;
const PHOTO_DURATION = 1.2;

const nameVariants = (reduce: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: reduce
      ? { staggerChildren: 0 }
      : { staggerChildren: WORD_STAGGER, delayChildren: NAME_DELAY },
  },
});

const wordVariants = (reduce: boolean): Variants => ({
  hidden: { y: "110%" },
  visible: { y: 0, transition: reduce ? { duration: 0 } : { duration: 0.9, ease: EASE } },
});

const badgeIcons: Record<HeroBadge["icon"], ComponentType<SVGProps<SVGSVGElement>>> = {
  briefcase: Briefcase,
  graduation: GraduationCap,
};

const badgePositions = [
  "-left-5 -top-6 sm:-left-10 sm:top-8 lg:-left-12 lg:top-10",
  "-right-5 -bottom-6 sm:-right-10 sm:bottom-8 lg:-right-10 lg:bottom-12",
];

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export function Hero() {
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

  const t = (delay: number, duration = 0.8): Transition =>
    reduce ? { duration: 0 } : { duration, delay, ease: EASE };

  const words = profile.name.split(" ");
  const nameEnd = NAME_DELAY + words.length * WORD_STAGGER + 0.3;
  const photoEnd = PHOTO_DELAY + PHOTO_DURATION;
  const tel = `tel:${profile.phone.replace(/[^\d+]/g, "")}`;

  const iconLinks = [
    { href: profile.github, label: hero.githubLabel, Icon: GithubIcon, external: true },
    { href: `mailto:${profile.email}`, label: hero.emailLabel, Icon: Mail, external: false },
    { href: tel, label: hero.phoneLabel, Icon: Phone, external: false },
  ].filter((l) => l.href && l.href !== "tel:" && l.href !== "mailto:");

  return (
    <section
      ref={sectionRef}
      id="hero"
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-x-clip border-b border-border outline-none"
    >
      <HeroBackground reduce={reduce} />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 pb-24 pt-28 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-32">
        {/* Text */}
        <div className="lg:col-span-7">
          <motion.p
            data-reveal
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={t(0.05, 0.6)}
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur-sm sm:text-sm"
          >
            <span className="relative flex size-2" aria-hidden="true">
              {!reduce && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-accent"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.6, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={nameVariants(reduce)}
            initial="hidden"
            animate="visible"
            className="mt-6 font-display text-[clamp(3rem,6.2vw+1rem,6.5rem)] leading-[0.95] tracking-tight text-foreground"
          >
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                {i > 0 && " "}
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] pr-[0.06em] align-bottom">
                  <motion.span
                    data-reveal
                    variants={wordVariants(reduce)}
                    className={
                      word === hero.highlight
                        ? "inline-block italic text-accent"
                        : "inline-block"
                    }
                  >
                    {word}
                  </motion.span>
                </span>
              </Fragment>
            ))}
          </motion.h1>

          <motion.p
            data-reveal
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={t(nameEnd - 0.2)}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            data-reveal
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={t(nameEnd - 0.05)}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href={hero.primaryCta.href}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-foreground/90"
              >
                {hero.primaryCta.label}
                <ArrowRight
                  className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  aria-hidden="true"
                />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface/70 px-6 text-sm font-medium text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-foreground/30 hover:bg-surface"
              >
                <Download className="size-4" aria-hidden="true" />
                {ui.downloadCv}
                <span className="sr-only"> {ui.opensInNewTab}</span>
              </a>
            </Magnetic>
          </motion.div>

          <motion.ul
            data-reveal
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={t(nameEnd + 0.1)}
            aria-label={hero.contactLinks}
            className="mt-8 flex items-center gap-2"
          >
            {iconLinks.map(({ href, label, Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  aria-label={label}
                  title={label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-surface/70 text-muted transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Photo */}
        <div className="order-first lg:order-last lg:col-span-5">
          <motion.div
            style={{ y: photoY }}
            className="relative mx-auto w-[70%] max-w-[20rem] lg:mr-0 lg:w-full lg:max-w-[26rem]"
          >
            <motion.div
              data-reveal-clip
              initial={{ clipPath: "inset(100% 0% 0% 0% round 2rem)" }}
              animate={{
                clipPath: "inset(0% 0% 0% 0% round 2rem)",
                transitionEnd: { clipPath: "none" },
              }}
              transition={t(PHOTO_DELAY, PHOTO_DURATION)}
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-accent-soft shadow-[0_24px_60px_-20px_rgba(28,25,23,0.25)]"
            >
              <motion.div
                data-reveal
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={t(PHOTO_DELAY, PHOTO_DURATION)}
                className="absolute inset-0"
              >
                <Image
                  src={profile.photo}
                  alt={profile.photoAlt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 416px, (min-width: 640px) 320px, 70vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>

            {hero.badges.map((badge, i) => {
              const Icon = badgeIcons[badge.icon];
              return (
                <motion.div
                  key={badge.value}
                  data-reveal
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={t(photoEnd - 0.2 + i * 0.15, 0.7)}
                  className={`absolute ${badgePositions[i]}`}
                >
                  <motion.div
                    animate={reduce ? undefined : { y: [0, -6, 0, 6, 0] }}
                    transition={{
                      duration: i === 0 ? 4.5 : 5.2,
                      delay: i * 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-border/80 bg-white/80 py-2 pl-2 pr-3.5 sm:py-2.5 sm:pl-2.5 sm:pr-4 shadow-[0_12px_32px_-12px_rgba(28,25,23,0.2)] backdrop-blur-md"
                  >
                    <span className="flex size-8 shrink-0 items-center sm:size-9 justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
                        {badge.label}
                      </span>
                      <span className="whitespace-nowrap text-xs font-semibold text-foreground sm:text-sm">
                        {badge.value}
                      </span>
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <ScrollCue reduce={reduce} delay={photoEnd + 0.2} />
    </section>
  );
}

function HeroBackground({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-70 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black_20%,transparent_75%)]"
      />
      <motion.div
        className="absolute -right-40 -top-40 size-[36rem] rounded-full bg-accent-soft blur-3xl will-change-transform"
        animate={reduce ? undefined : { x: [0, -60, 20, 0], y: [0, 40, 80, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-48 -left-40 size-[30rem] rounded-full bg-accent/[0.06] blur-3xl will-change-transform"
        animate={reduce ? undefined : { x: [0, 70, 30, 0], y: [0, -50, 10, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function ScrollCue({ reduce, delay }: { reduce: boolean; delay: number }) {
  return (
    <motion.div
      aria-hidden="true"
      data-reveal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, delay, ease: EASE }}
      className="pointer-events-none absolute inset-x-0 bottom-6 hidden flex-col items-center gap-2 text-muted [@media(min-height:700px)]:flex"
    >
      <span className="flex h-9 w-[22px] justify-center rounded-full border-[1.5px] border-muted/50 pt-1.5">
        <motion.span
          className="size-1 rounded-full bg-muted"
          animate={reduce ? undefined : { y: [0, 10], opacity: [1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: EASE, repeatDelay: 0.3 }}
        />
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.2em]">{hero.scrollCue}</span>
    </motion.div>
  );
}
