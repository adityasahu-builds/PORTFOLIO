"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function Table({ children, className = "", ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/[0.04] bg-[#07070c]/20 backdrop-blur-md">
      <table className={`w-full text-left border-collapse min-w-[600px] ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <thead>
      <tr className={`border-b border-white/[0.04] bg-[#09090e]/40 text-[10px] uppercase tracking-wider font-bold text-slate-500 select-none ${className}`}>
        {children}
      </tr>
    </thead>
  );
}

export function TableBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`divide-y divide-white/[0.03] text-sm text-slate-350 ${className}`}>{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
  hoverable = true,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  [key: string]: any;
}) {
  return (
    <tr
      className={`transition-colors duration-300 ${
        hoverable ? "hover:bg-white/[0.015]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return (
    <td className={`py-4.5 px-6 align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}

export function TableHeadCell({
  children,
  className = "",
  sortable = false,
  sortDirection,
  onSort,
}: {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}) {
  return (
    <th
      className={`py-4 px-6 font-bold align-middle ${
        sortable ? "cursor-pointer select-none hover:text-white transition-colors" : ""
      } ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && (
          <span className="text-slate-600 shrink-0">
            {sortDirection === "asc" ? (
              <ChevronUp className="w-3 h-3 text-[#00d2ff]" />
            ) : sortDirection === "desc" ? (
              <ChevronDown className="w-3 h-3 text-[#00d2ff]" />
            ) : (
              <div className="flex flex-col gap-0.5 opacity-40">
                <ChevronUp className="w-2.5 h-2.5 -mb-0.5" />
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            )}
          </span>
        )}
      </div>
    </th>
  );
}
