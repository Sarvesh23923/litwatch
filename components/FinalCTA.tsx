"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  LegalDocument01Icon,
  PencilEdit01Icon,
  Route02Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { revealOnScroll } from "@/animations/scrollReveal";
import { spawnRipple } from "@/animations/microInteractions";

const STAGES = [
  { label: "Ingest", icon: LegalDocument01Icon },
  { label: "Classify", icon: Tag01Icon },
  { label: "Draft", icon: PencilEdit01Icon },
  { label: "Track", icon: Route02Icon },
];

export function FinalCTA({ onRequestDemo }: { onRequestDemo: () => void }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const root = rootRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      revealOnScroll(gsap, ScrollTrigger, root, '[data-finalcta="item"]', { stagger: 0.08 });
    }, root);

    return () => ctx.revert();
  }, []);

  const handleCtaClick = (
    e: React.MouseEvent<HTMLElement>,
    tint: string,
    action?: () => void,
  ) => {
    const { gsap } = getGsap();
    spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, tint);
    action?.();
  };

  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 data-finalcta="item" className="text-[32px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[40px]">
            Ready for your AI co-pilot?
          </h2>
          <p data-finalcta="item" className="mt-4 text-[16px] leading-relaxed text-ink/60">
            Bring GST notice management into one controlled workflow.
          </p>

          <div data-finalcta="item" className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={(e) => handleCtaClick(e, "rgba(201,175,128,0.45)", onRequestDemo)}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[3px] bg-primary px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Request a demo
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              />
            </button>
            <a
              href="#workflow"
              onClick={(e) => handleCtaClick(e, "rgba(55,30,113,0.1)")}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[3px] border border-ink/15 px-6 py-3.5 text-[14.5px] font-medium text-ink transition-colors hover:border-primary hover:bg-lavender-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              See how it works
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        {/* Simplified workflow visual — no gradient background */}
        <div
          data-finalcta="item"
          className="mx-auto mt-16 flex max-w-[560px] items-center"
        >
          {STAGES.map((stage, i) => (
            <div key={stage.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-primary">
                  <HugeiconsIcon icon={stage.icon} size={18} strokeWidth={1.8} />
                </div>
                <span className="text-[11.5px] font-medium text-ink/60">{stage.label}</span>
              </div>
              {i < STAGES.length - 1 && (
                <div className="mx-2 mb-5 h-px flex-1 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
