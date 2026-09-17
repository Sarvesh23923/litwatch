"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Activity01Icon,
  ChartLineData01Icon,
  EyeIcon,
  FolderLibraryIcon,
  PencilEdit01Icon,
  Route02Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { revealOnScroll } from "@/animations/scrollReveal";

interface Pillar {
  title: string;
  description: string;
  icon: IconSvgElement;
}

const PILLARS: Pillar[] = [
  {
    title: "Structured workflows",
    description: "Every notice follows the same clear path from ingestion to resolution.",
    icon: Route02Icon,
  },
  {
    title: "Human review",
    description: "Nothing is sent without a consultant reviewing it first.",
    icon: EyeIcon,
  },
  {
    title: "Editable drafts",
    description: "AI drafts are a starting point — every word stays editable.",
    icon: PencilEdit01Icon,
  },
  {
    title: "Traceable actions",
    description: "Every edit, approval and override is part of the case record.",
    icon: Activity01Icon,
  },
  {
    title: "Organized case history",
    description: "Every notice, response and order stays attached to its case.",
    icon: FolderLibraryIcon,
  },
  {
    title: "Centralized visibility",
    description: "One view of every client and every notice, always current.",
    icon: ChartLineData01Icon,
  },
];

export function TrustSection() {
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
      revealOnScroll(gsap, ScrollTrigger, root, '[data-trust="item"]', { stagger: 0.06 });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="trust" ref={rootRef} className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <span className="mb-5 inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.14em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          For consultants
        </span>
        <h2 className="max-w-[720px] text-[32px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[38px] lg:text-[42px]">
          Built for professionals who need clarity, control and
          accountability.
        </h2>

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} data-trust="item" className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-primary">
                <HugeiconsIcon icon={pillar.icon} size={16} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[15px] font-medium text-ink">{pillar.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink/60">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
