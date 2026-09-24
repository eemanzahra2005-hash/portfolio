import { Navbar } from "@/components/Navbar";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Reveal } from "@/components/motion/Reveal";
import { sectionTitles, type SectionId } from "@/data/content";

// Placeholder sections, replaced phase by phase.
const sections: SectionId[] = ["contact"];

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        {sections.map((id) => (
            <section
              key={id}
              id={id}
              tabIndex={-1}
              aria-labelledby={`${id}-title`}
              className="flex min-h-screen items-center border-b border-border outline-none last:border-b-0"
            >
              <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
                <Reveal>
                  <h2
                    id={`${id}-title`}
                    className="font-display text-5xl tracking-tight text-foreground sm:text-7xl"
                  >
                    {sectionTitles[id]}
                  </h2>
                </Reveal>
              </div>
            </section>
        ))}
      </main>
    </>
  );
}
