import clsx from "clsx";
import { Mail } from "lucide-react";
import { Fragment, type ComponentType, type SVGProps } from "react";
import { BackToTopButton } from "@/components/BackToTop";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { footer, navLinks, profile } from "@/data/content";

interface Social {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
}

// Empty values (e.g. linkedin: "") are hidden.
const socials: Social[] = [
  { href: profile.github, label: footer.githubLabel, Icon: GithubIcon, external: true },
  { href: profile.linkedin, label: footer.linkedinLabel, Icon: LinkedinIcon, external: true },
  { href: profile.email && `mailto:${profile.email}`, label: footer.emailLabel, Icon: Mail },
].filter((s) => s.href);

const closingWords = footer.closing.split(" ");

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <RevealGroup className="mx-auto w-full max-w-6xl px-5 pt-20 pb-10 sm:px-8 sm:pt-28">
        <RevealItem>
          <p className="font-display text-[clamp(2.75rem,7vw+1rem,6.5rem)] leading-[1] tracking-tight text-foreground">
            {closingWords.map((w, i) => (
              <Fragment key={`${w}-${i}`}>
                {i > 0 && " "}
                <span className={clsx(w === footer.highlight && "italic text-accent")}>{w}</span>
              </Fragment>
            ))}
          </p>
        </RevealItem>

        <RevealItem className="mt-6 sm:mt-8">
          <a
            href={`mailto:${profile.email}`}
            aria-label={footer.emailLabel}
            className="group relative inline-block max-w-full break-all pb-1 text-[clamp(1.25rem,2.5vw+0.75rem,2.25rem)] font-medium tracking-tight text-foreground transition-colors duration-300 hover:text-accent"
          >
            {profile.email}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out-soft group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
            />
          </a>
        </RevealItem>

        <RevealItem className="mt-16 sm:mt-24">
          <nav aria-label={footer.navLabel}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </RevealItem>

        <RevealItem className="mt-8 flex flex-col gap-6 border-t border-border pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
            <span>{footer.copyright(year)}</span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>{footer.builtWith}</span>
          </p>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <ul aria-label={footer.socialLabel} className="flex items-center gap-1">
              {socials.map(({ href, label, Icon, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    aria-label={label}
                    title={label}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="grid size-10 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-accent-soft hover:text-accent"
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <BackToTopButton className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 font-medium text-foreground transition-colors duration-200 hover:border-accent hover:text-accent">
              {footer.backToTop}
            </BackToTopButton>
          </div>
        </RevealItem>
      </RevealGroup>
    </footer>
  );
}
