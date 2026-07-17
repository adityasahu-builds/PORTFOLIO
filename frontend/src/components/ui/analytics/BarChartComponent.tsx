"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarDataItem {
  name: string;
  value: number;
}

interface BarChartComponentProps {
  data: BarDataItem[];
  color?: string;
  isLoading?: boolean;
  height?: number;
  maxLabelLength?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#09090e] border border-white/[0.08] rounded-xl px-3 py-2 shadow-xl max-w-[200px]">
      <p className="text-[10px] text-slate-500 mb-1 break-all">{label}</p>
      <p className="text-sm font-semibold text-white">{payload[0].value}</p>
    </div>
  );
}

const COLORS = [
  "#00d2ff",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
];

export default function BarChartComponent({
  data,
  isLoading = false,
  height = 200,
  maxLabelLength = 16,
}: BarChartComponentProps) {
  if (isLoading) {
    return (
      <div
        className="animate-pulse rounded-xl bg-white/[0.03]"
        style={{ height }}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-white/[0.02] text-slate-600 text-xs"
        style={{ height }}
      >
        No data for selected period
      </div>
    );
  }

  // Truncate long labels for display
  const displayData = data.map((d) => ({
    ...d,
    displayName:
      d.name.length > maxLabelLength
        ? d.name.slice(0, maxLabelLength) + "…"
        : d.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={displayData}
        layout="vertical"
        margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          horizontal={false}
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
        />
        <XAxis
          type="number"
          tick={{ fill: "#475569", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="displayName"
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {displayData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
