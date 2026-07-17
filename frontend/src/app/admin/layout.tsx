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
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Personal Info", href: "/admin/personal-info", icon: Sliders },
  { label: "Media Manager", href: "/admin/media", icon: Image },
  { label: "Projects", href: "/admin/projects", icon: Briefcase },
  { label: "Skills", href: "/admin/skills", icon: Wrench },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Settings", href: "/admin/settings", icon: Settings },
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
          <Loader2 className="w-10 h-10 animate-spin text-[#00d2ff] drop-shadow-[0_0_15px_rgba(0,210,255,0.4)]" />
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
    <div className="min-h-screen w-full bg-[#030308] text-slate-100 relative font-sans flex">
      {/* Background Aesthetics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-blue-900/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-cyan-900/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1.2px_1.2px_at_50%_50%,#fff_100%,transparent)] opacity-[0.02] bg-[size:24px_24px]" />
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 border-r border-white/[0.04] bg-[#07070c]/70 backdrop-blur-xl transition-all duration-300 ease-out flex flex-col justify-between ${
          sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 border-b border-white/[0.04] flex items-center justify-between px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-3 select-none">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-[#00d2ff] flex items-center justify-center font-bold text-white shrink-0 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                AS
              </div>
              <span
                className={`font-bold tracking-tight text-white transition-all duration-300 ${
                  !sidebarOpen ? "opacity-0 pointer-events-none w-0" : "opacity-100"
                }`}
              >
                Portfolio CMS
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links list */}
          <nav className="p-4 flex flex-col gap-1" aria-label="Admin modules">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                    isActive ? "text-[#00d2ff] font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {/* Sliding Background Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border-l-2 border-[#00d2ff] rounded-xl z-0"
                      transition={{ type: "spring", stiffness: 385, damping: 30 }}
                    />
                  )}

                  <Icon
                    className={`w-4 h-4 shrink-0 transition-all duration-300 group-hover:scale-105 z-10 ${
                      isActive ? "text-[#00d2ff]" : "text-slate-500 group-hover:text-slate-350"
                    }`}
                  />
                  <span
                    className={`z-10 transition-all duration-300 ${
                      !sidebarOpen ? "opacity-0 pointer-events-none w-0" : "opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Miniature tooltip on hover when collapsed */}
                  {!sidebarOpen && (
                    <div className="hidden lg:block absolute left-24 px-2 py-1 rounded bg-[#09090e] border border-white/[0.05] text-[10px] uppercase font-bold tracking-widest text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-55">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile actions footer */}
        <div className="p-4 border-t border-white/[0.04] bg-[#050509]/30 flex flex-col gap-2">
          {/* Collapsible Profile Avatar Box */}
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-[#00d2ff] flex items-center justify-center font-bold text-white shrink-0 text-xs shadow-md">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div
              className={`min-w-0 transition-all duration-350 flex-1 ${
                !sidebarOpen ? "opacity-0 pointer-events-none w-0 h-0" : "opacity-100"
              }`}
            >
              <p className="text-xs font-semibold text-white truncate capitalize">{user.username}</p>
              <p className="text-[10px] text-slate-550 truncate font-mono">{user.email}</p>
            </div>
          </Link>

          <button
            onClick={logout}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/10 transition-all duration-300 font-medium text-sm ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400 shrink-0" />
            <span
              className={`transition-all duration-305 ${
                !sidebarOpen ? "opacity-0 pointer-events-none w-0" : "opacity-100"
              }`}
            >
              Log Out
            </span>
          </button>
        </div>
      </aside>

      {/* Sidebar spacer pushes layout main block */}
      <div
        aria-hidden="true"
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-out ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      />

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/[0.04] bg-[#030308]/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle sidebar panel"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb & Title combo */}
            <div className="flex flex-col gap-0.5">
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 select-none">
                <Link href="/" className="hover:text-[#00d2ff] transition-colors flex items-center gap-1">
                  <Home className="w-3 h-3" />
                  <span>Site</span>
                </Link>
                <span>/</span>
                {getBreadcrumbs().map((b, idx) => (
                  <React.Fragment key={b.href}>
                    {idx > 0 && <span>/</span>}
                    {b.isLast ? (
                      <span className="text-slate-350">{b.label}</span>
                    ) : (
                      <Link href={b.href} className="hover:text-[#00d2ff] transition-colors">
                        {b.label}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <h2 className="text-xs font-semibold text-white tracking-wide uppercase sm:hidden block leading-none">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Quick profile actions */}
          <div className="flex items-center gap-4">
            {/* Search Box placeholder */}
            <div className="hidden md:flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-40 px-3 py-1.5 bg-[#0a0a0f]/60 border border-white/[0.05] rounded-xl text-xs text-white placeholder-slate-650 outline-none focus:border-[#00d2ff]/40 focus:w-56 transition-all duration-300 font-sans"
              />
            </div>

            {/* Notification Bell Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer select-none"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00d2ff] ring-2 ring-[#030308] animate-pulse" />
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
                      className="absolute right-0 mt-2.5 w-72 rounded-2xl border border-white/[0.04] bg-[#09090e] shadow-2xl p-4 flex flex-col gap-2.5 z-55 backdrop-blur-xl"
                    >
                      <div className="pb-2 border-b border-white/[0.04] flex items-center justify-between">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">System Logs</p>
                        <span className="text-[8px] bg-blue-500/10 text-[#00d2ff] border border-blue-500/20 px-1.5 py-0.5 rounded-full font-mono uppercase font-bold">Live</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {mockNotifications.map((n) => (
                          <div key={n.id} className="flex gap-2.5 items-start p-1.5 rounded-xl hover:bg-white/[0.02] transition-colors text-left">
                            <div className="mt-0.5">
                              {n.type === "success" ? (
                                <Database className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Mail className="w-3.5 h-3.5 text-[#00d2ff]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white">{n.title}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{n.text}</p>
                              <p className="text-[8px] text-slate-650 font-mono mt-1">{n.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all select-none cursor-pointer"
              >
                <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-blue-600 to-[#00d2ff] flex items-center justify-center font-bold text-white text-[10px] shrink-0 shadow-sm">
                  {user.username.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-300 hidden md:block capitalize">{user.username}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
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
                      className="absolute right-0 mt-2.5 w-48 rounded-xl border border-white/[0.04] bg-[#09090e] shadow-2xl p-2 flex flex-col gap-1 z-55 backdrop-blur-xl"
                    >
                      <div className="px-3 py-2 border-b border-white/[0.04]">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-550">Authorized Email</p>
                        <p className="text-[10px] font-mono font-semibold text-white truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link
                        href="/admin/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        My Profile
                      </Link>
                      <Link
                        href="/admin/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/10 transition-colors text-left w-full cursor-pointer font-medium"
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
        </header>

        {/* Dynamic page routes render container */}
        <main className="flex-1 p-6 lg:p-8 relative overflow-y-auto z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
