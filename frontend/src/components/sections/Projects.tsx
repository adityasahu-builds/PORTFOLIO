"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "@/lib/gsap";
import { registerGSAPPlugins } from "@/lib/gsap";
import { ProjectShowcaseCard } from "@/components/projects/ProjectShowcaseCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FEATURED_PROJECTS, normalizeProject, ProjectItem } from "@/components/projects/projectsData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Fetch projects from dynamic database endpoint with instant default fallback
  const { data: rawProjects } = useQuery<any[]>({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const res = await api.get("/projects?featured=true");
      return res.data?.data || [];
    },
    placeholderData: FEATURED_PROJECTS,
    staleTime: 1000 * 30,
    refetchOnMount: true,
  });

  // Exactly 3 featured projects dynamically from API/database
  const projects: ProjectItem[] = useMemo(() => {
    if (!rawProjects || rawProjects.length === 0) {
      return FEATURED_PROJECTS;
    }

    const validFromApi = rawProjects
      .filter(
        (p: any) =>
          !p?.title?.toLowerCase()?.includes("portfolio") &&
          !p?.slug?.toLowerCase()?.includes("portfolio")
      )
      .map((p: any, idx: number) => normalizeProject(p, idx));

    // Sort by order/displayOrder ascending
    const sorted = [...validFromApi].sort((a, b) => {
      const orderA = (a as any).order ?? (a as any).displayOrder ?? 0;
      const orderB = (b as any).order ?? (b as any).displayOrder ?? 0;
      return orderA - orderB;
    });

    const top3 = sorted.slice(0, 3);
    if (top3.length === 0) return FEATURED_PROJECTS;

    return top3.map((p, idx) => ({
      ...p,
      number: String(idx + 1).padStart(2, "0"),
    }));
  }, [rawProjects]);

  useEffect(() => {
    if (projects.length === 0) return;

    registerGSAPPlugins();

    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current?.children;

    if (!section || !header || !cards) return;

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        header.querySelectorAll(".split-char"),
        { opacity: 0, y: 30, rotateX: -60 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        header.querySelector(".glow-line"),
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
          },
        }
      );

      // Cards Reveal Animation
      gsap.utils.toArray(cards).forEach((c, idx) => {
        const card = c as Element;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: idx * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Featured Projects section"
      className="relative min-h-screen bg-[#02040a] overflow-hidden"
    >
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Top/Bottom ambient light flares */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[350px] bg-gradient-to-b from-[#00d2ff]/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[45vw] h-[45vh] bg-gradient-to-tl from-[#a855f7]/5 to-transparent blur-[140px]" />
      </div>

      {/* Section Header */}
      <div
        ref={headerRef}
        className="container-site relative z-10 pt-28 pb-14 sm:pt-32 sm:pb-16 flex flex-col items-center text-center"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono tracking-widest uppercase text-[#00d2ff] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse" />
          Featured Projects
        </div>

        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-4 tracking-tight flex flex-wrap justify-center overflow-hidden perspective-[1000px] text-center px-4"
          aria-label="Selected Work by Aditya Sahu"
        >
          {"Selected Work".split(" ").map((word, wIdx, arr) => (
            <span key={wIdx} className="inline-block whitespace-nowrap">
              {word.split("").map((char, cIdx) => (
                <span
                  key={cIdx}
                  className="split-char inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {char}
                </span>
              ))}
              {wIdx !== arr.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          ))}
        </h2>

        <div
          className="glow-line w-20 h-0.5 bg-gradient-to-r from-[#0055ff] to-[#00d2ff] rounded-full shadow-[0_0_15px_#00d2ff] mb-6"
          style={{ transformOrigin: "center" }}
        />

        <p className="text-slate-400 max-w-xl text-sm sm:text-base leading-relaxed px-4">
          A curated selection of intelligent AI systems, disaster telemetry, and high-performance full-stack web applications.
        </p>
      </div>

      {/* 3-Card Grid */}
      <div className="container-site relative z-10">
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          role="list"
          aria-label="Featured Projects List"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              role="listitem"
              className={`h-full ${
                index === 2
                  ? "md:col-span-2 lg:col-span-1 md:max-w-[480px] md:mx-auto lg:max-w-none w-full"
                  : ""
              }`}
            >
              <ProjectShowcaseCard project={project} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* "View More Projects →" CTA Button */}
      <div className="container-site relative z-10 pt-16 sm:pt-20 pb-28 flex justify-center">
        <Link
          href="/projects"
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-mono tracking-wider text-slate-200 bg-white/[0.03] border border-white/[0.08] hover:border-[#00d2ff]/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(0,210,255,0.15)] focus-visible:outline-2 focus-visible:outline-[#00d2ff]"
          aria-label="View all projects in archive"
        >
          <span>View More Projects</span>
          <ArrowRight className="w-4 h-4 text-[#00d2ff] transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
