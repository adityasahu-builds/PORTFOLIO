"use client";

import { ArrowUp, Mail, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function Footer() {
  const year = new Date().getFullYear();

  // Fetch dynamic personal information from API
  const { data: personalInfo } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      const res = await api.get("/personal-info");
      return res.data?.data;
    },
  });

  const fullName = personalInfo?.hero?.fullName || "Aditya Sahu";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0] || "")
    .join("")
    .toUpperCase();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = personalInfo ? [
    { icon: <GithubIcon />, href: personalInfo.socialLinks.github || "#" },
    { icon: <LinkedinIcon />, href: personalInfo.socialLinks.linkedin || "#" },
    { icon: <Mail className="w-4 h-4" />, href: personalInfo.contact.primaryEmail ? `mailto:${personalInfo.contact.primaryEmail}` : "#" },
    { icon: <FileText className="w-4 h-4" />, href: "/cv.png", download: "cv.png" },
  ] : [
    { icon: <GithubIcon />, href: "#" },
    { icon: <LinkedinIcon />, href: "#" },
    { icon: <Mail className="w-4 h-4" />, href: "#" },
    { icon: <FileText className="w-4 h-4" />, href: "/cv.png", download: "cv.png" },
  ];

  return (
    <footer className="relative w-full pt-20 pb-10 bg-[#020202] overflow-hidden">
      {/* Soft Background Glows for Footer */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-[#00d2ff]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Brand & Statement */}
          <div className="lg:col-span-2 flex flex-col items-start gap-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,210,255,0.25)] relative group cursor-pointer hover:shadow-[0_0_60px_rgba(0,210,255,0.4)] transition-all duration-500">
              <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/as-logo.png" alt="AS Logo" className="w-full h-full object-contain relative z-10" />
            </div>
            <p className="text-slate-400 max-w-sm text-lg leading-relaxed font-light">
              Building modern digital experiences with clean architecture, immersive interfaces, and thoughtful user experiences.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#00d2ff]/[0.03] border border-[#00d2ff]/10 self-start shadow-[0_0_15px_rgba(0,210,255,0.05)] mt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d2ff] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d2ff]" />
              </span>
              <span className="text-[11px] font-semibold text-[#00d2ff]/90 uppercase tracking-widest">
                {personalInfo?.hero?.availabilityStatus || "Open for Internship Opportunities"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white text-sm tracking-widest uppercase font-semibold mb-2">Navigation</h4>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="group relative text-slate-400 hover:text-white transition-colors duration-300 w-fit font-medium tracking-wide"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-[#00d2ff] to-transparent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Connect Icons */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white text-sm tracking-widest uppercase font-semibold mb-2">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  download={social.download}
                  className="relative group w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-[#00d2ff]/40 hover:bg-[#00d2ff]/10 hover:shadow-[0_15px_30px_rgba(0,210,255,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00d2ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="relative flex flex-col items-center justify-center gap-8 pt-10 mt-10">
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
          
          <div className="flex flex-col items-center text-center gap-3">
            <p className="text-sm font-medium tracking-wide text-slate-400">© {year} {fullName}.</p>
            <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
              Designed & Developed using React, TypeScript, Tailwind CSS, GSAP and Framer Motion.
            </p>
            <p className="text-xs text-[#00d2ff]/70 font-medium tracking-wider uppercase mt-2">
              Made with passion for building exceptional digital experiences.
            </p>
          </div>

          {/* Back to Top */}
          <div className="absolute right-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex items-center justify-center hidden sm:flex">
            <button
              onClick={scrollToTop}
              className="group relative w-14 h-14 rounded-full bg-[#0a0a0a]/50 border border-white/[0.05] backdrop-blur-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-[#00d2ff]/30 hover:bg-[#00d2ff]/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,210,255,0.15)] overflow-hidden"
              aria-label="Back to Top"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#00d2ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ArrowUp className="w-5 h-5 relative z-10 group-hover:-translate-y-1 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
