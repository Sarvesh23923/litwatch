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

export function WorkflowSection({ onRequestDemo }: { onRequestDemo: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { gsap } = getGsap();
    spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, "rgba(201,175,128,0.4)");
    onRequestDemo();
  };

  useEffect(() => {
    if (reducedMotion) return;
    if (!sectionRef.current || !pinRef.current) return;

    const { gsap, ScrollTrigger } = getGsap();
    const section = sectionRef.current;
    const pinTarget = pinRef.current;

    const ctx = gsap.context(() => {
      buildWorkflowPin(gsap, ScrollTrigger, section, pinTarget);
    }, section);

    return () => ctx.revert();
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

  return (
    <section id="workflow" ref={sectionRef} className="py-24 lg:py-0">
      {!reducedMotion && (
        <div ref={pinRef} className="hidden lg:block">
          <div className="mx-auto max-w-[1360px] px-10 pb-24 pt-32">
            {eyebrow}
            {headline}
            <div className="mb-14">{cta}</div>
            <div className="grid w-full grid-cols-12 gap-16">
              <div className="col-span-4">
                <div className="mb-10 flex flex-col gap-0">
                  {STAGES.map((stage, i) => (
                    <div key={stage.key} className="flex items-start">
                      <div className="flex flex-col items-center">
                        <div
                          data-workflow="dot"
                          className="relative flex h-10 w-10 items-center justify-center rounded-full border"
                          style={{
                            backgroundColor: i === 0 ? "#f4f1fb" : "#ffffff",
                            borderColor: i === 0 ? "#371e71" : "#e4e0e8",
                            color: i === 0 ? "#371e71" : "#6f6b78",
                          }}
                        >
                          <HugeiconsIcon icon={stage.icon} size={16} strokeWidth={1.8} />
                        </div>
                        {i < STAGES.length - 1 && (
                          <div className="relative my-1 h-12 w-px bg-border">
                            <div
                              data-workflow="connector-fill"
                              className="absolute inset-x-0 top-0 w-px origin-top scale-y-0 bg-gradient-to-b from-primary to-primary-soft"
                              style={{ height: "100%" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 pt-1.5">
                        <p className="text-[11px] font-medium tracking-[0.08em] text-muted">
                          {stage.number}
                        </p>
                        <p className="text-[15px] font-medium text-ink">
                          {stage.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative h-[90px]">
                  {STAGES.map((stage, i) => (
                    <p
                      key={stage.key}
                      data-workflow="description"
                      className="absolute inset-x-0 top-0 max-w-[360px] text-[14.5px] leading-relaxed text-ink/60"
                      style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                      {stage.description}
                    </p>
                  ))}
                </div>
              </div>

              <div className="col-span-8 flex items-center">
                <div className="relative h-[420px] w-full overflow-hidden rounded-lg border border-border bg-gradient-to-br from-white to-lavender-50 p-8 shadow-[0_1px_2px_rgba(24,21,31,0.04),0_32px_64px_-28px_rgba(24,21,31,0.22)]">
                  <div
                    data-workflow="progress-bar"
                    className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-primary to-primary-soft transition-[width] duration-700"
                    style={{ width: "25%" }}
                  />

                  {STAGES.map((stage, i) => (
                    <div
                      key={stage.key}
                      data-workflow="panel"
                      className="absolute inset-8 top-10"
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
      )}

      <div className={reducedMotion ? "block" : "lg:hidden"}>
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
    </section>
  );
}
