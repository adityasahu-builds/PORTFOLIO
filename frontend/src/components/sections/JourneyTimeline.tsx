"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Dynamic Icon Renderer Component
function TimelineIcon({ name }: { name: string }) {
  const IconComponent = (Icons as unknown as Record<string, typeof Icons.Briefcase>)[name];
  if (IconComponent) {
    return <IconComponent className="w-5 h-5" />;
  }
  return <Icons.Briefcase className="w-5 h-5" />;
}

interface Experience {
  _id: string;
  companyName: string;
  role: string;
  employmentType: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  companyLogo?: string;
  companyWebsite?: string;
  description?: string;
  responsibilities: string[];
  achievements: string[];
  technologiesUsed: string[];
  displayOrder: number;
  featured: boolean;
  status: "Active" | "Inactive";
  iconName: string;
}

interface BgParticle {
  x: number;
  y: number;
  opacity: number;
  animY: number;
  animOp: number;
  duration: number;
}

export function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgDesktopRef = useRef<SVGPathElement>(null);
  const svgMobileRef = useRef<SVGPathElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [bgParticles, setBgParticles] = useState<BgParticle[]>([]);

  // Fetch experiences dynamically from backend
  const { data: experiences = [], isLoading, isError, refetch } = useQuery<Experience[]>({
    queryKey: ["experiences-active"],
    queryFn: async () => {
      const res = await api.get("/experience?status=Active");
      return res.data?.data || [];
    },
  });

  // Sort: displayOrder ascending, then startDate descending
  const sortedExperiences = [...experiences].sort((a: Experience, b: Experience) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const milestones = sortedExperiences.map((exp: Experience) => ({
    title: exp.role,
    company: exp.companyName,
    desc: exp.companyName,
    iconName: exp.iconName || "Briefcase",
    companyLogo: exp.companyLogo,
  }));

  useEffect(() => {
    setBgParticles(
      [...Array(15)].map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * 800,
        opacity: Math.random() * 0.5 + 0.1,
        animY: Math.random() * 800,
        animOp: Math.random() * 0.8 + 0.2,
        duration: 10 + Math.random() * 20,
      }))
    );
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isLoading || milestones.length === 0 || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (!isMobile && svgDesktopRef.current) {
        // Desktop: Draw the horizontal line on scroll with scrub
        const pathLength = svgDesktopRef.current.getTotalLength();
        gsap.set(svgDesktopRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        gsap.to(svgDesktopRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            scrub: 1,
            start: "top 70%",
            end: "bottom 30%",
          }
        });

      } else if (isMobile && svgMobileRef.current) {
        // Mobile: Vertical Draw with scrub
        const pathLength = svgMobileRef.current.getTotalLength();
        gsap.set(svgMobileRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        gsap.to(svgMobileRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            scrub: 1,
            start: "top 70%",
            end: "bottom 70%",
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile, milestones, isLoading]);

  // Desktop node positions (percentages)
  const getDesktopNodePosition = (idx: number) => ({
    x: `${((idx + 1) / (milestones.length + 1)) * 100}%`,
    y: '50%', // All nodes exactly on the horizontal line
  });

  // Mobile coordinates - Left-aligned for responsiveness
  const getMobileNodePosition = (idx: number) => ({
    x: '40px', // Shifted left to make room for cards on the right
    y: 100 + idx * 130, // Tighter vertical spacing on mobile
  });

  const mobileTotalHeight = milestones.length * 130 + 80;

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-transparent py-20">
      
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-blue-950/5 to-transparent" />
        {bgParticles.map((p, i) => (
          <motion.div
            key={`bg-particle-${i}`}
            className="absolute w-1 h-1 bg-[#00d2ff] rounded-full blur-[2px]"
            initial={{ x: p.x, y: p.y, opacity: p.opacity }}
            animate={{ y: [null, p.animY], opacity: [null, p.animOp, 0.1] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto">
        
        {/* LOADING STATE */}
        {isLoading ? (
          <div className="w-full py-32 flex items-center justify-center">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 animate-pulse">Loading Timeline...</span>
          </div>
        ) : isError ? (
          <div className="w-full py-32 flex flex-col items-center justify-center text-center gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-red-400">Failed to load journey timeline</span>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-red-500/20 text-red-400 bg-red-950/10 hover:bg-red-950/20 hover:border-red-400 transition-all rounded"
            >
              Retry Connection
            </button>
          </div>
        ) : milestones.length === 0 ? (
          <div className="w-full py-32 flex items-center justify-center">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-650">No milestones currently defined</span>
          </div>
        ) : (
          <>
            {/* DESKTOP VIEW */}
            {!isMobile && (
              <div className="relative w-full h-[400px]">
                {/* SVG Straight Horizontal Line */}
                <svg 
                  className="absolute top-0 left-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(0,210,255,0.8)]" 
                  viewBox="0 0 3200 400"
                  preserveAspectRatio="none"
                >
                  {/* Background faint path */}
                  <path
                    d="M 0 200 L 3200 200"
                    fill="none"
                    stroke="rgba(0, 162, 255, 0.1)"
                    strokeWidth="8"
                  />
                  {/* Animated active path */}
                  <path
                    ref={svgDesktopRef}
                    d="M 0 200 L 3200 200"
                    fill="none"
                    stroke="url(#neonGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_25px_rgba(0,210,255,1)]"
                  />
                  <defs>
                    <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0055ff" />
                      <stop offset="50%" stopColor="#00d2ff" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Nodes */}
                {milestones.map((milestone, idx) => {
                  const pos = getDesktopNodePosition(idx);
                  const isTop = idx % 2 === 0; // Cards alternate top/bottom to avoid overlap
                  return (
                    <div key={idx} className="absolute -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: pos.x, top: pos.y }}>
                      <MagneticNode milestone={milestone} isTop={isTop} index={idx} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* MOBILE VIEW */}
            {isMobile && (
              <div className="relative w-full max-w-[400px] mx-auto py-10 px-4" style={{ height: `${mobileTotalHeight}px` }}>
                {/* SVG Vertical Line */}
                <svg 
                  className="absolute top-0 left-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(0,210,255,0.8)]" 
                  viewBox={`0 0 350 ${mobileTotalHeight}`}
                  preserveAspectRatio="none"
                >
                  {/* Background faint path (shifted to x=40) */}
                  <path
                    d={`M 40 0 L 40 ${mobileTotalHeight}`}
                    fill="none"
                    stroke="rgba(0, 162, 255, 0.1)"
                    strokeWidth="4"
                  />
                  <path
                    ref={svgMobileRef}
                    d={`M 40 0 L 40 ${mobileTotalHeight}`}
                    fill="none"
                    stroke="url(#neonGradientMobile)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_20px_rgba(0,210,255,1)]"
                  />
                  <defs>
                    <linearGradient id="neonGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0055ff" />
                      <stop offset="50%" stopColor="#00d2ff" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Nodes */}
                {milestones.map((milestone, idx) => {
                  const pos = getMobileNodePosition(idx);
                  return (
                    <div key={idx} className="absolute -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: pos.x, top: pos.y }}>
                      <MagneticNode milestone={milestone} isMobile index={idx} />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

interface MagneticNodeProps {
  milestone: {
    title: string;
    company?: string;
    desc: string;
    iconName: string;
    companyLogo?: string;
  };
  isTop?: boolean;
  isMobile?: boolean;
  isLeft?: boolean;
  index: number;
}

// Interactive Sub-component for Nodes
function MagneticNode({ milestone, isTop, isMobile, isLeft, index }: MagneticNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * 0.4);
    y.set(distanceY * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  // Determine card positioning relative to the node
  let cardClasses = "absolute transition-all duration-500 ease-out pointer-events-none z-50 ";
  if (isMobile) {
    cardClasses += "left-12 top-1/2 -translate-y-1/2 w-[240px] text-left ";
  } else {
    cardClasses += isTop ? "bottom-14 left-1/2 -translate-x-1/2 w-[220px] " : "top-14 left-1/2 -translate-x-1/2 w-[220px] ";
  }

  return (
    <motion.div 
      ref={nodeRef}
      className="relative flex items-center justify-center cursor-pointer group z-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      style={{ x: springX, y: springY }}
      whileInView={{ scale: [0, 1.2, 1], opacity: [0, 1] }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Glow bloom */}
      <motion.div 
        animate={{ scale: hovered ? 1.5 : 1, opacity: hovered ? 0.8 : 0.4 }}
        className="absolute w-20 h-20 rounded-full bg-[#00d2ff] blur-[25px] pointer-events-none"
      />

      {/* Pulse rings */}
      <motion.div 
        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-12 h-12 rounded-full border border-[#00d2ff]/50 pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute w-12 h-12 rounded-full border border-[#00d2ff]/30 pointer-events-none"
      />

      {/* Core Node */}
      <motion.div 
        animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 10 : 0 }}
        className="relative w-12 h-12 rounded-full bg-blue-950 border-2 border-[#00d2ff] flex items-center justify-center text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.6)] group-hover:bg-[#00d2ff] group-hover:text-blue-950 transition-colors duration-300"
      >
        <TimelineIcon name={milestone.iconName} />
      </motion.div>

      {/* Hover Particles */}
      {hovered && (
        <>
          {[...Array(6)].map((_, i) => {
            const r1 = ((i * 17) % 10) / 10;
            const r2 = ((i * 23) % 10) / 10;
            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white rounded-full pointer-events-none"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  x: (r1 - 0.5) * 100, 
                  y: (r2 - 0.5) * 100, 
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            );
          })}
        </>
      )}

      {/* Glassmorphism Info Card (Always visible once node appears, no longer needs hover) */}
      <div className={cardClasses}>
        <motion.div 
          initial={{ y: isTop ? 20 : -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
          viewport={{ once: true }}
          className="p-3 md:p-4 rounded-xl border border-blue-500/30 bg-blue-950/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,162,255,0.3)] text-center"
        >
          <div className="flex items-center gap-2 mb-1 justify-center">
            {milestone.companyLogo && (
              <img 
                src={milestone.companyLogo} 
                alt={milestone.company || "Company Logo"} 
                className="w-5 h-5 rounded-full object-cover border border-blue-500/20" 
              />
            )}
            <h4 className="text-white font-bold font-display text-[13px] md:text-sm leading-tight">{milestone.title}</h4>
          </div>
          <p className="text-blue-200/70 text-[11px] md:text-xs font-light leading-snug">{milestone.desc}</p>
        </motion.div>
      </div>

    </motion.div>
  );
}
