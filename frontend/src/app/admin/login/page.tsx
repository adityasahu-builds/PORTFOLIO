"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, User, Loader2, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const { user, login, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.replace("/admin/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login(usernameOrEmail, password);
      // Success redirects automatically via Context -> Router push
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030308] overflow-hidden flex items-center justify-center font-sans">
      
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-600/10 via-indigo-950/20 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 0.95, 1.1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-cyan-600/5 via-blue-900/10 to-transparent blur-[140px]"
        />
        
        {/* Fine Star Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(1.2px_1.2px_at_50%_50%,#fff_100%,transparent)] opacity-[0.08] bg-[size:32px_32px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {mounted && [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00d2ff] rounded-full opacity-[0.25] blur-[1px]"
            initial={{
              x: Math.random() * 100 + "vw",
              y: Math.random() * 100 + "vh",
              scale: Math.random() * 1.5 + 0.5,
            }}
            animate={{
              y: ["100vh", "-10vh"],
              x: ["0vw", (Math.random() - 0.5) * 20 + "vw"],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Card container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] px-6 relative z-10"
      >
        <div className="p-8 md:p-10 rounded-3xl bg-[#09090e]/40 border border-white/[0.04] backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative overflow-hidden group">
          {/* Top subtle highlight border line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent" />

          {/* Logo Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-[#00d2ff] flex items-center justify-center text-xl font-bold font-display text-white shadow-[0_0_20px_rgba(0,210,255,0.25)] mb-4">
              AS
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1.5 font-sans">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Sign in to manage your premium portfolio CMS.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Error Message banner */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/10 backdrop-blur-sm flex items-start gap-2.5 text-xs text-rose-400 font-medium"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Username or Email</span>
              </label>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/30 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(0,210,255,0.05)] transition-all duration-300 font-sans"
                placeholder="admin or admin@adityasahu.dev"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Password</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert("Please refer to database seeding logs or seed.ts to retrieve or reset password."); }}
                  className="text-[10px] font-semibold text-slate-500 hover:text-[#00d2ff] transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/30 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(0,210,255,0.05)] transition-all duration-300 font-sans"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-0 text-slate-500 hover:text-[#00d2ff] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded border-white/[0.1] bg-[#0a0a0f]/60 text-[#00d2ff] focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 font-medium select-none cursor-pointer hover:text-slate-350">
                Remember my session details
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full overflow-hidden rounded-xl bg-white/[0.04] p-[1px] transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="relative flex items-center justify-center gap-2 rounded-xl bg-[#0a0a0f] py-3.5 transition-all duration-500 hover:bg-[#050508] text-sm font-semibold text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#00d2ff]" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </div>
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
