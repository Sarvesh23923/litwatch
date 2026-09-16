import type { gsap as GsapType } from "gsap";

export function moveTabIndicator(
  gsap: typeof GsapType,
  indicator: HTMLElement,
  activeTabEl: HTMLElement,
  container: HTMLElement,
) {
  const containerRect = container.getBoundingClientRect();
  const tabRect = activeTabEl.getBoundingClientRect();

  gsap.to(indicator, {
    x: tabRect.left - containerRect.left,
    width: tabRect.width,
    duration: 0.5,
    ease: "power3.out",
  });
}

export function switchPanel(
  gsap: typeof GsapType,
  panels: HTMLElement[],
  activeIndex: number,
) {
  panels.forEach((panel, i) => {
    const isActive = i === activeIndex;
    const items = panel.querySelectorAll('[data-showcase="item"]');

    if (isActive) {
      gsap.to(panel, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
        pointerEvents: "auto",
      });
      gsap.fromTo(
        items,
        { opacity: 0, y: 12, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: "back.out(1.3)",
          delay: 0.15,
        },
      );
    } else {
      gsap.to(panel, {
        opacity: 0,
        x: -10,
        scale: 0.98,
        duration: 0.3,
        ease: "power2.in",
        pointerEvents: "none",
      });
      gsap.set(items, { opacity: 0, y: 12, scale: 0.98 });
    }
  });
}

export function switchPanelInstant(
  gsap: typeof GsapType,
  panels: HTMLElement[],
  activeIndex: number,
) {
  panels.forEach((panel, i) => {
    const isActive = i === activeIndex;
    const items = panel.querySelectorAll('[data-showcase="item"]');
    gsap.set(panel, {
      opacity: isActive ? 1 : 0,
      x: 0,
      scale: 1,
      pointerEvents: isActive ? "auto" : "none",
    });
    gsap.set(items, { opacity: 1, y: 0, scale: 1 });
  });
}