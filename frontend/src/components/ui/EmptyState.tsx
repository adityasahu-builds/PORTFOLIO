"use client";

import React from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-500 mb-4.5">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-white tracking-wide uppercase">{title}</h3>
      <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
