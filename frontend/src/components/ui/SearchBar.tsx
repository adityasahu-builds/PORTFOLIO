"use client";

import React, { useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (v: string) => void;
  shortcut?: string;
}

export function SearchBar({
  value,
  onChangeValue,
  placeholder = "Search...",
  shortcut,
  className = "",
  ...props
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shortcut) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === shortcut) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcut]);

  return (
    <div className={`flex items-center gap-2.5 w-full max-w-sm ${className}`}>
      <Search className="w-4 h-4 text-slate-500 shrink-0 pointer-events-none" />
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#0a0a0f]/60 border border-white/[0.05] rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/10 transition-all font-sans"
          {...props}
        />
        {shortcut && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 bg-white/[0.03] border border-white/[0.05] rounded select-none pointer-events-none">
            ⌘{shortcut.toUpperCase()}
          </kbd>
        )}
      </div>
    </div>
  );
}
