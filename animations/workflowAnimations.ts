import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

const ACTIVE = { backgroundColor: "#f4f1fb", borderColor: "#371e71", color: "#371e71" };
const INACTIVE = { backgroundColor: "#ffffff", borderColor: "#e4e0e8", color: "#6f6b78" };

/**
 * Pins the workflow stage and scrubs one case through
 * Ingest → Classify → Draft → Track as the user scrolls. Stepper dots,
 * connector fills, description copy, the progress bar and the stage
 * panel all stay in sync off the same timeline so nothing can drift out
 * of step with the others.
 */
export function buildWorkflowPin(
  gsap: typeof GsapType,
  ScrollTrigger: typeof ScrollTriggerType,
  root: HTMLElement,
  pinTarget: HTMLElement,
) {
  const panels = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="panel"]'),
  );
  const dots = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="dot"]'),
  );
  const connectors = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="connector-fill"]'),
  );
  const descriptions = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="description"]'),
  );
  const progressBar = root.querySelector<HTMLElement>('[data-workflow="progress-bar"]');

  const stageCount = panels.length;
  if (stageCount < 2) return null;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: pinTarget,
      start: "top top",
      end: `+=${stageCount * 900}`,
      scrub: true,
      pin: pinTarget,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.set(panels, { opacity: 0, y: 16 });
  tl.set(panels[0], { opacity: 1, y: 0 });
  tl.set(descriptions, { opacity: 0, y: 8 });
  tl.set(descriptions[0], { opacity: 1, y: 0 });
  tl.set(dots, INACTIVE);
  tl.set(dots[0], ACTIVE);
  tl.set(connectors, { scaleY: 0 });
  if (progressBar) tl.set(progressBar, { width: `${(1 / stageCount) * 100}%` });

  const HOLD = 1;

  for (let i = 0; i < stageCount - 1; i++) {
    const next = i + 1;

    tl.to({}, { duration: HOLD });

    tl.to(panels[i], { opacity: 0, y: -16, duration: 0.6 }, ">");
    tl.to(descriptions[i], { opacity: 0, y: -8, duration: 0.4 }, "<");
    tl.to(dots[i], { ...INACTIVE, duration: 0.4 }, "<");
    tl.to(connectors[i], { scaleY: 1, duration: 0.6 }, "<");

    if (progressBar) {
      tl.to(
        progressBar,
        { width: `${((next + 1) / stageCount) * 100}%`, duration: 0.6, ease: "power2.out" },
        "<",
      );
    }

    tl.to(dots[next], { ...ACTIVE, duration: 0.4 }, "<+=0.1");
    tl.fromTo(
      panels[next],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      "<+=0.1",
    );
    tl.fromTo(
      descriptions[next],
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4 },
      "<+=0.15",
    );
  }

  tl.to({}, { duration: HOLD });

  return tl;
}
