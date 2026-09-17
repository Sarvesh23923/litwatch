"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  AiMagicIcon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CloudIcon,
  Exchange01Icon,
  FolderLibraryIcon,
  LegalDocument01Icon,
  Mail01Icon,
  PencilEdit01Icon,
  Route02Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";
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
    key: "draft",
    number: "03",
    label: "Draft",
    icon: PencilEdit01Icon,
    description:
      "A draft reply is generated using legal and rule-based reasoning, then routed to you for review, edits and approval.",
  },
  {
    key: "track",
    number: "04",
    label: "Track",
    icon: Route02Icon,
    description:
      "Hearings, orders, payments and appeals stay tracked in one timeline, end to end.",
  },
];

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
      { label: "GST portal match", value: "Confirmed" },
    ];

    return (
      <div className="space-y-5">
        <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-gradient-to-r from-lavender-100 to-cream-100 px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] text-primary">
          <HugeiconsIcon icon={AiMagicIcon} size={12} strokeWidth={2} />
          AI classification complete
        </span>

        <div className="grid grid-cols-2 gap-3">
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
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={1.8} className="text-primary" />
          All fields validated · ready for next step
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
            { label: "Approve & send", icon: CheckmarkCircle02Icon, variant: "primary" },
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

const NODE_STYLES = [
  { bg: "#f4f1fb", border: "#d9cded", icon: "#371e71" },
  { bg: "#f3ead9", border: "#c9af80", icon: "#a88c5c" },
  { bg: "#ebe5f6", border: "#5b3f9c", icon: "#371e71" },
  { bg: "#faf6ee", border: "#c9af80", icon: "#a88c5c" },
];

// The desktop wheel column (col-span-5 of a 12-col grid) is comfortably
// wide once the viewport clears xl (1280px), but between lg and xl
// (1024–1279px) that same column is much narrower, so the wheel needs a
// smaller radius there to avoid clipping the active node.
const WHEEL_RADIUS_FULL = 230;
const WHEEL_NODE_SIZE_FULL = 92;
const WHEEL_RADIUS_COMPACT = 150;
const WHEEL_NODE_SIZE_COMPACT = 64;
const WHEEL_INFO_GAP = 12; // mt-3
const WHEEL_INFO_HEIGHT = 90;

// Below lg there's no side-by-side room to bleed the wheel off-canvas, so
// the mobile/tablet wheel is smaller and simply centered — all four nodes
// stay visible, with distance-based fade doing the decluttering instead.
const MOBILE_WHEEL_RADIUS = 112;
const MOBILE_NODE_SIZE = 66;
// The mobile info text and stage panel sit below the wheel, so the
// "active" node highlights at 6 o'clock instead of the desktop's 3
// o'clock, pointing down toward its own content.
const MOBILE_ACTIVE_SLOT_ANGLE = 90;

export function WorkflowSection({ onRequestDemo }: { onRequestDemo: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const mobilePinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isFullWheel = useMediaQuery("(min-width: 1280px)");

  const WHEEL_RADIUS = isFullWheel ? WHEEL_RADIUS_FULL : WHEEL_RADIUS_COMPACT;
  const WHEEL_NODE_SIZE = isFullWheel
    ? WHEEL_NODE_SIZE_FULL
    : WHEEL_NODE_SIZE_COMPACT;
  // How far the wheel's center sits to the right of the column's left
  // edge — keeps the active + adjacent (top/bottom) nodes visible while
  // the far/back node clips off-screen, so only three nodes ever show.
  const WHEEL_CENTER_OFFSET = WHEEL_RADIUS * 0.45;
  // The right-side stage panel is sized to match the wheel + info column
  // so both sides end at the same point — otherwise the taller side's
  // tail hangs below the shorter one right as the pin releases, landing
  // awkwardly against the next section.
  const DESKTOP_COLUMN_HEIGHT =
    WHEEL_RADIUS * 2 + WHEEL_NODE_SIZE + WHEEL_INFO_GAP + WHEEL_INFO_HEIGHT;

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { gsap } = getGsap();
    spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, "rgba(201,175,128,0.4)");
    onRequestDemo();
  };

  useEffect(() => {
    if (reducedMotion) return;
    if (!sectionRef.current) return;

    const { gsap, ScrollTrigger } = getGsap();
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (!pinRef.current) return;
        buildWorkflowPin(gsap, ScrollTrigger, pinRef.current, pinRef.current);
      });

      mm.add("(max-width: 1023.98px)", () => {
        if (!mobilePinRef.current) return;
        buildWorkflowPin(
          gsap,
          ScrollTrigger,
          mobilePinRef.current,
          mobilePinRef.current,
          MOBILE_ACTIVE_SLOT_ANGLE,
        );
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const eyebrow = (
    <span className="mb-2 inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.14em] text-muted">
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

  return (
    <section id="workflow" ref={sectionRef} className="py-24 lg:py-0">
      {!reducedMotion && (
        <div ref={pinRef} className="hidden lg:block">
          <div className="mx-auto max-w-[1360px] px-10 pb-24 pt-16">
            {eyebrow}
            {headline}
            <div className="mb-6">{cta}</div>
            <div className="grid w-full grid-cols-12 gap-8 xl:gap-16">
              <div className="col-span-5 flex flex-col justify-center">
                <div
                  className="relative w-full overflow-hidden"
                  style={{ height: WHEEL_RADIUS * 2 + WHEEL_NODE_SIZE }}
                >
                  <div
                    data-workflow="wheel"
                    className="absolute"
                    style={{
                      left: WHEEL_CENTER_OFFSET - WHEEL_RADIUS,
                      top: "50%",
                      marginTop: -WHEEL_RADIUS,
                      height: WHEEL_RADIUS * 2,
                      width: WHEEL_RADIUS * 2,
                    }}
                  >
                    <svg
                      aria-hidden
                      className="absolute inset-0"
                      viewBox={`0 0 ${WHEEL_RADIUS * 2} ${WHEEL_RADIUS * 2}`}
                    >
                      <circle
                        cx={WHEEL_RADIUS}
                        cy={WHEEL_RADIUS}
                        r={WHEEL_RADIUS - 1}
                        fill="none"
                        stroke="#d9cded"
                        strokeWidth={1.5}
                        strokeDasharray="7 9"
                      />
                    </svg>
                    {STAGES.map((stage, i) => {
                      const angle = i * (360 / STAGES.length);
                      const nodeSize = WHEEL_NODE_SIZE;
                      const style = NODE_STYLES[i % NODE_STYLES.length];
                      return (
                        <div
                          key={stage.key}
                          className="absolute"
                          style={{
                            left: "50%",
                            top: "50%",
                            width: nodeSize,
                            height: nodeSize,
                            marginLeft: -nodeSize / 2,
                            marginTop: -nodeSize / 2,
                            transform: `rotate(${angle}deg) translate(${WHEEL_RADIUS}px) rotate(${-angle}deg)`,
                          }}
                        >
                          <div
                            data-workflow="wheel-node"
                            className="h-full w-full"
                          >
                            <div
                              data-workflow="wheel-node-inner"
                              className="flex h-full w-full items-center justify-center rounded-full border shadow-[0_8px_20px_-10px_rgba(24,21,31,0.35)]"
                              style={{
                                backgroundColor: style.bg,
                                borderColor: style.border,
                              }}
                            >
                              <HugeiconsIcon
                                icon={stage.icon}
                                size={26}
                                strokeWidth={1.8}
                                color={style.icon}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="relative"
                  style={{ marginTop: WHEEL_INFO_GAP, height: WHEEL_INFO_HEIGHT }}
                >
                  {STAGES.map((stage, i) => (
                    <div
                      key={stage.key}
                      data-workflow="info"
                      className="absolute inset-x-0 top-0"
                      style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                      <p className="text-[11px] font-medium tracking-[0.08em] text-muted">
                        {stage.number}
                      </p>
                      <p className="mt-1 text-[20px] font-semibold text-ink">
                        {stage.label}
                      </p>
                      <p className="mt-2 max-w-[380px] text-[14.5px] leading-relaxed text-ink/60">
                        {stage.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-7 flex items-center">
                <div
                  className="relative w-full overflow-hidden rounded-lg border border-border bg-gradient-to-br from-white to-lavender-50 p-8 shadow-[0_1px_2px_rgba(24,21,31,0.04),0_32px_64px_-28px_rgba(24,21,31,0.22)]"
                  style={{ height: DESKTOP_COLUMN_HEIGHT }}
                >
                  <div
                    data-workflow="progress-bar"
                    className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-primary to-primary-soft transition-[width] duration-700"
                    style={{ width: "25%" }}
                  />

                  {STAGES.map((stage, i) => (
                    <div
                      key={stage.key}
                      data-workflow="panel"
                      className="absolute inset-8 top-10 flex items-center"
                      style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                      <div className="w-full">
                        <StageBody stageKey={stage.key} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!reducedMotion && (
        <div ref={mobilePinRef} className="lg:hidden">
          <div className="mx-auto max-w-[560px] px-6 pb-16 pt-16">
            {eyebrow}
            {headline}
            <div className="mb-8">{cta}</div>

            <div
              className="relative mx-auto"
              style={{
                width: MOBILE_WHEEL_RADIUS * 2 + MOBILE_NODE_SIZE,
                height: MOBILE_WHEEL_RADIUS * 2 + MOBILE_NODE_SIZE,
              }}
            >
              <div
                data-workflow="wheel"
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -MOBILE_WHEEL_RADIUS,
                  marginTop: -MOBILE_WHEEL_RADIUS,
                  height: MOBILE_WHEEL_RADIUS * 2,
                  width: MOBILE_WHEEL_RADIUS * 2,
                }}
              >
                <svg
                  aria-hidden
                  className="absolute inset-0"
                  viewBox={`0 0 ${MOBILE_WHEEL_RADIUS * 2} ${MOBILE_WHEEL_RADIUS * 2}`}
                >
                  <circle
                    cx={MOBILE_WHEEL_RADIUS}
                    cy={MOBILE_WHEEL_RADIUS}
                    r={MOBILE_WHEEL_RADIUS - 1}
                    fill="none"
                    stroke="#d9cded"
                    strokeWidth={1.5}
                    strokeDasharray="6 8"
                  />
                </svg>
                {STAGES.map((stage, i) => {
                  const angle = i * (360 / STAGES.length);
                  const nodeSize = MOBILE_NODE_SIZE;
                  const style = NODE_STYLES[i % NODE_STYLES.length];
                  return (
                    <div
                      key={stage.key}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "50%",
                        width: nodeSize,
                        height: nodeSize,
                        marginLeft: -nodeSize / 2,
                        marginTop: -nodeSize / 2,
                        transform: `rotate(${angle}deg) translate(${MOBILE_WHEEL_RADIUS}px) rotate(${-angle}deg)`,
                      }}
                    >
                      <div data-workflow="wheel-node" className="h-full w-full">
                        <div
                          data-workflow="wheel-node-inner"
                          className="flex h-full w-full items-center justify-center rounded-full border shadow-[0_6px_16px_-8px_rgba(24,21,31,0.35)]"
                          style={{
                            backgroundColor: style.bg,
                            borderColor: style.border,
                          }}
                        >
                          <HugeiconsIcon
                            icon={stage.icon}
                            size={18}
                            strokeWidth={1.8}
                            color={style.icon}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative mx-auto mt-5 h-[104px] max-w-[380px] text-center">
              {STAGES.map((stage, i) => (
                <div
                  key={stage.key}
                  data-workflow="info"
                  className="absolute inset-x-0 top-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <p className="text-[11px] font-medium tracking-[0.08em] text-muted">
                    {stage.number}
                  </p>
                  <p className="mt-1 text-[19px] font-semibold text-ink">
                    {stage.label}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/60">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative mt-8 h-[340px] w-full overflow-hidden rounded-lg border border-border bg-gradient-to-br from-white to-lavender-50 p-6 shadow-[0_1px_2px_rgba(24,21,31,0.04),0_24px_48px_-24px_rgba(24,21,31,0.2)]">
              <div
                data-workflow="progress-bar"
                className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-primary to-primary-soft transition-[width] duration-700"
                style={{ width: "25%" }}
              />

              {STAGES.map((stage, i) => (
                <div
                  key={stage.key}
                  data-workflow="panel"
                  className="absolute inset-6 top-8"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <StageBody stageKey={stage.key} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reducedMotion && (
        <div>
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
        </div>
      )}
    </section>
  );
}
