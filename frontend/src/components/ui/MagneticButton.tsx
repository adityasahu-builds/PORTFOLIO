"use client";

import { useRef, useCallback } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function MagneticButton({
  children,
  href,
  onClick,
  className,
}: MagneticButtonProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLElement>(null);
  const strength = 0.35; // magnetic pull factor

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * strength;
    const dy = (e.clientY - centerY) * strength;

    inner.style.transform = `translate(${dx}px, ${dy}px)`;
    inner.style.transition = "transform 0.1s ease";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = "translate(0px, 0px)";
    inner.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
  }, []);

  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem 2.5rem",
    border: "1px solid var(--accent-gold)",
    borderRadius: "2px",
    background: "transparent",
    color: "var(--accent-gold)",
    cursor: "none",
    fontSize: "0.8rem",
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    transition: "background 0.4s ease, color 0.4s ease",
    fontFamily: "var(--font-inter), Inter, sans-serif",
    position: "relative",
    overflow: "hidden",
  };

  const Tag = href ? "a" : "button";

  return (
    <div
      ref={wrapperRef}
      className={`magnetic-wrapper ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-flex" }}
    >
      <Tag
        ref={innerRef as React.RefObject<HTMLAnchorElement & HTMLButtonElement>}
        href={href}
        onClick={onClick}
        style={buttonStyle}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--accent-glow)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          handleMouseLeave();
        }}
      >
        {children}
      </Tag>
    </div>
  );
}
