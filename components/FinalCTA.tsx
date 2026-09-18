"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  ChartAnalysisIcon,
  DocumentValidationIcon,
  LegalDocument01Icon,
  PencilEdit01Icon,
  Route02Icon,
  Tag01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { revealOnScroll } from "@/animations/scrollReveal";
import { spawnRipple } from "@/animations/microInteractions";

const STAGES = [
  { label: "Ingest", icon: LegalDocument01Icon },
  { label: "Classify", icon: Tag01Icon },
  { label: "Validate", icon: DocumentValidationIcon },
  { label: "Analyse", icon: ChartAnalysisIcon },
  { label: "Draft", icon: PencilEdit01Icon },
  { label: "Review", icon: UserCheck01Icon },
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
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div
          data-finalcta="item"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 75%)",
            }}
          />

          <div className="relative mx-auto max-w-[640px]">
            <span className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.14em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Get started
            </span>
            <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.015em] text-white sm:text-[40px]">
              Ready for your AI co-pilot?
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/70">
              Bring GST notice management into one controlled workflow.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={(e) => handleCtaClick(e, "rgba(201,175,128,0.45)", onRequestDemo)}
                className="group relative inline-flex h-[39px] items-center gap-[10px] overflow-hidden rounded-[11.7px] bg-white px-[15px] py-[10px] text-[14.5px] font-medium text-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
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
                onClick={(e) => handleCtaClick(e, "rgba(255,255,255,0.25)")}
                className="group relative inline-flex h-[39px] items-center gap-[10px] overflow-hidden rounded-[11.7px] border border-white/25 px-[15px] py-[10px] text-[14.5px] font-medium text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
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

          <div className="relative mx-auto mt-16 flex max-w-[720px] flex-wrap items-start justify-center gap-y-6">
            {STAGES.map((stage, i) => (
              <div key={stage.label} className="flex items-start">
                <div className="flex w-14 flex-col items-center gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm sm:h-14 sm:w-14">
                    <HugeiconsIcon icon={stage.icon} size={20} strokeWidth={1.6} />
                  </div>
                  <span className="text-center text-[11px] font-medium leading-tight text-white/60">
                    {stage.label}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div className="mt-5 h-px w-6 shrink-0 bg-white/15 sm:mt-7 sm:w-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
