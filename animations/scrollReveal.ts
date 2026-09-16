import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

/**
 * Simple, reusable scroll-triggered stagger reveal for a set of
 * elements tagged with a data-attribute. Not scrubbed — plays once
 * when the group enters the viewport, matching the hero/problem/
 * workflow entrance feel used across the rest of the site.
 */
export function revealOnScroll(
  gsap: typeof GsapType,
  ScrollTrigger: typeof ScrollTriggerType,
  root: HTMLElement,
  selector: string,
  opts: { y?: number; stagger?: number; start?: string } = {},
) {
  const items = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(selector));
  if (items.length === 0) return null;

  return gsap.fromTo(
    items,
    { opacity: 0, y: opts.y ?? 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: opts.stagger ?? 0.08,
      scrollTrigger: {
        trigger: root,
        start: opts.start ?? "top 82%",
        // Play once on the way down; never reverse it back out if the
        // user scrolls back up past this section.
        toggleActions: "play none none none",
      },
    },
  );
}
