"use client";

import Image from "next/image";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { ProjectItem } from "./projectsData";

interface ProjectShowcaseCardProps {
  project: ProjectItem;
  index: number;
}

export function ProjectShowcaseCard({ project }: ProjectShowcaseCardProps) {
  const accentColor = project.accentColor || "#00d2ff";

  return (
    <article
      aria-label={`Featured Project: ${project.title}`}
      className="group relative flex flex-col h-full rounded-2xl bg-[#090d16]/85 border border-white/[0.08] hover:border-white/[0.22] transition-all duration-300 ease-out overflow-hidden backdrop-blur-md hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]"
    >
      {/* Subtle top/corner glow on hover */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      {/* Media Thumbnail Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950/80 border-b border-white/[0.06]">
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
          priority={project.number === "01"}
        />

        {/* Gradient vignette for depth & seamless blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-black/30 opacity-70 pointer-events-none" />

        {/* Project Number Badge */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="font-mono text-xs font-semibold tracking-wider">{project.number}</span>
        </div>

        {/* Category Pill (if present) */}
        {project.category && (
          <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-slate-300 shadow-sm">
            <span className="font-mono text-[10px] tracking-wider uppercase">{project.category}</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-6 sm:p-7 justify-between gap-6">
        <div className="flex flex-col gap-3">
          {/* Title */}
          <h3 className="text-2xl font-bold font-display text-white tracking-tight group-hover:text-[#00d2ff] transition-colors duration-300">
            {project.title}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Technology Tags */}
          <div
            className="flex flex-wrap gap-1.5 pt-2"
            role="list"
            aria-label={`Technologies used in ${project.title}`}
          >
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                role="listitem"
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.07] text-slate-300 group-hover:border-white/[0.12] transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-white/[0.06] flex flex-wrap items-center gap-3 mt-auto">
          {/* GitHub Button */}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium text-slate-200 bg-white/[0.04] border border-white/[0.09] hover:bg-white/[0.09] hover:text-white hover:border-white/20 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#00d2ff]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}

          {/* Live Demo Button — only rendered if liveUrl exists! */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View live demo of ${project.title}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold text-black bg-gradient-to-r from-[#00d2ff] to-[#00a6ff] hover:from-[#33dcff] hover:to-[#1ab0ff] transition-all duration-200 shadow-[0_2px_10px_rgba(0,210,255,0.25)] hover:shadow-[0_4px_16px_rgba(0,210,255,0.4)] focus-visible:outline-2 focus-visible:outline-[#00d2ff]"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export { ProjectShowcaseCard as ProjectCard };
