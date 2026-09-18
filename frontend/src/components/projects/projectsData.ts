export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image: string;
  featured: boolean;
  accentColor?: string;
  category?: string;
}

export interface Project {
  id?: string;
  _id?: string;
  number?: string;
  title: string;
  category?: string;
  role?: string;
  status?: string;
  timeline?: string;
  description: string;
  problemStatement?: string;
  solution?: string;
  keyFeatures?: string[];
  technologies?: string[];
  techStack?: string[];
  accentColor?: string;
  githubUrl?: string;
  gitHubUrl?: string;
  liveUrl?: string;
  image?: string;
  thumbnail?: string;
  featured?: boolean;
  mockupType?: "portfolio" | "restaurant" | "school" | string;
}

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "cv-analyzer",
    number: "01",
    title: "CV Analyzer",
    description:
      "AI-powered resume analysis platform that analyzes CVs, evaluates ATS compatibility, identifies improvement areas, and helps users improve their resumes.",
    technologies: [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Express",
      "Gemini",
      "Groq",
    ],
    githubUrl: "https://github.com/adityasahu-builds/cv_analyzer",
    liveUrl: "https://cv-analyzer-chi-five.vercel.app",
    image: "/projects/cv-analyzer.png",
    featured: true,
    accentColor: "#00d2ff",
    category: "AI & Career Tech",
  },
  {
    id: "ultron",
    number: "02",
    title: "Ultron",
    description:
      "A personal AI assistant combining custom natural-language understanding, voice interaction and AI-powered task processing.",
    technologies: [
      "Flutter",
      "Dart",
      "Groq",
      "Gemini",
      "Whisper",
      "Custom NLU",
    ],
    githubUrl: "https://github.com/adityasahu-builds",
    image: "/projects/ultron.png",
    featured: true,
    accentColor: "#a855f7",
    category: "AI Assistant & NLU",
  },
  {
    id: "aeris",
    number: "03",
    title: "AERIS",
    description:
      "An intelligent disaster-management platform designed for environmental monitoring, situational awareness and disaster-response support.",
    technologies: [
      "Next.js",
      "TypeScript",
      "APIs",
      "Maps",
      "Weather/Telemetry data",
    ],
    githubUrl: "https://github.com/adityasahu-builds",
    image: "/projects/aeris.jpg",
    featured: true,
    accentColor: "#38bdf8",
    category: "Disaster Management & Telemetry",
  },
];

export const ALL_PROJECTS: ProjectItem[] = [
  ...FEATURED_PROJECTS,
  {
    id: "restaurant-platform",
    number: "04",
    title: "Restaurant Platform",
    description:
      "A modern digital storefront for a premium dining brand featuring online ordering, dynamic menus, and reservation management.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Redux", "Stripe"],
    githubUrl: "https://github.com/adityasahu-builds",
    image: "/projects/cv-analyzer.png",
    featured: false,
    accentColor: "#C8A96E",
    category: "E-Commerce & Hospitality",
  },
  {
    id: "school-management",
    number: "05",
    title: "School Management System",
    description:
      "A comprehensive academic portal connecting students, faculty, and administrators with real-time tracking and reporting.",
    technologies: ["Next.js", "PostgreSQL", "Prisma", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/adityasahu-builds",
    image: "/projects/aeris.jpg",
    featured: false,
    accentColor: "#A78BFA",
    category: "EdTech & Administration",
  },
];

export const PROJECTS: ProjectItem[] = FEATURED_PROJECTS;

export function normalizeProject(raw: any, index: number): ProjectItem {
  const number = raw.number || String(index + 1).padStart(2, "0");
  const title = raw.title || "";
  const id = raw.id || raw._id || raw.slug || `project-${number}`;
  const description = raw.description || "";
  const technologies = raw.technologies || raw.techStack || [];
  const githubUrl = raw.githubUrl || raw.gitHubUrl || "https://github.com/adityasahu-builds";
  const liveUrl = raw.liveUrl && raw.liveUrl.trim() !== "" ? raw.liveUrl : undefined;
  
  // Default image fallback if none provided
  const fallbackImage =
    index === 0
      ? "/projects/cv-analyzer.png"
      : index === 1
      ? "/projects/ultron.png"
      : index === 2
      ? "/projects/aeris.jpg"
      : "/projects/cv-analyzer.png";
      
  const image = raw.image || raw.thumbnail || fallbackImage;
  const featured = raw.featured ?? (index < 3);
  const accentColor =
    raw.accentColor ||
    (index === 0 ? "#00d2ff" : index === 1 ? "#a855f7" : index === 2 ? "#38bdf8" : "#C8A96E");
  const category = raw.category || "";

  return {
    id,
    number,
    title,
    description,
    technologies,
    githubUrl,
    liveUrl,
    image,
    featured,
    accentColor,
    category,
  };
}

export function getAllProjects(rawProjects?: any[]): ProjectItem[] {
  if (!rawProjects || rawProjects.length === 0) {
    return ALL_PROJECTS;
  }

  // Exclude any portfolio self-showcase strictly
  const nonPortfolio = rawProjects.filter(
    (p: any) =>
      !p?.title?.toLowerCase()?.includes("portfolio") &&
      !p?.slug?.toLowerCase()?.includes("portfolio")
  );

  const normalized = nonPortfolio.map((p, idx) => normalizeProject(p, idx));

  // Sort by order/displayOrder ascending
  const sorted = [...normalized].sort((a, b) => {
    const orderA = (a as any).order ?? (a as any).displayOrder ?? 0;
    const orderB = (b as any).order ?? (b as any).displayOrder ?? 0;
    return orderA - orderB;
  });

  return sorted.map((p, idx) => ({
    ...p,
    number: String(idx + 1).padStart(2, "0"),
  }));
}
