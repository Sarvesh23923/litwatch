import type { gsap as GsapType } from "gsap";

/**
 * A single, contained ripple fired from the pointer position — used as the
 * "press" feedback on primary actions. The button must have position:
 * relative and overflow-hidden. Respects prefers-reduced-motion.
 */
export function spawnRipple(
  gsap: typeof GsapType,
  button: HTMLElement,
  clientX: number,
  clientY: number,
  tint = "rgba(255,255,255,0.35)",
) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.6;

  const ripple = document.createElement("span");
  ripple.setAttribute("aria-hidden", "true");
  Object.assign(ripple.style, {
    position: "absolute",
    left: `${clientX - rect.left - size / 2}px`,
    top: `${clientY - rect.top - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "9999px",
    background: tint,
    pointerEvents: "none",
  });

  button.appendChild(ripple);

  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 1 },
    {
      scale: 1,
      opacity: 0,
      duration: 0.65,
      ease: "power2.out",
      onComplete: () => ripple.remove(),
    },
  );
}

/** Small tactile press pulse for a button, independent of the ripple. */
export function pressPulse(gsap: typeof GsapType, el: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.fromTo(
    el,
    { scale: 0.975 },
    { scale: 1, duration: 0.35, ease: "power3.out" },
  );
}
