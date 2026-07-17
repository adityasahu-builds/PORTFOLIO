"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  [key: string]: number | string;
}

interface AreaChartProps {
  data: DataPoint[];
  dataKey: string;
  color?: string;
  label?: string;
  isLoading?: boolean;
  height?: number;
  formatDate?: (date: string) => string;
  formatValue?: (value: number) => string;
}

// Custom tooltip styled for the dark theme
function CustomTooltip({
  active,
  payload,
  label,
  formatValue,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  formatValue?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#09090e] border border-white/[0.08] rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[10px] text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        {formatValue ? formatValue(payload[0].value) : payload[0].value}
      </p>
    </div>
  );
}

export default function AreaChartComponent({
  data,
  dataKey,
  color = "#00d2ff",
  isLoading = false,
  height = 200,
  formatDate,
  formatValue,
}: AreaChartProps) {
  const gradientId = `gradient-${dataKey}`;

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

  const displayData = data.map((d) => ({
    ...d,
    displayDate: formatDate ? formatDate(d.date) : d.date.slice(5), // MM-DD
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={displayData}
        margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="displayDate"
          tick={{ fill: "#475569", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#475569", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          content={
            <CustomTooltip
              formatValue={formatValue}
            />
          }
          cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: "#030308", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
