"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Menu, X } from "lucide-react";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);



/* ─── Nav Links ──────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

/* ─── Skill Cards ────────────────────────────────────────── */
const SKILL_CARDS = [
  {
    id: "frontend",
    label: "Frontend",
    sub: "HTML, CSS, JS, React",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "backend",
    label: "Backend",
    sub: "Node.js, Express",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="4" rx="1" />
        <rect x="2" y="10" width="20" height="4" rx="1" />
        <rect x="2" y="17" width="20" height="4" rx="1" />
        <circle cx="18" cy="5" r="0.8" fill="currentColor" />
        <circle cx="18" cy="12" r="0.8" fill="currentColor" />
        <circle cx="18" cy="19" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "design",
    label: "Design",
    sub: "Figma, UI/UX",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: "tools",
    label: "Tools",
    sub: "Git, VS Code",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

/* ─── Social Links ───────────────────────────────────────── */
const SOCIAL_LINKS = [
  {
    id: "github",
    href: "https://github.com/adityasahu",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    href: "https://linkedin.com/in/adityasahu",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    href: "https://instagram.com/adityasahu",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    id: "email",
    href: "mailto:hello@adityasahu.dev",
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];



/* ─── Elite Sub-components ────────────────────────────────── */

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.858.508 9.388.508 9.388.508s7.53 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  leetcode: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.873 9.883a2.748 2.748 0 0 0 0 3.89l1.455 1.506a2.71 2.71 0 0 0 1.942.828c.677 0 1.354-.258 1.874-.775l7.986-7.986a1.365 1.365 0 0 1 1.93.048c.513.517.513 1.385 0 1.902l-7.986 7.986a1.365 1.365 0 0 1-1.93-.048l-.004-.004a1.365 1.365 0 0 1 0-1.93l3.99-3.99a1.365 1.365 0 0 1 1.93 0c.513.517.513 1.386 0 1.903l-3.99 3.99a1.365 1.365 0 0 1 0 1.93l.004.004a2.71 2.71 0 0 0 1.942.828c.677 0 1.354-.257 1.874-.775l9.873-9.883a2.748 2.748 0 0 0 0-3.89l-1.455-1.506a2.71 2.71 0 0 0-1.942-.828c-.677 0-1.354.258-1.874.775l-7.986 7.986a1.365 1.365 0 0 1-1.93-.048c-.513-.517-.513-1.385 0-1.902l7.986-7.986a1.365 1.365 0 0 1 1.93.048l.004.004a1.365 1.365 0 0 1 0 1.93l-3.99 3.99a1.365 1.365 0 0 1-1.93 0c-.513-.517-.513-1.386 0-1.903l3.99-3.99a1.365 1.365 0 0 1 0-1.93" />
    </svg>
  ),
  stackoverflow: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.986 21.865v-6.407h2.152v8.566H1.13v-8.566h2.152v6.407H18.986zm-12.522-3.963l9.07.187.039-2.152-9.07-.187-.039 2.152zm.482-4.225l8.696 2.651.628-2.062-8.696-2.651-.628 2.062zm1.611-3.923l7.362 5.093 1.218-1.78-7.362-5.093-1.218 1.78zm3.013-3.056l5.241 7.22 1.745-1.267-5.241-7.22-1.745 1.267zM16.27 0l-1.942 1.13 3.931 6.745 1.942-1.13L16.27 0z" />
    </svg>
  )
};

// Static display placeholder

// 2. Interactive Premium Button with Magnetic, Glow & Ripple
interface EliteButtonProps {
  href: string;
  onClick?: (e: React.MouseEvent) => void;
  primary?: boolean;
  children: React.ReactNode;
  download?: boolean;
}

function EliteButton({ href, onClick, primary, children, download }: EliteButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [btnX, setBtnX] = useState(0);
  const [btnY, setBtnY] = useState(0);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Magnetic pull inside detection radius
    if (dist < 90) {
      setBtnX(dx * 0.22);
      setBtnY(dy * 0.22);
    } else {
      setBtnX(0);
      setBtnY(0);
    }
  };

  const handleMouseLeave = () => {
    setBtnX(0);
    setBtnY(0);
    setHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      onClick={handleClick}
      download={download}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      animate={{ x: btnX, y: btnY }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.04 }}
      className="relative group inline-flex items-center justify-center gap-1.5 sm:gap-3 px-3 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3.5 rounded-lg overflow-hidden font-bold text-[11px] sm:text-sm lg:text-[0.95rem] transition-all duration-300 select-none z-10 cursor-pointer"
      style={{
        fontFamily: "var(--font-inter, sans-serif)",
        background: primary 
          ? "linear-gradient(135deg, #0055ff 0%, #00a2ff 100%)" 
          : "rgba(0, 162, 255, 0.04)",
        border: primary ? "1px solid transparent" : "1px solid rgba(0, 162, 255, 0.35)",
        boxShadow: hovered 
          ? primary 
            ? "0 0 25px rgba(0, 162, 255, 0.65)" 
            : "0 0 20px rgba(0, 162, 255, 0.25)"
          : primary
            ? "0 4px 15px rgba(0, 85, 255, 0.3)"
            : "none",
        animation: (primary && !hovered) ? "pulseShadow 2.5s infinite ease-in-out" : undefined,
        color: primary ? "#ffffff" : "#00d2ff"
      }}
    >
      {/* Ripple Animation Spans */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/20 rounded-full pointer-events-none animate-[rippleEffect_0.6s_ease-out]"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "150px",
            height: "150px",
            marginLeft: "-75px",
            marginTop: "-75px",
          }}
        />
      ))}
      {children}
    </motion.a>
  );
}

// 3. Social tray link with Magnetic, Custom Tooltip, Glow, and Lift
interface SocialLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function SocialLink({ href, label, icon }: SocialLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    setOffset({ x: dx * 0.35, y: dy * 0.35 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <div className="relative">
      {/* Premium Micro-Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1 rounded bg-[#010312] border border-blue-500/30 text-[0.68rem] text-blue-200 font-semibold whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md"
            style={{ pointerEvents: "none" }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setHovered(true)}
        animate={{ 
          x: offset.x, 
          y: offset.y - (hovered ? 3 : 0), 
          rotate: hovered ? 8 : 0 
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        whileTap={{ scale: 0.92 }}
        className="w-[38px] h-[38px] rounded-lg border border-blue-500/25 bg-blue-950/10 text-blue-300 flex items-center justify-center transition-all duration-300 hover:border-blue-400 hover:text-white hover:bg-blue-900/30 hover:shadow-[0_0_15px_rgba(0,162,255,0.35)]"
      >
        {icon}
      </motion.a>
    </div>
  );
}

// 4. Skill Card with Staggered Entrance, Hover Glow & Progress Line
interface SkillCardProps {
  card: {
    id: string;
    label: string;
    sub: string;
    icon: React.ReactNode;
  };
  index: number;
}

function SkillCard({ card, index }: SkillCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4, x: -4 }}
      className="relative w-full max-w-[280px] lg:max-w-none lg:w-[225px] p-3.5 rounded-xl border border-blue-500/35 lg:border-blue-500/15 bg-blue-950/45 lg:bg-blue-950/5 backdrop-blur-md flex items-center justify-between gap-3 cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-900/10 hover:shadow-[0_4px_25px_rgba(0,162,255,0.18)]"
    >
      <div className="flex items-center gap-3">
        {/* Rotating icon on hover */}
        <motion.div
          animate={{ rotate: hovered ? 15 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/70 to-indigo-500/70 lg:from-blue-500/40 lg:to-indigo-500/40 border border-blue-500/50 lg:border-blue-500/30 flex items-center justify-center text-blue-100 lg:text-blue-200"
        >
          {card.icon}
        </motion.div>
        
        <div>
          <p className="text-sm font-semibold text-slate-200 leading-tight mb-0.5">
            {card.label}
          </p>
          <p className="text-[0.72rem] text-slate-400/80 leading-none font-medium">
            {card.sub}
          </p>
        </div>
      </div>

      {/* Pulse Status Dot */}
      <div className="relative w-2 h-2 flex items-center justify-center">
        <span className="absolute w-2 h-2 rounded-full bg-blue-400 animate-ping opacity-75" />
        <span className="relative w-1.5 h-1.5 rounded-full bg-blue-400" />
      </div>

      {/* Expanding progress line on hover */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800/40">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: hovered ? "100%" : "12%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
        />
      </div>
    </motion.div>
  );
}

// 5. Scroll Indicator - Minimal Mouse Wheel Animation
function ScrollIndicator() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10">
      <div className="w-5 h-9 rounded-full border-2 border-blue-500/40 flex justify-center p-1.5 bg-blue-950/5 backdrop-blur-[2px]">
        <motion.div
          animate={{
            y: [0, 12, 0],
            opacity: [1, 0.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut",
          }}
          className="w-1 h-1.5 rounded-full bg-blue-400"
        />
      </div>
      <span className="text-[0.62rem] tracking-[0.25em] uppercase text-blue-400/60 font-semibold font-mono">
        Scroll to Explore
      </span>
    </div>
  );
}

/* ─── Hero Component ─────────────────────────────────────── */
export function Hero() {
  const [activeNav, setActiveNav] = useState("Home");
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch dynamic personal information from API
  const { data: personalInfo } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      const res = await api.get("/personal-info");
      return res.data?.data;
    },
  });

  // Fetch active skills from backend to dynamically create skill cards
  const { data: skills = [] } = useQuery<any[]>({
    queryKey: ["skills-active"],
    queryFn: async () => {
      const res = await api.get("/skills?status=Active");
      return res.data?.data || [];
    },
  });

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const name = personalInfo?.hero?.fullName || "Aditya Sahu";

  const renderStaticName = () => {
    const spaceIndex = name.indexOf(" ");
    if (spaceIndex === -1) {
      return <span className="text-[#00d2ff]">{name}</span>;
    } else {
      const first = name.slice(0, spaceIndex);
      const second = name.slice(spaceIndex);
      return (
        <>
          <span className="text-[#00d2ff]">{first}</span>
          <span className="text-[#ffffff]">{second}</span>
        </>
      );
    }
  };

  // Global mouse coordinates for lights
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseLightX = useMotionValue(50);
  const mouseLightY = useMotionValue(50);
  const springLightX = useSpring(mouseLightX, { stiffness: 60, damping: 25 });
  const springLightY = useSpring(mouseLightY, { stiffness: 60, damping: 25 });

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    mouseLightX.set(px);
    mouseLightY.set(py);
  };
  
  // Centerpiece 3D Mouse Parallax Tilt
  const centerRef = useRef<HTMLDivElement>(null);
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const tiltX = useSpring(cardY, { stiffness: 90, damping: 20 });
  const tiltY = useSpring(cardX, { stiffness: 90, damping: 20 });

  const handleCenterMouseMove = (e: React.MouseEvent) => {
    if (!centerRef.current) return;
    const rect = centerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Calculate rotation angles (max 12 degrees)
    const rX = -(mouseY / height) * 12;
    const rY = (mouseX / width) * 12;
    
    cardY.set(rX);
    cardX.set(rY);
  };

  const handleCenterMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  const handleNavClick = (href: string, label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav(label);
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Dynamic social links resolver
  const dynamicSocialLinks: any[] = [];
  if (personalInfo?.socialLinks) {
    Object.entries(personalInfo.socialLinks).forEach(([key, value]) => {
      if (value && key !== "_id") {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        dynamicSocialLinks.push({
          id: key,
          href: value as string,
          label: label,
          icon: SOCIAL_ICONS[key] || (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          )
        });
      }
    });
  }

  if (personalInfo?.contact?.primaryEmail) {
    dynamicSocialLinks.push({
      id: "email",
      href: `mailto:${personalInfo.contact.primaryEmail}`,
      label: "Email",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      )
    });
  }

  const socialLinksToRender = dynamicSocialLinks.length > 0 ? dynamicSocialLinks : SOCIAL_LINKS;

  return (
    <section
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      id="home"
      className="relative min-h-screen lg:h-screen lg:min-h-[680px] w-full overflow-hidden select-none flex items-center py-6 lg:py-0"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 30%, #080f33 0%, #03040e 55%, #010105 100%)" }}
    >
      {/* WebGL Particle Background */}
      <HeroCanvas />

      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated Aurora Flow */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 50, 0],
            y: [0, -40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut",
          }}
          className="absolute -top-[25%] -left-[10%] w-[65%] h-[65%] rounded-full bg-gradient-to-tr from-blue-950/20 via-indigo-900/10 to-transparent blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 0.95, 1.1],
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
          }}
          className="absolute top-[35%] -right-[15%] w-[55%] h-[55%] rounded-full bg-gradient-to-br from-cyan-950/15 via-blue-900/10 to-transparent blur-[140px]"
        />

        {/* Dynamic Interactive Mouse-following Light */}
        <motion.div
          className="absolute inset-0 bg-transparent"
          style={{
            background: useMotionTemplate`radial-gradient(650px circle at ${springLightX}% ${springLightY}%, rgba(0, 162, 255, 0.08), transparent 80%)`,
          }}
        />

        {/* Starfield Background */}
        <div className="absolute inset-0 bg-[radial-gradient(1.2px_1.2px_at_12%_15%,#fff_100%,transparent),radial-gradient(1.5px_1.5px_at_50%_35%,#fff_100%,transparent),radial-gradient(1.8px_1.8px_at_82%_20%,#fff_100%,transparent),radial-gradient(1.2px_1.2px_at_28%_65%,#fff_100%,transparent),radial-gradient(1.8px_1.8px_at_73%_78%,#fff_100%,transparent)] opacity-[0.22] bg-[size:280px_280px] animate-[pulse_12s_ease-in-out_infinite]" />

        {/* Volumetric low-lying Cyber Fog overlay blurs */}
        <div className="absolute bottom-[-100px] left-[-10%] w-[120%] h-[250px] bg-gradient-to-t from-blue-950/25 to-transparent blur-[40px]" />
      </div>

      {/* Inline styles for custom keyframes and animation transitions */}
      <style>{`
        @keyframes rippleEffect {
          to { transform: scale(3.5); opacity: 0; }
        }
        @keyframes sweepGlow {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes pulseShadow {
          0% { box-shadow: 0 4px 15px rgba(0, 85, 255, 0.35); }
          50% { box-shadow: 0 4px 28px rgba(0, 162, 255, 0.65); }
          100% { box-shadow: 0 4px 15px rgba(0, 85, 255, 0.35); }
        }
        @keyframes morph {
          0% {
            border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
          }
          34% {
            border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%;
          }
          67% {
            border-radius: 50% 50% 30% 70% / 50% 30% 70% 50%;
          }
          100% {
            border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
          }
        }
        .organic-glass-blob {
          animation: morph 12s ease-in-out infinite;
        }
      `}</style>

      {/* ─── NAVBAR ────────────────────────────────── */}
      <header
        className="absolute top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: "rgba(3, 7, 24, 0.22)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(0, 162, 255, 0.12)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.57), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        <div
          className="w-full max-w-[1560px] px-5 sm:px-7 md:px-[53px] lg:px-[69px] flex items-center justify-between h-[72px]"
        >
          {/* AS Monogram - Styled A (white) S (blue) */}
          <div style={{ transform: "translateX(10px)" }}>
            <a
              href="#"
              aria-label="Aditya Sahu — back to top"
              onClick={handleNavClick("#", "Home")}
              className="flex items-center text-lg lg:text-xl font-bold font-display select-none tracking-widest text-white"
              style={{ textDecoration: "none" }}
            >
              A<span className="text-[#00d2ff] drop-shadow-[0_0_8px_rgba(0,162,255,0.4)]">S</span>
            </a>
          </div>

          {/* Nav Links with sliding underline */}
          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(1rem, 2.2vw, 2.5rem)",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="relative">
                  <a
                    href={link.href}
                    onClick={handleNavClick(link.href, link.label)}
                    style={{
                      position: "relative",
                      fontSize: "clamp(0.75rem, 0.95vw, 0.85rem)",
                      fontWeight: 500,
                      color: activeNav === link.label ? "#00d2ff" : "rgba(203, 213, 225, 0.7)",
                      textDecoration: "none",
                      transition: "color 0.25s ease",
                      fontFamily: "var(--font-inter, sans-serif)",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => {
                      if (activeNav !== link.label)
                        (e.currentTarget as HTMLElement).style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      if (activeNav !== link.label)
                        (e.currentTarget as HTMLElement).style.color = "rgba(203, 213, 225, 0.7)";
                    }}
                  >
                    {link.label}
                  </a>
                  {activeNav === link.label && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-[0_0_8px_rgba(0,162,255,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* CV Button */}
          <div className="hidden lg:block" style={{ transform: "translateX(-10px)" }}>
            <EliteButton href={personalInfo?.hero?.resumeUrl || "/Aditya_Sahu_CV.pdf"} download>
              <span>Download CV</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </EliteButton>
          </div>

          {/* Mobile Menu Action Bar */}
          <div className="flex lg:hidden items-center gap-3 mr-2">
            <EliteButton href={personalInfo?.hero?.resumeUrl || "/Aditya_Sahu_CV.pdf"} download>
              <span className="text-[11px] font-semibold">CV</span>
            </EliteButton>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-[#00d2ff] transition-colors p-1.5 rounded-lg bg-blue-950/20 border border-blue-500/20 shadow-[0_0_10px_rgba(0,162,255,0.1)] focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full bg-[#030718]/95 border-t border-blue-500/25 backdrop-blur-2xl flex flex-col lg:hidden shadow-[0_15px_30px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <ul className="flex flex-col py-4 px-8 gap-4 list-none m-0">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleNavClick(link.href, link.label)(e);
                      }}
                      className="block py-2 text-sm font-semibold tracking-wider font-inter transition-all duration-300"
                      style={{
                        color: activeNav === link.label ? "#00d2ff" : "rgba(203, 213, 225, 0.7)",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── MAIN HERO CONTENT ─────────────────────── */}
      <div
        className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-6 md:px-8 grid grid-cols-[0.8fr_1.2fr] lg:grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-8 xs:gap-y-10 sm:gap-6 lg:gap-8 pt-[76px] lg:pt-0"
      >
        {/* ── LEFT: Text Content ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          className="order-1 lg:order-1 flex flex-col gap-0 z-10 w-full max-w-[520px] mx-auto lg:mx-0 text-left items-start pl-6 sm:pl-0 lg:translate-x-[60px]"
        >
          {/* Hi, I'm */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center justify-start gap-1.5 text-[9px] xs:text-xs lg:text-[1rem]"
            style={{
              color: "rgba(203, 213, 225, 0.7)",
              fontFamily: "var(--font-inter, sans-serif)",
              fontWeight: 400,
              marginBottom: "0.25rem",
            }}
          >
            Hi, I&apos;m
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "2px",
                background: "linear-gradient(90deg, #0055ff, #00d2ff)",
                borderRadius: "999px",
              }}
            />
          </motion.p>

          {/* Name - Styled with split colors exactly like reference image */}
          <h1
            className="whitespace-normal sm:whitespace-nowrap text-[13px] xs:text-[15px] sm:text-3xl md:text-5xl lg:text-[clamp(2.4rem,4.2vw,3.4rem)]"
            style={{
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "0.25rem",
              fontFamily: "var(--font-inter, sans-serif)",
              letterSpacing: "-0.02em",
            }}
          >
            <span className="drop-shadow-[0_0_15px_rgba(0,162,255,0.25)]">
              {renderStaticName()}
            </span>
          </h1>

          <div className="mb-2 lg:mb-4 min-h-[26px] flex items-center justify-start">
            <span className="text-[#00d2ff] font-semibold text-[8px] xs:text-[9.5px] sm:text-base lg:text-lg drop-shadow-[0_0_12px_rgba(0,162,255,0.3)]">
              {personalInfo?.hero?.professionalTitle || "Full Stack Developer & AI/ML Engineer"}
            </span>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="text-[8px] xs:text-[9.5px] sm:text-sm lg:text-[0.95rem] leading-relaxed lg:leading-[1.7] mb-4 lg:mb-8"
            style={{
              color: "rgba(148, 163, 184, 0.85)",
              fontFamily: "var(--font-inter, sans-serif)",
              maxWidth: "95%",
              fontWeight: 400,
            }}
          >
            {personalInfo?.hero?.heroDescription || "I build modern, scalable and user-friendly web experiences with clean code and creative design."}
          </motion.p>

          {/* Upgraded CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="flex gap-x-3 gap-y-4 sm:gap-4 lg:gap-8 my-6 sm:my-8 lg:my-0 lg:mb-10 flex-wrap justify-start"
          >
            <EliteButton href={personalInfo?.hero?.ctaButtonUrl || "#projects"} onClick={handleNavClick(personalInfo?.hero?.ctaButtonUrl || "#projects", "Projects")} primary>
              <span>{personalInfo?.hero?.ctaButtonText || "View My Work"}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </EliteButton>

            <EliteButton href="#contact" onClick={handleNavClick("#contact", "Contact")}>
              <span>Contact Me</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </EliteButton>
          </motion.div>

          {/* Social Links Tray */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            className="mt-6 sm:mt-8 lg:mt-10 mb-8 lg:mb-0 flex flex-col items-start"
          >
            <p
              className="flex items-center justify-start gap-3"
              style={{
                fontSize: "0.75rem",
                color: "rgba(148, 163, 184, 0.5)",
                fontFamily: "var(--font-inter, sans-serif)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Let&apos;s connect
              <span style={{ flex: "0 0 28px", height: "1px", background: "rgba(0, 162, 255, 0.4)", display: "inline-block" }} />
            </p>
            <div className="flex gap-2.5">
              {socialLinksToRender.map((s) => (
                <SocialLink key={s.id} href={s.href} label={s.label} icon={s.icon} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="order-2 lg:order-2 relative z-10 mx-auto lg:mx-0 flex items-center justify-center pointer-events-auto lg:translate-x-[45px] w-full max-w-[210px] xs:max-w-[230px] sm:max-w-[280px] md:max-w-[340px] lg:w-[clamp(420px,42vw,570px)] aspect-[13/16] lg:aspect-auto lg:h-[clamp(570px,72vh,780px)] mt-0 lg:mt-0"
        >
          {/* 3D-Tilting HTML Image Centerpiece Wrapper */}
          <motion.div
            ref={centerRef}
            onMouseMove={handleCenterMouseMove}
            onMouseLeave={handleCenterMouseLeave}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            }}
            style={{
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
            whileHover={{ scale: 1.02 }}
            className="relative w-full h-full z-10 flex items-center justify-center cursor-pointer group"
          >
            {/* The pre-rendered image asset containing the mockup card, orbits and badges */}
            <img
              src="/hero-card.png"
              alt={name}
              className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_15px_35px_rgba(0,162,255,0.15)]"
              style={{
                imageRendering: "auto",
              }}
            />
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Skill Cards stacked vertically ──── */}
        <div
          className="order-3 col-span-2 lg:col-span-1 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-[0.9rem] z-10 items-center lg:items-end w-full max-w-[320px] sm:max-w-[500px] mx-auto lg:max-w-none lg:mx-0 lg:translate-x-[50px] pb-24 lg:pb-0"
        >
          {(() => {
            // Dynamically resolve skill highlight cards from MongoDB categories
            const categories = Array.from(new Set(skills.map((s: any) => s.category)));
            const dynamicSkillCards = categories.slice(0, 4).map((cat: any) => {
              const catSkills = skills.filter((s: any) => s.category === cat);
              const subText = catSkills.slice(0, 4).map((s: any) => s.title).join(", ");
              
              // Icon map based on category names
              let icon = (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              );
              if (cat.toLowerCase().includes("backend")) {
                icon = (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="3" width="20" height="4" rx="1" />
                    <rect x="2" y="10" width="20" height="4" rx="1" />
                    <rect x="2" y="17" width="20" height="4" rx="1" />
                    <circle cx="18" cy="5" r="0.8" fill="currentColor" />
                    <circle cx="18" cy="12" r="0.8" fill="currentColor" />
                    <circle cx="18" cy="19" r="0.8" fill="currentColor" />
                  </svg>
                );
              } else if (cat.toLowerCase().includes("design") || cat.toLowerCase().includes("ui")) {
                icon = (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                    <circle cx="11" cy="11" r="2" />
                  </svg>
                );
              } else if (cat.toLowerCase().includes("tool") || cat.toLowerCase().includes("dev")) {
                icon = (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                );
              }

              return {
                id: cat.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                label: cat,
                sub: subText,
                icon
              };
            });

            const skillCardsToRender = dynamicSkillCards.length > 0 ? dynamicSkillCards : SKILL_CARDS;
            return skillCardsToRender.map((card, i) => (
              <SkillCard key={card.id} card={card} index={i} />
            ));
          })()}
        </div>
      </div>

      {/* ─── Scroll Indicator ─── */}
      <ScrollIndicator />

      {/* ─── Bottom gradient blend into next section ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to top, #03040e 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </section>
  );
}
