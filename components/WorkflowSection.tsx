"use client";

import { useEffect, useRef, useState } from "react";
import type { gsap as GsapType } from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  AiMagicIcon,
  ArrowRight02Icon,
  ChartAnalysisIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CloudIcon,
  DocumentValidationIcon,
  Exchange01Icon,
  FolderLibraryIcon,
  LegalDocument01Icon,
  Mail01Icon,
  PencilEdit01Icon,
  Route02Icon,
  Tag01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { buildWorkflowPin } from "@/animations/workflowAnimations";
import { spawnRipple } from "@/animations/microInteractions";

interface Stage {
  key: string;
  number: string;
  label: string;
  icon: IconSvgElement;
  description: string;
}

const STAGES: Stage[] = [
  {
    key: "ingest",
    number: "01",
    label: "Ingest",
    icon: LegalDocument01Icon,
    description:
      "Notices arrive from email, the GST portal, or cloud storage — Litwatch pulls them into one place automatically.",
  },
  {
    key: "classify",
    number: "02",
    label: "Classify",
    icon: Tag01Icon,
    description:
      "AI reads the notice, identifies its type, and extracts the dates and GST details that matter.",
  },
  {
    key: "validate",
    number: "03",
    label: "Validate",
    icon: DocumentValidationIcon,
    description:
      "Notice data is reconciled against your GST portal filings, flagging matches and mismatches before you act.",
  },
  {
    key: "analyse",
    number: "04",
    label: "Analyse",
    icon: ChartAnalysisIcon,
    description:
      "AI assesses recovery risk and surfaces the legal grounds and precedents relevant to your response.",
  },
  {
    key: "draft",
    number: "05",
    label: "Draft",
    icon: PencilEdit01Icon,
    description:
      "A draft reply is generated using legal and rule-based reasoning, then routed to you for review, edits and approval.",
  },
  {
    key: "review",
    number: "06",
    label: "Review",
    icon: UserCheck01Icon,
    description:
      "Your reviewer approves, edits or overrides the draft before it's ever sent.",
  },
  {
    key: "track",
    number: "07",
    label: "Track",
    icon: Route02Icon,
    description:
      "Hearings, orders, payments and appeals stay tracked in one timeline, end to end.",
  },
];

// Orbit geometry: icons sit evenly spaced on a fixed-size ring. On wide
// screens only the right half of that ring is ever shown (clipped into a
// half-moon), so exactly 3 icons are visible at a time: the active one at
// "3 o'clock", with the previous and next stages above and below it.
// Below the lg breakpoint (a "vertical" layout, stacked instead of
// side-by-side) the clip is dropped and the anchor moves to "12 o'clock",
// showing the full ring with all 7 stages at once.
const ORBIT_SIZE = 300;
const ORBIT_SIZE_COMPACT = 240;

function orbitAnchor(radius: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
}

function StageBody({ stageKey }: { stageKey: string }) {
  if (stageKey === "ingest") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-ink">
            New notice detected
          </p>
          <span className="rounded-[3px] bg-neutral-100 px-2.5 py-1 text-[10.5px] font-medium tracking-[0.06em] text-ink/60">
            Auto-captured
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {[
            { label: "Email", icon: Mail01Icon, active: true },
            { label: "GST portal", icon: CloudIcon, active: false },
            { label: "Cloud storage", icon: FolderLibraryIcon, active: false },
          ].map((source) => (
            <span
              key={source.label}
              className={`inline-flex items-center gap-1.5 rounded-[3px] border px-3 py-1.5 text-[12.5px] font-medium ${
                source.active
                  ? "border-primary bg-lavender-50 text-primary"
                  : "border-border bg-white text-ink/50"
              }`}
            >
              <HugeiconsIcon icon={source.icon} size={14} strokeWidth={1.8} />
              {source.label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 rounded-md border border-border bg-neutral-50 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dark text-white">
            <HugeiconsIcon icon={LegalDocument01Icon} size={22} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <p className="text-[14.5px] font-medium text-ink">
              Notice_ABC_Industries.pdf
            </p>
            <p className="mt-1 text-[12.5px] text-muted">
              Client: ABC Industries · Received today, 10:42 AM
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (stageKey === "classify") {
    const fields = [
      { label: "Notice type", value: "Section 73" },
      { label: "Issuing authority", value: "CGST Range 4" },
      { label: "Deadline", value: "12 days" },
    ];

    return (
      <div className="space-y-5">
        <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-gradient-to-r from-lavender-100 to-cream-100 px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] text-primary">
          <HugeiconsIcon icon={AiMagicIcon} size={12} strokeWidth={2} />
          AI classification complete
        </span>

        <div className="grid grid-cols-3 gap-3">
          {fields.map((field) => (
            <div
              key={field.label}
              className="rounded-md border border-border bg-neutral-50 p-4"
            >
              <p className="text-[10.5px] font-medium tracking-[0.06em] text-muted">
                {field.label}
              </p>
              <p className="mt-1.5 text-[14px] font-medium text-ink">
                {field.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-ink/55">
          <HugeiconsIcon icon={Tag01Icon} size={14} strokeWidth={1.8} className="text-primary" />
          Notice type identified · ready for reconciliation
        </div>
      </div>
    );
  }

  if (stageKey === "validate") {
    const rows = [
      { label: "Filed returns", ok: true },
      { label: "Turnover figures", ok: true },
      { label: "ITC claimed", ok: false },
    ];

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-ink">
            Reconciled with GST portal
          </p>
          <span className="rounded-[3px] bg-lavender-100 px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] text-primary">
            92% match
          </span>
        </div>

        <div className="space-y-2.5">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-md border border-border bg-neutral-50 p-4"
            >
              <span className="text-[13.5px] font-medium text-ink/75">{row.label}</span>
              <span
                className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium ${
                  row.ok ? "text-secondary-dark" : "text-primary"
                }`}
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={14}
                  strokeWidth={1.8}
                />
                {row.ok ? "Match" : "Mismatch"}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-ink/55">
          <HugeiconsIcon icon={DocumentValidationIcon} size={14} strokeWidth={1.8} className="text-primary" />
          1 discrepancy flagged for review before drafting
        </div>
      </div>
    );
  }

  if (stageKey === "analyse") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-ink">
            Risk assessment complete
          </p>
          <span className="rounded-[3px] bg-neutral-100 px-2.5 py-1 text-[10.5px] font-medium tracking-[0.06em] text-ink/70">
            Recovery risk: Medium
          </span>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-border bg-neutral-50 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dark text-white">
            <HugeiconsIcon icon={ChartAnalysisIcon} size={22} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <p className="text-[14.5px] font-medium text-ink">
              3 similar cases resolved favorably
            </p>
            <p className="mt-1 text-[12.5px] text-muted">
              Based on precedent under Section 73, CGST Range 4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-ink/55">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={1.8} className="text-primary" />
          Legal grounds for response identified
        </div>
      </div>
    );
  }

  if (stageKey === "draft") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-ink">
            Draft ready for review
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-gradient-to-r from-lavender-100 to-cream-100 px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] text-primary">
            <HugeiconsIcon icon={AiMagicIcon} size={12} strokeWidth={2} />
            AI-assisted
          </span>
        </div>

        <div className="space-y-3 rounded-md border border-border bg-neutral-50 p-5">
          <div className="space-y-2">
            {[100, 92, 85, 70].map((width, i) => (
              <span
                key={i}
                className="block h-2 rounded-full bg-white"
                style={{ width: `${width}%` }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1 text-[12px] text-ink/55">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Grammar &amp; legal accuracy verified
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {[
            { label: "Edit draft", icon: PencilEdit01Icon, variant: "secondary" },
            { label: "Send for review", icon: CheckmarkCircle02Icon, variant: "primary" },
            { label: "Regenerate", icon: Exchange01Icon, variant: "secondary" },
          ].map((action) => (
            <span
              key={action.label}
              className={`inline-flex items-center gap-1.5 rounded-[3px] px-3.5 py-2 text-[12.5px] font-medium ${
                action.variant === "primary"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white"
                  : "border border-border bg-white text-ink"
              }`}
            >
              <HugeiconsIcon icon={action.icon} size={14} strokeWidth={1.8} />
              {action.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (stageKey === "review") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-ink">
            Approved by reviewer
          </p>
          <span className="rounded-[3px] bg-lavender-100 px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] text-primary">
            Ready to file
          </span>
        </div>

        <div className="flex items-center gap-4 rounded-md border border-border bg-neutral-50 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white">
            <HugeiconsIcon icon={UserCheck01Icon} size={20} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <p className="text-[14.5px] font-medium text-ink">Priya Sharma</p>
            <p className="mt-1 text-[12.5px] text-muted">
              Consultant · Approved with no edits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-ink/55">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={1.8} className="text-primary" />
          Full edit history kept for every review
        </div>
      </div>
    );
  }

  const steps = [
    { label: "Hearing", done: true, date: "Jan 15" },
    { label: "Response", done: true, date: "Jan 22" },
    { label: "Order", current: true, date: "Feb 05" },
    { label: "Payment", done: false, date: "TBD" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-ink">Case timeline</p>
        <span className="rounded-[3px] bg-neutral-100 px-2.5 py-1 text-[10.5px] font-medium tracking-[0.06em] text-ink/70">
          In progress
        </span>
      </div>

      <div className="space-y-1">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-4 rounded-md border p-3.5 ${
              step.current
                ? "border-primary bg-lavender-50/50"
                : "border-border bg-white"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                step.done
                  ? "border-primary bg-gradient-to-br from-primary to-primary-dark text-white"
                  : step.current
                    ? "border-primary bg-white text-primary"
                    : "border-border bg-white text-muted"
              }`}
            >
              {step.done ? (
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2.2} />
              ) : (
                <span className="text-[12px] font-medium">{i + 1}</span>
              )}
            </div>

            <div className="flex-1">
              <p className="text-[13.5px] font-medium text-ink">
                {step.label}
              </p>
              <p className="text-[11.5px] text-muted">{step.date}</p>
            </div>

            {step.current && (
              <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.8} className="text-primary" />
            )}
          </div>
        ))}
      </div>

      <p className="text-[12.5px] text-ink/55">
        Recovery risk: <span className="font-medium text-secondary-dark">Low</span>
      </p>
    </div>
  );
}

export function WorkflowSection({ onRequestDemo }: { onRequestDemo: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isCompact, setIsCompact] = useState(false);

  // Below lg the layout stacks vertically instead of sitting side-by-side
  // with the panel, so the orbit switches from a half-moon to a full circle.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const orbitSize = isCompact ? ORBIT_SIZE_COMPACT : ORBIT_SIZE;
  const orbitAnchorDeg = isCompact ? -90 : 0;
  const anchor = orbitAnchor(orbitSize / 2, orbitAnchorDeg);

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { gsap } = getGsap();
    spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, "rgba(201,175,128,0.4)");
    onRequestDemo();
  };

  useEffect(() => {
    if (reducedMotion) return;
    if (!sectionRef.current || !pinRef.current) return;

    const section = sectionRef.current;
    const pinTarget = pinRef.current;
    let ctx: ReturnType<typeof GsapType.context> | null = null;

    // Deferred by a frame so that if this effect fires twice back-to-back
    // (React StrictMode's dev-only double mount, or two rapid compact/
    // full-circle toggles from a fast resize), the first build never
    // actually runs — its cleanup cancels the pending frame before GSAP
    // is ever touched. Building two overlapping ScrollTrigger pins on the
    // same target back-to-back was leaving the timeline's opening "active
    // stage" frame un-rendered (every bubble stuck looking inactive).
    const rafId = requestAnimationFrame(() => {
      const { gsap, ScrollTrigger } = getGsap();
      ctx = gsap.context(() => {
        buildWorkflowPin(gsap, ScrollTrigger, section, pinTarget);
      }, section);
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
    };
    // Rebuilt whenever the compact/full-circle mode flips so the ring's
    // rotation targets stay in sync with the new anchor angle instead of
    // carrying over stale values computed for the other layout.
  }, [reducedMotion]);

  const eyebrow = (
    <span className="mb-5 inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.14em] text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
      How it works
    </span>
  );

  const headline = (
    <h2 className="max-w-[640px] text-[32px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[38px] lg:text-[42px]">
      From notice to next action.
    </h2>
  );

  const cta = (
    <button
      type="button"
      onClick={handleCtaClick}
      className="group relative mt-6 inline-flex h-[39px] items-center gap-[10px] overflow-hidden rounded-[11.7px] border border-transparent px-[15px] py-[10px] text-[14.5px] font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      Request a demo
      <HugeiconsIcon
        icon={ArrowRight02Icon}
        size={16}
        strokeWidth={2}
        className="transition-transform duration-200 ease-out group-hover:translate-x-1"
      />
    </button>
  );

  if (reducedMotion) {
    return (
      <section id="workflow" ref={sectionRef} className="py-24">
        <div className="mx-auto max-w-[1360px] px-6 pb-16 lg:px-10">
          {eyebrow}
          {headline}
          {cta}
        </div>
        <div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-6 lg:px-10">
          {STAGES.map((stage) => (
            <div
              key={stage.key}
              className="rounded-lg border border-border bg-gradient-to-br from-white to-lavender-50 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white">
                  <HugeiconsIcon icon={stage.icon} size={15} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.08em] text-muted">
                    {stage.number}
                  </p>
                  <p className="text-[15px] font-medium text-ink">
                    {stage.label}
                  </p>
                </div>
              </div>
              <p className="mb-5 text-[14px] leading-relaxed text-ink/60">
                {stage.description}
              </p>
              <div className="rounded-md border border-border bg-neutral-50/50 p-5">
                <StageBody stageKey={stage.key} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="workflow" ref={sectionRef} className="py-24 lg:py-0">
      <div ref={pinRef}>
        <div className="mx-auto max-w-[1360px] px-6 pb-16 pt-20 lg:px-10">
          {eyebrow}
          {headline}
          <div className="mb-8">{cta}</div>
          <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              {/* Orbit: a dashed ring holding all 7 stage icons, evenly
                  spaced. On wide screens only the right half is shown
                  (clipped into a half-moon) so exactly 3 icons are visible
                  at once, the active one at "3 o'clock". Below lg, where
                  this column stacks above the panel instead of sitting
                  beside it, the clip is dropped and the anchor moves to
                  "12 o'clock" so the full ring — all 7 stages — is always
                  visible. The ring rotates (via buildWorkflowPin) so the
                  active stage always lands at the anchor and grows into
                  the large "current" bubble. */}
              <div
                className="relative mb-4 overflow-hidden"
                style={{ height: isCompact ? orbitSize + 20 : ORBIT_SIZE }}
              >
                <div
                  className="absolute"
                  style={{
                    left: isCompact ? "50%" : "8%",
                    top: "50%",
                    width: orbitSize,
                    height: orbitSize,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Static window — never rotates, so the visible shape
                      stays clean regardless of how the icons have spun. */}
                  <div
                    className="absolute inset-0"
                    style={isCompact ? undefined : { clipPath: "inset(0 -40px 0 50%)" }}
                  >
                    {/* The dashed track itself never moves — only the
                        icons animate around it — so it reads as a fixed
                        rail rather than something that's spinning. */}
                    <div
                      className="absolute inset-0 rounded-full border-2 border-dashed"
                      style={{ borderColor: "rgba(55,30,113,0.3)" }}
                    />
                    <div data-workflow="orbit-ring" className="absolute inset-0">
                      {STAGES.map((stage, i) => {
                        const angle =
                          ((orbitAnchorDeg + i * (360 / STAGES.length)) * Math.PI) / 180;
                        const x = (orbitSize / 2) * Math.cos(angle);
                        const y = (orbitSize / 2) * Math.sin(angle);
                        return (
                          <div
                            key={stage.key}
                            className="absolute"
                            style={{
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <div
                              data-workflow="orbit-bubble"
                              className="flex items-center justify-center rounded-full shadow-[0_1px_2px_rgba(24,21,31,0.06),0_8px_16px_-8px_rgba(24,21,31,0.2)] transition-colors"
                              style={{
                                height: 44,
                                width: 44,
                                backgroundColor: i === 0 ? "#ebe5f6" : "#f3ead9",
                                color: i === 0 ? "#371e71" : "#a88c5c",
                                transform: i === 0 ? "scale(1.6)" : "scale(1)",
                              }}
                            >
                              <HugeiconsIcon icon={stage.icon} size={16} strokeWidth={1.8} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fixed at the anchor point on wide screens — outside
                      the clipped, rotating ring — so it never spins or
                      gets clipped, just cross-fades between stage names.
                      Below lg the full circle has no single "gap toward
                      the panel" to sit in, so the caption renders as its
                      own centered row beneath the ring instead (see
                      isCompact block further down). */}
                  {!isCompact && (
                    <div
                      className="absolute"
                      style={{
                        left: `calc(50% + ${anchor.x}px)`,
                        top: `calc(50% + ${anchor.y}px)`,
                        transform: "translate(40px, -50%)",
                      }}
                    >
                      <div className="relative h-[24px]">
                        {STAGES.map((stage, i) => (
                          <span
                            key={stage.key}
                            data-workflow="caption"
                            className="absolute left-0 top-0 whitespace-nowrap text-[16px] font-semibold text-ink"
                            style={{ opacity: i === 0 ? 1 : 0 }}
                          >
                            {stage.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isCompact && (
                <div className="relative mb-2 h-[24px] text-center">
                  {STAGES.map((stage, i) => (
                    <span
                      key={stage.key}
                      data-workflow="caption"
                      className="absolute inset-x-0 top-0 whitespace-nowrap text-[16px] font-semibold text-ink"
                      style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                      {stage.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="relative mt-2 h-[90px]">
                {STAGES.map((stage, i) => (
                  <p
                    key={stage.key}
                    data-workflow="description"
                    className="absolute inset-x-0 top-0 mx-auto max-w-[360px] text-[14.5px] leading-relaxed text-ink/60 lg:mx-0"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    {stage.description}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center lg:col-span-8">
              <div className="relative h-[440px] w-full overflow-hidden rounded-lg border border-border bg-gradient-to-br from-white to-lavender-50 p-5 shadow-[0_1px_2px_rgba(24,21,31,0.04),0_32px_64px_-28px_rgba(24,21,31,0.22)] sm:p-8">
                <div
                  data-workflow="progress-bar"
                  className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-primary to-primary-soft transition-[width] duration-700"
                  style={{ width: "25%" }}
                />

                {STAGES.map((stage, i) => (
                  <div
                    key={stage.key}
                    data-workflow="panel"
                    className="absolute inset-5 top-8 sm:inset-8 sm:top-10"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    <StageBody stageKey={stage.key} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
