"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";

interface HeroNavbarProps {
  activeNav?: string;
  onNavClick?: (href: string, label: string) => void;
  reducedMotion?: boolean;
}

const NAV_ITEMS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function HeroNavbar({
  activeNav = "Home",
  onNavClick,
  reducedMotion,
}: HeroNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClick = (href: string, label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(href, label);
    } else {
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1,
      }}
      className="absolute top-0 left-0 right-0 z-30 w-full select-none"
    >
      <div className="w-full max-w-[1600px] mx-auto h-20 lg:h-24 px-6 sm:px-8 md:px-10 lg:px-12 flex items-center justify-between">
        {/* ── LEFT: "AS" Logo / Monogram ── */}
        <a
          href="#"
          onClick={handleClick("#", "Home")}
          className="group flex items-center gap-1.5 text-2xl lg:text-[28px] font-bold font-display tracking-wider text-white transition-transform duration-300 hover:scale-105"
          aria-label="Aditya Sahu Home"
        >
          <span className="text-white">A</span>
          <span className="bg-gradient-to-r from-[#00d2ff] to-[#3b82f6] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,210,255,0.5)]">
            S
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff] ml-0.5 animate-pulse" />
        </a>

        {/* ── CENTER: Desktop Navigation Links ── */}
        <nav aria-label="Hero navigation" className="hidden md:block">
          <ul className="flex items-center gap-7 lg:gap-10 list-none m-0 p-0">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeNav === item.label;
              return (
                <motion.li
                  key={item.label}
                  initial={reducedMotion ? {} : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2 + idx * 0.05,
                  }}
                  className="relative py-1"
                >
                  <a
                    href={item.href}
                    onClick={handleClick(item.href, item.label)}
                    className="relative text-[15px] lg:text-[16px] font-medium transition-all duration-300 font-sans tracking-wide"
                    style={{
                      color: isActive ? "#00d2ff" : "rgba(203, 213, 225, 0.72)",
                      textShadow: isActive
                        ? "0 0 16px rgba(0, 210, 255, 0.45)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(203, 213, 225, 0.72)";
                    }}
                  >
                    {item.label}
                  </a>

                  {/* Active Indicator Underline with Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="heroNavActiveIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[#00d2ff] via-[#3b82f6] to-[#8b5cf6] shadow-[0_0_10px_rgba(0,210,255,0.7)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* ── RIGHT: Download CV Button ── */}
        <div className="hidden md:flex items-center">
          <a
            href="/cv.png"
            download
            className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold text-[#00d2ff] bg-[rgba(5,10,25,0.6)] border border-[rgba(80,150,255,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-[#00d2ff] hover:text-white hover:bg-[rgba(0,162,255,0.15)] hover:shadow-[0_0_24px_rgba(0,210,255,0.35)] hover:-translate-y-0.5 active:scale-95"
            aria-label="Download Curriculum Vitae"
          >
            <span>Download CV</span>
            <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </div>

        {/* ── Mobile Menu Toggle Button ── */}
        <div className="flex md:hidden items-center gap-3">
          <a
            href="/cv.png"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#00d2ff] bg-[rgba(5,10,25,0.65)] border border-[rgba(80,150,255,0.35)] backdrop-blur-md"
            aria-label="Download CV"
          >
            <span>CV</span>
            <Download className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-[rgba(5,10,25,0.65)] border border-[rgba(80,150,255,0.25)] backdrop-blur-md transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden w-full bg-[rgba(3,7,24,0.94)] border-b border-[rgba(80,150,255,0.25)] backdrop-blur-2xl px-6 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleClick(item.href, item.label)(e);
                    }}
                    className="block py-2 text-base font-semibold transition-colors duration-200"
                    style={{
                      color: activeNav === item.label ? "#00d2ff" : "rgba(226, 232, 240, 0.8)",
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
