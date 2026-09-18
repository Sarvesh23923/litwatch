"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  AiMagicIcon,
  CheckmarkCircle02Icon,
  Exchange01Icon,
  EyeIcon,
  FileSearchIcon,
  Flag01Icon,
  Idea01Icon,
  PencilEdit01Icon,
  ScanIcon,
  Tag01Icon,
  TextAlignLeftIcon,
  SparklesIcon,
  UserIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { buildAIControlScroll } from "@/animations/aiControlAnimations";

interface Capability {
  label: string;
  icon: IconSvgElement;
  description: string;
  /** Which "Handoff workflow" phase (0-indexed) this capability belongs to. */
  phase: 0 | 1 | 2;
}

const AI_ASSISTANCE: Capability[] = [
  { label: "Extract", icon: FileSearchIcon, description: "Pull key data from documents", phase: 0 },
  { label: "Classify", icon: Tag01Icon, description: "Categorize notice types", phase: 0 },
  { label: "Summarize", icon: TextAlignLeftIcon, description: "Create concise overviews", phase: 0 },
  { label: "Identify", icon: ScanIcon, description: "Detect critical issues", phase: 0 },
  { label: "Draft", icon: AiMagicIcon, description: "Generate initial responses", phase: 0 },
  { label: "Surface", icon: Idea01Icon, description: "Highlight insights", phase: 0 },
];

const CONSULTANT_CONTROL: Capability[] = [
  { label: "Review", icon: EyeIcon, description: "Verify AI suggestions", phase: 1 },
  { label: "Edit", icon: PencilEdit01Icon, description: "Refine the draft", phase: 1 },
  { label: "Approve", icon: CheckmarkCircle02Icon, description: "Final sign-off", phase: 2 },
  { label: "Override", icon: Exchange01Icon, description: "Change AI decisions", phase: 2 },
  { label: "Decide", icon: Flag01Icon, description: "Make final judgment", phase: 2 },
];

export function AIControlSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const root = rootRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      buildAIControlScroll(gsap, ScrollTrigger, root);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="ai-control" 
      ref={rootRef} 
      className="relative overflow-hidden border-y border-border bg-gradient-to-b from-white via-lavender-50/30 to-white py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 50%, rgba(55, 30, 113, 0.04) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(251, 146, 60, 0.04) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-lavender-100 to-cream-100 px-4 py-2 text-[14px] font-bold tracking-[0.14em] text-primary">
            <HugeiconsIcon icon={SparklesIcon} size={14} strokeWidth={2.5} />
            AI + human control
          </span>
        </div>

        <h2 className="max-w-[720px] text-[32px] font-bold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[40px] lg:text-[46px]">
          AI accelerates the work.{" "}
          <span className="text-primary">You stay in control.</span>
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-lavender-100 to-lavender-200">
                <HugeiconsIcon icon={SparklesIcon} size={16} strokeWidth={2} className="text-primary" />
              </div>
              <p className="text-[15px] font-bold tracking-[0.1em] text-primary">
                AI assistance
              </p>
            </div>
            <div className="space-y-3">
              {AI_ASSISTANCE.map((item) => (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoveredPhase(item.phase)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  className="group relative overflow-hidden rounded-lg border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lavender-50 transition-all group-hover:bg-lavender-100">
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        strokeWidth={2}
                        className="text-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-ink">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[12px] text-ink/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cream-100 to-cream-200">
                <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={2} className="text-secondary-dark" />
              </div>
              <p className="text-[15px] font-bold tracking-[0.1em] text-secondary-dark">
                Your control
              </p>
            </div>
            <div className="space-y-3">
              {CONSULTANT_CONTROL.map((item) => (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoveredPhase(item.phase)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  className="group relative overflow-hidden rounded-lg border border-secondary/20 bg-white p-4 transition-all hover:border-secondary/40 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream-50 transition-all group-hover:bg-cream-100">
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        strokeWidth={2}
                        className="text-secondary-dark"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-ink">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[12px] text-ink/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-secondary to-secondary-dark transition-all duration-300 group-hover:w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div data-control="visual" className="relative">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[13px] font-bold tracking-[0.1em] text-muted">
                  Handoff workflow
                </p>
                <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5">
                  <span className="text-[11px] font-medium text-muted">Scroll to animate</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} className="text-muted" />
                </div>
              </div>

              <div
                data-control="frame"
                className="relative overflow-hidden rounded-2xl border-2 border-border bg-white shadow-[0_4px_6px_rgba(24,21,31,0.04),0_40px_80px_-32px_rgba(24,21,31,0.25)] transition-all duration-500"
              >
                <div
                  data-control="progress-bar"
                  className="h-1 w-1/3 bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                />

                <div className="p-5 sm:p-8">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-lavender-100 to-cream-100">
                        <HugeiconsIcon icon={AiMagicIcon} size={20} strokeWidth={2} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-ink">
                          Reply draft — ABC Industries
                        </p>
                        <p className="text-[12px] text-ink/60">Section 73 notice</p>
                      </div>
                    </div>

                    <div className="relative h-[28px] w-[160px] shrink-0 sm:w-[180px]">
                      <span
                        data-control="tag"
                        data-stage="0"
                        className="absolute inset-y-0 right-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-lavender-100 px-3 py-1 text-[11px] font-bold text-primary shadow-sm"
                      >
                        <HugeiconsIcon icon={SparklesIcon} size={11} strokeWidth={2.5} />
                        AI-generated
                      </span>
                      <span
                        data-control="tag"
                        data-stage="1"
                        className="absolute inset-y-0 right-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-cream-100 px-3 py-1 text-[11px] font-bold text-secondary-dark shadow-sm"
                      >
                        <HugeiconsIcon icon={PencilEdit01Icon} size={11} strokeWidth={2.5} />
                        Edited by you
                      </span>
                      <span
                        data-control="tag"
                        data-stage="2"
                        className="absolute inset-y-0 right-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white shadow-sm"
                      >
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} strokeWidth={2.5} />
                        Approved
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-2.5 w-full rounded-full bg-neutral-100" />
                    <div className="relative">
                      <div className="h-2.5 w-[88%] rounded-full bg-neutral-100" />
                      <div
                        data-control="edit-overlay"
                        className="absolute inset-y-0 left-0 h-2.5 w-[60%] rounded-full bg-gradient-to-r from-cream-200 to-cream-100 shadow-sm"
                      />
                      <div
                        data-control="cursor"
                        className="absolute -right-6 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-secondary-dark text-white shadow-lg"
                      >
                        <HugeiconsIcon icon={PencilEdit01Icon} size={14} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="h-2.5 w-[70%] rounded-full bg-neutral-100" />
                    <div className="h-2.5 w-[82%] rounded-full bg-neutral-100" />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-neutral-50 p-4">
                    <div className="flex items-center gap-3">
                      <div
                        data-control="ai-badge"
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-lavender-100"
                      >
                        <HugeiconsIcon icon={SparklesIcon} size={18} strokeWidth={2} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-ink">AI confidence</p>
                        <p className="text-[11px] text-muted">Based on 2,400+ similar cases</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-200">
                        <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-primary to-secondary" />
                      </div>
                      <span className="text-[13px] font-bold text-primary">92%</span>
                    </div>
                  </div>
                </div>

                <div
                  data-control="approved-badge"
                  className="absolute -right-5 -top-5 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-primary text-white shadow-[0_8px_24px_-8px_rgba(55,30,113,0.4)]"
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} strokeWidth={2.5} />
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  { step: "1", label: "AI generates", icon: SparklesIcon, active: true },
                  { step: "2", label: "You review & edit", icon: PencilEdit01Icon, active: false },
                  { step: "3", label: "You approve", icon: CheckmarkCircle02Icon, active: false },
                ].map((phase, index) => (
                  <div
                    key={phase.step}
                    data-control="phase-indicator"
                    data-phase={phase.step}
                    className={`rounded-lg border p-4 transition-all ${
                      phase.active
                        ? "border-primary bg-lavender-50 shadow-sm"
                        : "border-border bg-white"
                    } ${
                      hoveredPhase === index
                        ? "scale-[1.04] ring-2 ring-secondary ring-offset-2"
                        : ""
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                          phase.active
                            ? "bg-primary text-white"
                            : "bg-neutral-200 text-muted"
                        }`}
                      >
                        {phase.step}
                      </div>
                      <HugeiconsIcon
                        icon={phase.icon}
                        size={16}
                        strokeWidth={2}
                        className={phase.active ? "text-primary" : "text-muted"}
                      />
                    </div>
                    <p
                      className={`text-[13px] font-semibold ${
                        phase.active ? "text-primary" : "text-ink/60"
                      }`}
                    >
                      {phase.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 max-w-[520px] text-[14px] leading-relaxed text-ink/65">
                AI prepares the first draft based on legal frameworks and past cases.
                You review, edit what needs changing, then approve — nothing goes out
                without your final sign-off.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}