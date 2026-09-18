import type { Metadata } from "next";
import { ProjectsArchiveClient } from "@/components/projects/ProjectsArchiveClient";

export const metadata: Metadata = {
  title: "All Projects — Aditya Sahu",
  description:
    "Complete project archive of Aditya Sahu. Explore AI platforms, full-stack applications, intelligent agents, and engineering explorations.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "All Projects — Aditya Sahu",
    description:
      "A complete archive of software platforms, AI applications, and engineering projects built by Aditya Sahu.",
    url: "https://adityasahubuilds.dev/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsArchiveClient />;
}
