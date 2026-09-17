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

const STATS = [
  { value: "100%", label: "of drafts reviewed by a consultant before they go out" },
  { value: "0", label: "notices sent without a human sign-off" },
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
        <span className="mb-2 inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.14em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          For consultants
        </span>
        <h2 className="max-w-[720px] text-[32px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[38px] lg:text-[42px]">
          Built for professionals who need clarity, control and
          accountability.
        </h2>

        <div className="mt-14 grid grid-cols-12 gap-6">
          <div
            data-trust="item"
            className="relative col-span-12 flex flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-secondary to-secondary-dark p-8 text-ink lg:col-span-4"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(24,21,31,0.07) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                maskImage:
                  "radial-gradient(ellipse 90% 90% at 100% 0%, black 0%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 90% 90% at 100% 0%, black 0%, transparent 70%)",
              }}
            />
            <div className="relative flex flex-col gap-7">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-[40px] font-semibold leading-none tracking-[-0.02em]">
                    {stat.value}
                  </p>
                  <p className="mt-2 max-w-[240px] text-[13.5px] leading-relaxed text-ink/65">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="relative mt-8 border-t border-ink/10 pt-5 text-[13px] leading-relaxed text-ink/55">
              Litwatch drafts, tracks and organizes. You stay the one making
              the call.
            </p>
          </div>

          <div
            data-trust="item"
            className="col-span-12 overflow-hidden rounded-lg border border-border bg-white lg:col-span-8"
          >
            <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
              {PILLARS.map((pillar, i) => (
                <div
                  key={pillar.title}
                  className={`flex gap-4 p-6 transition-colors hover:bg-lavender-50/40 ${
                    i % 2 === 0 ? "sm:border-r sm:border-border" : ""
                  } ${i < PILLARS.length - 2 ? "sm:border-b sm:border-border" : ""}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lavender-50 text-primary">
                    <HugeiconsIcon icon={pillar.icon} size={18} strokeWidth={1.8} />
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
        </div>
      </div>
    </section>
  );
}
