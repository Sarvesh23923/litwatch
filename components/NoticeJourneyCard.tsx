"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert01Icon,
  ChartAnalysisIcon,
  CheckmarkCircle02Icon,
  DocumentValidationIcon,
  LegalDocument01Icon,
  PencilEdit01Icon,
  Route02Icon,
  Tag01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { buildJourneyLoop } from "@/animations/journeyAnimations";

const STAGES = [
  { key: "ingest", label: "Ingest", icon: LegalDocument01Icon },
  { key: "classify", label: "Classify", icon: Tag01Icon },
  { key: "validate", label: "Validate", icon: DocumentValidationIcon },
  { key: "analyse", label: "Analyse", icon: ChartAnalysisIcon },
  { key: "draft", label: "Draft", icon: PencilEdit01Icon },
  { key: "review", label: "Review", icon: UserCheck01Icon },
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
      <div className="mb-8 flex items-start">
        {STAGES.map((stage, i) => (
          <div key={stage.key} className="flex flex-1 items-start last:flex-none">
            <div className="flex w-[38px] flex-col items-center gap-1.5">
              <div
                data-journey="dot"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors"
                style={{
                  backgroundColor: i === 0 ? "#f4f1fb" : "#ffffff",
                  borderColor: i === 0 ? "#371e71" : "#e4e0e8",
                  color: i === 0 ? "#371e71" : "#6f6b78",
                }}
              >
                <HugeiconsIcon icon={stage.icon} size={11} strokeWidth={2} />
              </div>
              <span className="text-center text-[9px] font-medium leading-tight tracking-[0.04em] text-muted">
                {stage.label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className="relative mx-1 mt-3 h-px flex-1 bg-border">
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
      <div className="relative h-[180px] sm:h-[168px]">
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

        {/* Validate */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 0 }}>
          <p className="mb-4 text-[13px] font-medium text-ink">
            Checked against filings
          </p>
          <div className="space-y-2">
            {[
              { label: "GSTR-3B filings", ok: true },
              { label: "ITC ledger", ok: false },
            ].map((check) => (
              <div
                key={check.label}
                className="flex items-center justify-between rounded-md border border-border bg-neutral-50 px-3 py-2.5"
              >
                <span className="text-[12.5px] font-medium text-ink">
                  {check.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-semibold ${
                    check.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  <HugeiconsIcon
                    icon={check.ok ? CheckmarkCircle02Icon : Alert01Icon}
                    size={10}
                    strokeWidth={2}
                  />
                  {check.ok ? "Matched" : "Discrepancy"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 0 }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">
              Discrepancy flagged
            </p>
            <span className="rounded-[3px] bg-lavender-100 px-2 py-0.5 text-[10px] font-medium tracking-[0.06em] text-primary">
              1 area
            </span>
          </div>
          <div className="flex items-start gap-2.5 rounded-md border border-border bg-neutral-50 p-4">
            <span className="mt-0.5 shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[9.5px] font-semibold text-red-700">
              High
            </span>
            <p className="text-[12px] leading-relaxed text-ink/75">
              ITC mismatch of ₹1,24,000 in Q3 filing
            </p>
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
            Ready for review
          </div>
        </div>

        {/* Review */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 0 }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">
              Awaiting approval
            </p>
            <span className="rounded-[3px] bg-lavender-100 px-2 py-0.5 text-[10px] font-medium tracking-[0.06em] text-primary">
              Consultant review
            </span>
          </div>
          <div className="space-y-2 rounded-md border border-border bg-neutral-50 p-4">
            <span className="block h-1.5 w-full rounded-full bg-white" />
            <span className="block h-1.5 w-[90%] rounded-full bg-white" />
            <span className="block h-1.5 w-[65%] rounded-full bg-white" />
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-secondary-dark">
            <HugeiconsIcon icon={UserCheck01Icon} size={13} strokeWidth={1.8} />
            Edited and approved
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
