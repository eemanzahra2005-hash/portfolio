import { Award, GraduationCap } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  aboutSection,
  certifications,
  education,
  experience,
  profile,
  projects,
  sectionHeadings,
  skills,
} from "@/data/content";

const currentEducation = education[0];
const semester = Number.parseInt(currentEducation?.detail ?? "", 10);

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  ordinal?: boolean;
}

const stats: Stat[] = [
  { value: experience.length, label: aboutSection.stats.roles },
  { value: projects.length, label: aboutSection.stats.projects },
  {
    value: skills.reduce((sum, g) => sum + g.items.length, 0),
    label: aboutSection.stats.technologies,
    suffix: "+",
  },
  ...(Number.isFinite(semester)
    ? [{ value: semester, label: aboutSection.stats.semester, ordinal: true }]
    : []),
];

interface Credential {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  kind: string;
  title: string;
  org: string;
  period: string;
}

const credentials: Credential[] = [
  ...education.map((e) => ({
    Icon: GraduationCap,
    kind: aboutSection.educationLabel,
    title: e.degree,
    org: e.school,
    period: e.period,
  })),
  ...certifications.map((c) => ({
    Icon: Award,
    kind: aboutSection.certificationLabel,
    title: c.title,
    org: c.issuer,
    period: c.period,
  })),
];

export function About() {
  return (
    <section
      id="about"
      tabIndex={-1}
      aria-labelledby="about-title"
      className="border-b border-border py-24 outline-none sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeading id="about-title" content={sectionHeadings.about} />
            <Reveal delay={0.1}>
              <p className="mt-8 text-lg leading-relaxed text-foreground/85 sm:text-xl sm:leading-relaxed">
                {profile.about}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-base leading-relaxed text-muted">
                {aboutSection.currently}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-12">
            <h3 className="sr-only">{aboutSection.statsLabel}</h3>
            <RevealGroup className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat) => (
                <RevealItem key={stat.label}>
                  <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-surface p-5 shadow-sm transition duration-300 ease-out-soft hover:-translate-y-1 hover:border-accent hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      ordinal={stat.ordinal}
                      className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl"
                    />
                    <span className="text-sm text-muted">{stat.label}</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        <RevealGroup className="mt-16 grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:mt-20">
          {credentials.map(({ Icon, kind, title, org, period }) => (
            <RevealItem key={`${title}-${org}`}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                    {kind}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted">{org}</p>
                  <p className="mt-2 text-xs text-muted">{period}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
