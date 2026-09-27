"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Folder,
  Wrench,
  GraduationCap,
  Award,
  Mail,
  Zap,
  ArrowRight,
  ExternalLink,
  Activity,
  Globe,
  Server,
  Database,
  Layers,
  ChevronRight,
  Briefcase,
  Sliders,
  CheckCircle2,
  HardDrive,
  Radio,
  Plus,
} from "lucide-react";

// Hook to fetch live model counts from database
function useCount(endpoint: string, queryKey: string) {
  return useQuery<number>({
    queryKey: [queryKey + "-count"],
    queryFn: async () => {
      const res = await api.get(endpoint);
      const data = res.data?.data;
      if (Array.isArray(data)) return data.length;
      if (typeof data === "object" && data !== null) {
        if (data.pagination?.total !== undefined) return data.pagination.total;
        if (Array.isArray(data.data)) return data.data.length;
      }
      return 0;
    },
    staleTime: 30000,
  });
}

interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

function useRecentMessages() {
  return useQuery<ContactMessage[]>({
    queryKey: ["recent-messages"],
    queryFn: async () => {
      const res = await api.get("/contact?limit=5&page=1");
      return res.data?.data?.data || [];
    },
    staleTime: 30000,
  });
}

// Smooth Animated Number Counter
function AnimatedCounter({ value, isLoading }: { value: number; isLoading?: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 0.8;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(end * (1 - Math.pow(1 - progress, 3)));
      setDisplayValue(current);

      if (frame >= totalFrames) {
        clearInterval(counter);
        setDisplayValue(end);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [value, isLoading]);

  if (isLoading) {
    return <span className="inline-block w-6 h-6 bg-white/10 animate-pulse rounded" />;
  }

  return <span>{displayValue}</span>;
}

// Glowing SVG Sparkline Curve
function MiniSparkline({ color }: { color: "red" | "cyan" | "purple" | "emerald" | "amber" | "violet" }) {
  const colorMap = {
    red: { stroke: "#ff2a4a", fill: "url(#spk-red)" },
    cyan: { stroke: "#00d2ff", fill: "url(#spk-cyan)" },
    purple: { stroke: "#c084fc", fill: "url(#spk-purple)" },
    emerald: { stroke: "#10b981", fill: "url(#spk-emerald)" },
    amber: { stroke: "#f59e0b", fill: "url(#spk-amber)" },
    violet: { stroke: "#818cf8", fill: "url(#spk-violet)" },
  };

  const c = colorMap[color];

  return (
    <svg className="w-18 h-8 overflow-visible" viewBox="0 0 100 36">
      <defs>
        <linearGradient id={`spk-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 0 28 Q 25 8, 50 20 T 80 6 T 100 14 L 100 36 L 0 36 Z"
        fill={c.fill}
      />
      <path
        d="M 0 28 Q 25 8, 50 20 T 80 6 T 100 14"
        fill="none"
        stroke={c.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${c.stroke})` }}
      />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Real-time live counts from Supabase database
  const projects = useCount("/projects", "projects");
  const skills = useCount("/skills", "skills");
  const experience = useCount("/experience", "experience");
  const education = useCount("/education", "education");
  const certificates = useCount("/certificates", "certificates");
  const messages = useCount("/contact", "messages");
  const recentMessages = useRecentMessages();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  const statCards = [
    {
      label: "Projects",
      value: projects.data ?? 5,
      icon: Folder,
      href: "/admin/projects",
      trend: "↑ 2 this week",
      colorType: "red" as const,
      iconBg: "from-red-500/25 to-rose-950/40 text-[#ff385c] border-red-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_10px_rgba(255,56,92,0.3)]",
      borderGlow: "hover:border-red-500/40",
    },
    {
      label: "Skills",
      value: skills.data ?? 8,
      icon: Wrench,
      href: "/admin/skills",
      trend: "↑ 1 added recently",
      colorType: "cyan" as const,
      iconBg: "from-cyan-500/25 to-blue-950/40 text-[#00d2ff] border-cyan-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_10px_rgba(0,210,255,0.3)]",
      borderGlow: "hover:border-cyan-500/40",
    },
    {
      label: "Experience",
      value: experience.data ?? 7,
      icon: Briefcase,
      href: "/admin/experience",
      trend: "↑ Timeline updated",
      colorType: "purple" as const,
      iconBg: "from-purple-500/25 to-indigo-950/40 text-purple-400 border-purple-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_10px_rgba(192,132,252,0.3)]",
      borderGlow: "hover:border-purple-500/40",
    },
    {
      label: "Education",
      value: education.data ?? 1,
      icon: GraduationCap,
      href: "/admin/education",
      trend: "↑ Academic stats",
      colorType: "emerald" as const,
      iconBg: "from-emerald-500/25 to-teal-950/40 text-emerald-400 border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_10px_rgba(16,185,129,0.3)]",
      borderGlow: "hover:border-emerald-500/40",
    },
    {
      label: "Certificates",
      value: certificates.data ?? 0,
      icon: Award,
      href: "/admin/certificates",
      trend: "— No new updates",
      colorType: "amber" as const,
      iconBg: "from-amber-500/25 to-orange-950/40 text-amber-400 border-amber-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_10px_rgba(245,158,11,0.3)]",
      borderGlow: "hover:border-amber-500/40",
    },
    {
      label: "Messages",
      value: messages.data ?? 0,
      icon: Mail,
      href: "/admin/messages",
      trend: "— Unread count",
      colorType: "violet" as const,
      iconBg: "from-violet-500/25 to-indigo-950/40 text-violet-400 border-violet-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_10px_rgba(129,140,248,0.3)]",
      borderGlow: "hover:border-violet-500/40",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ================================================== */}
      {/* 1. SLEEK COMPACT APPLE LIQUID HERO BAR             */}
      {/* ================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/[0.08] bg-[#09060e]/50 backdrop-blur-2xl p-5 sm:p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">
              {getGreeting()}, ADMIN 👋
            </span>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
              <span>All Systems Operational</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Welcome back,{" "}
            <span className="text-[#ff385c] drop-shadow-[0_0_15px_rgba(255,56,92,0.4)] capitalize">
              {user?.username ?? "Aditya"}
            </span>
          </h1>

          <p className="text-xs text-slate-400 font-normal">
            Analyze logs and organize database models for your custom portfolio site.
          </p>
        </div>

        {/* Quick Action Buttons on Right */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-b from-red-600 to-rose-800 hover:from-red-500 hover:to-rose-700 text-white text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_15px_rgba(239,68,68,0.4)] border border-red-400/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </motion.div>

      {/* ================================================== */}
      {/* 2. SIX SKEUOMORPHIC LIQUID-GLASS METRIC CARDS       */}
      {/* ================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * idx, duration: 0.35 }}
            >
              <Link
                href={card.href}
                className={`group relative flex flex-col justify-between p-4 h-36 rounded-2xl bg-[#09060e]/50 hover:bg-[#0f0917]/70 border border-white/[0.07] ${card.borderGlow} backdrop-blur-2xl transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_25px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 overflow-hidden`}
              >
                {/* Top Row: Skeuomorphic Icon Squircle */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-b flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${card.iconBg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Middle: Number & Label */}
                <div className="mt-1">
                  <div className="text-2xl font-bold text-white tracking-tight font-sans">
                    <AnimatedCounter value={card.value} />
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mt-0.5">{card.label}</div>
                </div>

                {/* Bottom Row: Trend Line & Mini Sparkline */}
                <div className="flex items-end justify-between mt-1">
                  <span className="text-[10px] text-slate-400 font-mono font-medium truncate max-w-[85px]">
                    {card.trend}
                  </span>
                  <div className="translate-y-0.5">
                    <MiniSparkline color={card.colorType} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ================================================== */}
      {/* 3. BALANCED TWO-COLUMN WORKSPACE (NO CLUTTER)      */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 items-start">
        {/* ================================================= */}
        {/* LEFT COLUMN (7 COLS): FEATURED PROJECT & ACTIVITY */}
        {/* ================================================= */}
        <div className="md:col-span-7 lg:col-span-7 space-y-6">
          {/* FEATURED PROJECT CARD (CLEAN APPLE LIQUID GLASS) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.08] bg-[#09060e]/50 backdrop-blur-2xl p-5 sm:p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_10px_35px_rgba(0,0,0,0.5)]"
          >
            {/* Header with Status Pill */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Featured Project
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                Production Ready
              </span>
            </div>

            {/* Project Content */}
            <div className="mt-4 space-y-3">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Website & CMS</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Modern, responsive and fully functional developer portfolio built with Next.js 16, Supabase PostgreSQL, Prisma ORM, and Supabase Storage.
                </p>
              </div>

              {/* Technology Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] font-medium text-slate-300">
                  Next.js 16
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] font-medium text-slate-300">
                  Supabase PostgreSQL
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] font-medium text-slate-300">
                  Prisma ORM
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] font-medium text-slate-300">
                  Tailwind CSS
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] font-medium text-slate-300">
                  Supabase Storage
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-red-600 to-rose-800 hover:from-red-500 hover:to-rose-700 text-white font-semibold text-xs tracking-wide shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_15px_rgba(239,68,68,0.35)] border border-red-400/30 transition-all cursor-pointer"
                >
                  <span>View Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/admin/projects"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white text-xs font-medium border border-white/[0.08] transition-all"
                >
                  <span>Manage Projects</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* RECENT ACTIVITY CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.08] bg-[#09060e]/50 backdrop-blur-2xl p-5 sm:p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_10px_35px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" />
                <h3 className="text-xs uppercase font-bold tracking-wider text-white">Recent Activity</h3>
              </div>
              <Link
                href="/admin/messages"
                className="text-[11px] font-semibold text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Activity Timeline List */}
            <div className="mt-3.5 space-y-3">
              <div className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Folder className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">New project added</p>
                    <p className="text-[10px] text-slate-400 truncate">Portfolio Website</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">2 hours ago</span>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">Skill updated</p>
                    <p className="text-[10px] text-slate-400 truncate">Next.js, React</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">4 hours ago</span>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">Certificate uploaded</p>
                    <p className="text-[10px] text-slate-400 truncate">NPTEL Soft Skills</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">1 day ago</span>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">Message received</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {recentMessages.data?.[0]?.fullName ? `From ${recentMessages.data[0].fullName}` : "From visitor"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">1 day ago</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================================================= */}
        {/* RIGHT COLUMN (5 COLS): QUICK ACTIONS & OVERVIEW   */}
        {/* ================================================= */}
        <div className="md:col-span-5 lg:col-span-5 space-y-6">
          {/* QUICK ACTIONS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.08] bg-[#09060e]/50 backdrop-blur-2xl p-5 sm:p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_10px_35px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2 pb-3.5 border-b border-white/[0.06]">
              <Zap className="w-4 h-4 text-red-500 fill-red-500" />
              <h3 className="text-xs uppercase font-bold tracking-wider text-white">Quick Actions</h3>
            </div>

            <div className="mt-3.5 space-y-2">
              {/* Action 1: Add Project */}
              <Link
                href="/admin/projects"
                className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-red-500/10 border border-white/[0.04] hover:border-red-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-[#ff2a4a] border border-red-500/30 flex items-center justify-center shrink-0">
                    <Folder className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-red-300 transition-colors">
                      Add Project
                    </p>
                    <p className="text-[10px] text-slate-400">Showcase new work</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Action 2: Add Skill */}
              <Link
                href="/admin/skills"
                className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-cyan-500/10 border border-white/[0.04] hover:border-cyan-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-[#00d2ff] border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      Add Skill
                    </p>
                    <p className="text-[10px] text-slate-400">Add new technology</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Action 3: Add Certificate */}
              <Link
                href="/admin/certificates"
                className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-purple-500/10 border border-white/[0.04] hover:border-purple-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                      Add Certificate
                    </p>
                    <p className="text-[10px] text-slate-400">Upload verified certificate</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Action 4: View Messages */}
              <Link
                href="/admin/messages"
                className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-emerald-500/10 border border-white/[0.04] hover:border-emerald-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      View Messages
                    </p>
                    <p className="text-[10px] text-slate-400">Reply to visitor queries</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </motion.div>

          {/* SITE OVERVIEW / INFRASTRUCTURE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.08] bg-[#09060e]/50 backdrop-blur-2xl p-5 sm:p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_10px_35px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs uppercase font-bold tracking-wider text-white">System Architecture</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                Live
              </span>
            </div>

            {/* Architecture Details Grid */}
            <div className="mt-3.5 space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-medium text-white">Production Domain</p>
                    <p className="text-[10px] text-slate-400 font-mono">adityasahubuilds.dev</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-xs font-medium text-white">Database Engine</p>
                    <p className="text-[10px] text-slate-400 font-mono">Supabase PostgreSQL</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-cyan-400">Pooler</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-xs font-medium text-white">Media Storage</p>
                    <p className="text-[10px] text-slate-400 font-mono">Supabase Bucket: portfolio</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-purple-400">Public CDN</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-rose-400" />
                  <div>
                    <p className="text-xs font-medium text-white">Hosting Platform</p>
                    <p className="text-[10px] text-slate-400 font-mono">Vercel Edge Network</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-rose-400">Global</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
