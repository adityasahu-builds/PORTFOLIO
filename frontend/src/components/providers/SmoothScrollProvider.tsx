"use client";

import { useEffect, useRef } from "react";
import { initLenis, destroyLenis, getLenis } from "@/lib/lenis";
import { registerGSAPPlugins } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    registerGSAPPlugins();
    const lenis = initLenis();

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // RAF loop
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
