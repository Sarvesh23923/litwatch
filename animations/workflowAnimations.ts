import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

function normalizeAngle(angle: number) {
  let a = angle % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

/**
 * Pins the workflow stage and scrubs one case through
 * Ingest → Classify → Draft → Track as the user scrolls. A ring of stage
 * icons physically rotates like a ferris wheel — whichever node lands in
 * the "active" slot (3 o'clock by default; pass `activeSlotAngle` to move
 * it, e.g. 90 for 6 o'clock) drives the info text, the stage panel and
 * the progress bar, all off the same scroll progress so nothing drifts
 * out of step.
 */
export function buildWorkflowPin(
  gsap: typeof GsapType,
  ScrollTrigger: typeof ScrollTriggerType,
  root: HTMLElement,
  pinTarget: HTMLElement,
  activeSlotAngle = 0,
) {
  const panels = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="panel"]'),
  );
  const infos = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="info"]'),
  );
  const wheel = root.querySelector<HTMLElement>('[data-workflow="wheel"]');
  const nodes = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="wheel-node"]'),
  );
  const nodeInners = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-workflow="wheel-node-inner"]'),
  );
  const progressBar = root.querySelector<HTMLElement>('[data-workflow="progress-bar"]');

  const stageCount = panels.length;
  if (stageCount < 2 || !wheel || nodes.length !== stageCount) return null;

  const step = 360 / stageCount;
  const baseAngles = nodes.map((_, i) => i * step);

  function render(progress: number) {
    const scrub = progress * (stageCount - 1);
    const index = Math.min(stageCount - 2, Math.floor(scrub));
    const t = scrub - index;
    const rotation = -scrub * step + activeSlotAngle;

    gsap.set(wheel!, { rotate: rotation });

    // Only the active node and its immediate neighbor on either side stay
    // visible — anything further round the wheel fades fully out over a
    // ramp (rather than snapping off) so a node sliding past the cutoff
    // eases away instead of popping, keeping at most three nodes on
    // screen at rest regardless of stage count.
    const neighborCutoff = (step / 180) * 1.5;
    const fadeWidth = (step / 180) * 0.5;

    nodes.forEach((node, i) => {
      const total = normalizeAngle(baseAngles[i] + rotation);
      const dist = Math.abs(normalizeAngle(total - activeSlotAngle)) / 180;
      const scale = gsap.utils.clamp(0.55, 1, 1 - dist * 0.75);
      const baseOpacity = gsap.utils.clamp(0.4, 1, 1 - dist * 0.65);
      const fade = gsap.utils.clamp(0, 1, (neighborCutoff - dist) / fadeWidth);
      const opacity = baseOpacity * fade;
      gsap.set(node, { scale, opacity });
      gsap.set(nodeInners[i], { rotate: -total });
    });

    // Hold each stage fully visible for most of its dwell and only blend
    // into the next one in the final stretch, so consecutive panels/info
    // blocks (which differ in height) don't sit double-exposed on top of
    // each other for the whole scroll segment.
    const crossStart = 0.72;
    const cross = gsap.utils.clamp(0, 1, (t - crossStart) / (1 - crossStart));

    panels.forEach((panel, i) => {
      let opacity = 0;
      let y = 16;
      if (i === index) {
        opacity = 1 - cross;
        y = -16 * cross;
      } else if (i === index + 1) {
        opacity = cross;
        y = 16 * (1 - cross);
      }
      gsap.set(panel, { opacity, y });
    });

    infos.forEach((info, i) => {
      let opacity = 0;
      let y = 8;
      if (i === index) {
        opacity = 1 - cross;
        y = -8 * cross;
      } else if (i === index + 1) {
        opacity = cross;
        y = 8 * (1 - cross);
      }
      gsap.set(info, { opacity, y });
    });

    if (progressBar) {
      const pct = ((index + 1 + t) / stageCount) * 100;
      gsap.set(progressBar, { width: `${pct}%` });
    }
  }

  render(0);

  // The active scrub only needs `activeDistance` of scroll to run through
  // every stage; the remaining `holdDistance` keeps the pin locked on the
  // fully-settled last stage so viewers get a beat to look at it before
  // the section releases into whatever comes next.
  const activeDistance = stageCount * 900;
  const holdDistance = 600;
  const totalDistance = activeDistance + holdDistance;

  const trigger = ScrollTrigger.create({
    trigger: pinTarget,
    start: "top top",
    end: `+=${totalDistance}`,
    scrub: true,
    pin: pinTarget,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const effective = Math.min(1, (self.progress * totalDistance) / activeDistance);
      render(effective);
    },
  });

  return trigger;
}
