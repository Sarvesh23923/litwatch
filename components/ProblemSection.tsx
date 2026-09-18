"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Alert01Icon,
  Calendar01Icon,
  CloudIcon,
  FlashIcon,
  LegalDocument01Icon,
  Mail01Icon,
  SheetIcon,
  UserAccountIcon,
  AlertDiamondIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { buildProblemScroll } from "@/animations/problemAnimations";

interface Fragment {
  key: string;
  label: string;
  icon: IconSvgElement;
  top: number;
  left: number;
  rotate: number;
  dx: number;
  dy: number;
  color: string;
  badge?: string;
}

const FRAGMENTS: Fragment[] = [
  { 
    key: "email", 
    label: "Email notice", 
    icon: Mail01Icon, 
    top: 20, 
    left: 8, 
    rotate: -9, 
    dx: 214, 
    dy: 158,
    color: "text-blue-600",
    badge: "Unread"
  },
  { 
    key: "portal", 
    label: "GST portal", 
    icon: CloudIcon, 
    top: 26, 
    left: 428, 
    rotate: 7, 
    dx: -204, 
    dy: 152,
    color: "text-purple-600",
    badge: "3 new"
  },
  { 
    key: "sheet", 
    label: "Spreadsheet", 
    icon: SheetIcon, 
    top: 356, 
    left: 4, 
    rotate: 5, 
    dx: 218, 
    dy: -178,
    color: "text-green-600"
  },
  { 
    key: "notice", 
    label: "Notice PDF", 
    icon: LegalDocument01Icon, 
    top: 366, 
    left: 432, 
    rotate: -6, 
    dx: -212, 
    dy: -188,
    color: "text-red-600",
    badge: "Urgent"
  },
  { 
    key: "deadline", 
    label: "Due: 2 days", 
    icon: Calendar01Icon, 
    top: 0, 
    left: 220, 
    rotate: 3, 
    dx: 4, 
    dy: 178,
    color: "text-orange-600",
    badge: "Due soon"
  },
  { 
    key: "client", 
    label: "Client record", 
    icon: UserAccountIcon, 
    top: 392, 
    left: 220, 
    rotate: -4, 
    dx: 4, 
    dy: -220,
    color: "text-indigo-600"
  },
];

const PROBLEMS = [
  {
    index: "01",
    title: "Portal hopping",
    body: "Notices arrive through email, GST portal, uploads and other channels.",
    icon: CloudIcon,
    stat: "4+ channels",
  },
  {
    index: "02",
    title: "Deadline pressure",
    body: "Important response dates can be buried inside documents while the clock keeps moving.",
    icon: AlertDiamondIcon,
    stat: "15-30 days",
  },
  {
    index: "03",
    title: "Manual analysis",
    body: "Reading notices, checking figures and understanding the officer's grounds takes time.",
    icon: Loading03Icon,
    stat: "3-5 hours",
  },
  {
    index: "04",
    title: "No central view",
    body: "When managing multiple clients, it can be difficult to see every active notice and pending action.",
    icon: LegalDocument01Icon,
    stat: "50+ clients",
  },
];

export function ProblemSection() {
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const visualWrapRef = useRef<HTMLDivElement>(null);
  const [visualScale, setVisualScale] = useState(1);

  useEffect(() => {
    if (!rootRef.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const root = rootRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      buildProblemScroll(gsap, ScrollTrigger, root);
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const nextScale =
        width < 420 ? 0.62 : width < 520 ? 0.72 : width < 768 ? 0.82 : 1;
      setVisualScale(nextScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <section
      id="problem"
      ref={rootRef}
      className="relative overflow-hidden border-y border-border bg-gradient-to-b from-lavender-50 via-lavender-50/50 to-white py-16 sm:py-20 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(251, 146, 60, 0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:mb-10 lg:mb-12">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.14em] text-muted sm:text-[14px]">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              The problem
            </span>

            <h2 className="max-w-[760px] text-[28px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[32px] lg:text-[42px]">
              GST notices shouldn&apos;t live in scattered inboxes, portals and
              spreadsheets.
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="grid gap-3 sm:gap-4 lg:gap-5">
              {PROBLEMS.map((problem, index) => (
                <div
                  key={problem.index}
                  className="group relative overflow-hidden rounded-lg border border-border bg-white p-4 shadow-[0_1px_3px_rgba(24,21,31,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_-8px_rgba(24,21,31,0.12)] hover:border-primary/30 sm:p-5 lg:p-6"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute right-3 top-3 flex items-center gap-2 sm:right-4 sm:top-4">
                    <span className="hidden rounded-full bg-lavender-100 px-2.5 py-1 text-[11px] font-semibold text-primary sm:inline-flex">
                      {problem.stat}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-lavender-100 to-cream-100 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
                      <HugeiconsIcon
                        icon={problem.icon}
                        size={16}
                        strokeWidth={2}
                        className="text-primary sm:text-[18px]"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="text-[11px] font-bold text-secondary-dark">
                          {problem.index}
                        </span>
                        <h3 className="text-[15px] font-semibold text-ink sm:text-[16px]">
                          {problem.title}
                        </h3>
                      </div>
                      <p className="text-[12.5px] leading-relaxed text-ink/65 sm:text-[13.5px]">
                        {problem.body}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50/50 p-3 sm:mt-6 sm:p-4">
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={FlashIcon}
                  size={16}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-orange-600 sm:text-[18px]"
                />
                <div>
                  <p className="text-[12.5px] font-medium text-orange-900 sm:text-[13px]">
                    The cost of chaos
                  </p>
                  <p className="mt-1 text-[11.5px] text-orange-800/70 sm:text-[12px]">
                    Tax consultants spend 40% of their time just organizing information before they can even start working on responses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:col-span-7">
            <div
              ref={visualWrapRef}
              className="relative flex w-full max-w-[680px] items-center justify-center overflow-hidden"
              style={{
                minHeight: visualScale < 1 ? `${Math.round(520 * visualScale)}px` : undefined,
              }}
            >
              <div
                ref={visualRef}
                data-problem="visual"
                className="relative aspect-[680/520] w-full max-w-[680px] shrink-0 origin-center"
                style={{
                  transform: `scale(${visualScale})`,
                  transformOrigin: "center center",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
                  }}
                />

              {FRAGMENTS.map((frag) => (
                <div
                  key={frag.key}
                  data-problem="fragment"
                  data-dx={frag.dx}
                  data-dy={frag.dy}
                  style={{
                    top: `${(frag.top / 520) * 100}%`,
                    left: `${(frag.left / 680) * 100}%`,
                    transform: `rotate(${frag.rotate}deg)`,
                    width: "clamp(110px, 27vw, 190px)",
                  }}
                  className="absolute flex items-center gap-3 rounded-lg border border-border bg-white px-3 py-2 shadow-[0_4px_12px_-4px_rgba(24,21,31,0.1),0_20px_40px_-20px_rgba(24,21,31,0.15)] backdrop-blur-sm transition-shadow hover:shadow-[0_8px_24px_-8px_rgba(24,21,31,0.2)] sm:px-4 sm:py-3.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-neutral-50 to-neutral-100">
                    <HugeiconsIcon
                      icon={frag.icon}
                      size={18}
                      strokeWidth={1.8}
                      className={frag.color}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate text-[11.5px] font-medium text-ink sm:text-[13px]">
                      {frag.label}
                    </span>
                    {frag.badge && (
                      <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[8px] font-semibold text-red-700 sm:text-[9px]">
                        <HugeiconsIcon icon={Alert01Icon} size={9} strokeWidth={2.4} />
                        {frag.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div
                className="absolute flex items-center justify-center"
                style={{ top: "32.7%", left: "29.4%", width: "41.2%", height: "34.6%" }}
              >
                <div
                  data-problem="target-outline"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-lavender-50/30"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary/40" />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary/40" style={{ animationDelay: "0.2s" }} />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary/40" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <span className="text-[12px] font-medium text-primary/50">
                    Centralizing...
                  </span>
                </div>
                <div
                  data-problem="target-solid"
                  className="absolute inset-0 flex scale-95 flex-col items-center justify-center gap-4 rounded-xl border-2 border-primary bg-gradient-to-br from-white to-lavender-50 opacity-0 shadow-[0_24px_48px_-24px_rgba(55,30,113,0.4),0_0_0_1px_rgba(55,30,113,0.08)_inset]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo.svg" alt="Litwatch" className="h-11 w-auto" />
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-[12px] font-medium text-green-700">
                      All notices unified
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-6 rounded-full border border-border bg-white/90 px-5 py-2.5 shadow-[0_8px_16px_-8px_rgba(24,21,31,0.15)] backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-muted">Before:</span>
                    <span className="text-[13px] font-semibold text-red-600">Chaos</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-muted">After:</span>
                    <span className="text-[13px] font-semibold text-primary">Clarity</span>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}