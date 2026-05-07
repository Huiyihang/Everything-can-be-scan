"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const isLocalhost = ["localhost", "127.0.0.1"].includes(
      window.location.hostname
    );

    if (!window.isSecureContext && !isLocalhost) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA registration should never block the main scan experience.
    });
  }, []);

  return null;
}
