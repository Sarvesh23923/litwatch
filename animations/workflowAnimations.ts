import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

const BUBBLE_ACTIVE = { scale: 1.6, backgroundColor: "#ebe5f6", color: "#371e71" };
const BUBBLE_INACTIVE = { scale: 1, backgroundColor: "#f3ead9", color: "#a88c5c" };

/**
 * Pins the workflow stage and scrubs one case through all 7 stages as the
 * user scrolls. The orbit ring rotates so the active stage's icon always
 * lands on the anchor point and grows into the "current" bubble, spinning
 * along with the ring, while the caption (the active stage's name, fixed
 * at that same anchor point), description copy, the progress bar and the
 * stage panel all stay in sync off the same timeline.
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
  const captions = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="caption"]'),
  );
  const descriptions = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="description"]'),
  );
  const progressBar = root.querySelector<HTMLElement>('[data-workflow="progress-bar"]');
  const orbitRing = root.querySelector<HTMLElement>('[data-workflow="orbit-ring"]');
  const orbitBubbles = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="orbit-bubble"]'),
  );

  const stageCount = panels.length;
  if (stageCount < 2) return null;

  const STEP = 360 / stageCount;

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
  tl.set(captions, { opacity: 0, y: 8 });
  tl.set(captions[0], { opacity: 1, y: 0 });
  tl.set(descriptions, { opacity: 0, y: 8 });
  tl.set(descriptions[0], { opacity: 1, y: 0 });
  if (orbitRing) tl.set(orbitRing, { rotation: 0 });
  if (orbitBubbles.length) {
    tl.set(orbitBubbles, BUBBLE_INACTIVE);
    tl.set(orbitBubbles[0], BUBBLE_ACTIVE);
  }
  if (progressBar) tl.set(progressBar, { width: `${(1 / stageCount) * 100}%` });

  const HOLD = 1;

  for (let i = 0; i < stageCount - 1; i++) {
    const next = i + 1;

    tl.to({}, { duration: HOLD });

    tl.to(panels[i], { opacity: 0, y: -16, duration: 0.6 }, ">");
    tl.to(captions[i], { opacity: 0, y: -8, duration: 0.4 }, "<");
    tl.to(descriptions[i], { opacity: 0, y: -8, duration: 0.4 }, "<");

    if (orbitRing) {
      tl.to(orbitRing, { rotation: -next * STEP, duration: 0.6, ease: "power2.out" }, "<");
    }
    if (orbitBubbles.length) {
      tl.to(orbitBubbles[i], { ...BUBBLE_INACTIVE, duration: 0.4 }, "<");
    }

    if (progressBar) {
      tl.to(
        progressBar,
        { width: `${((next + 1) / stageCount) * 100}%`, duration: 0.6, ease: "power2.out" },
        "<",
      );
    }

    if (orbitBubbles.length) {
      tl.to(orbitBubbles[next], { ...BUBBLE_ACTIVE, duration: 0.4 }, "<+=0.1");
    }
    tl.fromTo(
      panels[next],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      "<+=0.1",
    );
    tl.fromTo(
      captions[next],
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4 },
      "<+=0.15",
    );
    tl.fromTo(
      descriptions[next],
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4 },
      "<+=0.15",
    );
  }

  tl.to({}, { duration: HOLD });

  // Force the opening frame (all the tl.set(...) calls above) to paint
  // synchronously, then have ScrollTrigger re-measure and re-render this
  // specific trigger. Without this, a scrub-linked timeline's cumulative
  // state at time 0 can be left only partially painted (e.g. every stage
  // stuck looking inactive) until an actual scroll event forces GSAP's
  // normal update loop to run.
  tl.render(0, true, true);
  tl.scrollTrigger?.refresh();

  return tl;
}
