"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const logoARef = useRef<HTMLDivElement>(null);
  const logoSRRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shutter1Ref = useRef<HTMLDivElement>(null);
  const shutter2Ref = useRef<HTMLDivElement>(null);
  const shutter3Ref = useRef<HTMLDivElement>(null);
  const shutter4Ref = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  const counterObj = useRef({ val: 0 });
  const [percent, setPercent] = useState("00");

  useEffect(() => {
    const container = containerRef.current;
    const ring = ringRef.current;
    const logoA = logoARef.current;
    const logoS = logoSRRef.current;
    const counter = counterRef.current;
    const progressText = progressTextRef.current;
    const canvas = canvasRef.current;
    const hud = hudRef.current;

    const shutters = [
      shutter1Ref.current,
      shutter2Ref.current,
      shutter3Ref.current,
      shutter4Ref.current,
    ].filter(Boolean) as HTMLDivElement[];

    if (!container || !ring || !logoA || !logoS || !counter || !progressText || !canvas || !hud || shutters.length < 4) return;

    // ─── 1. CANVAS PARTICLE DUST SYSTEM ───
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      ox: number;
      oy: number;
      size: number;
      speedX: number;
      speedY: number;
      angle: number;
      radius: number;
    }> = [];

    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 200;
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        ox: width / 2 + Math.cos(angle) * radius,
        oy: height / 2 + Math.sin(angle) * radius,
        size: Math.random() * 1.4 + 0.4,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI * 2,
        radius,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.01)";
      ctx.lineWidth = 1;
      const gridSize = 80;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach((p) => {
        p.angle += 0.0012;
        const targetX = width / 2 + Math.cos(p.angle) * p.radius;
        const targetY = height / 2 + Math.sin(p.angle) * p.radius;

        p.x += (targetX - p.x) * 0.04 + p.speedX;
        p.y += (targetY - p.y) * 0.04 + p.speedY;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 130) {
          const force = (130 - distance) / 130;
          const angleForce = Math.atan2(dy, dx);
          p.x -= Math.cos(angleForce) * force * 5;
          p.y -= Math.sin(angleForce) * force * 5;
        }

        ctx.fillStyle = "rgba(200, 169, 110, 0.22)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // ─── 2. ACTIVE PROGRESS RING GRAPHIC ───
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    gsap.set(ring, {
      strokeDasharray: circumference,
      strokeDashoffset: circumference,
      rotation: -90,
      transformOrigin: "center center",
    });

    // Initial setup of layout
    gsap.set(logoA, { opacity: 0, x: -40, filter: "blur(6px)" });
    gsap.set(logoS, { opacity: 0, x: 40, filter: "blur(6px)" });
    gsap.set(counter, { opacity: 0, y: 15 });
    gsap.set(progressText, { opacity: 0 });
    gsap.set(hud, { opacity: 0 });

    shutters.forEach((shutter) => {
      gsap.set(shutter, { yPercent: 0 });
    });

    const mainTimeline = gsap.timeline({
      onComplete: () => {
        // Stop canvas loop
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);

        // ─── 4. LITERAL MONOGRAM SPLIT & SHUTTER EXIT ───
        const exitTimeline = gsap.timeline({
          onComplete,
        });

        // Alternate shutter movements
        shutters.forEach((shutter, index) => {
          const direction = index % 2 === 0 ? -100 : 100;
          exitTimeline.to(
            shutter,
            {
              yPercent: direction,
              duration: 1.35,
              ease: "power4.inOut",
            },
            index * 0.05
          );
        });

        exitTimeline.to(
          container,
          {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.8,
          },
          "-=0.7"
        );
      },
    });

    // Entrance timeline
    mainTimeline.to(hud, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    });

    mainTimeline.to(
      progressText,
      {
        opacity: 0.5,
        duration: 0.8,
        ease: "power2.out",
      },
      0.2
    );

    // Dynamic loading circle
    mainTimeline.to(
      ring,
      {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power3.inOut",
      },
      0.3
    );

    mainTimeline.to(
      counterObj.current,
      {
        val: 100,
        duration: 2.2,
        ease: "power3.inOut",
        onUpdate: () => {
          setPercent(String(Math.round(counterObj.current.val)).padStart(2, "0"));
        },
      },
      0.3
    );

    mainTimeline.to(
      counter,
      {
        opacity: 0.85,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.5
    );

    // ─── 3. INTERSECTING MONOGRAM REVEAL ───
    mainTimeline.to(
      [logoA, logoS],
      {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power4.out",
        stagger: 0.08,
      },
      0.8
    );

    // Completion highlight flash
    mainTimeline.to(ring, {
      stroke: "#ffffff",
      duration: 0.35,
      ease: "power2.out",
    });

    mainTimeline.to(
      [logoA, logoS],
      {
        color: "var(--accent-gold)",
        textShadow: "0 0 20px rgba(200, 169, 110, 0.3)",
        duration: 0.35,
        ease: "power2.out",
      },
      "<"
    );

    // Fade out surrounding elements only. The letters 'A' and 'S' do NOT fade out.
    // They will split vertically with the panels!
    mainTimeline.to(
      [ring, counter, progressText, hud, canvas],
      {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power3.in",
        stagger: 0.04,
      },
      "+=0.3"
    );

    return () => {
      mainTimeline.kill();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="System loading canvas"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ─── SHUTTER CURTAINS ─── */}
      <div
        ref={shutter1Ref}
        style={{
          position: "absolute",
          top: 0,
          left: "0%",
          width: "25.2%",
          height: "100%",
          background: "#050505",
          zIndex: 1,
        }}
      />

      {/* Shutter 2 (Left Center): Contains "A" (pinned to its right edge) */}
      <div
        ref={shutter2Ref}
        style={{
          position: "absolute",
          top: 0,
          left: "25%",
          width: "25.2%",
          height: "100%",
          background: "#050505",
          zIndex: 2,
        }}
      >
        <div
          ref={logoARef}
          className="font-display"
          style={{
            position: "absolute",
            top: "50%",
            right: "0px",
            transform: "translate(0%, -50%)",
            fontSize: "3.2rem",
            fontWeight: 400,
            userSelect: "none",
            color: "var(--text-primary)",
            lineHeight: 1,
            paddingRight: "2px",
          }}
        >
          A
        </div>
      </div>

      {/* Shutter 3 (Right Center): Contains "S" (pinned to its left edge) */}
      <div
        ref={shutter3Ref}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "25.2%",
          height: "100%",
          background: "#050505",
          zIndex: 2,
        }}
      >
        <div
          ref={logoSRRef}
          className="font-display"
          style={{
            position: "absolute",
            top: "50%",
            left: "0px",
            transform: "translate(0%, -50%)",
            fontSize: "3.2rem",
            fontWeight: 400,
            userSelect: "none",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.7)",
            lineHeight: 1,
            paddingLeft: "2px",
          }}
        >
          S
        </div>
      </div>

      <div
        ref={shutter4Ref}
        style={{
          position: "absolute",
          top: 0,
          left: "75%",
          width: "25.2%",
          height: "100%",
          background: "#050505",
          zIndex: 1,
        }}
      />

      {/* Interactive dust canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Decorative HUD Borders */}
      <div
        ref={hudRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "24px",
          border: "1px solid rgba(200, 169, 110, 0.03)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <div style={{ position: "absolute", top: -4, left: -4, width: 8, height: 8, borderLeft: "1px solid var(--accent-gold)", borderTop: "1px solid var(--accent-gold)", opacity: 0.4 }} />
        <div style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRight: "1px solid var(--accent-gold)", borderTop: "1px solid var(--accent-gold)", opacity: 0.4 }} />
        <div style={{ position: "absolute", bottom: -4, left: -4, width: 8, height: 8, borderLeft: "1px solid var(--accent-gold)", borderBottom: "1px solid var(--accent-gold)", opacity: 0.4 }} />
        <div style={{ position: "absolute", bottom: -4, right: -4, width: 8, height: 8, borderRight: "1px solid var(--accent-gold)", borderBottom: "1px solid var(--accent-gold)", opacity: 0.4 }} />

        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "0.55rem",
            color: "var(--text-muted)",
            letterSpacing: "0.15em",
          }}
        >
          LOC: 28.6139° N / 77.2090° E
        </div>
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "0.55rem",
            color: "var(--text-muted)",
            letterSpacing: "0.15em",
          }}
        >
          SYS: COMP_READY_V2.5
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "0.55rem",
            color: "var(--text-muted)",
            letterSpacing: "0.15em",
          }}
        >
          CORE: DEV_ENVIRONMENT
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "0.55rem",
            color: "var(--accent-gold)",
            letterSpacing: "0.15em",
          }}
        >
          DESIGN BY AS
        </div>
      </div>

      {/* Ring Loader Graphic */}
      <div
        style={{
          position: "relative",
          width: "140px",
          height: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <div
          className="radar-ripple"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "1px solid rgba(200, 169, 110, 0.12)",
            animation: "radarWave 3.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite",
          }}
        />
        <div
          className="radar-ripple"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "1px solid rgba(200, 169, 110, 0.06)",
            animation: "radarWave 3.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite",
            animationDelay: "1.75s",
          }}
        />

        <svg
          width="130"
          height="130"
          viewBox="0 0 130 130"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <circle
            cx="65"
            cy="65"
            r="54"
            fill="none"
            stroke="rgba(255, 255, 255, 0.02)"
            strokeWidth="1.5"
          />
          <circle
            ref={ringRef}
            cx="65"
            cy="65"
            r="54"
            fill="none"
            stroke="var(--accent-gold)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom info section */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(3rem, 8vh, 6rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          zIndex: 4,
        }}
      >
        <div
          ref={counterRef}
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            color: "var(--text-primary)",
          }}
        >
          {percent}%
        </div>

        <div
          ref={progressTextRef}
          className="text-mono-tag"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.25em",
            fontSize: "0.65rem",
            textTransform: "uppercase",
          }}
        >
          System Setup
        </div>
      </div>

      <style jsx global>{`
        @keyframes radarWave {
          0% {
            transform: scale(0.85);
            opacity: 0.9;
          }
          100% {
            transform: scale(2.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
