"use client";

import React, { useState } from "react";
import { Globe, Monitor, Smartphone, Tablet, ChevronLeft, ChevronRight } from "lucide-react";
import type { VisitorSession, VisitorsData } from "@/types/analytics";

interface VisitorsTableProps {
  data?: VisitorsData;
  isLoading?: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

function DeviceIcon({ type }: { type: string }) {
  if (type === "Mobile") return <Smartphone className="w-3.5 h-3.5 text-blue-400" />;
  if (type === "Tablet") return <Tablet className="w-3.5 h-3.5 text-violet-400" />;
  return <Monitor className="w-3.5 h-3.5 text-cyan-400" />;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VisitorsTable({
  data,
  isLoading,
  page,
  onPageChange,
}: VisitorsTableProps) {
  const visitors = data?.visitors ?? [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3 items-center p-3 rounded-xl bg-white/[0.02]">
            <div className="w-7 h-7 rounded-full bg-white/[0.05] shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-white/[0.04] rounded w-2/3" />
              <div className="h-2.5 bg-white/[0.03] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (visitors.length === 0) {
    return (
      <div className="py-12 text-center">
        <Globe className="w-8 h-8 text-slate-700 mx-auto mb-3" />
        <p className="text-slate-600 text-sm">No visitors recorded in this period</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left text-[10px] uppercase tracking-widest text-slate-600 pb-2 pr-3 font-semibold">
                Location
              </th>
              <th className="text-left text-[10px] uppercase tracking-widest text-slate-600 pb-2 pr-3 font-semibold">
                Device / Browser
              </th>
              <th className="text-left text-[10px] uppercase tracking-widest text-slate-600 pb-2 pr-3 font-semibold">
                Landing Page
              </th>
              <th className="text-left text-[10px] uppercase tracking-widest text-slate-600 pb-2 pr-3 font-semibold">
                Source
              </th>
              <th className="text-left text-[10px] uppercase tracking-widest text-slate-600 pb-2 pr-3 font-semibold">
                Duration
              </th>
              <th className="text-left text-[10px] uppercase tracking-widest text-slate-600 pb-2 font-semibold">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {visitors.map((v: VisitorSession) => (
              <tr
                key={v._id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="text-slate-300 font-medium">{v.country}</span>
                    {v.city !== "Unknown" && (
                      <span className="text-slate-600">{v.city}</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-1.5">
                    <DeviceIcon type={v.deviceType} />
                    <span className="text-slate-400">{v.browser}</span>
                    <span className="text-slate-600">/{v.os}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-3">
                  <span className="text-slate-500 font-mono truncate max-w-[100px] inline-block">
                    {v.landingPage}
                  </span>
                </td>
                <td className="py-2.5 pr-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400 text-[10px]">
                    {v.referralSource}
                  </span>
                </td>
                <td className="py-2.5 pr-3">
                  <span className="text-slate-500">
                    {formatDuration(v.sessionDuration)}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="text-slate-600">
                    {formatDateTime(v.visitTime)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <span className="text-[10px] text-slate-600">
            Showing {(page - 1) * pagination.limit + 1}–
            {Math.min(page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-500 px-2">
              {page} / {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pagination.pages}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
