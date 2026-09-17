"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  LegalDocument01Icon,
  PencilEdit01Icon,
  Route02Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { buildJourneyLoop } from "@/animations/journeyAnimations";

const STAGES = [
  { key: "ingest", label: "Ingest", icon: LegalDocument01Icon },
  { key: "classify", label: "Classify", icon: Tag01Icon },
  { key: "draft", label: "Draft", icon: PencilEdit01Icon },
  { key: "track", label: "Track", icon: Route02Icon },
] as const;

export function NoticeJourneyCard() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const { gsap } = getGsap();
    const root = rootRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      const loop = buildJourneyLoop(gsap, root);
      return () => loop.kill();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      data-hero="frame"
      ref={rootRef}
      className="relative w-full rounded-lg border border-border bg-white p-6 shadow-[0_1px_2px_rgba(24,21,31,0.04),0_32px_64px_-28px_rgba(24,21,31,0.22)] lg:p-8"
    >
      {/* Persistent case identity — this is the same case throughout */}
      <div className="mb-7 flex items-center justify-between border-b border-border pb-5">
        <div>
          <p className="text-[13.5px] font-medium text-ink">
            ABC Industries
          </p>
          <p className="text-[12px] text-muted">Section 73 notice</p>
        </div>
        <span className="rounded-[3px] bg-lavender-100 px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] text-primary">
          Live case
        </span>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center">
        {STAGES.map((stage, i) => (
          <div key={stage.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                data-journey="dot"
                className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
                style={{
                  backgroundColor: i === 0 ? "#f4f1fb" : "#ffffff",
                  borderColor: i === 0 ? "#371e71" : "#e4e0e8",
                  color: i === 0 ? "#371e71" : "#6f6b78",
                }}
              >
                <HugeiconsIcon icon={stage.icon} size={14} strokeWidth={2} />
              </div>
              <span className="text-[10.5px] font-medium tracking-[0.06em] text-muted">
                {stage.label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className="relative mx-2 mb-5 h-px flex-1 bg-border">
                <div
                  data-journey="connector-fill"
                  className="absolute inset-y-0 left-0 h-px w-full origin-left scale-x-0 bg-primary"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stage content — stacked panels, cross-faded by GSAP */}
      <div className="relative h-[220px] sm:h-[196px]">
        {/* Ingest */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 1 }}>
          <p className="mb-4 text-[13px] font-medium text-ink">
            New notice detected
          </p>
          <div className="flex items-center gap-3 rounded-md border border-border bg-neutral-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-primary">
              <HugeiconsIcon icon={LegalDocument01Icon} size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-ink">
                Notice_ABC_Industries.pdf
              </p>
              <p className="text-[11.5px] text-muted">
                Source: Email · Received today, 10:42 AM
              </p>
            </div>
          </div>
        </div>

        {/* Classify */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 0 }}>
          <p className="mb-4 text-[13px] font-medium text-ink">
            Details extracted
          </p>
          <div className="flex flex-wrap gap-2">
            {["Section 73 notice", "CGST Range 4", "Deadline: 12 days"].map(
              (chip) => (
                <span
                  key={chip}
                  className="rounded-[3px] border border-border bg-neutral-50 px-2.5 py-1.5 text-[12px] font-medium text-ink/75"
                >
                  {chip}
                </span>
              ),
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] text-ink/55">
            <HugeiconsIcon icon={Tag01Icon} size={13} strokeWidth={1.8} className="text-primary" />
            Matched against GST portal filings
          </div>
        </div>

        {/* Draft */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 0 }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">
              Draft reply generated
            </p>
            <span className="rounded-[3px] bg-lavender-100 px-2 py-0.5 text-[10px] font-medium tracking-[0.06em] text-primary">
              AI-assisted
            </span>
          </div>
          <div className="space-y-2 rounded-md border border-border bg-neutral-50 p-4">
            <span className="block h-1.5 w-full rounded-full bg-white" />
            <span className="block h-1.5 w-[90%] rounded-full bg-white" />
            <span className="block h-1.5 w-[65%] rounded-full bg-white" />
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-secondary-dark">
            <HugeiconsIcon icon={PencilEdit01Icon} size={13} strokeWidth={1.8} />
            Awaiting your review
          </div>
        </div>

        {/* Track */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 0 }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">Case tracked</p>
            <span className="rounded-[3px] bg-neutral-100 px-2 py-0.5 text-[10px] font-medium tracking-[0.06em] text-ink/70">
              In progress
            </span>
          </div>
          <div className="flex items-center">
            {[
              { label: "Hearing", done: true },
              { label: "Response", done: false, current: true },
              { label: "Order", done: false },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      step.done
                        ? "border-primary bg-primary text-white"
                        : step.current
                          ? "border-primary bg-white text-primary"
                          : "border-border bg-white text-muted"
                    }`}
                  >
                    {step.done && (
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} strokeWidth={2.4} />
                    )}
                  </div>
                  <span className="text-[10.5px] font-medium text-ink/65">
                    {step.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className={`mx-2 mb-4 h-px flex-1 ${step.done ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
