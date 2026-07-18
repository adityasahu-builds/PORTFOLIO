"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { registerGSAPPlugins } from "@/lib/gsap";
import { ProjectShowcaseCard } from "@/components/projects/ProjectShowcaseCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

import { Project } from "@/components/projects/projectsData";

interface DBProject extends Project {
  _id: string;
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Fetch featured projects from dynamic database endpoint
  const { data: projects = [], isLoading, isError, refetch } = useQuery<DBProject[]>({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const res = await api.get("/projects?featured=true");
      return res.data?.data || [];
    },
  });

  useEffect(() => {
    // Wait until loading is complete and projects exist in the DOM
    if (isLoading || projects.length === 0) return;

    registerGSAPPlugins();

    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current?.children;

    if (!section || !header || !cards) return;

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        header.querySelectorAll(".split-char"),
        { opacity: 0, y: 40, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        header.querySelector(".glow-line"),
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
          },
        }
      );

      gsap.utils.toArray(cards).forEach((c) => {
        const card = c as Element;
        gsap.fromTo(
          card,
          { opacity: 0, y: 100, scale: 0.95, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [projects, isLoading]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Projects section"
      className="relative min-h-screen bg-[#02040a] overflow-hidden"
    >
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Blue fog */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#00d2ff]/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-gradient-to-tl from-[#4DFFB4]/5 to-transparent blur-[150px]" />
      </div>

      {/* Section Header */}
      <div
        ref={headerRef}
        className="container-site relative z-10 pt-32 pb-16 flex flex-col items-center text-center"
      >
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold font-display text-white mb-6 flex flex-wrap justify-center overflow-hidden perspective-[1000px] text-center px-4">
          {"Featured Projects".split(" ").map((word, wIdx, arr) => (
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
        
        <div className="glow-line w-24 h-1 bg-gradient-to-r from-[#0055ff] to-[#00d2ff] rounded-full shadow-[0_0_15px_#00d2ff] mb-8" style={{ transformOrigin: "center" }} />
        
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          A collection of projects focused on performance, clean architecture, user experience, and real-world problem solving.
        </p>
      </div>

      {/* Showcase Cards List */}
      <div ref={cardsRef} className="relative z-10 flex flex-col gap-0">
        {isLoading ? (
          // Premium pulsing skeleton loader cards to prevent layout jumps
          [...Array(3)].map((_, idx) => (
            <div key={idx} className="w-full min-h-screen py-24 flex items-center justify-center select-none">
              <div className="container-site w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24 animate-pulse">
                <div className="w-full lg:w-1/2 h-[350px] rounded-3xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-md shadow-2xl" />
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                  <div className="h-6 w-32 bg-white/[0.02] rounded-lg" />
                  <div className="h-12 w-3/4 bg-white/[0.02] rounded-lg" />
                  <div className="h-24 w-full bg-white/[0.02] rounded-lg" />
                  <div className="h-20 w-full bg-white/[0.01] border border-white/[0.04] rounded-2xl" />
                </div>
              </div>
            </div>
          ))
        ) : isError ? (
          <div className="w-full py-32 flex flex-col items-center justify-center text-center gap-4">
            <p className="text-red-400 font-mono text-sm uppercase tracking-widest">Failed to load projects</p>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-red-500/20 text-red-400 bg-red-950/10 hover:bg-red-950/20 hover:border-red-400 transition-all rounded"
            >
              Retry Connection
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="w-full py-32 flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">No featured projects found</p>
          </div>
        ) : (
          projects.map((project: DBProject, index: number) => (
            <ProjectShowcaseCard key={project._id} project={project} index={index} />
          ))
        )}
      </div>
    </section>
  );
}
