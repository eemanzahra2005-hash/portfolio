import { ContactCards } from "@/components/contact/ContactCards";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionHeadings } from "@/data/content";

export function Contact() {
  return (
    <section
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="overflow-x-clip py-24 outline-none sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading id="contact-title" content={sectionHeadings.contact} />
        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <ContactCards />
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
