import { useEffect, useCallback } from "react";
import { api } from "@/lib/api";

// Helper to generate a UUID if not supported natively
function generateUUID() {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "session-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useAnalytics() {
  const trackEvent = useCallback(async (
    eventName: "pageView" | "projectView" | "resumeDownload" | "contactSubmission" | "socialClick" | "ctaClick",
    details?: Record<string, any>
  ) => {
    if (typeof window === "undefined") return;

    try {
      // 1. Get or create sessionId
      let sessionId = sessionStorage.getItem("portfolio_session_id");
      if (!sessionId) {
        sessionId = generateUUID();
        sessionStorage.setItem("portfolio_session_id", sessionId);
      }

      // 2. Get or fetch client geo details
      let geoData: { country?: string; city?: string } = {};
      const cachedGeo = sessionStorage.getItem("portfolio_geo_data");
      if (cachedGeo) {
        try {
          geoData = JSON.parse(cachedGeo);
        } catch {
          // ignore parsing error
        }
      } else {
        try {
          // Fetch from a free public API
          const geoRes = await fetch("https://ipapi.co/json/");
          if (geoRes.ok) {
            const geoJson = await geoRes.json();
            geoData = {
              country: geoJson.country_name || "Unknown",
              city: geoJson.city || "Unknown",
            };
            sessionStorage.setItem("portfolio_geo_data", JSON.stringify(geoData));
          }
        } catch (geoErr) {
          console.warn("Geo lookup failed, falling back to backend resolver:", geoErr);
        }
      }

      // 3. Get or create landingPage path
      let landingPage = sessionStorage.getItem("portfolio_landing_page");
      if (!landingPage) {
        landingPage = window.location.pathname;
        sessionStorage.setItem("portfolio_landing_page", landingPage);
      }

      // 4. Resolve referral source
      const referralSource = document.referrer ? new URL(document.referrer).hostname : "Direct";

      // 5. Build payload
      const payload = {
        sessionId,
        eventName,
        pagePath: window.location.pathname,
        details: details || {},
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        referralSource,
        landingPage,
        country: geoData.country || "Unknown",
        city: geoData.city || "Unknown",
      };

      // 6. Ingest tracking request (avoid blocking UI or throwing errors to the client)
      await api.post("/analytics/track", payload).catch((err) => {
        console.warn("Analytics ping error:", err);
      });
    } catch (err) {
      console.warn("Analytics tracker caught error:", err);
    }
  }, []);

  return { trackEvent };
}

/**
   * Helper component or hook to trigger pageView automatically on mount.
   */
export function useAutoTrackPageView() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("pageView");
  }, [trackEvent]);
}
