"use client";

import { useEffect } from "react";

// ponytail: beacons on every mount (home ↔ detail navigation included); the DB
// unique index on (session_id, visited_date) keeps it to one row per visitor per day.
export default function TrackVisit() {
  useEffect(() => {
    // Automation (Puppeteer/Selenium/Playwright) exposes navigator.webdriver.
    if (navigator.webdriver) return;

    const send = () => {
      void fetch("/api/public/track", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: window.location.pathname }),
      }).catch(() => {});
    };

    // Prerendered / background tabs only count once actually seen.
    if (document.visibilityState === "visible") {
      send();
      return;
    }

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", onVisible);
      send();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return null;
}
