"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true, // Auto-refetch when user switches tabs
            refetchOnMount: true, // Always fetch latest Supabase data on mount
            retry: 2,
            staleTime: 0, // Zero stale time for instant real-time updates
            gcTime: 5 * 60 * 1000,
          },
        },
      })
  );

  // Cross-tab real-time sync between Admin Panel and Main Website
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel("portfolio-realtime-sync");
    channel.onmessage = (event) => {
      if (event.data === "invalidate" || event.data?.type === "invalidate") {
        queryClient.invalidateQueries();
      }
    };
    return () => {
      channel.close();
    };
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
