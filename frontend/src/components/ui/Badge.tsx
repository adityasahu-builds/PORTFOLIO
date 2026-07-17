"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "neutral" | "featured";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    success:
      "text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 shadow-[0_0_8px_rgba(52,211,153,0.1)]",
    warning:
      "text-amber-450 bg-amber-950/30 border border-amber-800/30 shadow-[0_0_8px_rgba(245,158,11,0.1)]",
    error:
      "text-rose-400 bg-rose-955/20 border border-rose-900/30 shadow-[0_0_8px_rgba(244,63,94,0.1)]",
    info:
      "text-[#00d2ff] bg-blue-950/30 border border-blue-800/30 shadow-[0_0_8px_rgba(0,210,255,0.1)]",
    featured:
      "text-amber-400 bg-amber-400/10 border border-amber-500/20 shadow-[0_0_12px_rgba(251,191,36,0.15)]",
    neutral:
      "text-slate-400 bg-white/[0.02] border border-white/[0.05]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest leading-none select-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
