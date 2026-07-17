"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: "modal" | "drawer";
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  variant = "modal",
}: DialogProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {variant === "modal" ? (
            /* CENTERED MODAL */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md p-6 rounded-2xl border border-white/[0.05] bg-[#09090e]/95 backdrop-blur-xl shadow-2xl space-y-4 z-10"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <h3 className="text-sm uppercase tracking-widest font-bold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
            </motion.div>
          ) : (
            /* SIDE SHEET DRAWER */
            <motion.div
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl h-full border-l border-white/[0.04] bg-[#09090e]/95 backdrop-blur-xl shadow-2xl flex flex-col z-10 text-slate-200"
            >
              <div className="h-16 border-b border-white/[0.04] flex items-center justify-between px-6 shrink-0 bg-[#07070a]">
                <h2 className="text-sm uppercase tracking-widest font-bold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
