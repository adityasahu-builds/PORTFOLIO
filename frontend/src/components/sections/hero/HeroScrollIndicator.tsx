"use client";

import { motion } from "framer-motion";

interface HeroScrollIndicatorProps {
  reducedMotion?: boolean;
}

export function HeroScrollIndicator({ reducedMotion }: HeroScrollIndicatorProps) {
  const handleScrollDown = () => {
    const nextSection = document.querySelector("#about") || document.querySelector("section:nth-of-type(2)");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  return (
    <motion.button
      initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1 }}
      onClick={handleScrollDown}
      className="group flex flex-col items-center gap-1.5 cursor-pointer select-none bg-transparent border-0 outline-none text-slate-400/60 hover:text-[#00d2ff] transition-colors duration-300 z-10 focus-visible:outline-none"
      aria-label="Scroll to explore more content"
    >
      <div className="w-5 h-8 rounded-full border border-slate-400/40 group-hover:border-[#00d2ff]/60 flex items-start justify-center p-1 bg-[rgba(5,10,25,0.4)] backdrop-blur-sm transition-colors duration-300">
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  y: [0, 8, 0],
                  opacity: [0.9, 0.2, 0.9],
                }
          }
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut",
          }}
          className="w-1 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]"
        />
      </div>

      <span className="text-[10px] tracking-[0.2em] uppercase font-semibold font-mono text-slate-400/70 group-hover:text-[#00d2ff] transition-colors duration-300">
        SCROLL TO EXPLORE
      </span>
    </motion.button>
  );
}
