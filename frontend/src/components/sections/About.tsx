"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { 
  GraduationCap, 
  Code2, 
  BrainCircuit, 
  Target, 
  Terminal, 
  Lightbulb, 
  Rocket,
  ArrowRight,
  Award
} from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { JourneyTimeline } from "@/components/sections/JourneyTimeline";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface EducationRecord {
  _id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyStudying: boolean;
  grade?: string;
  description?: string;
  achievements: string[];
  displayOrder: number;
  featured: boolean;
  status: "Active" | "Inactive";
}


const TECH_STACK = {
  Languages: ["C", "C++", "JavaScript", "Python"],
  Frontend: ["HTML5", "CSS3", "Tailwind CSS", "React.js", "Next.js"],
  Backend: ["Node.js", "Express.js"],
  Database: ["MongoDB", "MySQL"],
  Tools: ["Git", "GitHub", "VS Code", "Postman", "Figma"],
  Learning: ["Artificial Intelligence", "Machine Learning", "Prompt Engineering"]
};

const CORE_VALUES = [
  { icon: <Target className="w-5 h-5" />, title: "Problem Solving" },
  { icon: <BrainCircuit className="w-5 h-5" />, title: "Continuous Learning" },
  { icon: <Terminal className="w-5 h-5" />, title: "Clean Code" },
  { icon: <Lightbulb className="w-5 h-5" />, title: "Innovation" }
];

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch active education records dynamically
  const { data: educationRecords = [] } = useQuery<EducationRecord[]>({
    queryKey: ["education-active"],
    queryFn: async () => {
      const res = await api.get("/education?status=Active");
      return res.data?.data || [];
    },
  });

  // Fetch dynamic personal information from API
  const { data: personalInfo } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      const res = await api.get("/personal-info");
      return res.data?.data;
    },
  });

  // Fetch active skills dynamically from database
  const { data: skills = [], isLoading: isSkillsLoading, isError: isSkillsError, refetch: refetchSkills } = useQuery<any[]>({
    queryKey: ["skills-active"],
    queryFn: async () => {
      const res = await api.get("/skills?status=Active");
      return res.data?.data || [];
    },
  });

  // Fetch active certificates dynamically from database
  const { data: certificates = [], isLoading: isCertificatesLoading } = useQuery<any[]>({
    queryKey: ["certificates-active"],
    queryFn: async () => {
      const res = await api.get("/certificates?status=Active");
      return res.data?.data || [];
    },
  });

  const fullName = personalInfo?.hero?.fullName || "Aditya Sahu";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0] || "")
    .join("")
    .toUpperCase();

  // Get the highest-priority education (sorted by displayOrder)
  const primaryEducation = educationRecords[0];
  const educationValue = primaryEducation
    ? `${primaryEducation.fieldOfStudy}`
    : "Computer Science Engineering (AI & ML)";
  const educationSub = primaryEducation
    ? primaryEducation.institutionName
    : "Maharana Pratap Engineering College";

  const QUICK_INFO = [
    {
      icon: <GraduationCap className="w-6 h-6 text-blue-400" />,
      label: "Education",
      value: educationValue,
      sub: educationSub
    },
    {
      icon: <Code2 className="w-6 h-6 text-blue-400" />,
      label: "Location & Nationality",
      value: personalInfo?.about?.location || "Mandsaur, MP, India",
      sub: personalInfo?.about?.nationality || "Indian"
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-blue-400" />,
      label: "Languages Spoken",
      value: personalInfo?.about?.languages?.join(", ") || "English, Hindi",
      sub: "Fluent communication"
    },
    {
      icon: <Target className="w-6 h-6 text-blue-400" />,
      label: "Interests & Focus",
      value: personalInfo?.about?.interests?.join(", ") || "Coding, AI/ML, Hacking",
      sub: "Continuous Learning"
    }
  ];
  
  // Left side 3D card tilt
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const tiltX = useSpring(cardY, { stiffness: 90, damping: 20 });
  const tiltY = useSpring(cardX, { stiffness: 90, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Calculate rotation angles (max 10 degrees)
    const rX = -(mouseY / height) * 10;
    const rY = (mouseX / width) * 10;
    
    cardY.set(rX);
    cardX.set(rY);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  return (
    <section id="about" ref={containerRef} className="relative min-h-screen w-full overflow-hidden py-24 z-10" style={{ background: "transparent" }}>
      
      {/* Background Orbs to match Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-950/20 via-indigo-900/10 to-transparent blur-[120px]"
        />
      </div>

      <div className="container-site relative z-10 mx-auto px-6 md:px-8 max-w-[1440px]">
        <div className="mb-16">
          <SectionLabel number="01" label="About Me" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 lg:gap-16 items-start">
          
          {/* Left Column: 3D Card Avatar */}
          <motion.div 
            className="sticky top-32 perspective-1000 hidden lg:block"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
              className="relative w-full aspect-[3/4] rounded-2xl border border-blue-500/20 bg-blue-950/10 backdrop-blur-md flex items-center justify-center group overflow-hidden shadow-[0_8px_32px_rgba(0,162,255,0.1)]"
            >
              {/* Inner animated border glow */}
              <div className="absolute inset-0 border border-blue-400/0 group-hover:border-blue-400/30 rounded-2xl transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,162,255,0)] group-hover:shadow-[inset_0_0_30px_rgba(0,162,255,0.15)]" />
              
              {/* Abstract 3D placeholder / particles */}
              <div 
                style={{ 
                  transform: "translateZ(50px)",
                  borderColor: personalInfo?.about?.portraitRingColor || "rgba(59, 130, 246, 0.3)",
                  boxShadow: personalInfo?.about?.portraitGlowColor ? `0 0 25px ${personalInfo.about.portraitGlowColor}33` : undefined,
                }} 
                className="relative w-48 h-48 rounded-full border flex items-center justify-center bg-gradient-to-b from-blue-500/10 to-transparent"
              >
                <motion.div 
                  animate={personalInfo?.about?.portraitAnimationEnabled !== false ? { rotate: 360 } : undefined}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ borderColor: personalInfo?.about?.portraitRingColor ? `${personalInfo.about.portraitRingColor}4d` : "rgba(96, 165, 250, 0.3)" }}
                  className="absolute inset-[-10%] rounded-full border border-dashed z-0"
                />
                <motion.div 
                  animate={personalInfo?.about?.portraitAnimationEnabled !== false ? { rotate: -360 } : undefined}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  style={{ borderColor: personalInfo?.about?.portraitRingColor ? `${personalInfo.about.portraitRingColor}66` : "rgba(147, 197, 253, 0.4)" }}
                  className="absolute inset-[10%] rounded-full border border-dotted z-0"
                />
                <div className="w-full h-full flex items-center justify-center z-10 relative overflow-hidden rounded-full p-1">
                  <motion.img 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={personalInfo?.about?.portraitImage || "/aditya.jpg"} 
                    alt="Portrait" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
              </div>
              
              {/* Floating particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [-10, 10, -10], x: [-5, 5, -5], opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 blur-[1px]"
                  style={{ top: `${20 + i * 15}%`, left: `${15 + i * 20}%`, transform: "translateZ(30px)" }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Content (Top Half) */}
          <div className="flex flex-col gap-16">
            
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4 tracking-tight">
                {personalInfo?.about?.aboutHeading || <>About <span className="text-[#00d2ff]">Me</span></>}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-8 shadow-[0_0_10px_rgba(0,162,255,0.5)]" />
              {personalInfo?.about?.aboutDescription && (
                <p className="text-sm font-mono text-cyan-400/80 mb-3 tracking-wider uppercase">{personalInfo.about.aboutDescription}</p>
              )}
              <p className="text-lg text-slate-300/90 leading-relaxed font-inter font-light max-w-3xl whitespace-pre-wrap">
                {personalInfo?.about?.longBiography || (
                  <>
                    I am a passionate <strong className="text-white font-medium">software developer</strong> with a strong interest in Full Stack Web Development. 
                    Currently, I am expanding my horizons by learning <strong className="text-[#00d2ff] font-medium">Artificial Intelligence & Machine Learning</strong>. 
                    I love building modern, scalable, and user-friendly web applications that provide seamless digital experiences. 
                    Constantly improving my problem-solving and development skills, my goal is to become an exceptional software engineer who creates real-world solutions through technology.
                  </>
                )}
              </p>
            </motion.div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUICK_INFO.map((info, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="group relative p-5 rounded-xl border border-blue-500/15 bg-blue-950/10 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-900/20 hover:shadow-[0_8px_30px_rgba(0,162,255,0.12)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-blue-400 group-hover:scale-110 group-hover:text-cyan-300 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs text-blue-300/70 font-semibold tracking-wider uppercase mb-1">{info.label}</p>
                      <p className="text-sm font-medium text-slate-100">{info.value}</p>
                      <p className="text-sm text-slate-400">{info.sub}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 font-display flex items-center gap-3">
                <Rocket className="w-6 h-6 text-[#00d2ff]" /> Tech Stack
              </h3>
              <div className="flex flex-col gap-6">
                {(() => {
                  // Group skills dynamically by category, fallback to TECH_STACK if empty
                  const skillsByCategory: Record<string, string[]> = {};
                  if (skills && skills.length > 0) {
                    [...skills]
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .forEach((s) => {
                        if (!skillsByCategory[s.category]) {
                          skillsByCategory[s.category] = [];
                        }
                        skillsByCategory[s.category].push(s.title);
                      });
                  }
                  const displayTechStack = Object.keys(skillsByCategory).length > 0 ? skillsByCategory : TECH_STACK;

                  if (isSkillsLoading) {
                    return (
                      <div className="py-4 text-xs font-mono uppercase tracking-widest text-slate-500 animate-pulse">
                        Loading stack...
                      </div>
                    );
                  }

                  if (isSkillsError) {
                    return (
                      <div className="py-4 flex flex-col gap-3 items-start">
                        <span className="text-xs font-mono uppercase tracking-widest text-red-400">Failed to load stack</span>
                        <button 
                          onClick={() => refetchSkills()}
                          className="px-3 py-1.5 text-xs font-mono uppercase tracking-widest border border-red-500/20 text-red-400 bg-red-950/10 hover:bg-red-950/20 transition-all rounded"
                        >
                          Retry
                        </button>
                      </div>
                    );
                  }

                  return Object.entries(displayTechStack).map(([category, skillsList]) => (
                    <div key={category} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 border-b border-blue-500/10 pb-4 last:border-0 last:pb-0">
                      <span className="w-28 text-sm font-semibold text-blue-300/80 uppercase tracking-wider">{category}</span>
                      <div className="flex flex-wrap gap-2">
                        {skillsList.map((skill) => (
                          <span 
                            key={skill} 
                            className="px-3 py-1.5 text-sm font-medium text-slate-300 rounded-md border border-blue-500/20 bg-blue-950/20 backdrop-blur-sm hover:border-blue-400 hover:text-white hover:shadow-[0_0_15px_rgba(0,162,255,0.3)] transition-all duration-300 cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>

      {/* FULL WIDTH SECTION: My Journey Timeline */}
      <div className="relative w-full my-24 border-y border-blue-500/10 bg-blue-950/5">
        <div className="container-site relative z-20 mx-auto px-6 md:px-8 max-w-[1440px] pt-16">
          <h3 className="text-3xl font-bold text-white font-display">My Journey</h3>
          <p className="text-blue-300/60 mt-2">A timeline of my evolution as a developer.</p>
        </div>
        <JourneyTimeline />
      </div>

      <div className="container-site relative z-10 mx-auto px-6 md:px-8 max-w-[1440px] flex flex-col gap-[40px]">
        
        {/* Core Values (Full Width, Left Aligned) */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 font-display">Core Values</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CORE_VALUES.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-xl border border-blue-500/15 bg-blue-950/10 hover:border-[#00d2ff]/50 hover:shadow-[0_0_20px_rgba(0,162,255,0.15)] transition-all duration-300 group"
              >
                <div className="text-blue-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {value.icon}
                </div>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white">{value.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certificates Showcase (Only if database contains active certificates) */}
        {certificates && certificates.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-6 font-display flex items-center gap-3">
              <Award className="w-6 h-6 text-[#00d2ff]" /> Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((cert) => (
                  <motion.div
                    key={cert._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -6 }}
                    className="flex flex-col gap-4 p-5 rounded-2xl border border-blue-500/15 bg-blue-950/10 hover:border-[#00d2ff]/30 hover:shadow-[0_12px_30px_rgba(0,162,255,0.15)] transition-all duration-300 relative overflow-hidden group"
                  >
                    {cert.imageUrl && (
                      <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-blue-500/10 mb-2 relative">
                        <img 
                          src={cert.imageUrl} 
                          alt={cert.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#00d2ff] transition-colors duration-300 leading-tight mb-1">{cert.title}</h4>
                      <p className="text-xs text-blue-300/80 font-medium">{cert.issuer}</p>
                      {cert.issueDate && (
                        <p className="text-[10px] text-slate-500 font-mono mt-1">Issued: {cert.issueDate}</p>
                      )}
                    </div>
                    {cert.credentialUrl && (
                      <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#00d2ff] uppercase tracking-wider hover:text-white mt-auto flex items-center gap-1 w-fit group/btn"
                      >
                        Verify Credential 
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">
                          <path d="M7 17L17 7M7 7h10v10" />
                        </svg>
                      </a>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Quote and CTA */}
          <div className="flex flex-col gap-16">
            

            {/* Philosophy Quote */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-transparent relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 text-blue-500/20 text-8xl font-serif leading-none rotate-180">"</div>
              <p className="relative z-10 text-xl md:text-2xl font-medium text-center text-slate-200 font-display italic px-4">
                "Technology is not just about writing code—it's about <span className="text-[#00d2ff] font-semibold drop-shadow-[0_0_8px_rgba(0,162,255,0.5)]">building meaningful solutions</span> that create real impact."
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-start"
            >
              <a 
                href="#projects" 
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg overflow-hidden font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_4px_20px_rgba(0,162,255,0.4)] hover:shadow-[0_4px_30px_rgba(0,162,255,0.6)] transition-all duration-300"
              >
                <span>Explore My Projects</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </motion.div>

          </div>
      </div>
    </section>
  );
}
