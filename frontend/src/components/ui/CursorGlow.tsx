"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const handleMouseEnterInteractive = () => {
      ring?.classList.add("is-hovering");
      dot.style.transform = "translate(-50%, -50%) scale(0.4)";
    };

    const handleMouseLeaveInteractive = () => {
      ring?.classList.remove("is-hovering");
      dot.style.transform = "translate(-50%, -50%) scale(1)";
    };

    // Ring lerps after dot
    function lerp(a: number, b: number, n: number) {
      return a + (b - a) * n;
    }

    function animate() {
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);
      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }
      rafId = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Detect interactive elements
    const interactiveSelectors = "a, button, [role='button'], .magnetic-wrapper";
    const addListeners = (el: Element) => {
      el.addEventListener("mouseenter", handleMouseEnterInteractive);
      el.addEventListener("mouseleave", handleMouseLeaveInteractive);
    };

    const interactiveEls = document.querySelectorAll(interactiveSelectors);
    interactiveEls.forEach(addListeners);

    // Watch for dynamically added elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll(interactiveSelectors).forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterInteractive);
        el.removeEventListener("mouseleave", handleMouseLeaveInteractive);
        addListeners(el);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
