"use client";

import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/components/providers/AuthContext";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  GraduationCap,
  Award,
  Mail,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  Home,
  Loader2,
  Sliders,
  Image,
  BarChart3,
  CheckCircle,
  Database,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ToastProvider>
    </AuthProvider>
  );
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, subtitle: "Overview & stats" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, subtitle: "Insights & reports" },
  { label: "Projects", href: "/admin/projects", icon: Briefcase, subtitle: "My work" },
  { label: "Skills", href: "/admin/skills", icon: Wrench, subtitle: "Technologies" },
  { label: "Experience", href: "/admin/experience", icon: Briefcase, subtitle: "Work history" },
  { label: "Education", href: "/admin/education", icon: GraduationCap, subtitle: "Academic background" },
  { label: "Certificates", href: "/admin/certificates", icon: Award, subtitle: "Achievements" },
  { label: "Personal Info", href: "/admin/personal-info", icon: Sliders, subtitle: "Bio & contact details" },
  { label: "Messages", href: "/admin/messages", icon: Mail, subtitle: "Contact submissions", badge: "3" },
  { label: "Profile", href: "/admin/profile", icon: User, subtitle: "About me" },
  { label: "Settings", href: "/admin/settings", icon: Settings, subtitle: "Preferences" },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Mock Notifications for Topbar
  const mockNotifications = [
    { id: "1", title: "System Alert", text: "Database cluster is running healthy.", time: "Just now", type: "success" },
    { id: "2", title: "New Message", text: "A user sent a contact message.", time: "2 hours ago", type: "message" },
    { id: "3", title: "SSL Certificate", text: "SSL verified successfully.", time: "1 day ago", type: "success" },
  ];

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [user, isLoading, isLoginPage, router]);

  // Adjust sidebar state on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. If hitting login screen, render directly without wrapper UI
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 2. Loading state shield for protected routes
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#030308] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#ff2a4a] drop-shadow-[0_0_15px_rgba(255,42,74,0.5)]" />
          <span className="text-slate-400 text-sm font-mono tracking-widest uppercase">Authorizing Session...</span>
        </div>
      </div>
    );
  }

  // Format breadcrumb path
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      const label = seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return { label, href, isLast: idx === segments.length - 1 };
    });
  };

  const getPageTitle = () => {
    const breadcrumbs = getBreadcrumbs();
    if (breadcrumbs.length > 0) {
      return breadcrumbs[breadcrumbs.length - 1].label;
    }
    return "Dashboard";
  };

  return (
    <div className="min-h-screen w-full bg-[#050308] text-slate-100 relative font-sans flex overflow-hidden">
      {/* Single Unified Stranger Things Background for Entire Environment */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="/dashboard/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top opacity-30 select-none scale-105"
        />
        {/* Soft vignette and liquid glass dimming */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050308]/85 via-[#050308]/92 to-[#050308]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,42,74,0.1),transparent_70%)]" />
      </div>

      {/* Sidebar Navigation (Apple Liquid Glass with Red Glow) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 border-r border-red-500/10 bg-[#08050c]/80 backdrop-blur-2xl transition-all duration-300 ease-out flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.8)] ${
          sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Brand Header */}
          <div className="h-18 border-b border-white/[0.05] flex items-center justify-between px-5 shrink-0">
            <Link href="/admin/dashboard" className="flex items-center gap-3 select-none group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-red-950 flex items-center justify-center font-black text-white text-xs shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/40 group-hover:scale-105 transition-transform">
                AS
              </div>
              <div
                className={`transition-all duration-300 ${
                  !sidebarOpen ? "opacity-0 pointer-events-none w-0" : "opacity-100"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-white text-sm">Portfolio CMS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Admin Panel</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links list (Scrollable) */}
          <nav className="p-3 flex-1 overflow-y-auto space-y-1.5 custom-scrollbar" aria-label="Admin modules">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-red-600/25 via-red-950/30 to-transparent border border-red-500/40 text-white shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/[0.04]"
                  }`}
                >
                  {/* Glowing Icon Container */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive
                        ? "bg-red-500/20 text-[#ff2a4a] shadow-[0_0_10px_rgba(255,42,74,0.4)]"
                        : "text-slate-400 group-hover:text-white group-hover:bg-white/[0.05]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Text Container with Subtitle */}
                  <div
                    className={`flex-1 min-w-0 transition-all duration-300 ${
                      !sidebarOpen ? "opacity-0 pointer-events-none w-0" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-red-600/90 text-white text-[9px] font-bold shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className={`text-[10px] truncate mt-0.2 ${isActive ? "text-red-300/70" : "text-slate-500"}`}>
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Miniature tooltip on hover when collapsed */}
                  {!sidebarOpen && (
                    <div className="hidden lg:block absolute left-20 px-2.5 py-1 rounded-xl bg-[#0e0a14] border border-red-500/30 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Liquid Glass System Status Widget */}
          {sidebarOpen && (
            <div className="p-3 shrink-0">
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-3 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <div>
                    <p className="text-[11px] font-semibold text-white">Database Online</p>
                    <p className="text-[9px] text-slate-400 font-mono">Supabase PostgreSQL</p>
                  </div>
                </div>
                <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  Live
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User profile actions footer */}
        <div className="p-3 border-t border-white/[0.05] bg-[#050308]/60 flex flex-col gap-2 shrink-0">
          {/* Collapsible Profile Avatar Box */}
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-rose-800 flex items-center justify-center font-bold text-white shrink-0 text-xs shadow-[0_0_12px_rgba(239,68,68,0.3)] border border-red-400/30">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div
              className={`min-w-0 transition-all duration-300 flex-1 ${
                !sidebarOpen ? "opacity-0 pointer-events-none w-0 h-0" : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate capitalize">{user.username}</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              </div>
              <p className="text-[10px] text-slate-400 truncate font-mono">{user.email}</p>
            </div>
          </Link>

          <button
            onClick={logout}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-500/20 transition-all duration-300 font-medium text-xs ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400 shrink-0" />
            <span
              className={`transition-all duration-300 ${
                !sidebarOpen ? "opacity-0 pointer-events-none w-0" : "opacity-100"
              }`}
            >
              Log Out
            </span>
          </button>
        </div>
      </aside>

      {/* Sidebar spacer */}
      <div
        aria-hidden="true"
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-out ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      />

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top Floating Glass Navbar */}
        <header className="h-18 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <div className="w-full h-full rounded-2xl bg-[#09060d]/80 border border-white/[0.06] backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            {/* Left brand indicator + mobile menu */}
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <Link href="/admin/dashboard" className="flex items-center gap-2.5 select-none">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-red-950 flex items-center justify-center font-black text-white text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400/40">
                    AS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs tracking-tight text-white">Portfolio CMS</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                    </div>
                    <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">Admin Panel</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Center Global Search / Command Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
              <div className="w-full relative flex items-center">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search anything... (projects, skills, messages, etc.)"
                  className="w-full pl-10 pr-14 py-2 bg-[#050308]/60 border border-white/[0.07] hover:border-red-500/30 focus:border-red-500/50 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all duration-300 font-sans shadow-inner backdrop-blur-md"
                />
                <div className="absolute right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-slate-400 font-mono">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              </div>
            </div>

            {/* Right Quick Actions & Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all cursor-pointer select-none"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.7)] border border-red-400/40">
                    3
                  </span>
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-red-500/20 bg-[#0c0812]/95 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-4 flex flex-col gap-2.5 z-50 backdrop-blur-2xl"
                      >
                        <div className="pb-2.5 border-b border-white/[0.06] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                            <p className="text-[11px] uppercase font-bold tracking-wider text-slate-200">System Logs</p>
                          </div>
                          <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                            Live
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {mockNotifications.map((n) => (
                            <div key={n.id} className="flex gap-3 items-start p-2 rounded-xl hover:bg-white/[0.03] transition-colors text-left border border-transparent hover:border-white/[0.04]">
                              <div className="mt-0.5">
                                {n.type === "success" ? (
                                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Mail className="w-3.5 h-3.5 text-red-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white">{n.title}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.text}</p>
                                <p className="text-[9px] text-slate-500 font-mono mt-1">{n.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle Icon (Moon) */}
              <button
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all cursor-pointer select-none hidden sm:block"
                title="Cinematic Dark Mode"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </button>

              {/* Profile Pill with Online Indicator */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-red-500/30 transition-all select-none cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-600 to-rose-800 flex items-center justify-center font-bold text-white text-[11px] shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.4)] border border-red-400/30">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white capitalize leading-tight">{user.username}</span>
                    <span className="text-[9px] text-emerald-400 font-medium flex items-center gap-1 leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                      Online
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2.5 w-52 rounded-2xl border border-red-500/20 bg-[#0c0812]/95 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2.5 flex flex-col gap-1 z-50 backdrop-blur-2xl"
                      >
                        <div className="px-3 py-2 border-b border-white/[0.06]">
                          <p className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Authorized Account</p>
                          <p className="text-xs font-mono font-semibold text-white truncate mt-0.5">{user.email}</p>
                        </div>
                        <Link
                          href="/admin/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          My Profile
                        </Link>
                        <Link
                          href="/admin/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/20 transition-colors text-left w-full cursor-pointer font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic page routes render container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative overflow-y-auto z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
