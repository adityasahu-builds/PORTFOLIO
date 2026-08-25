"use client";

import { motion, MotionValue } from "framer-motion";
import { Wrench, Code2 } from "lucide-react";

interface HeroCapabilityCardsProps {
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  reducedMotion?: boolean;
}

interface CapabilityItem {
  id: string;
  title: string;
  skills: string;
  type: "code" | "wrench";
  accentColor?: string;
}

const capabilities: CapabilityItem[] = [
  {
    id: "programming",
    title: "Programming",
    skills: "Python, Android",
    type: "code",
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: "React, TypeScript, Three.js",
    type: "code",
  },
  {
    id: "tools",
    title: "Tools",
    skills: "GSAP",
    type: "wrench",
  },
  {
    id: "aiml",
    title: "AI/ML",
    skills: "Gemini API",
    type: "code",
  },
];

export function HeroCapabilityCards({
  mouseX,
  mouseY,
  reducedMotion,
}: HeroCapabilityCardsProps) {
  return (
    <motion.div
      className="flex flex-col gap-4 w-full max-w-[340px] z-10 select-none"
      style={{
        x: reducedMotion || !mouseX ? 0 : mouseX,
        y: reducedMotion || !mouseY ? 0 : mouseY,
      }}
    >
      {capabilities.map((item, index) => (
        <motion.div
          key={item.id}
          initial={reducedMotion ? {} : { opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.4 + index * 0.12,
          }}
          whileHover={{ y: -2, scale: 1.02 }}
          className="group relative px-6 py-5 rounded-[20px] bg-[rgba(8,16,38,0.68)] border border-[rgba(70,120,230,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-[rgba(56,189,248,0.55)] hover:bg-[rgba(10,22,50,0.78)] hover:shadow-[0_8px_28px_rgba(20,90,220,0.22)] flex items-center justify-between gap-4 overflow-hidden"
        >
          {/* Left Side: Icon + Text */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Icon Container with multi-layer gradient & neon accent */}
            <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-b from-[#244588] via-[#162d64] to-[#0e1c42] border border-[rgba(96,165,250,0.35)] flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105">
              {/* Bottom accent glow inside icon */}
              <div className="absolute bottom-0 inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent opacity-80" />

              {item.type === "code" ? (
                <Code2
                  className="w-5 h-5 text-[#93c5fd] transition-colors duration-200 group-hover:text-cyan-300"
                  strokeWidth={2.3}
                />
              ) : (
                <Wrench
                  className="w-5 h-5 text-[#93c5fd] transition-colors duration-200 group-hover:text-cyan-300"
                  strokeWidth={2.3}
                />
              )}
            </div>

            {/* Labels */}
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-bold text-white tracking-wide leading-tight group-hover:text-cyan-100 transition-colors">
                {item.title}
              </span>
              <span className="text-[12.5px] text-slate-300/80 font-normal truncate mt-1.5 group-hover:text-slate-200 transition-colors">
                {item.skills}
              </span>
            </div>
          </div>

          {/* Right Side: Glowing Blue Indicator Dot */}
          <div className="relative flex items-center justify-center shrink-0 pr-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_10px_2px_rgba(56,189,248,0.85)] ring-2 ring-[rgba(56,189,248,0.2)]" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
