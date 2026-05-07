"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister()))
        )
        .catch(() => {
          // Development should keep working even if the browser blocks cleanup.
        });

      if ("caches" in window) {
        window.caches
          .keys()
          .then((keys) => Promise.all(keys.map((key) => window.caches.delete(key))))
          .catch(() => {
            // Ignore cache cleanup errors in development.
          });
      }

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
