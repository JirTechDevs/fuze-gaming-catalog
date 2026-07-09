"use client";

import * as React from "react";

interface StorefrontLiteModeState {
  isLiteMode: boolean;
  resolved: boolean;
}

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function isAppleMobileDevice() {
  const platform = window.navigator.platform ?? "";
  const userAgent = window.navigator.userAgent;

  return /iP(hone|ad|od)/.test(userAgent) || (platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
}

function subscribeToMediaQuery(query: MediaQueryList, listener: () => void) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }

  query.addListener(listener);
  return () => query.removeListener(listener);
}

export function useStorefrontLiteMode(): StorefrontLiteModeState {
  const [state, setState] = React.useState<StorefrontLiteModeState>({
    isLiteMode: false,
    resolved: false,
  });

  React.useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const update = () => {
      setState({
        isLiteMode:
          mobileQuery.matches ||
          reducedMotionQuery.matches ||
          isAppleMobileDevice(),
        resolved: true,
      });
    };

    update();

    const unsubscribeMobile = subscribeToMediaQuery(mobileQuery, update);
    const unsubscribeMotion = subscribeToMediaQuery(reducedMotionQuery, update);

    return () => {
      unsubscribeMobile();
      unsubscribeMotion();
    };
  }, []);

  return state;
}
