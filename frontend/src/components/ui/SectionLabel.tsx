"use client";

import { cn } from "@/lib/utils";

interface SectionLabelProps {
  number: string;
  label: string;
  className?: string;
}

export function SectionLabel({ number, label, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="text-section-label" style={{ color: "var(--accent-gold)" }}>
        {number}
      </span>
      <span
        className="text-section-label"
        style={{
          width: "32px",
          height: "1px",
          background: "var(--border-active)",
          display: "inline-block",
        }}
        aria-hidden="true"
      />
      <span className="text-section-label">{label}</span>
    </div>
  );
}
