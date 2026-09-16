import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export function buildProblemScroll(
  gsap: typeof GsapType,
  ScrollTrigger: typeof ScrollTriggerType,
  root: HTMLElement,
) {
  const visual = root.querySelector<HTMLElement>('[data-problem="visual"]');
  const fragments = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-problem="fragment"]'),
  );
  const outline = root.querySelector('[data-problem="target-outline"]');
  const solid = root.querySelector('[data-problem="target-solid"]');

  if (!visual || fragments.length === 0) return null;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: visual,
      start: "top 80%",
      end: "bottom 50%",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  gsap.set(fragments, { transformOrigin: "center center" });
  gsap.set(solid, { transformOrigin: "center center" });

  tl.to(outline, { 
    opacity: 0, 
    scale: 1.1,
    duration: 0.6,
  }, 0);

  tl.to(solid, { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    duration: 1,
    ease: "back.out(1.2)",
  }, 0.2);

  fragments.forEach((frag, i) => {
    const dx = Number(frag.dataset.dx ?? 0);
    const dy = Number(frag.dataset.dy ?? 0);
    
    const stagger = i * 0.08;
    
    tl.to(
      frag,
      {
        x: dx,
        y: dy,
        rotate: 0,
        scale: 0.75,
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
      },
      stagger,
    );

    tl.to(
      frag,
      {
        boxShadow: "0 8px 32px -12px rgba(55, 30, 113, 0.3)",
        borderColor: "rgba(139, 92, 246, 0.3)",
        duration: 0.5,
        ease: "power2.out",
      },
      stagger,
    );
  });

  tl.to(
    solid,
    {
      boxShadow: "0 32px 64px -32px rgba(55, 30, 113, 0.5), 0 0 0 2px rgba(55, 30, 113, 0.1) inset",
      duration: 0.8,
      ease: "power2.out",
    },
    0.6,
  );

  return tl;
}