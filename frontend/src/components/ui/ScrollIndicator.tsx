"use client";

import { useEffect, useRef } from "react";

export function ScrollIndicator() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    line.style.animationPlayState = "running";
  }, []);

  return (
    <>
      <style>{`
        @keyframes scrollPulse {
          0% { transform: translateY(-100%); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        .scroll-line-inner {
          animation: scrollPulse 2s ease-in-out infinite;
          animation-play-state: paused;
        }
      `}</style>
      <div
        aria-label="Scroll to explore"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          className="text-section-label"
          style={{ color: "var(--text-muted)", writingMode: "vertical-rl" }}
        >
          scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "56px",
            background: "var(--border-active)",
            overflow: "hidden",
            position: "relative",
            borderRadius: "1px",
          }}
        >
          <div
            ref={lineRef}
            className="scroll-line-inner"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "50%",
              background:
                "linear-gradient(to bottom, var(--accent-gold), transparent)",
              borderRadius: "1px",
            }}
          />
        </div>
      </div>
    </>
  );
}
