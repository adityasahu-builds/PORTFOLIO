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

const SOCIAL_ITEMS = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/adityasahu",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/adityasahu",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/adityasahu",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:hello@adityasahu.dev",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

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
        className="flex items-center flex-wrap gap-[10px] sm:gap-3.5 lg:gap-4 mb-[24px] sm:mb-7 lg:mb-14 w-full"
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

      {/* ── 6. SOCIAL LINKS ── */}
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.85,
        }}
        className="flex flex-col items-start gap-[14px] sm:gap-4 w-full"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-slate-400 uppercase font-sans">
          <span>LET&apos;S CONNECT</span>
          <span className="w-6 h-[1px] bg-[rgba(80,150,255,0.4)]" />
        </div>

        {/* Icons with 10px gap, clamp 46-52px dimensions */}
        <div className="flex items-center gap-[10px] sm:gap-3 flex-wrap max-w-full">
          {SOCIAL_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="group relative w-[clamp(46px,12.5vw,52px)] h-[clamp(46px,12.5vw,52px)] sm:w-[52px] sm:h-[52px] rounded-[14px] bg-[rgba(5,10,25,0.7)] border border-[rgba(80,150,255,0.25)] backdrop-blur-md flex items-center justify-center text-slate-300 transition-all duration-300 hover:text-[#00d2ff] hover:border-[rgba(0,210,255,0.5)] hover:bg-[rgba(0,210,255,0.1)] hover:shadow-[0_0_18px_rgba(0,210,255,0.3)] hover:scale-105 hover:-translate-y-0.5 active:scale-95 shrink-0"
            >
              <div className="[&>svg]:w-5 [&>svg]:h-5">
                {item.icon}
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
