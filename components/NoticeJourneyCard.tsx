"use client";

import { Fragment, useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
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

      {/* Stepper — two rows: Ingest→Analyse across the top, then Draft→Track
          underneath, centered under the top row. Both rows use the same
          flex-1-per-stage pattern so the connector lines stretch and read
          the same way in both rows. */}
      <div className="mb-8">
        <div className="flex items-center">
          {STAGES.slice(0, 4).map((stage, i, arr) => (
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
              {i < arr.length - 1 && (
                <div className="relative mx-2 mb-5 h-px flex-1 bg-border">
                  <div
                    data-journey="connector-fill"
                    className="absolute inset-0 h-px w-full origin-left scale-x-0 bg-primary"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Invisible spacer — kept in the DOM (rather than removed) so the
            connector-fill count still matches what the looping animation
            expects; it just reserves the vertical gap between rows. */}
        <div className="invisible h-4 w-px">
          <div data-journey="connector-fill" className="h-full w-px origin-top scale-y-0" />
        </div>

        {/* Row 2 visually reads right to left (Draft → Review → Track, so
            Draft sits on the right and Track on the left). The dots and
            connectors are flat siblings (not nested per-stage) so
            flex-row-reverse can mirror the whole sequence — including which
            side each connector fills from — without breaking the pairing
            between a connector and the dots on either side of it. DOM order
            stays in natural stage order (Draft, Review, Track) so the
            connector-fill elements still line up with the animation's
            stage indices. */}
        <div className="mx-auto flex w-3/4 flex-row-reverse items-center">
          {STAGES.slice(4).map((stage, i, arr) => (
            <Fragment key={stage.key}>
              <div className="flex flex-none flex-col items-center gap-2">
                <div
                  data-journey="dot"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-muted transition-colors"
                >
                  <HugeiconsIcon icon={stage.icon} size={14} strokeWidth={2} />
                </div>
                <span className="text-[10.5px] font-medium tracking-[0.06em] text-muted">
                  {stage.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className="relative mx-2 mb-5 h-px flex-1 bg-border">
                  <div
                    data-journey="connector-fill"
                    className="absolute inset-0 h-px w-full origin-right scale-x-0 bg-primary"
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>
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
            Notice type identified
          </div>
        </div>

        {/* Validate */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 0 }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">
              Reconciled with GST portal
            </p>
            <span className="rounded-[3px] bg-lavender-100 px-2 py-0.5 text-[10px] font-medium tracking-[0.06em] text-primary">
              92% match
            </span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Filed returns", ok: true },
              { label: "Turnover figures", ok: true },
              { label: "ITC claimed", ok: false },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-md border border-border bg-neutral-50 px-3 py-2"
              >
                <span className="text-[12px] font-medium text-ink/75">{row.label}</span>
                <span
                  className={`text-[11px] font-medium ${row.ok ? "text-secondary-dark" : "text-primary"}`}
                >
                  {row.ok ? "Match" : "Mismatch"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 0 }}>
          <p className="mb-4 text-[13px] font-medium text-ink">
            Risk assessment complete
          </p>
          <div className="flex items-center gap-3 rounded-md border border-border bg-neutral-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-primary">
              <HugeiconsIcon icon={ChartAnalysisIcon} size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink">Recovery risk: Medium</p>
              <p className="text-[11.5px] text-muted">
                3 similar cases resolved favorably
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] text-ink/55">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={1.8} className="text-primary" />
            Legal grounds for response identified
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

        {/* Review */}
        <div data-journey="panel" className="absolute inset-0" style={{ opacity: 0 }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">Approved by reviewer</p>
            <span className="rounded-[3px] bg-lavender-100 px-2 py-0.5 text-[10px] font-medium tracking-[0.06em] text-primary">
              Ready to file
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-border bg-neutral-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary">
              <HugeiconsIcon icon={UserCheck01Icon} size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink">Priya Sharma</p>
              <p className="text-[11.5px] text-muted">
                Consultant · Approved with no edits
              </p>
            </div>
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
