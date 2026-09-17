
"use client";

import { useSyncExternalStore } from "react";

function subscribe(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

function getServerSnapshot() {
  return false;
}

/** Tracks an arbitrary media query reactively, without a setState-in-effect. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    getServerSnapshot,
  );
}
