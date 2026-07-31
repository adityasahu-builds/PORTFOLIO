"use client";

import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Preloader } from "@/components/sections/Preloader";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { useAutoTrackPageView } from "@/hooks/useAnalytics";
import { StructuredData } from "@/components/seo/StructuredData";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  useAutoTrackPageView();

  // Fetch data for JSON-LD structured schemas (non-blocking)
  const { data: personalInfo } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      const res = await api.get("/personal-info");
      return res.data?.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour — reuse cached data across components
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const res = await api.get("/projects?featured=true");
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 60,
  });

  return (
    <>
      {/* JSON-LD Structured Data — rendered immediately, not gated by preloader */}
      <StructuredData personalInfo={personalInfo} projects={projects} />

      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <main
        id="main-content"
        tabIndex={-1}
        aria-label="Aditya Sahu Portfolio — Full Stack Developer & AI Engineer"
        style={{
          opacity: preloaderDone ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: preloaderDone ? "auto" : "none",
        }}
      >
        <NavBar />
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
