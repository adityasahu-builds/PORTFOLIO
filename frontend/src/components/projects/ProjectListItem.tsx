"use client";

import Image from "next/image";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { ProjectItem } from "./projectsData";

interface ProjectListItemProps {
  project: ProjectItem;
  index: number;
}

export function ProjectListItem({ project, index }: ProjectListItemProps) {
  const accentColor = project.accentColor || "#00d2ff";

  return (
    <article
      aria-label={`Project: ${project.title}`}
      className="group relative border-t border-white/[0.08] hover:border-white/[0.2] transition-colors duration-300 py-10 sm:py-14 lg:py-16"
    >
      {/* Subtle row highlight on hover */}
      <div
        className="absolute inset-x-0 inset-y-2 bg-white/[0.015] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Row Header / Meta */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-sm sm:text-base font-bold tracking-wider px-2.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]"
            style={{ color: accentColor }}
          >
            {project.number}
          </span>
          {project.category && (
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              {project.category}
            </span>
          )}
        </div>

        {project.featured && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider uppercase text-[#00d2ff]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse" />
            Featured
          </span>
        )}
      </div>

      {/* Structured Content Layout: Desktop 2-column, Mobile stacked */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
        {/* Left / Primary Information */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight group-hover:text-[#00d2ff] transition-colors duration-300">
            {project.title}
          </h3>

          {/* Mobile Image Insertion: On mobile/tablet screens (< 1024px), display image right under title */}
          <div className="block lg:hidden w-full my-2">
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-950/80 border border-white/[0.08]">
              <Image
                src={project.image}
                alt={`${project.title} project preview`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {project.description}
          </p>

          {/* Technology Tags */}
          <div
            className="flex flex-wrap items-center gap-2 pt-2"
            role="list"
            aria-label={`Technologies used in ${project.title}`}
          >
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                role="listitem"
                className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 group-hover:border-white/[0.14] transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} on GitHub`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium text-slate-200 bg-white/[0.04] border border-white/[0.09] hover:bg-white/[0.09] hover:text-white hover:border-white/20 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#00d2ff]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

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

        {/* Right / Visual Area (Desktop Viewport) */}
        <div className="hidden lg:block w-full lg:w-2/5 shrink-0">
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-950/80 border border-white/[0.08] group-hover:border-white/[0.2] transition-all duration-300 shadow-xl group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
            <Image
              src={project.image}
              alt={`${project.title} project preview`}
              fill
              sizes="(max-width: 1440px) 40vw, 500px"
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
              priority={index < 2}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </article>
  );
}
