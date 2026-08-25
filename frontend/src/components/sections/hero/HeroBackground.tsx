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
      {/* ── Photographic Background Image Layer ── */}
      {/* Opacity set precisely to 85.6% so the original photo details and cinematic colors render accurately */}
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
          className="w-full h-full object-cover object-[center_35%] lg:object-[center_28%]"
          style={{
            opacity: 0.856,
            transform: "translateZ(0)",
          }}
        />
      </motion.div>

      {/* ── Subtle Ambient Shadows for crisp UI readability without washing out the photo ── */}
      {/* Soft dark gradient behind left text */}
      <div
        className="absolute inset-y-0 left-0 w-[55%] lg:w-[48%]"
        style={{
          background:
            "linear-gradient(to right, rgba(3, 7, 24, 0.65) 0%, rgba(3, 7, 24, 0.3) 65%, transparent 100%)",
        }}
      />

      {/* Top subtle navbar shadow */}
      <div
        className="absolute top-0 left-0 right-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3, 7, 24, 0.5) 0%, transparent 100%)",
        }}
      />

      {/* Bottom smooth section transition blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background:
            "linear-gradient(to top, #03040e 0%, rgba(3, 4, 14, 0.6) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
