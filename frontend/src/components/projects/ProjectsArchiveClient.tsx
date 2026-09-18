"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ALL_PROJECTS, getAllProjects, ProjectItem } from "./projectsData";
import { ProjectListItem } from "./ProjectListItem";
import { ArrowLeft, ArrowRight, RefreshCw, FolderGit2 } from "lucide-react";

export function ProjectsArchiveClient() {
  const {
    data: rawProjects,
    isLoading,
    isError,
    refetch,
  } = useQuery<any[]>({
    queryKey: ["all-projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data?.data || [];
    },
    placeholderData: ALL_PROJECTS,
    staleTime: 1000 * 30,
    refetchOnMount: true,
  });

  const projects: ProjectItem[] = useMemo(() => {
    return getAllProjects(rawProjects);
  }, [rawProjects]);

  return (
    <main
      id="main-content"
      className="relative min-h-screen bg-[#02040a] text-white selection:bg-[#00d2ff]/20 selection:text-white"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-gradient-to-b from-[#00d2ff]/10 to-transparent blur-[140px]" />
        <div className="absolute top-[40vh] right-0 w-[40vw] h-[40vh] bg-gradient-to-tl from-[#a855f7]/5 to-transparent blur-[160px]" />
      </div>

      {/* Top Header & Navigation Bar */}
      <header className="relative z-20 border-b border-white/[0.06] bg-[#02040a]/80 backdrop-blur-xl sticky top-0">
        <div className="container-site py-4 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-wider text-slate-400 hover:text-[#00d2ff] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#00d2ff] rounded px-2 py-1"
            aria-label="Return to Homepage"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/"
            className="font-display text-sm tracking-widest uppercase font-bold text-slate-300 hover:text-white transition-colors"
            aria-label="Aditya Sahu Homepage"
          >
            AS
          </Link>

          <a
            href="/#contact"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/20"
          >
            <span>Get in touch</span>
          </a>
        </div>
      </header>

      {/* Archive Hero Section */}
      <div className="container-site relative z-10 pt-16 sm:pt-20 pb-12 sm:pb-16 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono tracking-widest uppercase text-[#00d2ff] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse" />
          All Projects
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white tracking-tight mb-6">
          Archive & Explorations
        </h1>

        <div className="glow-line w-24 h-0.5 bg-gradient-to-r from-[#0055ff] to-[#00d2ff] rounded-full shadow-[0_0_15px_#00d2ff] mb-8" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-400 border-b border-white/[0.06] pb-8">
          <p className="text-base sm:text-lg max-w-2xl leading-relaxed">
            A collection of things I&apos;ve built, experimented with, and shipped — spanning AI agents, environmental telemetry, and full-stack systems.
          </p>

          <div className="shrink-0 font-mono text-xs text-slate-400 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-md self-start sm:self-auto">
            {projects.length} Projects Documented
          </div>
        </div>
      </div>

      {/* Vertical Editorial List Section */}
      <div className="container-site relative z-10 pb-28 max-w-6xl mx-auto">
        {isLoading && projects.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <RefreshCw className="w-8 h-8 text-[#00d2ff] animate-spin" />
            <p className="font-mono text-sm text-slate-400">Loading project archive...</p>
          </div>
        ) : isError && projects.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <p className="font-mono text-sm text-rose-400">Failed to load projects from server</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-rose-300 bg-rose-950/20 border border-rose-500/20 hover:border-rose-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <FolderGit2 className="w-12 h-12 text-slate-600" />
            <p className="font-mono text-sm text-slate-400">No projects found in archive</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0" role="list" aria-label="All Projects List">
            {projects.map((project, index) => (
              <ProjectListItem key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Bottom Navigation CTA */}
        <div className="mt-20 pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl text-xs sm:text-sm font-mono tracking-wider text-slate-200 bg-white/[0.03] border border-white/[0.08] hover:border-[#00d2ff]/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 text-[#00d2ff] transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <a
            href="/#contact"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl text-xs sm:text-sm font-mono tracking-wider text-slate-200 bg-white/[0.03] border border-white/[0.08] hover:border-[#00d2ff]/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
          >
            <span>Have a project in mind? Let&apos;s talk</span>
            <ArrowRight className="w-4 h-4 text-[#00d2ff] transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </main>
  );
}
