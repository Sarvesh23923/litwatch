import type { gsap as GsapType } from "gsap";

/**
 * Builds the hero entrance timeline. Scoped to `root` so the caller can run
 * this inside a gsap.context(() => ..., root) and get automatic cleanup.
 */
export function buildHeroTimeline(gsap: typeof GsapType, root: HTMLElement) {
  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.35, // let the navbar settle first
  });

  const eyebrow = root.querySelector('[data-hero="eyebrow"]');
  const headlineLines = root.querySelectorAll('[data-hero="headline-line"]');
  const paragraph = root.querySelector('[data-hero="paragraph"]');
  const ctaButtons = root.querySelectorAll('[data-hero="cta-btn"]');
  const frame = root.querySelector('[data-hero="frame"]');

  tl.fromTo(
    eyebrow,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.5 },
  )
    .fromTo(
      headlineLines,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "expo.out" },
      "-=0.2",
    )
    .fromTo(
      paragraph,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.35",
    )
    .fromTo(
      ctaButtons,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
      "-=0.3",
    )
    .fromTo(
      frame,
      { opacity: 0, scale: 0.96, y: 18 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power4.out" },
      "-=0.4",
    );

  return tl;
}

/** Extremely subtle post-entrance ambient motion — no bounce, no loops. */
export function buildHeroAmbient(gsap: typeof GsapType, root: HTMLElement) {
  const frame = root.querySelector('[data-hero="frame"]');
  if (!frame) return null;

  return gsap.to(frame, {
    y: -6,
    duration: 4.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}
