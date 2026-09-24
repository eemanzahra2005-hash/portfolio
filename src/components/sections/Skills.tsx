import clsx from "clsx";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SkillCard } from "@/components/skills/SkillCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionHeadings, skills } from "@/data/content";

/** 6-col grid on lg: first row 3 cards, second row 2 wider cards. */
function cardSpan(index: number, total: number) {
  const lastRowStart = total - (total % 3 || 3);
  return clsx(
    index >= lastRowStart && total % 3 === 2 ? "lg:col-span-3" : "lg:col-span-2",
    total % 2 === 1 && index === total - 1 && "sm:col-span-2",
  );
}

const allSkills = skills.flatMap((g) => g.items);
const marqueeRows = [allSkills, [...allSkills].reverse()];

export function Skills() {
  return (
    <section
      id="skills"
      tabIndex={-1}
      aria-labelledby="skills-title"
      className="overflow-x-clip border-b border-border py-24 outline-none sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading id="skills-title" content={sectionHeadings.skills} />

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
          {skills.map((group, i) => (
            <RevealItem key={group.title} className={cardSpan(i, skills.length)}>
              <SkillCard group={group} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <SkillsMarquee />
    </section>
  );
}

/** Decorative: the same skills are listed in the cards above, so it's hidden from assistive tech. */
function SkillsMarquee() {
  const chipClass =
    "shrink-0 rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-foreground/80 sm:text-base";

  return (
    <div aria-hidden="true" className="mt-16 lg:mt-20">
      <div className="group space-y-3 overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:hidden">
        {marqueeRows.map((row, r) => (
          <div
            key={r}
            className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
            style={{ animationDirection: r % 2 ? "reverse" : "normal" }}
          >
            {[...row, ...row].map((item, i) => (
              <span key={i} className={clsx(chipClass, "mr-3")}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto hidden w-full max-w-6xl flex-wrap gap-2 px-5 motion-reduce:flex sm:px-8">
        {allSkills.map((item) => (
          <span key={item} className={chipClass}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
