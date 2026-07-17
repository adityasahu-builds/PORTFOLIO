"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Wrench,
  GraduationCap,
  Award,
  Mail,
  TrendingUp,
  ArrowRight,
  Clock,
  User,
  ExternalLink,
  BarChart3,
  Calendar,
  Sparkles,
} from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  icon: React.FC<{ className?: string }>;
  href: string;
  color: string;
  glow: string;
  borderGlow: string;
  bg: string;
  trend: string;
  isLoading?: boolean;
}

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

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

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

    const duration = 1.0; // seconds
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out exponential curve
      const current = Math.round(end * (1 - Math.pow(2, -10 * progress)));
      
      setDisplayValue(current);

      if (frame >= totalFrames) {
        clearInterval(counter);
        setDisplayValue(end);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [value, isLoading]);

  if (isLoading) {
    return <span className="animate-pulse opacity-50">...</span>;
  }

  return <span>{displayValue}</span>;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const projects = useCount("/projects", "projects");
  const skills = useCount("/skills", "skills");
  const education = useCount("/education", "education");
  const experience = useCount("/experience", "experience");
  const certificates = useCount("/certificates", "certificates");
  const messages = useQuery<number>({
    queryKey: ["messages-count"],
    queryFn: async () => {
      const res = await api.get("/contact?limit=1&page=1");
      return res.data?.data?.pagination?.total ?? 0;
    },
    staleTime: 30000,
  });
  const recentMessages = useRecentMessages();

  const statCards: StatCard[] = [
    {
      label: "Projects",
      value: projects.data ?? 0,
      icon: Briefcase,
      href: "/admin/projects",
      color: "text-blue-400",
      glow: "bg-blue-500/10",
      borderGlow: "group-hover:border-blue-500/35",
      bg: "from-blue-500/5 to-transparent border-white/[0.04] hover:bg-white/[0.01]",
      trend: "Latest active",
      isLoading: projects.isLoading,
    },
    {
      label: "Skills",
      value: skills.data ?? 0,
      icon: Wrench,
      href: "/admin/skills",
      color: "text-cyan-400",
      glow: "bg-cyan-500/10",
      borderGlow: "group-hover:border-cyan-500/35",
      bg: "from-cyan-500/5 to-transparent border-white/[0.04] hover:bg-white/[0.01]",
      trend: "Fully configured",
      isLoading: skills.isLoading,
    },
    {
      label: "Experience",
      value: experience.data ?? 0,
      icon: TrendingUp,
      href: "/admin/experience",
      color: "text-violet-400",
      glow: "bg-violet-500/10",
      borderGlow: "group-hover:border-violet-500/35",
      bg: "from-violet-500/5 to-transparent border-white/[0.04] hover:bg-white/[0.01]",
      trend: "Timeline loaded",
      isLoading: experience.isLoading,
    },
    {
      label: "Education",
      value: education.data ?? 0,
      icon: GraduationCap,
      href: "/admin/education",
      color: "text-emerald-400",
      glow: "bg-emerald-500/10",
      borderGlow: "group-hover:border-emerald-500/35",
      bg: "from-emerald-500/5 to-transparent border-white/[0.04] hover:bg-white/[0.01]",
      trend: "Academic stats",
      isLoading: education.isLoading,
    },
    {
      label: "Certificates",
      value: certificates.data ?? 0,
      icon: Award,
      href: "/admin/certificates",
      color: "text-amber-400",
      glow: "bg-amber-500/10",
      borderGlow: "group-hover:border-amber-500/35",
      bg: "from-amber-500/5 to-transparent border-white/[0.04] hover:bg-white/[0.01]",
      trend: "Credentials active",
      isLoading: certificates.isLoading,
    },
    {
      label: "Messages",
      value: messages.data ?? 0,
      icon: Mail,
      href: "/admin/messages",
      color: "text-rose-450",
      glow: "bg-rose-500/10",
      borderGlow: "group-hover:border-rose-500/35",
      bg: "from-rose-500/5 to-transparent border-white/[0.04] hover:bg-white/[0.01]",
      trend: "Unread count",
      isLoading: messages.isLoading,
    },
  ];

  const quickActions = [
    { label: "Add Project", href: "/admin/projects", icon: Briefcase, desc: "Showcase new development work" },
    { label: "Add Skill", href: "/admin/skills", icon: Wrench, desc: "Incorporate new tech stack nodes" },
    { label: "Add Certificate", href: "/admin/certificates", icon: Award, desc: "Upload verified achievements" },
    { label: "View Messages", href: "/admin/messages", icon: Mail, desc: "Reply to visitor contact logs" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-[#00d2ff] to-blue-400 bg-clip-text text-transparent capitalize">
              {user?.username ?? "Admin"}
            </span>
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-1">
            Analyze logs and organize database models for your custom portfolio site.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:border-[#00d2ff]/30 hover:bg-white/[0.05] transition-all text-xs font-semibold"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Live Site</span>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4 select-none">
          <BarChart3 className="w-4 h-4 text-slate-500" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
            Database Overview
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={card.href}
                  className={`group relative flex flex-col justify-between p-5 h-40 rounded-2xl bg-gradient-to-br ${card.bg} border backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 shadow-md ${card.borderGlow} overflow-hidden`}
                >
                  {/* Glowing Blur bubble */}
                  <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-15 blur-xl transition-all duration-300 group-hover:scale-125 ${card.glow}`} />

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center transition-colors group-hover:border-white/[0.12] ${card.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  {/* Value / Label */}
                  <div className="mt-3">
                    <div className="text-3xl font-bold tracking-tight text-white font-sans flex items-baseline">
                      <AnimatedCounter value={card.value} isLoading={card.isLoading} />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-semibold uppercase tracking-wider">{card.label}</div>
                  </div>

                  {/* Mini Trend Signal */}
                  <div className="flex items-center justify-between text-[9px] font-semibold text-slate-650 mt-2 font-mono select-none">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#00d2ff]" />
                      {card.trend}
                    </span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#00d2ff]" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Recent Messages + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="xl:col-span-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] p-6 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 select-none">
              <Mail className="w-4 h-4 text-rose-400" />
              <h2 className="text-xs uppercase tracking-widest font-bold text-white">Recent Messages</h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-[10px] uppercase font-bold tracking-widest text-[#00d2ff] hover:underline flex items-center gap-1.5"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMessages.isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/[0.04] rounded w-3/4" />
                    <div className="h-2.5 bg-white/[0.03] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentMessages.data?.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
              <Mail className="w-8 h-8 text-slate-700" />
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Inbox Empty</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentMessages.data?.map((msg) => (
                <div
                  key={msg._id}
                  className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-600/20 flex items-center justify-center shrink-0 text-xs font-bold text-[#00d2ff] border border-blue-500/10">
                    {msg.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200 truncate">{msg.fullName}</span>
                      <span className="text-[9px] text-slate-600 shrink-0 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-550" />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{msg.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="xl:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.04] p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-5 select-none">
            <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
            <h2 className="text-xs uppercase tracking-widest font-bold text-white">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#00d2ff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-350 group-hover:text-white transition-colors">
                      {action.label}
                    </div>
                    <div className="text-[10px] text-slate-650 mt-0.5">{action.desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-[#00d2ff] group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
