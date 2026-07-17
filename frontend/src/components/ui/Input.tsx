"use client";

import React from "react";
import { motion } from "framer-motion";

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.FC<{ className?: string }>;
}

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    BaseInputProps {}

export function InputField({
  label,
  error,
  helperText,
  icon: Icon,
  className = "",
  id,
  type = "text",
  ...props
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        )}
        <input
          id={id}
          type={type}
          className={`w-full py-2.5 bg-white/[0.02] border rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/10 disabled:opacity-50 disabled:cursor-not-allowed ${
            Icon ? "pl-10 pr-4" : "px-4"
          } ${
            error
              ? "border-rose-500/50 focus:border-rose-500/70 focus:ring-rose-500/10"
              : "border-white/[0.06] hover:border-white/[0.12] focus:border-[#00d2ff]/40"
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[10px] font-semibold text-rose-450 leading-none mt-0.5">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-[10px] text-slate-500 leading-normal">
          {helperText}
        </span>
      )}
    </div>
  );
}

export interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseInputProps {}

export function TextAreaField({
  label,
  error,
  helperText,
  className = "",
  id,
  rows = 4,
  ...props
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full px-4 py-3 bg-white/[0.02] border rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/10 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? "border-rose-500/50 focus:border-rose-500/70 focus:ring-rose-500/10"
            : "border-white/[0.06] hover:border-white/[0.12]"
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[10px] font-semibold text-rose-450 leading-none mt-0.5">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-[10px] text-slate-500 leading-normal">
          {helperText}
        </span>
      )}
    </div>
  );
}

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    BaseInputProps {
  options: { label: string; value: string | number }[];
}

export function SelectField({
  label,
  error,
  helperText,
  options,
  className = "",
  id,
  ...props
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-2.5 bg-white/[0.02] border rounded-xl text-xs text-white outline-none transition-all cursor-pointer focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/10 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? "border-rose-500/50 focus:border-rose-500/70 focus:ring-rose-500/10"
            : "border-white/[0.06] hover:border-white/[0.12]"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#09090e] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-[10px] font-semibold text-rose-450 leading-none mt-0.5">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-[10px] text-slate-500 leading-normal">
          {helperText}
        </span>
      )}
    </div>
  );
}

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SwitchField({
  label,
  checked,
  onChange,
  disabled = false,
}: SwitchFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 select-none">
      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#00d2ff]/20 disabled:opacity-50 cursor-pointer ${
          checked ? "bg-gradient-to-r from-blue-600 to-[#00d2ff]" : "bg-white/[0.08]"
        }`}
      >
        <motion.div
          layout
          className="w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
