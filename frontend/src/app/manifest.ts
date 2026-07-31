import type { MetadataRoute } from "next";

/**
 * SEO: manifest.ts
 * Generates /manifest.json via Next.js App Router convention.
 * Enables "Add to Home Screen" on mobile, boosts search engine trust signals,
 * and provides consistent brand metadata for PWA-aware crawlers.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aditya Sahu — Full Stack Developer & AI Engineer Portfolio",
    short_name: "Aditya Sahu",
    description:
      "Portfolio of Aditya Sahu — Full Stack Developer, AI Engineer, and React Developer specializing in MERN stack, Python, machine learning integrations, and modern web applications.",
    start_url: "/",
    display: "standalone",
    background_color: "#030718",
    theme_color: "#030718",
    orientation: "portrait",
    scope: "/",
    lang: "en",
    categories: ["portfolio", "technology", "developer"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/as-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/as-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
