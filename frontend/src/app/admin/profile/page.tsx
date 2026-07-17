"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
  right,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.FC<{ className?: string }>;
  disabled?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>{label}</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/10 transition-all disabled:opacity-50"
        />
        {right && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>
        )}
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  const { user, checkSession } = useAuth();

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Profile form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Pre-fill from auth context
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const profileMutation = useMutation({
    mutationFn: () => api.put("/auth/profile", { username, email }),
    onSuccess: async () => {
      await checkSession();
      showNotification("success", "Profile updated successfully.");
    },
    onError: (err: any) =>
      showNotification("error", err?.response?.data?.message || "Failed to update profile."),
  });

  const passwordMutation = useMutation({
    mutationFn: () =>
      api.put("/auth/change-password", { currentPassword, newPassword }),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showNotification("success", "Password changed successfully.");
    },
    onError: (err: any) =>
      showNotification("error", err?.response?.data?.message || "Failed to change password."),
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    profileMutation.mutate();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      showNotification("error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      showNotification("error", "New password must be at least 8 characters.");
      return;
    }
    passwordMutation.mutate();
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(newPassword);
  const strengthColors = ["", "bg-rose-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-cyan-500"];
  const strengthLabels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  return (
    <div className="space-y-8 max-w-2xl pb-16">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl text-sm font-medium ${
              notification.type === "success"
                ? "bg-emerald-950/80 border-emerald-700/40 text-emerald-300"
                : "bg-rose-950/80 border-rose-700/40 text-rose-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-5 h-5 text-[#00d2ff]" />
          My Profile
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account details and security settings.</p>
      </div>

      {/* Avatar + Info Card */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-[#00d2ff] flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-[0_0_30px_rgba(0,210,255,0.15)]">
          {user?.username?.substring(0, 2).toUpperCase() ?? "AD"}
        </div>
        <div>
          <div className="text-lg font-bold text-white capitalize">{user?.username}</div>
          <div className="text-sm text-slate-400 mt-0.5">{user?.email}</div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/20 text-[#00d2ff] text-xs font-semibold uppercase tracking-widest">
            <Shield className="w-3 h-3" />
            {user?.role ?? "Admin"}
          </div>
        </div>
      </div>

      {/* Profile Information Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            Profile Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Update your username and email address.</p>
        </div>
        <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
          <InputField
            label="Username"
            id="username"
            value={username}
            onChange={setUsername}
            placeholder="your username"
            icon={User}
          />
          <InputField
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="your@email.com"
            icon={Mail}
          />
          <div className="pt-2">
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#00d2ff] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {profileMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>

      {/* Change Password Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            Change Password
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Use a strong, unique password to protect your account.
          </p>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          {/* Current Password */}
          <InputField
            label="Current Password"
            id="current-password"
            type={showCurrentPw ? "text" : "password"}
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter current password"
            icon={KeyRound}
            right={
              <button
                type="button"
                onClick={() => setShowCurrentPw((v) => !v)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* New Password */}
          <InputField
            label="New Password"
            id="new-password"
            type={showNewPw ? "text" : "password"}
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 8 characters"
            icon={Lock}
            right={
              <button
                type="button"
                onClick={() => setShowNewPw((v) => !v)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Strength meter */}
          {newPassword && (
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      s <= strength ? strengthColors[strength] : "bg-white/[0.06]"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${strengthColors[strength].replace("bg-", "text-")}`}>
                {strengthLabels[strength]}
              </p>
            </div>
          )}

          {/* Confirm Password */}
          <InputField
            label="Confirm New Password"
            id="confirm-password"
            type={showConfirmPw ? "text" : "password"}
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repeat new password"
            icon={Lock}
            right={
              <button
                type="button"
                onClick={() => setShowConfirmPw((v) => !v)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Mismatch warning */}
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Passwords do not match
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordMutation.isPending || !currentPassword || !newPassword || !confirmPassword}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {passwordMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              Update Password
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
