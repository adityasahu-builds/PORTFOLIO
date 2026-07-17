"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Project } from "./projectsData";
import { LaptopMockup } from "./LaptopMockup";
import { ArrowUpRight, ExternalLink } from "lucide-react";

interface ProjectShowcaseCardProps {
  project: Project;
  index: number;
}

export function ProjectShowcaseCard({ project, index }: ProjectShowcaseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div
      className="project-showcase-card relative w-full min-h-screen py-24 flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Floating Particles on Hover */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at ${isEven ? "30%" : "70%"} 50%, ${project.accentColor} 0%, transparent 50%)`,
            filter: "blur(80px)",
          }}
        />
      </motion.div>

      <div className="container-site relative z-10 w-full">
        <div
          className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${
            isEven ? "" : "lg:flex-row-reverse"
          }`}
        >
          {/* Mockup Side */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <LaptopMockup project={project} isHovered={isHovered} />
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold font-display text-slate-800" style={{ WebkitTextStroke: `1px ${project.accentColor}` }}>
                  {project.number}
                </span>
                <span className="text-xs tracking-widest uppercase font-mono text-slate-400">
                  {project.category}
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
                {project.title}
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Problem & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md">
              <div>
                <h5 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  The Problem
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {project.problemStatement}
                </p>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  The Solution
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Key Features & Tech Stack */}
            <div className="flex flex-col gap-6">
              <div>
                <h5 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  Key Features
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.keyFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <ArrowUpRight className="w-3.5 h-3.5" style={{ color: project.accentColor }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  Tech Stack
                </h5>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-4">
              <a
                href="#"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${project.accentColor}dd 0%, ${project.accentColor}88 100%)`,
                  color: "#000",
                  boxShadow: isHovered ? `0 0 20px ${project.accentColor}66` : `0 4px 15px ${project.accentColor}33`,
                }}
              >
                <span className="relative z-10">Live Demo</span>
                <ExternalLink className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 overflow-hidden bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.08] text-white"
              >
                <span>GitHub</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
