import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export function buildAIControlScroll(
  gsap: typeof GsapType,
  ScrollTrigger: typeof ScrollTriggerType,
  root: HTMLElement,
) {
  const visual = root.querySelector<HTMLElement>('[data-control="visual"]');
  const frame = root.querySelector('[data-control="frame"]');
  const tags = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-control="tag"]'),
  );
  const phaseIndicators = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-control="phase-indicator"]'),
  );
  const editOverlay = root.querySelector('[data-control="edit-overlay"]');
  const cursor = root.querySelector('[data-control="cursor"]');
  const approvedBadge = root.querySelector('[data-control="approved-badge"]');
  const progressBar = root.querySelector('[data-control="progress-bar"]');
  const aiBadge = root.querySelector('[data-control="ai-badge"]');

  if (!visual || tags.length < 3) return null;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top 60%",
      end: "bottom 40%",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  gsap.set(tags, { opacity: 0, scale: 0.9, y: 4 });
  gsap.set(tags[0], { opacity: 1, scale: 1, y: 0 });
  gsap.set(editOverlay, { opacity: 0, scaleX: 0, transformOrigin: "left" });
  gsap.set(cursor, { opacity: 0, scale: 0.5, rotate: -20 });
  gsap.set(approvedBadge, { opacity: 0, scale: 0.5, rotate: -180 });
  gsap.set(frame, { borderColor: "#e4e0e8" });
  
  phaseIndicators.forEach((indicator, i) => {
    if (i > 0) {
      gsap.set(indicator, {
        borderColor: "#e4e0e8",
        backgroundColor: "#ffffff",
      });
    }
  });

  // Stage 1: AI Generated → Edited
  tl.addLabel("edited", 1);

  tl.to(tags[0], { 
    opacity: 0, 
    scale: 0.9, 
    y: -4,
    duration: 0.4,
    ease: "power2.in"
  }, "edited");

  tl.to(tags[1], { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    duration: 0.5,
    ease: "back.out(1.5)"
  }, "edited+=0.1");

  tl.to(editOverlay, { 
    opacity: 1, 
    scaleX: 1,
    duration: 0.6,
    ease: "power2.out"
  }, "edited+=0.2");

  tl.to(cursor, { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    duration: 0.5,
    ease: "back.out(1.7)"
  }, "edited+=0.3");

  tl.to(aiBadge, {
    scale: 0.95,
    duration: 0.3,
    ease: "power2.inOut"
  }, "edited+=0.2");

  if (progressBar) {
    tl.to(progressBar, {
      width: "66%",
      duration: 0.6,
      ease: "power2.out"
    }, "edited");
  }

  tl.to(phaseIndicators[0], {
    borderColor: "#e4e0e8",
    backgroundColor: "#ffffff",
    duration: 0.4
  }, "edited");

  tl.to(phaseIndicators[1], {
    borderColor: "#371e71",
    backgroundColor: "#f4f1fb",
    duration: 0.5,
    ease: "power2.out"
  }, "edited+=0.2");

  // Stage 2: Edited → Approved
  tl.addLabel("approved", 2.2);

  tl.to(tags[1], { 
    opacity: 0, 
    scale: 0.9, 
    y: -4,
    duration: 0.4,
    ease: "power2.in"
  }, "approved");

  tl.to(tags[2], { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    duration: 0.5,
    ease: "back.out(1.5)"
  }, "approved+=0.1");

  tl.to(cursor, { 
    opacity: 0, 
    scale: 0.5,
    rotate: 20,
    duration: 0.4,
    ease: "power2.in"
  }, "approved");

  tl.to(frame, { 
    borderColor: "#371e71",
    duration: 0.6,
    ease: "power2.out"
  }, "approved+=0.1");

  tl.to(approvedBadge, { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    duration: 0.7,
    ease: "elastic.out(1, 0.6)"
  }, "approved+=0.2");

  if (progressBar) {
    tl.to(progressBar, {
      width: "100%",
      duration: 0.7,
      ease: "power2.out"
    }, "approved");
  }

  tl.to(phaseIndicators[1], {
    borderColor: "#e4e0e8",
    backgroundColor: "#ffffff",
    duration: 0.4
  }, "approved");

  tl.to(phaseIndicators[2], {
    borderColor: "#371e71",
    backgroundColor: "#f4f1fb",
    duration: 0.5,
    ease: "power2.out"
  }, "approved+=0.2");

  tl.to(aiBadge, {
    scale: 1,
    duration: 0.4,
    ease: "power2.out"
  }, "approved+=0.3");

  tl.to({}, { duration: 0.8 });

  return tl;
}