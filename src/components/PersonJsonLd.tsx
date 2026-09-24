import { personSchema, profile, site } from "@/data/content";
import { siteUrl } from "@/lib/site";

/** schema.org Person for search engines. Empty profile links (e.g. linkedin: "") are skipped. */
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: site.description,
    email: `mailto:${profile.email}`,
    url: siteUrl,
    image: `${siteUrl}${profile.photo}`,
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
    alumniOf: { "@type": "CollegeOrUniversity", name: personSchema.alumniOf },
    worksFor: { "@type": "Organization", name: personSchema.worksFor },
    address: {
      "@type": "PostalAddress",
      addressLocality: personSchema.addressLocality,
      addressCountry: personSchema.addressCountry,
    },
    knowsAbout: personSchema.knowsAbout,
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
