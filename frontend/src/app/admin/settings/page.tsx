"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Link2,
  Globe,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  FileText,
  Palette,
  Bell,
  Code2,
  ExternalLink,
} from "lucide-react";

const SETTINGS_KEY = "portfolio_site_settings";

interface SiteSettings {
  siteName: string;
  tagline: string;
  bio: string;
  location: string;
  contactEmail: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  resumeUrl: string;
  accentColor: string;
  enableNotifications: boolean;
  enableContactForm: boolean;
  metaDescription: string;
}

const defaultSettings: SiteSettings = {
  siteName: "Portfolio",
  tagline: "Full-Stack Developer & Designer",
  bio: "",
  location: "",
  contactEmail: "",
  phone: "",
  githubUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  websiteUrl: "",
  resumeUrl: "",
  accentColor: "#00d2ff",
  enableNotifications: true,
  enableContactForm: true,
  metaDescription: "",
};

function SectionHeader({ icon: Icon, title, description }: {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 py-4 border-b border-white/[0.05]">
      <h2 className="text-sm font-bold text-white flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        {title}
      </h2>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </div>
  );
}

function FieldRow({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  mono = false,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.FC<{ className?: string }>;
  mono?: boolean;
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
          autoComplete="off"
          className={`w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/10 transition-all ${
            mono ? "font-mono" : ""
          }`}
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/[0.04] last:border-b-0">
      <div>
        <div className="text-sm text-slate-300 font-medium">{label}</div>
        <div className="text-xs text-slate-600 mt-0.5">{description}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
          value ? "bg-[#00d2ff]" : "bg-white/[0.08]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const set = (key: keyof SiteSettings) => (value: string | boolean) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate async save with localStorage persistence
    await new Promise((r) => setTimeout(r, 600));
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      showNotification("success", "Settings saved successfully.");
    } catch {
      showNotification("error", "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-slate-400" />
            Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure your portfolio site preferences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Site Identity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden"
        >
          <SectionHeader
            icon={Globe}
            title="Site Identity"
            description="Basic information displayed across your portfolio."
          />
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow
              label="Site Name"
              id="siteName"
              value={settings.siteName}
              onChange={set("siteName")}
              placeholder="My Portfolio"
              icon={Globe}
            />
            <FieldRow
              label="Tagline"
              id="tagline"
              value={settings.tagline}
              onChange={set("tagline")}
              placeholder="Full-Stack Developer"
              icon={FileText}
            />
            <div className="sm:col-span-2">
              <label htmlFor="bio" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                value={settings.bio}
                onChange={(e) => set("bio")(e.target.value)}
                placeholder="A short description about yourself..."
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 transition-all resize-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="metaDesc" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                SEO Meta Description
              </label>
              <textarea
                id="metaDesc"
                rows={2}
                value={settings.metaDescription}
                onChange={(e) => set("metaDescription")(e.target.value)}
                placeholder="Shown in search engine results..."
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden"
        >
          <SectionHeader
            icon={Mail}
            title="Contact Information"
            description="Displayed in your contact section and footer."
          />
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow
              label="Contact Email"
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={set("contactEmail")}
              placeholder="hello@example.com"
              icon={Mail}
            />
            <FieldRow
              label="Phone"
              id="phone"
              type="tel"
              value={settings.phone}
              onChange={set("phone")}
              placeholder="+1 (555) 000-0000"
              icon={Phone}
            />
            <div className="sm:col-span-2">
              <FieldRow
                label="Location"
                id="location"
                value={settings.location}
                onChange={set("location")}
                placeholder="City, Country"
                icon={MapPin}
              />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden"
        >
          <SectionHeader
            icon={LinkIcon}
            title="Social Links"
            description="Links shown in your portfolio header and footer."
          />
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow
              label="GitHub"
              id="githubUrl"
              value={settings.githubUrl}
              onChange={set("githubUrl")}
              placeholder="https://github.com/username"
              icon={Link2}
              mono
            />
            <FieldRow
              label="LinkedIn"
              id="linkedinUrl"
              value={settings.linkedinUrl}
              onChange={set("linkedinUrl")}
              placeholder="https://linkedin.com/in/username"
              icon={Link2}
              mono
            />
            <FieldRow
              label="Twitter / X"
              id="twitterUrl"
              value={settings.twitterUrl}
              onChange={set("twitterUrl")}
              placeholder="https://twitter.com/username"
              icon={Link2}
              mono
            />
            <FieldRow
              label="Website"
              id="websiteUrl"
              value={settings.websiteUrl}
              onChange={set("websiteUrl")}
              placeholder="https://yourwebsite.com"
              icon={ExternalLink}
              mono
            />
            <div className="sm:col-span-2">
              <FieldRow
                label="Resume / CV URL"
                id="resumeUrl"
                value={settings.resumeUrl}
                onChange={set("resumeUrl")}
                placeholder="https://drive.google.com/..."
                icon={FileText}
                mono
              />
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden"
        >
          <SectionHeader
            icon={Palette}
            title="Appearance"
            description="Customize your portfolio visual style."
          />
          <div className="p-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => set("accentColor")(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => set("accentColor")(e.target.value)}
                  className="w-32 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white font-mono outline-none focus:border-[#00d2ff]/40 transition-all"
                />
                <div
                  className="w-8 h-8 rounded-full shadow-lg"
                  style={{
                    backgroundColor: settings.accentColor,
                    boxShadow: `0 0 20px ${settings.accentColor}44`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Toggles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden"
        >
          <SectionHeader
            icon={Code2}
            title="Features"
            description="Toggle portfolio features on or off."
          />
          <div className="p-6 space-y-0">
            <Toggle
              label="Contact Form"
              description="Allow visitors to send you messages through the contact form."
              value={settings.enableContactForm}
              onChange={(v) => set("enableContactForm")(v)}
            />
            <Toggle
              label="Email Notifications"
              description="Receive email notifications when someone contacts you."
              value={settings.enableNotifications}
              onChange={(v) => set("enableNotifications")(v)}
            />
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#00d2ff] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-blue-900/20"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
          <p className="text-xs text-slate-600">
            Settings are stored locally and applied to your portfolio.
          </p>
        </div>
      </form>
    </div>
  );
}
