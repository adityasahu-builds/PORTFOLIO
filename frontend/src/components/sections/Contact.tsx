"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { registerGSAPPlugins } from "@/lib/gsap";
import { ContactForm } from "@/components/ui/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Mail, FileText, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic personal information from API
  const { data: personalInfo } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      const res = await api.get("/personal-info");
      return res.data?.data;
    },
  });

  // Fetch active education dynamically
  const { data: educationRecords = [] } = useQuery<Array<{ _id: string; institutionName: string; degree: string; fieldOfStudy: string; currentlyStudying: boolean; }>>({
    queryKey: ["education-active-contact"],
    queryFn: async () => {
      const res = await api.get("/education?status=Active");
      return res.data?.data || [];
    },
  });
  const primaryEdu = educationRecords[0];
  const eduDegree = primaryEdu ? `${primaryEdu.degree}` : "Computer Science Engineering (AI & ML)";
  const eduInstitution = primaryEdu ? primaryEdu.institutionName : "Maharana Pratap Engineering College (MPGI)";

  useEffect(() => {
    registerGSAPPlugins();

    const section = sectionRef.current;
    const header = headerRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (!section || !header || !leftPanel || !rightPanel) return;

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        header.querySelectorAll(".split-char"),
        { opacity: 0, y: 50, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.03,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        header.querySelector(".glow-line"),
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
          },
        }
      );

      // Cards & Form Reveal
      const cards = leftPanel.querySelectorAll(".contact-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: leftPanel,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        rightPanel,
        { opacity: 0, x: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rightPanel,
            start: "top 75%",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact section"
      className="relative min-h-screen bg-[#050505] overflow-hidden pt-40 flex flex-col justify-between"
    >
      {/* Animated Futuristic Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=')]" />
        
        {/* Very Slow Stars */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.1] mix-blend-screen animate-[spin_240s_linear_infinite]" />
        
        {/* Gradient Fog & Glowing Orbs */}
        <div className="absolute -top-40 left-[10%] w-[40vw] h-[40vw] bg-[#0055ff]/10 blur-[150px] rounded-full mix-blend-screen animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-[#00d2ff]/10 blur-[120px] rounded-full mix-blend-screen animate-[pulse_14s_ease-in-out_infinite_reverse]" />
      </div>

      <div className="container-site relative z-10 flex-grow flex flex-col mb-10">
        {/* Section Intro */}
        <div ref={headerRef} className="flex flex-col items-center text-center mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-8 flex flex-wrap justify-center overflow-hidden perspective-[1000px] text-center px-4">
            {"LET'S BUILD SOMETHING AMAZING".split(" ").map((word, wIdx, arr) => (
              <span key={wIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className={`split-char inline-block`}
                    style={{ transformOrigin: "50% 100%" }}
                  >
                    {char}
                  </span>
                ))}
                {wIdx !== arr.length - 1 && (
                  <span className="inline-block">&nbsp;</span>
                )}
              </span>
            ))}
          </h2>
          <div className="glow-line w-32 h-[3px] bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent rounded-full shadow-[0_0_15px_#00d2ff] mb-12 opacity-80" />
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
            Whether you have an internship opportunity, freelance project, collaboration idea, or simply want to connect—I'd love to hear from you.
          </p>
        </div>

        {/* Layout: Left (Profile) & Right (Form) */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Panel */}
          <div ref={leftPanelRef} className="w-full lg:w-5/12 flex flex-col gap-6">
            
            {/* Main Profile Card */}
            <div className="contact-card group relative p-8 rounded-3xl bg-[#0a0a0a]/40 border border-white/[0.03] hover:border-[#00d2ff]/20 backdrop-blur-2xl shadow-2xl hover:shadow-[0_20px_40px_rgba(0,210,255,0.05)] transition-all duration-700 overflow-hidden flex flex-col gap-6 -translate-y-0 hover:-translate-y-2">
              {/* Animated Gradient Spotlight */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-[#00d2ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#00d2ff]/10 blur-[80px] rounded-full group-hover:bg-[#00d2ff]/20 transition-all duration-700" />
              
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-bold text-white mb-2">{personalInfo?.hero?.fullName || "Aditya Sahu"}</h3>
                <p className="text-[#00d2ff] font-medium tracking-wide">{personalInfo?.hero?.professionalTitle || "Full Stack Developer & AI/ML Engineer"}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-2">Education</h4>
                <p className="text-slate-300">{eduDegree}</p>
                <p className="text-slate-400 text-sm">{eduInstitution}</p>
              </div>

              <div className="relative z-10 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#00d2ff]/[0.03] border border-[#00d2ff]/10 self-start shadow-[0_0_15px_rgba(0,210,255,0.05)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d2ff] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d2ff]" />
                </span>
                <span className="text-xs font-semibold text-[#00d2ff]/90 uppercase tracking-wider">
                  {personalInfo?.hero?.availabilityStatus || "Open to Internship Opportunities"}
                </span>
              </div>
            </div>

            {/* Quick Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="contact-card group relative flex items-center gap-4 p-4 rounded-2xl bg-[#0a0a0a]/40 border border-white/[0.03] hover:border-[#00d2ff]/20 hover:bg-white/[0.02] backdrop-blur-xl transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,210,255,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00d2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-[#00d2ff]/30 group-hover:bg-[#00d2ff]/10 group-hover:scale-110 transition-all duration-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Location</p>
                  <p className="text-sm text-slate-300 font-medium">
                    {personalInfo?.contact?.city && personalInfo?.contact?.country
                      ? `${personalInfo.contact.city}, ${personalInfo.contact.country}`
                      : "Mandsaur, MP, India"}
                  </p>
                </div>
              </div>

              <div className="contact-card group relative flex items-center gap-4 p-4 rounded-2xl bg-[#0a0a0a]/40 border border-white/[0.03] hover:border-[#00d2ff]/20 hover:bg-white/[0.02] backdrop-blur-xl transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,210,255,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00d2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-[#00d2ff]/30 group-hover:bg-[#00d2ff]/10 group-hover:scale-110 transition-all duration-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-sm text-slate-300 font-medium break-all">
                    {personalInfo?.contact?.primaryEmail || "aditya@example.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a 
                href={personalInfo?.socialLinks?.github || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-card group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#0a0a0a]/40 border border-white/[0.03] hover:border-[#00d2ff]/30 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,210,255,0.08)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#00d2ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 text-slate-400 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                  <GithubIcon />
                </div>
                <span className="relative z-10 text-[11px] font-semibold tracking-wide text-slate-400 group-hover:text-white transition-colors duration-500">GitHub</span>
                <ArrowUpRight className="w-3 h-3 absolute top-3 right-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#00d2ff]" />
              </a>

              <a 
                href={personalInfo?.socialLinks?.linkedin || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-card group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#0a0a0a]/40 border border-white/[0.03] hover:border-[#0055ff]/30 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,85,255,0.08)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0055ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 text-slate-400 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                  <LinkedInIcon />
                </div>
                <span className="relative z-10 text-[11px] font-semibold tracking-wide text-slate-400 group-hover:text-white transition-colors duration-500">LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 absolute top-3 right-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#0055ff]" />
              </a>

              <a 
                href="/cv.png" 
                download="cv.png"
                className="contact-card group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#0a0a0a]/40 border border-white/[0.03] hover:border-emerald-500/30 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(16,185,129,0.08)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 text-slate-400 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="relative z-10 text-[11px] font-semibold tracking-wide text-slate-400 group-hover:text-white transition-colors duration-500">Resume</span>
                <ArrowUpRight className="w-3 h-3 absolute top-3 right-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald-400" />
              </a>
            </div>

          </div>

          {/* Right Panel (Form) */}
          <div ref={rightPanelRef} className="w-full lg:w-7/12">
            <ContactForm />
          </div>

        </div>
      </div>

      {/* Cinematic Transition to Footer */}
      <div className="relative z-10 mt-20 w-full h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
      <div className="relative z-10 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent shadow-[0_0_30px_rgba(0,210,255,0.2)]" />
      
      {/* Embedded Footer */}
      <Footer />
    </section>
  );
}
