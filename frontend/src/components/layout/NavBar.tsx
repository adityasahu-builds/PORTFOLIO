"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AudioController } from "@/components/ui/AudioController";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const NAV_LINKS = [
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export function NavBar() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef<HTMLElement>(null);

  // Fetch dynamic personal information from API
  const { data: personalInfo } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      const res = await api.get("/personal-info");
      return res.data?.data;
    },
  });

  const fullName = personalInfo?.hero?.fullName || "Aditya Sahu";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0] || "")
    .join("")
    .toUpperCase();

  useEffect(() => {
    // Show navbar after hero section (approx 80vh)
    const showThreshold = window.innerHeight * 0.8;

    const handleScroll = () => {
      const y = window.scrollY;
      setVisible(y > showThreshold);
      setScrolled(y > showThreshold + 50);

      // Section tracking for active state highlighting
      const scrollPosition = y + 250; // offset for detection
      
      let currentSection = "";
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = link.id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
      style={{
        transitionTimingFunction: "var(--ease-expo)",
      }}
    >
      <div
        className="container-site py-4 flex items-center justify-between"
        style={{
          borderBottom: scrolled ? `1px solid rgba(139, 92, 246, 0.15)` : "1px solid transparent",
          background: scrolled
            ? "rgba(5, 1, 12, 0.72)"
            : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          transition: "all 0.5s var(--ease-expo)",
          boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.4)" : "none",
        }}
      >
        {/* Logo mark with hover glow */}
        <a
          href="#"
          className="font-display text-sm tracking-widest uppercase font-bold relative group"
          style={{ color: "var(--text-secondary)" }}
          aria-label={`${fullName} — back to top`}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="group-hover:text-white transition-colors duration-300">{initials}</span>
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-violet-400 group-hover:w-full transition-all duration-300" />
        </a>

        {/* Nav links & Audio Controller */}
        <div className="flex items-center gap-4 lg:gap-8">
          <ul className="hidden lg:flex items-center gap-8 list-none" role="list">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.href} className="relative py-1">
                  <a
                    href={link.href}
                    onClick={handleNavClick(link.href)}
                    className="text-section-label tracking-widest transition-colors duration-300 font-semibold"
                    style={{ 
                      fontSize: "clamp(0.68rem, 0.9vw, 0.75rem)",
                      color: isActive ? "#c4b5fd" : "var(--text-muted)" 
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                    }}
                  >
                    {link.label}
                  </a>
                  
                  {/* Sliding Underline active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="scrollNavUnderline"
                      className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
          
          <div className="border-l border-violet-500/15 pl-4 lg:pl-6 hidden lg:block">
            <AudioController />
          </div>
          <div className="block lg:hidden">
            <AudioController />
          </div>
        </div>
      </div>
    </nav>
  );
}
