"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminRootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/admin/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#00d2ff] drop-shadow-[0_0_15px_rgba(0,210,255,0.4)]" />
        <span className="text-slate-400 text-sm font-mono tracking-widest uppercase">Initializing Session...</span>
      </div>
    </div>
  );
}
