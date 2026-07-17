"use client";

import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Preloader } from "@/components/sections/Preloader";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { useAutoTrackPageView } from "@/hooks/useAnalytics";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  useAutoTrackPageView();

  return (
    <>
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <main
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
