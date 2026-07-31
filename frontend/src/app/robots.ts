import type { MetadataRoute } from "next";

/**
 * SEO: robots.ts
 * Generates /robots.txt at build time via Next.js App Router convention.
 * Allows all crawlers to index the site, disallows the admin panel,
 * and provides sitemap location for Google Search Console.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://adityasahu.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
