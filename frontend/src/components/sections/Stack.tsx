"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { registerGSAPPlugins } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Skill {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description?: string;
  featured: boolean;
  displayOrder: number;
  x: string;
  y: string;
  connections: string[];
}

export function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fetch active skills from backend
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills-active"],
    queryFn: async () => {
      const res = await api.get("/skills?status=Active");
      return res.data?.data || [];
    },
  });

  // Sort: Featured skills first, then display order
  const sortedSkills = [...skills].sort((a: Skill, b: Skill) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.displayOrder - b.displayOrder;
  });

  useEffect(() => {
    if (isLoading || sortedSkills.length === 0) return;

    registerGSAPPlugins();
    const section = sectionRef.current;
    if (!section) return;

    // Reset itemRefs length
    itemRefs.current = itemRefs.current.slice(0, sortedSkills.length);

    const ctx = gsap.context(() => {
      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];

      gsap.from(items, {
        opacity: 0,
        scale: 0.8,
        duration: 0.7,
        ease: "back.out(1.4)",
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      // Draw SVG lines
      if (svgRef.current) {
        const lines = svgRef.current.querySelectorAll("line");
        gsap.from(lines, {
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [sortedSkills, isLoading]);

  // Calculate dynamic connections to draw line elements between related nodes
  const linesToDraw: { x1: string; y1: string; x2: string; y2: string }[] = [];
  const drawnKeys = new Set<string>();

  sortedSkills.forEach((skillA: Skill) => {
    if (skillA.connections && Array.isArray(skillA.connections)) {
      skillA.connections.forEach((targetSlug: string) => {
        const skillB = sortedSkills.find((s: Skill) => s.slug === targetSlug);
        if (skillB) {
          const key1 = `${skillA.slug}-${skillB.slug}`;
          const key2 = `${skillB.slug}-${skillA.slug}`;
          if (!drawnKeys.has(key1) && !drawnKeys.has(key2)) {
            drawnKeys.add(key1);
            linesToDraw.push({
              x1: skillA.x,
              y1: skillA.y,
              x2: skillB.x,
              y2: skillB.y,
            });
          }
        }
      });
    }
  });

  return (
    <section
      ref={sectionRef}
      id="stack"
      aria-label="Technology stack section"
      style={{
        padding: "clamp(5rem, 10vh, 8rem) 0",
        background: "var(--bg-surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container-site" style={{ marginBottom: "3rem" }}>
        <SectionLabel number="03" label="Stack" />
      </div>

      {/* Constellation container */}
      <div
        className="container-site"
        style={{ position: "relative", height: "clamp(360px, 50vw, 560px)" }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 animate-pulse">Loading Constellation...</span>
          </div>
        ) : sortedSkills.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-650">No technologies currently defined</span>
          </div>
        ) : (
          <>
            {/* SVG connector lines */}
            <svg
              ref={svgRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--border-active)" stopOpacity="0" />
                  <stop offset="50%" stopColor="var(--border-active)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--border-active)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {linesToDraw.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                  opacity="0.4"
                />
              ))}
            </svg>

            {/* Tech nodes */}
            {sortedSkills.map((tech, i) => (
              <div
                key={tech.slug}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="listitem"
                title={tech.description || ""}
                aria-label={`${tech.title}: ${tech.description || ""}`}
                style={{
                  position: "absolute",
                  left: tech.x,
                  top: tech.y,
                  transform: "translate(-50%, -50%)",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  const inner = el.querySelector(".tech-inner") as HTMLDivElement;
                  if (inner) {
                    inner.style.borderColor = "var(--accent-gold)";
                    inner.style.color = "var(--accent-gold)";
                    inner.style.background = "var(--accent-glow)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  const inner = el.querySelector(".tech-inner") as HTMLDivElement;
                  if (inner) {
                    inner.style.borderColor = "var(--border-subtle)";
                    inner.style.color = "var(--text-muted)";
                    inner.style.background = "transparent";
                  }
                }}
              >
                <div
                  className="tech-inner text-mono-tag"
                  style={{
                    padding: "6px 14px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "2px",
                    color: "var(--text-muted)",
                    background: "transparent",
                    transition: "all 0.3s var(--ease-expo)",
                    whiteSpace: "nowrap",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {tech.title}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
