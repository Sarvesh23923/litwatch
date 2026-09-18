import type { gsap as GsapType } from "gsap";

const HOLD = 1.9;

/**
 * A looping, self-playing sequence: one notice moving through every stage
 * (Ingest → Classify → Validate → Analyse → Draft → Review → Track) inside
 * a single card. Panels are stacked (absolute) and cross-fade; the
 * stepper's connector lines fill in sync so the stepper and the content
 * always agree on what stage is "active".
 */
export function buildJourneyLoop(gsap: typeof GsapType, root: HTMLElement) {
  const panels = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-journey="panel"]'),
  );
  const dots = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-journey="dot"]'),
  );
  const connectors = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-journey="connector-fill"]'),
  );

  const STAGE_COUNT = panels.length;

  if (STAGE_COUNT < 2 || dots.length !== STAGE_COUNT) {
    return gsap.timeline();
  }

  const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } });

  // Reset to a clean stage-0 state at the top of every loop.
  tl.set(panels, { opacity: 0, y: 10 });
  tl.set(panels[0], { opacity: 1, y: 0 });
  tl.set(dots, { backgroundColor: "#ffffff", borderColor: "#e4e0e8", color: "#6f6b78" });
  tl.set(dots[0], { backgroundColor: "#f4f1fb", borderColor: "#371e71", color: "#371e71" });
  tl.set(connectors, { scaleX: 0 });

  for (let i = 0; i < STAGE_COUNT; i++) {
    tl.to({}, { duration: HOLD }); // hold on the current stage

    const next = (i + 1) % STAGE_COUNT;
    const label = `stage${next}`;
    tl.addLabel(label);

    tl.to(panels[i], { opacity: 0, y: -10, duration: 0.4 }, label);
    tl.to(
      dots[i],
      { backgroundColor: "#ffffff", borderColor: "#e4e0e8", color: "#6f6b78", duration: 0.4 },
      label,
    );

    if (next !== 0) {
      // moving forward — fill the connector we're leaving
      tl.to(connectors[i], { scaleX: 1, duration: 0.5 }, label);
    } else {
      // looping back to the start — collapse all connectors together
      tl.to(connectors, { scaleX: 0, duration: 0.4 }, label);
    }

    tl.to(
      dots[next],
      { backgroundColor: "#f4f1fb", borderColor: "#371e71", color: "#371e71", duration: 0.4 },
      `${label}+=0.1`,
    );
    tl.fromTo(
      panels[next],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      `${label}+=0.15`,
    );
  }

  return tl;
}
