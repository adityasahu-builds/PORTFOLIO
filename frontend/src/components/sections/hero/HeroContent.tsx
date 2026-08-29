"use client";

import { motion, MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface HeroContentProps {
  onExploreProjects?: () => void;
  onConnect?: () => void;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  reducedMotion?: boolean;
}

export function HeroContent({
  onExploreProjects,
  onConnect,
  mouseX,
  mouseY,
  reducedMotion,
}: HeroContentProps) {
  const handleScrollTo = (selector: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      className="flex flex-col items-start text-left w-full max-w-full lg:max-w-[600px] z-10 select-none box-border"
      style={{
        x: reducedMotion || !mouseX ? 0 : mouseX,
        y: reducedMotion || !mouseY ? 0 : mouseY,
      }}
    >
      {/* ── 1. "Hi, I'm —" Tagline ── */}
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2,
        }}
        className="flex items-center gap-2 mb-[12px] sm:mb-4 lg:mb-6"
      >
        <span className="text-slate-300/90 text-[13px] sm:text-[15px] lg:text-[17px] font-medium font-sans">
          Hi, I&apos;m
        </span>
        <span className="w-6 h-[2px] bg-gradient-to-r from-[#0055ff] to-[#00d2ff] rounded-full inline-block" />
      </motion.div>

      {/* ── 2. Headline: "Aditya Sahu" ── */}
      <motion.h1
        initial={reducedMotion ? {} : { opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.35,
        }}
        className="text-[clamp(40px,10.5vw,56px)] sm:text-[54px] lg:text-[72px] xl:text-[78px] font-extrabold tracking-[-0.02em] leading-none mb-[10px] sm:mb-4 lg:mb-10 font-sans max-w-full"
      >
        <span className="text-[#00d2ff] drop-shadow-[0_0_24px_rgba(0,210,255,0.35)]">
          Aditya
        </span>{" "}
        <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          Sahu
        </span>
      </motion.h1>

      {/* ── 3. Subtitle: "Full Stack Developer & AI/ML Engineer" ── */}
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.5,
        }}
        className="mb-[14px] sm:mb-4 lg:mb-8 max-w-full"
      >
        <h2 className="text-[#00d2ff] text-[clamp(16px,4.3vw,22px)] sm:text-[20px] lg:text-[24px] font-semibold tracking-tight font-sans drop-shadow-[0_0_12px_rgba(0,210,255,0.25)] leading-[1.25] max-w-full break-words">
          Full Stack Developer &amp; AI/ML Engineer
        </h2>
      </motion.div>

      {/* ── 4. Description ── */}
      <motion.p
        initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.65,
        }}
        className="text-slate-300/85 text-[15px] sm:text-[14px] lg:text-[17px] leading-[1.5] sm:leading-[1.6] max-w-full lg:max-w-[580px] mb-[22px] sm:mb-6 lg:mb-12 font-normal font-sans"
      >
        <span className="block sm:hidden">
          I build modern web applications and AI-powered solutions.
        </span>
        <span className="hidden sm:inline">
          I am a passionate software developer with a strong interest in Full Stack Web Development and AI/ML.
        </span>
      </motion.p>

      {/* ── 5. CTA BUTTONS ── */}
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.75,
        }}
        className="flex items-center flex-wrap gap-[10px] sm:gap-3.5 lg:gap-4 mb-2 lg:mb-0 w-full"
      >
        {/* Primary CTA */}
        <a
          href="#projects"
          onClick={handleScrollTo("#projects")}
          className="group relative inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-7 py-2.5 sm:py-3.5 lg:py-4 rounded-[12px] text-[13.5px] sm:text-[15px] font-semibold text-white bg-gradient-to-r from-[#0066ff] to-[#00b4ff] shadow-[0_4px_20px_rgba(0,102,255,0.45)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,180,255,0.65)] hover:-translate-y-0.5 active:scale-95 shrink-0"
          aria-label="Explore My Projects"
        >
          <span>Explore My Projects</span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        {/* Secondary CTA */}
        <a
          href="#contact"
          onClick={handleScrollTo("#contact")}
          className="group relative inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-7 py-2.5 sm:py-3.5 lg:py-4 rounded-[12px] text-[13.5px] sm:text-[15px] font-semibold text-[#00d2ff] bg-[rgba(5,10,25,0.65)] border border-[rgba(0,210,255,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-[#00d2ff] hover:text-white hover:bg-[rgba(0,210,255,0.15)] hover:shadow-[0_0_22px_rgba(0,210,255,0.35)] hover:-translate-y-0.5 active:scale-95 shrink-0"
          aria-label="Contact Me"
        >
          <span>Contact Me</span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.div>
    </motion.div>
  );
}
