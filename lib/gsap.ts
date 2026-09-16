"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;

    // Matter loads with font-display: swap, so the page can reflow after
    // ScrollTrigger has already measured trigger positions — same for any
    // late-loading images. Re-measure once things settle so scroll-mapped
    // sections (Problem, Workflow, ...) stay in sync with actual scroll.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
  return { gsap, ScrollTrigger };
}
