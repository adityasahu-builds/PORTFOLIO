"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bg: string;
  glow: string;
  isLoading?: boolean;
  index?: number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  glow,
  isLoading = false,
  index = 0,
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className={`relative flex flex-col gap-3 p-5 rounded-2xl bg-gradient-to-br ${bg} border backdrop-blur-sm overflow-hidden shadow-lg ${glow}`}
    >
      {/* Background glow blob */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-2xl bg-current ${color}`}
      />

      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center ${color} shrink-0`}
      >
        <Icon className="w-4.5 h-4.5" />
      </div>

      {/* Value */}
      <div>
        <div
          className={`text-3xl font-bold tracking-tight text-white ${
            isLoading ? "animate-pulse opacity-50" : ""
          }`}
        >
          {isLoading ? "—" : value}
        </div>
        <div className="text-xs text-slate-400 mt-0.5 font-medium">{label}</div>
        {subtitle && (
          <div className="text-[10px] text-slate-600 mt-0.5">{subtitle}</div>
        )}
      </div>

      {/* Trend indicator */}
      {trend && !isLoading && (
        <div className="flex items-center gap-1">
          {trend === "up" && (
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              Growing
            </span>
          )}
          {trend === "down" && (
            <span className="flex items-center gap-0.5 text-[10px] text-rose-400">
              <TrendingDown className="w-3 h-3" />
              Declining
            </span>
          )}
          {trend === "neutral" && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
              <Minus className="w-3 h-3" />
              Stable
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
