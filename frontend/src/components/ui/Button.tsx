"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.FC<{ className?: string }>;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon: Icon,
  type = "button",
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4.5 py-2.5 text-xs font-semibold rounded-xl gap-2",
    lg: "px-6 py-3.5 text-sm font-semibold rounded-2xl gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-[#00d2ff] hover:opacity-95 text-white shadow-lg shadow-blue-900/25 border border-transparent",
    secondary:
      "bg-white/[0.03] border border-white/[0.06] text-slate-350 hover:text-white hover:bg-white/[0.06] hover:border-[#00d2ff]/20",
    outline:
      "bg-transparent border border-white/[0.1] text-slate-400 hover:text-white hover:border-white/[0.2]",
    ghost:
      "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]",
    danger:
      "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      type={type}
      className={`inline-flex items-center justify-center font-sans tracking-wide transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...(props as any)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0 text-current" />
      ) : null}
      <span className="truncate">{children}</span>
    </motion.button>
  );
}
