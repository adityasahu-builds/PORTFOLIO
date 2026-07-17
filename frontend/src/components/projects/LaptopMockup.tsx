"use client";

import { motion } from "framer-motion";
import { Project } from "./projectsData";
import { Loader2, Construction, CalendarClock } from "lucide-react";

interface LaptopMockupProps {
  project: Project;
  isHovered: boolean;
}

export function LaptopMockup({ project, isHovered }: LaptopMockupProps) {
  const color = project.accentColor;

  return (
    <div className="relative w-full max-w-[600px] mx-auto perspective-[1200px]">
      {/* Glow behind the laptop */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 blur-[60px] rounded-full z-0"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />

      {/* The Laptop Frame */}
      <motion.div
        animate={{
          rotateX: isHovered ? 2 : 5,
          rotateY: isHovered ? -2 : 0,
          y: isHovered ? -10 : 0,
        }}
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        className="relative z-10 w-full rounded-[1.5rem] border-[4px] border-slate-800 bg-[#0a0a0a] shadow-2xl p-2 pb-6"
      >
        {/* Camera Dot */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-700" />
        
        {/* The Screen / Display Area */}
        <div
          className="w-full aspect-[16/10] bg-[#020202] rounded-xl overflow-hidden relative border border-slate-900 mt-2"
        >
          {/* Mockup Inner Content */}
          <ScreenContent project={project} isHovered={isHovered} />
          
          {/* Glass glare effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.08]" />
        </div>

        {/* Laptop Base (bottom lip) */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-[1.25rem] flex justify-center items-end pb-0.5">
          <div className="w-24 h-1 bg-slate-700/50 rounded-t-lg" />
        </div>
      </motion.div>
    </div>
  );
}

function ScreenContent({ project, isHovered }: { project: Project; isHovered: boolean }) {
  // Empty state rendering based on mockup type
  let Icon = Loader2;
  let statusText = "Loading details...";
  
  if (project.status === "Currently Building") {
    Icon = Construction;
    statusText = "Development in progress";
  } else if (project.status === "Coming Soon") {
    Icon = CalendarClock;
    statusText = "Preparing launch";
  } else if (project.status === "Planning") {
    Icon = CalendarClock;
    statusText = "Architecting solution";
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center z-10 bg-grid-slate-900/[0.04]">
      {/* Animated Background Overlay */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
        className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=')]"
      />

      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm"
      >
        <motion.div
          animate={project.status === "Currently Building" ? { rotate: 360 } : {}}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          style={{ color: project.accentColor }}
        >
          <Icon className="w-12 h-12" />
        </motion.div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest uppercase text-slate-500">
            {project.status}
          </span>
          <h4 className="text-xl font-bold text-slate-200">{project.title}</h4>
        </div>

        {/* Loading / Progress Bar */}
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "100%" : "30%" }}
            transition={{ duration: 2, ease: "easeInOut", repeat: isHovered ? Infinity : 0 }}
            className="h-full rounded-full"
            style={{ backgroundColor: project.accentColor }}
          />
        </div>

        <p className="text-sm text-slate-400 max-w-[280px]">
          Project details, screenshots, and live links will be added upon completion.
        </p>
      </motion.div>
    </div>
  );
}
