"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  User,
  BookOpen,
  Mail,
  Share2,
  Globe,
  Save,
  RotateCcw,
  Plus,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Calendar,
  ExternalLink,
  MapPin,
  MessageSquare,
  Lock,
  Compass,
} from "lucide-react";
import MediaPicker from "@/components/ui/MediaPicker";

// Social media icon resolver
const getSocialIcon = (key: string) => {
  switch (key) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      );
    default:
      return <Globe className="w-5 h-5" />;
  }
};

interface PersonalInfoData {
  hero: {
    fullName: string;
    professionalTitle: string;
    shortTagline: string;
    typingText: string[];
    heroDescription: string;
    profileImage: string;
    resumeUrl: string;
    currentCompany: string;
    currentPosition: string;
    experienceYears: number;
    availabilityStatus: string;
    ctaButtonText: string;
    ctaButtonUrl: string;
  };
  about: {
    aboutHeading: string;
    aboutDescription: string;
    longBiography: string;
    location: string;
    nationality: string;
    languages: string[];
    interests: string[];
    portraitTitle: string;
    portraitSubtitle: string;
    portraitRingColor: string;
    portraitGlowColor: string;
    portraitAccentColor: string;
    portraitBackgroundEffect: string;
    portraitAnimationEnabled: boolean;
    portraitImage: string;
  };
  contact: {
    primaryEmail: string;
    secondaryEmail: string;
    phoneNumber: string;
    whatsApp: string;
    address: string;
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
    resume: string;
    twitter: string;
    instagram: string;
    youtube: string;
    leetcode: string;
    codeforces: string;
    codechef: string;
    geeksforgeeks: string;
    hackerrank: string;
    hackerone: string;
    medium: string;
    devto: string;
    stackoverflow: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
}

const TABS = [
  { id: "general", label: "General", icon: Sliders },
  { id: "hero", label: "Hero Section", icon: User },
  { id: "about", label: "About Section", icon: BookOpen },
  { id: "contact", label: "Contact Info", icon: Mail },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "seo", label: "SEO Config", icon: Globe },
];

export default function AdminPersonalInfoPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState<PersonalInfoData | null>(null);
  // Tag fields local states
  const [typingInput, setTypingInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch current data
  const { data: dbData, isLoading, isError } = useQuery<PersonalInfoData>({
    queryKey: ["admin-personal-info"],
    queryFn: async () => {
      const res = await api.get("/personal-info");
      return res.data?.data;
    },
  });

  // Keep form in sync when dbData is loaded
  useEffect(() => {
    if (dbData) {
      setForm(JSON.parse(JSON.stringify(dbData)));
    }
  }, [dbData]);

  // Mutation for updating data
  const updateMutation = useMutation({
    mutationFn: (data: PersonalInfoData) => api.put("/personal-info", data),
    onSuccess: (res) => {
      const updatedData = res.data?.data;
      queryClient.setQueryData(["admin-personal-info"], updatedData);
      setForm(JSON.parse(JSON.stringify(updatedData)));
      showNotification("success", "Personal information saved successfully.");
    },
    onError: (err: any) => {
      showNotification("error", err?.response?.data?.message || "Failed to save information.");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#00d2ff]" />
          <span className="text-slate-400 text-xs tracking-widest font-mono uppercase">Loading configuration...</span>
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-rose-450 gap-2">
        <AlertCircle className="w-5 h-5" />
        <span className="font-semibold text-sm">Failed to load personal information configuration.</span>
      </div>
    );
  }

  // Detect unsaved changes by comparing JSON representations
  const isDirty = JSON.stringify(dbData) !== JSON.stringify(form);

  const handleReset = () => {
    if (dbData) {
      setForm(JSON.parse(JSON.stringify(dbData)));
      showNotification("success", "Changes reverted to last saved state.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  // State handlers for nested fields
  const setHeroField = (key: keyof PersonalInfoData["hero"], val: any) => {
    setForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        hero: { ...prev.hero, [key]: val },
      };
    });
  };

  const setAboutField = (key: keyof PersonalInfoData["about"], val: any) => {
    setForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        about: { ...prev.about, [key]: val },
      };
    });
  };

  const setContactField = (key: keyof PersonalInfoData["contact"], val: any) => {
    setForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        contact: { ...prev.contact, [key]: val },
      };
    });
  };

  const setSocialField = (key: keyof PersonalInfoData["socialLinks"], val: any) => {
    setForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: val },
      };
    });
  };

  const setSeoField = (key: keyof PersonalInfoData["seo"], val: any) => {
    setForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        seo: { ...prev.seo, [key]: val },
      };
    });
  };

  // Helper arrays update functions
  const addTypingText = () => {
    const trimmed = typingInput.trim();
    if (trimmed && !form.hero.typingText.includes(trimmed)) {
      setHeroField("typingText", [...form.hero.typingText, trimmed]);
    }
    setTypingInput("");
  };

  const removeTypingText = (txt: string) => {
    setHeroField("typingText", form.hero.typingText.filter((t) => t !== txt));
  };

  const addLanguage = () => {
    const trimmed = langInput.trim();
    if (trimmed && !form.about.languages.includes(trimmed)) {
      setAboutField("languages", [...form.about.languages, trimmed]);
    }
    setLangInput("");
  };

  const removeLanguage = (lang: string) => {
    setAboutField("languages", form.about.languages.filter((l) => l !== lang));
  };

  const addInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !form.about.interests.includes(trimmed)) {
      setAboutField("interests", [...form.about.interests, trimmed]);
    }
    setInterestInput("");
  };

  const removeInterest = (item: string) => {
    setAboutField("interests", form.about.interests.filter((i) => i !== item));
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !form.seo.keywords.includes(trimmed)) {
      setSeoField("keywords", [...form.seo.keywords, trimmed]);
    }
    setKeywordInput("");
  };

  const removeKeyword = (kw: string) => {
    setSeoField("keywords", form.seo.keywords.filter((k) => k !== kw));
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
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

      {/* Header and Floating Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Sliders className="w-6 h-6 text-[#00d2ff]" />
            Personal Information CMS
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage global portfolio settings, Hero animations, About biography, and SEO targets.</p>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-amber-400 font-mono flex items-center gap-1.5 mr-2 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              Unsaved Changes
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || updateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] rounded-xl text-xs text-slate-300 font-semibold transition-all disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-[#00d2ff] hover:opacity-90 rounded-xl text-xs text-white font-bold transition-all disabled:opacity-40 shadow-lg shadow-blue-900/20"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Page Tabs + Forms Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start">
        {/* Navigation Sidebar Tabs */}
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 border-b border-white/[0.04] lg:border-b-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  isTabActive
                    ? "bg-blue-500/10 border-l-2 border-[#00d2ff] text-[#00d2ff]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.01]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isTabActive ? "text-[#00d2ff]" : "text-slate-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body + Interactive Previews Container */}
        <div className="bg-white/[0.01] border border-white/[0.04] rounded-3xl p-6 lg:p-8 space-y-8 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* TABS EDITORS */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.04] pb-3 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-slate-400" /> General Info & Experience
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={form.hero.fullName}
                        onChange={(e) => setHeroField("fullName", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Professional Title</label>
                      <input
                        type="text"
                        value={form.hero.professionalTitle}
                        onChange={(e) => setHeroField("professionalTitle", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Current Company</label>
                      <input
                        type="text"
                        value={form.hero.currentCompany}
                        onChange={(e) => setHeroField("currentCompany", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Current Position</label>
                      <input
                        type="text"
                        value={form.hero.currentPosition}
                        onChange={(e) => setHeroField("currentPosition", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Experience Years</label>
                      <input
                        type="number"
                        value={form.hero.experienceYears}
                        onChange={(e) => setHeroField("experienceYears", parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Availability Status</label>
                      <input
                        type="text"
                        value={form.hero.availabilityStatus}
                        onChange={(e) => setHeroField("availabilityStatus", e.target.value)}
                        placeholder="e.g. Open to Internship Opportunities"
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "hero" && (
                <div className="space-y-6">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.04] pb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" /> Hero Branding & Call To Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Hero Inputs */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Short Tagline</label>
                        <input
                          type="text"
                          value={form.hero.shortTagline}
                          onChange={(e) => setHeroField("shortTagline", e.target.value)}
                          className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hero Description</label>
                        <textarea
                          rows={3}
                          value={form.hero.heroDescription}
                          onChange={(e) => setHeroField("heroDescription", e.target.value)}
                          className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">CTA Button Text</label>
                          <input
                            type="text"
                            value={form.hero.ctaButtonText}
                            onChange={(e) => setHeroField("ctaButtonText", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">CTA Button URL</label>
                          <input
                            type="text"
                            value={form.hero.ctaButtonUrl}
                            onChange={(e) => setHeroField("ctaButtonUrl", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MediaPicker
                          label="Profile Image"
                          placeholder="Select profile avatar image..."
                          value={form.hero.profileImage}
                          onChange={(url) => setHeroField("profileImage", url)}
                          acceptType="image"
                        />
                        <MediaPicker
                          label="Resume PDF / Document"
                          placeholder="Select resume document..."
                          value={form.hero.resumeUrl}
                          onChange={(url) => setHeroField("resumeUrl", url)}
                          acceptType="document"
                        />
                      </div>
                      {/* Typing text dynamic array */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Typing Text Professions</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={typingInput}
                            onChange={(e) => setTypingInput(e.target.value)}
                            placeholder="Add profession (e.g. Backend Developer)"
                            className="flex-1 px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTypingText())}
                          />
                          <button
                            type="button"
                            onClick={addTypingText}
                            className="px-4 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] rounded-xl text-white flex items-center justify-center transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {form.hero.typingText.map((t, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#00d2ff] text-xs font-semibold"
                            >
                              {t}
                              <button type="button" onClick={() => removeTypingText(t)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Previews Sidebar */}
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 space-y-4">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Previews</h3>
                        
                        {/* Profile Photo Preview */}
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className="w-20 h-20 rounded-full border border-blue-500/20 bg-blue-950/20 flex items-center justify-center overflow-hidden">
                            {form.hero.profileImage ? (
                              <img src={form.hero.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-8 h-8 text-blue-400" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Profile Avatar</span>
                        </div>

                        {/* Resume Link Preview */}
                        {form.hero.resumeUrl && (
                          <div className="border border-white/[0.04] p-3 rounded-xl bg-white/[0.01]">
                            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                              <span>Resume Link</span>
                              <a href={form.hero.resumeUrl} target="_blank" rel="noreferrer" className="text-[#00d2ff] flex items-center gap-0.5 hover:underline">
                                Link <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                            <p className="text-xs text-white truncate mt-1">{form.hero.resumeUrl}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "about" && (
                <div className="space-y-6">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.04] pb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" /> About Layout & Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">About Heading</label>
                          <input
                            type="text"
                            value={form.about.aboutHeading}
                            onChange={(e) => setAboutField("aboutHeading", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Location</label>
                          <input
                            type="text"
                            value={form.about.location}
                            onChange={(e) => setAboutField("location", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">About Short Description</label>
                        <input
                          type="text"
                          value={form.about.aboutDescription}
                          onChange={(e) => setAboutField("aboutDescription", e.target.value)}
                          className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Long Biography</label>
                        <textarea
                          rows={6}
                          value={form.about.longBiography}
                          onChange={(e) => setAboutField("longBiography", e.target.value)}
                          className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none resize-y"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nationality</label>
                          <input
                            type="text"
                            value={form.about.nationality}
                            onChange={(e) => setAboutField("nationality", e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                          />
                        </div>
                        {/* Languages Dynamic List */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Languages Spoken</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={langInput}
                              onChange={(e) => setLangInput(e.target.value)}
                              placeholder="e.g. English"
                              className="flex-1 px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-lg text-xs text-white focus:border-[#00d2ff]/40 outline-none"
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                            />
                            <button type="button" onClick={addLanguage} className="px-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {form.about.languages.map((l, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-900/10 border border-blue-500/20 text-[#00d2ff] text-[11px] font-medium">
                                {l}
                                <button type="button" onClick={() => removeLanguage(l)} className="text-slate-400 hover:text-white"><X className="w-2.5 h-2.5" /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Interests Dynamic List */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Interests & Hobbies</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            placeholder="e.g. Machine Learning"
                            className="flex-1 px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-lg text-xs text-white focus:border-[#00d2ff]/40 outline-none"
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                          />
                          <button type="button" onClick={addInterest} className="px-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {form.about.interests.map((it, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-900/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium">
                              {it}
                              <button type="button" onClick={() => removeInterest(it)} className="text-slate-400 hover:text-white"><X className="w-2.5 h-2.5" /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Portrait Card Subsection */}
                      <div className="border-t border-white/[0.04] pt-6 mt-6 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Compass className="w-4 h-4 text-[#00d2ff]" /> Portrait Card Settings
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Portrait Title</label>
                            <input
                              type="text"
                              value={form.about.portraitTitle}
                              onChange={(e) => setAboutField("portraitTitle", e.target.value)}
                              className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Portrait Subtitle</label>
                            <input
                              type="text"
                              value={form.about.portraitSubtitle}
                              onChange={(e) => setAboutField("portraitSubtitle", e.target.value)}
                              className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                            />
                          </div>
                        </div>

                        <div className="w-full">
                          <MediaPicker
                            label="Portrait Center Image (Optional)"
                            placeholder="Select image to display in the center of the orbit rings..."
                            value={form.about.portraitImage}
                            onChange={(url) => setAboutField("portraitImage", url)}
                            acceptType="image"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ring Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={form.about.portraitRingColor}
                                onChange={(e) => setAboutField("portraitRingColor", e.target.value)}
                                className="w-10 h-10 rounded-xl bg-transparent border border-white/[0.08] cursor-pointer shrink-0"
                              />
                              <input
                                type="text"
                                value={form.about.portraitRingColor}
                                onChange={(e) => setAboutField("portraitRingColor", e.target.value)}
                                className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-white outline-none"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Glow Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={form.about.portraitGlowColor}
                                onChange={(e) => setAboutField("portraitGlowColor", e.target.value)}
                                className="w-10 h-10 rounded-xl bg-transparent border border-white/[0.08] cursor-pointer shrink-0"
                              />
                              <input
                                type="text"
                                value={form.about.portraitGlowColor}
                                onChange={(e) => setAboutField("portraitGlowColor", e.target.value)}
                                className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-white outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Accent Text Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={form.about.portraitAccentColor}
                                onChange={(e) => setAboutField("portraitAccentColor", e.target.value)}
                                className="w-10 h-10 rounded-xl bg-transparent border border-white/[0.08] cursor-pointer shrink-0"
                              />
                              <input
                                type="text"
                                value={form.about.portraitAccentColor}
                                onChange={(e) => setAboutField("portraitAccentColor", e.target.value)}
                                className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-white outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                          <div>
                            <h4 className="text-xs font-semibold text-white">Enable Orbit Ring Animations</h4>
                            <p className="text-[10px] text-slate-500">Enable slow continuous rotational animations for the inner and outer circles.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAboutField("portraitAnimationEnabled", !form.about.portraitAnimationEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              form.about.portraitAnimationEnabled ? "bg-[#00d2ff]" : "bg-white/[0.08]"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                form.about.portraitAnimationEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Previews Sidebar for Portrait Card */}
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-white/[0.05] bg-[#07070c]/50 p-5 space-y-4">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Preview Card</h3>
                        
                        {/* The Actual Rendered Card mirroring About.tsx frontend */}
                        <div className="relative w-full aspect-[3/4] rounded-2xl border border-blue-500/20 bg-blue-950/10 backdrop-blur-md flex items-center justify-center overflow-hidden shadow-lg">
                          <div 
                            style={{ borderColor: `${form.about.portraitRingColor}33` }} 
                            className="absolute inset-0 border rounded-2xl" 
                          />
                          
                          <div 
                            style={{ 
                              transform: "translateZ(50px)",
                              borderColor: `${form.about.portraitRingColor}4d`,
                              boxShadow: `0 0 20px ${form.about.portraitGlowColor}33`
                            }} 
                            className="relative w-36 h-36 rounded-full border flex items-center justify-center bg-gradient-to-b from-blue-500/10 to-transparent overflow-hidden"
                          >
                            <motion.div 
                              animate={form.about.portraitAnimationEnabled ? { rotate: 360 } : undefined}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              style={{ borderColor: `${form.about.portraitRingColor}4d` }}
                              className="absolute inset-[-10%] rounded-full border border-dashed z-0"
                            />
                            <motion.div 
                              animate={form.about.portraitAnimationEnabled ? { rotate: -360 } : undefined}
                              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                              style={{ borderColor: `${form.about.portraitRingColor}66` }}
                              className="absolute inset-[10%] rounded-full border border-dotted z-0"
                            />
                            
                            <div className="w-full h-full flex items-center justify-center z-10 relative">
                              {form.about.portraitImage ? (
                                <img 
                                  src={form.about.portraitImage} 
                                  alt="Portrait" 
                                  className="w-full h-full object-cover rounded-full p-1" 
                                />
                              ) : (
                                <div className="text-center">
                                  <div 
                                    style={{ color: form.about.portraitAccentColor }} 
                                    className="font-bold text-2xl mb-1"
                                  >
                                    {form.about.portraitTitle}
                                  </div>
                                  <div className="text-blue-200/50 text-[10px] tracking-[0.2em] uppercase">
                                    {form.about.portraitSubtitle}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="block text-[10px] text-slate-500 text-center font-mono">Portrait Component Preview</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-6">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.04] pb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" /> Contact Details & Directory
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Primary Email</label>
                      <input
                        type="email"
                        value={form.contact.primaryEmail}
                        onChange={(e) => setContactField("primaryEmail", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Secondary Email</label>
                      <input
                        type="email"
                        value={form.contact.secondaryEmail}
                        onChange={(e) => setContactField("secondaryEmail", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={form.contact.phoneNumber}
                        onChange={(e) => setContactField("phoneNumber", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp Number</label>
                      <input
                        type="text"
                        value={form.contact.whatsApp}
                        onChange={(e) => setContactField("whatsApp", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Address</label>
                      <input
                        type="text"
                        value={form.contact.address}
                        onChange={(e) => setContactField("address", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">City</label>
                      <input
                        type="text"
                        value={form.contact.city}
                        onChange={(e) => setContactField("city", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">State</label>
                      <input
                        type="text"
                        value={form.contact.state}
                        onChange={(e) => setContactField("state", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Country</label>
                      <input
                        type="text"
                        value={form.contact.country}
                        onChange={(e) => setContactField("country", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Timezone</label>
                      <input
                        type="text"
                        value={form.contact.timezone}
                        onChange={(e) => setContactField("timezone", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-6">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.04] pb-3 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-slate-400" /> Social Links & Portfolios
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(form.socialLinks).map((key) => (
                        <div key={key}>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 capitalize flex items-center gap-1.5">
                            <span className="text-slate-500 shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5">
                              {getSocialIcon(key)}
                            </span>
                            <span>{key}</span>
                          </label>
                          <input
                            type="text"
                            value={(form.socialLinks as any)[key]}
                            onChange={(e) => setSocialField(key as any, e.target.value)}
                            placeholder={`https://${key}.com/username`}
                            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-white font-mono focus:border-[#00d2ff]/40 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    {/* Live Preview icons */}
                    <div>
                      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 space-y-4">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Links Preview</h3>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(form.socialLinks).map(([key, value]) => {
                            if (!value) return null;
                            return (
                              <a
                                key={key}
                                href={value}
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 rounded-full border border-blue-500/20 bg-blue-950/20 text-[#00d2ff] hover:text-white flex items-center justify-center hover:scale-105 transition-transform"
                                title={key}
                              >
                                {getSocialIcon(key)}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-6">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.04] pb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" /> Search Engine Optimization (SEO)
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Meta Title</label>
                        <input
                          type="text"
                          value={form.seo.metaTitle}
                          onChange={(e) => setSeoField("metaTitle", e.target.value)}
                          className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">OpenGraph Image URL</label>
                        <input
                          type="text"
                          value={form.seo.ogImage}
                          onChange={(e) => setSeoField("ogImage", e.target.value)}
                          className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Meta Description</label>
                      <textarea
                        rows={3}
                        value={form.seo.metaDescription}
                        onChange={(e) => setSeoField("metaDescription", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white focus:border-[#00d2ff]/40 outline-none resize-none"
                      />
                    </div>
                    {/* Keywords dynamic list */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Keywords & Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          placeholder="e.g. React"
                          className="flex-1 px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-lg text-xs text-white focus:border-[#00d2ff]/40 outline-none"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                        />
                        <button type="button" onClick={addKeyword} className="px-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {form.seo.keywords.map((k, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-900/10 border border-blue-500/20 text-[#00d2ff] text-[11px] font-medium">
                            {k}
                            <button type="button" onClick={() => removeKeyword(k)} className="text-slate-400 hover:text-white"><X className="w-2.5 h-2.5" /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
