"use client";

import React from "react";
import { Calendar } from "lucide-react";
import type { DateRange, DateFilter } from "@/types/analytics";

interface FilterBarProps {
  filter: DateFilter;
  onChange: (filter: DateFilter) => void;
}

const PRESETS: { label: string; range: DateRange }[] = [
  { label: "Today", range: "today" },
  { label: "Last 7 Days", range: "7d" },
  { label: "Last 30 Days", range: "30d" },
  { label: "Last 90 Days", range: "90d" },
  { label: "Custom", range: "custom" },
];

export default function FilterBar({ filter, onChange }: FilterBarProps) {
  const handlePreset = (range: DateRange) => {
    if (range === "custom") {
      // Keep existing custom dates if already set
      onChange({ range, startDate: filter.startDate, endDate: filter.endDate });
    } else {
      onChange({ range });
    }
  };

  const handleCustomDate = (
    key: "startDate" | "endDate",
    value: string
  ) => {
    onChange({ ...filter, range: "custom", [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Preset Buttons */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        {PRESETS.map((preset) => (
          <button
            key={preset.range}
            onClick={() => handlePreset(preset.range)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              filter.range === preset.range
                ? "bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30 shadow-sm"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Date Inputs */}
      {filter.range === "custom" && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="date"
              value={filter.startDate || ""}
              onChange={(e) => handleCustomDate("startDate", e.target.value)}
              className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
          <span className="text-slate-600 text-xs">to</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="date"
              value={filter.endDate || ""}
              onChange={(e) => handleCustomDate("endDate", e.target.value)}
              className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
