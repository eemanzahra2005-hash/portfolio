"use client";

import { Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type SVGProps,
} from "react";
import { createPortal } from "react-dom";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { EASE } from "@/components/motion/SmoothScroll";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { contactSection, profile } from "@/data/content";
import { LocalTime } from "./LocalTime";

const TOAST_MS = 2200;
const noopSubscribe = () => () => {};
const { cards } = contactSection;

interface Card {
  key: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href?: string;
  linkLabel?: string;
  external?: boolean;
  copyable?: boolean;
}

/** Strips the protocol and "www." for display. */
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const allCards: Card[] = [
  {
    key: "email",
    Icon: Mail,
    label: cards.email,
    value: profile.email,
    href: `mailto:${profile.email}`,
    linkLabel: contactSection.emailLabel,
    copyable: true,
  },
  {
    key: "phone",
    Icon: Phone,
    label: cards.phone,
    value: profile.phone,
    href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
    linkLabel: contactSection.phoneLabel,
  },
  { key: "location", Icon: MapPin, label: cards.location, value: profile.location },
  {
    key: "github",
    Icon: GithubIcon,
    label: cards.github,
    value: displayUrl(profile.github),
    href: profile.github,
    linkLabel: contactSection.githubLabel,
    external: true,
  },
  {
    key: "linkedin",
    Icon: LinkedinIcon,
    label: cards.linkedin,
    value: displayUrl(profile.linkedin),
    href: profile.linkedin,
    linkLabel: contactSection.linkedinLabel,
    external: true,
  },
];

// Empty values (e.g. linkedin: "") are hidden.
const visibleCards = allCards.filter((c) => c.value && (c.href === undefined || c.href));

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts / older browsers.
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}

export function ContactCards() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(profile.email);
    clearTimeout(timer.current);
    setCopied(ok);
    setToast(ok ? contactSection.copiedToast : contactSection.copyFailedToast);
    timer.current = setTimeout(() => {
      setCopied(false);
      setToast(null);
    }, TOAST_MS);
  };

  const iconSwap = {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.6 },
    transition: reduce ? { duration: 0 } : { duration: 0.25, ease: EASE },
  };

  return (
    <div>
      <h3 className="sr-only">{contactSection.cardsLabel}</h3>
      <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {visibleCards.map(({ key, Icon, label, value, href, linkLabel, external, copyable }) => (
          <RevealItem key={key}>
            <div className="group relative flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:border-accent/40 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent hover:shadow-[0_12px_32px_-16px_rgb(28_25_23/0.18)] motion-safe:hover:-translate-y-1 motion-safe:has-[a:focus-visible]:-translate-y-1 sm:p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    aria-label={linkLabel}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="mt-0.5 block truncate font-medium text-foreground transition-colors duration-200 after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent focus-visible:outline-none"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-0.5 truncate font-medium text-foreground">{value}</p>
                )}
              </div>
              {copyable && (
                <button
                  type="button"
                  onClick={onCopy}
                  aria-label={contactSection.copyLabel}
                  className="relative z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <span className="relative grid size-3.5 place-items-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {copied ? (
                        <motion.span key="check" className="absolute inset-0 text-accent" {...iconSwap}>
                          <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                        </motion.span>
                      ) : (
                        <motion.span key="copy" className="absolute inset-0" {...iconSwap}>
                          <Copy className="size-3.5" aria-hidden="true" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <span aria-hidden="true">{copied ? contactSection.copied : contactSection.copy}</span>
                </button>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <LocalTime className="mt-6 flex min-h-5 items-center gap-2 text-sm text-muted" />

      <Toast message={toast} ok={copied} reduce={reduce} />
    </div>
  );
}

/** Small status toast, portalled so fixed positioning isn't affected by transformed ancestors. */
function Toast({ message, ok, reduce }: { message: string | null; ok: boolean; reduce: boolean }) {
  // The portal target only exists on the client.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!mounted) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[65] flex justify-center px-4"
    >
      <AnimatePresence>
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }}
            className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-surface shadow-lg"
          >
            {ok && <Check className="size-4" aria-hidden="true" />}
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
