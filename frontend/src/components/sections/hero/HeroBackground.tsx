"use client";

import { motion, MotionValue } from "framer-motion";

interface HeroBackgroundProps {
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  reducedMotion?: boolean;
}

export function HeroBackground({ mouseX, mouseY, reducedMotion }: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#030718]">

      {/* ── Photographic Background Image Layer — visible on ALL screen sizes ── */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          x: reducedMotion || !mouseX ? 0 : mouseX,
          y: reducedMotion || !mouseY ? 0 : mouseY,
          scale: 1.02,
        }}
      >
        <img
          src="/hero_background.jpeg"
          alt="Aditya Sahu Workspace — Full Stack Developer & AI Engineer"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover object-[58%_top] sm:object-[center_20%] lg:object-[center_28%]"
          style={{
            opacity: 0.90,
            transform: "translateZ(0)",
          }}
        />
      </motion.div>

      {/* ── Mobile gradient overlay: crystal clear at top (90% vivid intensity), smooth dark blend at bottom for text ── */}
      <div
        className="block lg:hidden absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(3, 7, 24, 0.05) 0%, rgba(3, 7, 24, 0) 30%, rgba(3, 7, 24, 0.45) 60%, rgba(3, 7, 24, 0.88) 85%, rgba(3, 7, 24, 0.98) 100%)",
        }}
      />

      {/* ── Desktop soft dark gradient behind left text ── */}
      <div
        className="hidden lg:block absolute inset-y-0 left-0 w-[48%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(3, 7, 24, 0.82) 0%, rgba(3, 7, 24, 0.55) 55%, transparent 100%)",
        }}
      />

      {/* Top navbar shadow */}
      <div
        className="absolute top-0 left-0 right-0 h-20 sm:h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3, 7, 24, 0.6) 0%, transparent 100%)",
        }}
      />

      {/* Bottom section transition blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #03040e 0%, rgba(3, 4, 14, 0.6) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
