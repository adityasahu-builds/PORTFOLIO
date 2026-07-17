"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export function Card({ children, hoverEffect = true, className = "", ...props }: CardProps) {
  const Tag = hoverEffect ? motion.div : "div";

  return (
    <Tag
      className={`relative rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 backdrop-blur-sm shadow-md overflow-hidden ${
        hoverEffect ? "hover:border-white/[0.08] hover:bg-white/[0.03]" : ""
      } ${className}`}
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
      {...(props as any)}
    >
      {/* Visual top subtle glow gradient */}
      {hoverEffect && (
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#00d2ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      {children}
    </Tag>
  );
}
