"use client";

import { motion } from "framer-motion";

interface HeroStatsBarProps {
  reducedMotion?: boolean;
}

const STATS = [
  {
    value: "10+",
    label: "Projects Completed",
    gradient: "from-white via-slate-100 to-slate-300",
  },
  {
    value: "3+",
    label: "Years of Experience",
    gradient: "from-white via-slate-100 to-slate-300",
  },
  {
    value: "AI/ML",
    label: "Models Deployed",
    gradient: "from-[#00d2ff] via-[#3b82f6] to-[#a855f7]",
  },
  {
    value: "100%",
    label: "Client Satisfaction",
    gradient: "from-emerald-400 via-teal-300 to-cyan-400",
  },
];

export function HeroStatsBar({ reducedMotion }: HeroStatsBarProps) {
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.9,
      }}
      className="w-full max-w-[920px] mx-auto z-10 select-none px-4 sm:px-0"
    >
      <div className="p-4 sm:p-5 lg:py-5 lg:px-8 rounded-[18px] bg-[rgba(5,10,25,0.72)] border border-[rgba(80,150,255,0.28)] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center text-center px-3 ${
                idx !== 0 ? "md:border-l md:border-[rgba(80,150,255,0.2)]" : ""
              }`}
            >
              <div
                className={`text-[26px] sm:text-[30px] lg:text-[34px] font-extrabold tracking-tight bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent leading-none mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]`}
              >
                {stat.value}
              </div>
              <div className="text-[11.5px] sm:text-[12.5px] font-medium text-slate-300/80 leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
