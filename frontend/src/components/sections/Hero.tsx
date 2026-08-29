"use client";

import { useRef, useEffect, useState } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { HeroBackground } from "./hero/HeroBackground";
import { HeroNavbar } from "./hero/HeroNavbar";
import { HeroContent } from "./hero/HeroContent";
import { HeroCapabilityCards } from "./hero/HeroCapabilityCards";
import { HeroScrollIndicator } from "./hero/HeroScrollIndicator";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const [activeNav, setActiveNav] = useState("Home");

  // ── 25. Subtle Mouse Parallax Logic ──
  // Background: 2–4px max | Cards: 4–7px max | Text: 1–2px max
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Smooth springs for high-end organic Apple-quality motion
  const bgX = useSpring(rawMouseX, { stiffness: 45, damping: 25 });
  const bgY = useSpring(rawMouseY, { stiffness: 45, damping: 25 });

  // Spring values mapped for different depth layers
  const [textSpringX, setTextSpringX] = useState<any>(null);
  const [textSpringY, setTextSpringY] = useState<any>(null);
  const [cardsSpringX, setCardsSpringX] = useState<any>(null);
  const [cardsSpringY, setCardsSpringY] = useState<any>(null);
  const [bgSpringX, setBgSpringX] = useState<any>(null);
  const [bgSpringY, setBgSpringY] = useState<any>(null);

  // Derive scaled motion values using useSpring
  const textX = useSpring(0, { stiffness: 50, damping: 20 });
  const textY = useSpring(0, { stiffness: 50, damping: 20 });
  const cardsX = useSpring(0, { stiffness: 50, damping: 20 });
  const cardsY = useSpring(0, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReduced || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    // Normalized coordinates from center: -1 to +1
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply strict maximum displacements per specification:
    // Background: 2–4px max
    bgX.set(-normX * 4);
    bgY.set(-normY * 4);

    // Text: 1–2px max
    textX.set(normX * 2);
    textY.set(normY * 2);

    // Cards: 4–7px max
    cardsX.set(-normX * 6);
    cardsY.set(-normY * 6);
  };

  const handleMouseLeave = () => {
    bgX.set(0);
    bgY.set(0);
    textX.set(0);
    textY.set(0);
    cardsX.set(0);
    cardsY.set(0);
  };

  const handleNavClick = (href: string, label: string) => {
    setActiveNav(label);
    if (href === "#" || href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Synchronize scroll tracking with navbar
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 0.4) {
        setActiveNav("Home");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero relative w-full min-h-[100svh] lg:h-[100svh] overflow-hidden select-none flex flex-col justify-between bg-[#030718]"
      style={{
        perspective: 1200,
      }}
      aria-label="Aditya Sahu — Hero Section"
    >
      {/* ── A. Background Image Layer (Final Asset: /hero_background.jpeg) ── */}
      <HeroBackground
        mouseX={bgX}
        mouseY={bgY}
        reducedMotion={!!prefersReduced}
      />

      {/* ── B. Navbar ── */}
      <HeroNavbar
        activeNav={activeNav}
        onNavClick={handleNavClick}
        reducedMotion={!!prefersReduced}
      />

      {/* ── Main Interactive Canvas: Left Content, Center Workspace, Right Cards ── */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-10 lg:px-12 flex-1 flex flex-col justify-end lg:justify-center pt-24 sm:pt-28 lg:pt-0 pb-2 sm:pb-4 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 items-end lg:items-center w-full">

          {/* ── C. Left Content — full width on mobile, 6 cols on desktop ── */}
          <div className="col-span-1 lg:col-span-6 xl:col-span-6 flex justify-start items-end lg:items-center">
            <HeroContent
              mouseX={textX}
              mouseY={textY}
              reducedMotion={!!prefersReduced}
            />
          </div>

          {/* ── Center buffer (desktop only) ── */}
          <div className="hidden xl:block xl:col-span-1 pointer-events-none" />

          {/* ── D. Right Capability Cards — hidden on phones, visible on lg+ ── */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-5 justify-center lg:justify-end items-center">
            <HeroCapabilityCards
              mouseX={cardsX}
              mouseY={cardsY}
              reducedMotion={!!prefersReduced}
            />
          </div>

        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className="relative z-10 w-full flex flex-col items-center pb-2 sm:pb-5 px-4">
        <HeroScrollIndicator reducedMotion={!!prefersReduced} />
      </div>
    </section>
  );
}
