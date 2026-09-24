import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/motion/Reveal";
import { sectionTitles, type SectionId } from "@/data/content";

const sections: SectionId[] = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {sections.map((id) => {
          const Heading = id === "hero" ? "h1" : "h2";
          return (
            <section
              key={id}
              id={id}
              tabIndex={-1}
              aria-labelledby={`${id}-title`}
              className="flex min-h-screen items-center border-b border-border outline-none last:border-b-0"
            >
              <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
                <Reveal>
                  <Heading
                    id={`${id}-title`}
                    className="font-display text-5xl tracking-tight text-foreground sm:text-7xl"
                  >
                    {sectionTitles[id]}
                  </Heading>
                </Reveal>
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
