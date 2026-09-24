import { FeaturedProjects } from "@/components/projects/FeaturedProjects";
import { MoreOnGithub } from "@/components/projects/MoreOnGithub";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionHeadings } from "@/data/content";

/** Server component: featured grid is interactive (client), the GitHub list is fetched on the server. */
export function Projects() {
  return (
    <section
      id="projects"
      tabIndex={-1}
      aria-labelledby="projects-title"
      className="overflow-x-clip border-b border-border py-24 outline-none sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading id="projects-title" content={sectionHeadings.projects} />
        <FeaturedProjects />
        <MoreOnGithub />
      </div>
    </section>
  );
}
