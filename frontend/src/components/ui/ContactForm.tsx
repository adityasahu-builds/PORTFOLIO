"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        
        // Reset back to idle after a few seconds
        setTimeout(() => {
          setStatus("idle");
        }, 5000);
      } else {
        setStatus("idle");
        const errMsg = data.message || "Failed to send message. Please try again.";
        setError(errMsg);
        console.error("Submission failed:", errMsg);
      }
    } catch (err) {
      setStatus("idle");
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errMsg);
      console.error("Submission error:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null); // Clear error on edit
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto flex flex-col gap-6 p-8 rounded-3xl bg-[#0a0a0a]/40 border border-white/[0.03] backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group/form"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent opacity-0 group-hover/form:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-[#00d2ff]/5 blur-3xl rounded-full opacity-0 group-hover/form:opacity-100 transition-opacity duration-700" />

      <h3 className="text-2xl font-display font-bold text-white mb-2 relative z-10">Send a Message</h3>
      
      <div className="flex flex-col sm:flex-row gap-6 relative z-10">
        <div className="flex flex-col gap-2 w-full group">
          <label 
            htmlFor="name" 
            className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 group-focus-within:text-[#00d2ff] transition-colors cursor-text"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-[#0a0a0a]/50 border border-white/[0.05] hover:border-white/[0.1] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#00d2ff]/40 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(0,210,255,0.05)] transition-all duration-300"
          />
        </div>

        <div className="flex flex-col gap-2 w-full group">
          <label 
            htmlFor="email" 
            className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 group-focus-within:text-[#00d2ff] transition-colors cursor-text"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-[#0a0a0a]/50 border border-white/[0.05] hover:border-white/[0.1] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#00d2ff]/40 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(0,210,255,0.05)] transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full group z-10">
        <label 
          htmlFor="subject" 
          className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 group-focus-within:text-[#00d2ff] transition-colors cursor-text"
        >
          Subject
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full bg-[#0a0a0a]/50 border border-white/[0.05] hover:border-white/[0.1] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#00d2ff]/40 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(0,210,255,0.05)] transition-all duration-300"
        />
      </div>

      <div className="flex flex-col gap-2 w-full group z-10">
        <label 
          htmlFor="message" 
          className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 group-focus-within:text-[#00d2ff] transition-colors cursor-text"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full bg-[#0a0a0a]/50 border border-white/[0.05] hover:border-white/[0.1] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#00d2ff]/40 focus:bg-white/[0.02] focus:shadow-[0_0_15px_rgba(0,210,255,0.05)] transition-all duration-500 resize-none h-32 focus:h-48"
        />
      </div>

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-rose-500/90 text-sm relative z-10 text-center font-medium font-mono-code bg-rose-950/10 border border-rose-500/20 py-2.5 rounded-xl backdrop-blur-md"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={status !== "idle"}
        className="group relative w-full overflow-hidden rounded-xl bg-white/[0.05] p-[1px] transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,210,255,0.15)] hover:-translate-y-1 z-10"
      >
        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#0055ff_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] px-8 py-4 transition-all duration-500 group-hover:bg-[#050505] w-full h-full">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 font-semibold text-slate-300 group-hover:text-white transition-colors duration-500"
              >
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#00d2ff] transition-all duration-500" />
              </motion.div>
            )}
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 font-semibold text-[#00d2ff]"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </motion.div>
            )}
            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 font-semibold text-[#4DFFB4]"
              >
                <CheckCircle2 className="w-5 h-5" />
                Message Sent!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>

      {/* Success Message Pop-in */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-3xl"
          >
            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { x: -60, y: 80 },
                { x: 90, y: -50 },
                { x: -40, y: -90 },
                { x: 70, y: 60 },
                { x: -80, y: 30 },
                { x: 50, y: -80 }
              ].map((coord, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1.5, 0], 
                    x: coord.x, 
                    y: coord.y 
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#00d2ff]"
                />
              ))}
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00d2ff] to-[#4DFFB4] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(77,255,180,0.4)]"
            >
              <CheckCircle2 className="w-8 h-8 text-black" />
            </motion.div>
            <h4 className="text-2xl font-display font-bold text-white mb-2">Thank You!</h4>
            <p className="text-slate-400 text-center max-w-xs">
              {"I've received your message and will get back to you as soon as possible."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
