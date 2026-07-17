"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextProps {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useMemo(
    () => ({
      success: (msg: string) => addToast("success", msg),
      error: (msg: string) => addToast("error", msg),
      warning: (msg: string) => addToast("warning", msg),
      info: (msg: string) => addToast("info", msg),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Tray container */}
      <div className="fixed top-6 right-6 z-55 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            let icon = <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
            let styles = "bg-[#061e14]/90 border-emerald-500/20 text-emerald-400 shadow-emerald-950/20";
            let progressBg = "bg-emerald-500";

            if (t.type === "error") {
              icon = <AlertCircle className="w-5 h-5 text-rose-450 shrink-0" />;
              styles = "bg-[#250d11]/90 border-rose-500/20 text-rose-400 shadow-rose-950/20";
              progressBg = "bg-rose-500";
            } else if (t.type === "warning") {
              icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
              styles = "bg-[#271b05]/90 border-amber-500/20 text-amber-400 shadow-amber-950/20";
              progressBg = "bg-amber-500";
            } else if (t.type === "info") {
              icon = <Info className="w-5 h-5 text-[#00d2ff] shrink-0" />;
              styles = "bg-[#031522]/90 border-[#00d2ff]/20 text-[#00d2ff] shadow-blue-950/20";
              progressBg = "bg-[#00d2ff]";
            }

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: 50, transition: { duration: 0.2 } }}
                className={`pointer-events-auto relative flex items-start gap-3.5 px-4.5 py-4 rounded-2xl border backdrop-blur-xl shadow-xl transition-colors font-sans overflow-hidden ${styles}`}
              >
                {icon}
                <div className="flex-1 text-xs font-semibold leading-relaxed pr-2">
                  {t.message}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-slate-500 hover:text-white transition-colors shrink-0 -mt-1 p-0.5 rounded-lg hover:bg-white/5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {/* Visual duration progress bar */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-0.5 ${progressBg}`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
