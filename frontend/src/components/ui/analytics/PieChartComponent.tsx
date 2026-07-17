"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PieDataItem {
  name: string;
  count: number;
}

interface PieChartComponentProps {
  data: PieDataItem[];
  isLoading?: boolean;
  height?: number;
  showLegend?: boolean;
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
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: PieDataItem }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-[#09090e] border border-white/[0.08] rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[10px] text-slate-500 mb-1">{item.name}</p>
      <p className="text-sm font-semibold text-white">{item.value}</p>
    </div>
  );
}

function CustomLegend({
  payload,
}: {
  payload?: { value: string; color: string }[];
}) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PieChartComponent({
  data,
  isLoading = false,
  height = 220,
  showLegend = true,
}: PieChartComponentProps) {
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

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="45%"
          innerRadius="40%"
          outerRadius="65%"
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              opacity={0.9}
            />
          ))}
        </Pie>

        {/* Center label */}
        <text
          x="50%"
          y="45%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-white"
        >
          <tspan
            x="50%"
            dy="-0.4em"
            fontSize="18"
            fontWeight="700"
            fill="white"
          >
            {total}
          </tspan>
          <tspan x="50%" dy="1.4em" fontSize="9" fill="#475569">
            TOTAL
          </tspan>
        </text>

        <Tooltip content={<CustomTooltip />} />

        {showLegend && (
          <Legend
            content={<CustomLegend />}
            verticalAlign="bottom"
            height={60}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
