"use client";

import React from "react";
import { Mail, Clock } from "lucide-react";
import type { RecentMessage, MessageTrend } from "@/types/analytics";

interface MessagesTableProps {
  messages?: RecentMessage[];
  trends?: MessageTrend[];
  isLoading?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function MessagesTable({
  messages = [],
  trends = [],
  isLoading,
}: MessagesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex gap-3 items-center p-3 rounded-xl bg-white/[0.02]"
          >
            <div className="w-8 h-8 rounded-full bg-white/[0.05] shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-white/[0.04] rounded w-3/4" />
              <div className="h-2.5 bg-white/[0.03] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="py-12 text-center">
        <Mail className="w-8 h-8 text-slate-700 mx-auto mb-3" />
        <p className="text-slate-600 text-sm">No messages in this period</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-600/20 flex items-center justify-center shrink-0 text-xs font-bold text-[#00d2ff]">
            {msg.fullName.charAt(0).toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-200 truncate">
                {msg.fullName}
              </span>
              <span className="text-[10px] text-slate-600 shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(msg.createdAt)}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {msg.subject
                ? truncate(msg.subject, 60)
                : truncate(msg.message, 60)}
            </p>
            <p className="text-[10px] text-slate-600 truncate mt-0.5">
              {msg.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
