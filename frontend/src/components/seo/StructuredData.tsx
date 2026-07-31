/**
 * SEO: StructuredData.tsx
 * Renders production-grade JSON-LD schema markup into the document <head>.
 * Supports: Person, WebSite, ProfilePage, ItemList (projects), BreadcrumbList.
 * Google-validated schema.org vocabulary — no keyword stuffing.
 */

interface Project {
  _id?: string;
  title: string;
  description?: string;
  liveUrl?: string;
  githubUrl?: string;
  number?: string;
  category?: string;
}

interface PersonalInfo {
  hero?: {
    fullName?: string;
    professionalTitle?: string;
    heroDescription?: string;
    availabilityStatus?: string;
  };
  about?: {
    location?: string;
    nationality?: string;
    longBiography?: string;
  };
  contact?: {
    primaryEmail?: string;
    phone?: string;
    city?: string;
    country?: string;
  };
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    leetcode?: string;
  };
}

interface StructuredDataProps {
  personalInfo?: PersonalInfo;
  projects?: Project[];
  siteUrl?: string;
}

export function StructuredData({
  personalInfo,
  projects = [],
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adityasahu.dev",
}: StructuredDataProps) {
  const fullName = personalInfo?.hero?.fullName || "Aditya Sahu";
  const jobTitle =
    personalInfo?.hero?.professionalTitle ||
    "Full Stack Developer & AI Engineer";
  const email = personalInfo?.contact?.primaryEmail || "";
  const location =
    personalInfo?.about?.location ||
    personalInfo?.contact?.city ||
    "Mandsaur, Madhya Pradesh, India";
  const githubUrl =
    personalInfo?.socialLinks?.github || "https://github.com/adityasahu";
  const linkedinUrl =
    personalInfo?.socialLinks?.linkedin ||
    "https://linkedin.com/in/adityasahu";
  const twitterUrl = personalInfo?.socialLinks?.twitter || "";
  const bio =
    personalInfo?.about?.longBiography ||
    "Full Stack Developer and AI Engineer specializing in React, Node.js, Express, MongoDB (MERN Stack), Python, and Machine Learning integrations. Building scalable, modern web applications.";

  /* ── Person Schema ──────────────────────────────────────── */
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: fullName,
    url: siteUrl,
    image: {
      "@type": "ImageObject",
      url: `${siteUrl}/aditya.jpg`,
      width: 800,
      height: 800,
    },
    jobTitle: [
      "Full Stack Developer",
      "AI Engineer",
      "React Developer",
      "MERN Stack Developer",
      "Software Developer",
    ],
    description: bio,
    ...(email && { email }),
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressCountry: personalInfo?.about?.nationality || "IN",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Maharana Pratap Engineering College, Mandsaur",
    },
    knowsAbout: [
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "TypeScript",
      "JavaScript",
      "Python",
      "Machine Learning",
      "Artificial Intelligence",
      "Tailwind CSS",
      "REST APIs",
      "Framer Motion",
      "Three.js",
      "Git",
      "Figma",
    ],
    sameAs: [
      githubUrl,
      linkedinUrl,
      ...(twitterUrl ? [twitterUrl] : []),
      ...(personalInfo?.socialLinks?.instagram
        ? [personalInfo.socialLinks.instagram]
        : []),
    ].filter(Boolean),
  };

  /* ── WebSite Schema ─────────────────────────────────────── */
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: `${fullName} — Full Stack Developer & AI Engineer Portfolio`,
    description: `Official portfolio of ${fullName}, a Full Stack Developer and AI Engineer specializing in React, MERN Stack, Python, and Machine Learning. Open to internship and freelance opportunities.`,
    author: { "@id": `${siteUrl}/#person` },
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  /* ── ProfilePage Schema ─────────────────────────────────── */
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: `${fullName} — Software Developer Portfolio`,
    description: `Portfolio and profile of ${fullName}, a Full Stack Developer, AI/ML Engineer, React Developer, and MERN Stack Developer. View projects, skills, education, and contact details.`,
    mainEntity: { "@id": `${siteUrl}/#person` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${siteUrl}/#about`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Projects",
          item: `${siteUrl}/#projects`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Contact",
          item: `${siteUrl}/#contact`,
        },
      ],
    },
  };

  /* ── ItemList Schema (Projects) ─────────────────────────── */
  const projectListSchema =
    projects.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${siteUrl}/#projects`,
          name: `Featured Projects by ${fullName}`,
          description: `A curated list of software development projects by ${fullName}, showcasing full-stack web applications, AI integrations, and React/MERN Stack development.`,
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "SoftwareApplication",
              name: project.title,
              description: project.description || "",
              applicationCategory: "WebApplication",
              author: { "@id": `${siteUrl}/#person` },
              ...(project.liveUrl && { url: project.liveUrl }),
              ...(project.githubUrl && {
                codeRepository: project.githubUrl,
              }),
            },
          })),
        }
      : null;

  const schemas = [
    personSchema,
    websiteSchema,
    profilePageSchema,
    ...(projectListSchema ? [projectListSchema] : []),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Controlled JSON-LD schema data, not user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
