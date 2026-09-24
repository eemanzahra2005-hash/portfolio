import type { MetadataRoute } from "next";
import { site } from "@/data/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.manifest.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: site.manifest.backgroundColor,
    theme_color: site.manifest.themeColor,
    lang: "en",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
