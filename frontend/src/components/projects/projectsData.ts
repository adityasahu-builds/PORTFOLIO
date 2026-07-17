export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  role: string;
  status: string;
  timeline: string;
  description: string;
  problemStatement: string;
  solution: string;
  keyFeatures: string[];
  techStack: string[];
  accentColor: string;
  mockupType: "portfolio" | "restaurant" | "school";
}

export const PROJECTS: Project[] = [
  {
    id: "portfolio-website",
    number: "01",
    title: "Portfolio Website",
    category: "Personal Brand & Showcase",
    role: "Frontend Developer & Designer",
    status: "Currently Building",
    timeline: "Ongoing",
    description:
      "A premium, Awwwards-inspired personal portfolio designed to showcase projects with immersive 3D effects, glassmorphism, and smooth GSAP animations.",
    problemStatement:
      "Traditional portfolios often feel static and fail to capture the user's attention or demonstrate advanced frontend capabilities.",
    solution:
      "Developed a highly interactive, cinematic experience using React, Framer Motion, and GSAP to create a memorable first impression.",
    keyFeatures: [
      "Cinematic GSAP Scroll Animations",
      "Interactive 3D Elements",
      "Custom Cursor & Magnetic Buttons",
      "Dynamic Theming & Neon Glows",
    ],
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"],
    accentColor: "#00d2ff",
    mockupType: "portfolio",
  },
  {
    id: "restaurant-website",
    number: "02",
    title: "Restaurant Platform",
    category: "E-Commerce & Hospitality",
    role: "Full Stack Developer",
    status: "Coming Soon",
    timeline: "Q3 2026",
    description:
      "A modern digital storefront for a premium restaurant featuring online ordering, dynamic menus, and reservation management.",
    problemStatement:
      "Restaurants struggle with clunky third-party ordering systems that dilute their brand and charge high commission fees.",
    solution:
      "Building a bespoke, highly performant platform that keeps customers engaged while streamlining kitchen operations.",
    keyFeatures: [
      "Real-time Order Tracking",
      "Interactive Menu with 3D Models",
      "Seamless Payment Integration",
      "Admin Dashboard for Analytics",
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "Redux", "Stripe"],
    accentColor: "#C8A96E",
    mockupType: "restaurant",
  },
  {
    id: "school-website",
    number: "03",
    title: "School Management System",
    category: "EdTech & Administration",
    role: "Lead Developer",
    status: "Planning",
    timeline: "Q4 2026",
    description:
      "A comprehensive school portal designed to connect students, teachers, and parents with real-time academic tracking and resource sharing.",
    problemStatement:
      "Educational institutions often rely on fragmented software, leading to communication gaps and inefficient data management.",
    solution:
      "Architecting a centralized hub that unifies attendance, grades, and announcements into a single, intuitive interface.",
    keyFeatures: [
      "Role-based Access Control",
      "Live Attendance Tracking",
      "Secure Parent Portal",
      "Automated Grade Reports",
    ],
    techStack: ["Next.js", "PostgreSQL", "Prisma", "TypeScript", "Tailwind CSS"],
    accentColor: "#A78BFA",
    mockupType: "school",
  },
];
