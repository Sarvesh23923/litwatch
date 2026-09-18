"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Cursor02Icon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { revealOnScroll } from "@/animations/scrollReveal";
import { spawnRipple } from "@/animations/microInteractions";

type Stage = "triage" | "in_progress" | "resolved";

type Urgency = "overdue" | "due_soon" | "needs_review" | "open";

interface Notice {
  id: string;
  client: string;
  type: string;
  note: string;
  urgency?: Urgency;
  urgent?: boolean;
  stage: Stage;
}

const URGENCY_LABEL: Record<Urgency, string> = {
  overdue: "Overdue",
  due_soon: "Due soon",
  needs_review: "Needs review",
  open: "Open",
};

const URGENCY_STYLE: Record<Urgency, string> = {
  overdue: "bg-primary text-white",
  due_soon: "bg-cream-100 text-secondary-dark",
  needs_review: "bg-lavender-100 text-primary",
  open: "bg-neutral-100 text-ink/70",
};

const STAGE_META: Record<Stage, { label: string; dot: string }> = {
  triage: { label: "Needs triage", dot: "bg-primary" },
  in_progress: { label: "In progress", dot: "bg-secondary-dark" },
  resolved: { label: "Resolved", dot: "bg-muted" },
};

const STAGE_ORDER: Stage[] = ["triage", "in_progress", "resolved"];

// How many cards comfortably fit in a column before it needs to scroll —
// past this, we surface the rest as a pending count instead of implying
// the column only holds what's currently in view.
const DEFAULT_VISIBLE_CARDS = 3;

const INITIAL_NOTICES: Notice[] = [
  {
    id: "abc-industries",
    client: "ABC Industries",
    type: "Section 73 notice",
    note: "Due in 2 days",
    urgency: "needs_review",
    urgent: true,
    stage: "triage",
  },
  {
    id: "sundar-exports",
    client: "Sundar Exports",
    type: "Section 61 notice",
    note: "Overdue by 3 days",
    urgency: "overdue",
    urgent: true,
    stage: "triage",
  },
  {
    id: "meridian-textiles",
    client: "Meridian Textiles",
    type: "Mismatch notice",
    note: "Due in 6 days",
    urgency: "due_soon",
    stage: "triage",
  },
  {
    id: "kavya-apparels",
    client: "Kavya Apparels",
    type: "Section 74 notice",
    note: "Started 2 days ago",
    stage: "in_progress",
  },
  {
    id: "vikram-textiles",
    client: "Vikram Textiles",
    type: "Late fee notice",
    note: "Assigned to you",
    stage: "in_progress",
  },
  {
    id: "orion-logistics",
    client: "Orion Logistics",
    type: "Reconciliation notice",
    note: "Closed Jan 18",
    stage: "resolved",
  },
];

function nextStage(stage: Stage): Stage {
  if (stage === "triage") return "in_progress";
  if (stage === "in_progress") return "resolved";
  return stage;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const AUTOPLAY_STEP_PAUSE = 500;
const AUTOPLAY_RESET_PAUSE = 800;
const AUTOPLAY_MANUAL_COOLDOWN = 2000;

export function ControlTower({ onRequestDemo }: { onRequestDemo: () => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const lastMovedRef = useRef<string | null>(null);
  const visibleRef = useRef(false);
  const hoveredRef = useRef(false);
  const manualAtRef = useRef(0);

  useEffect(() => {
    if (!rootRef.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const root = rootRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      revealOnScroll(gsap, ScrollTrigger, root, '[data-tower="item"]', { stagger: 0.07 });
    }, root);

    return () => ctx.revert();
  }, []);

  // Once a card lands in its new column, settle it in with a small
  // entrance so the move reads as "arriving" rather than just popping in.
  useEffect(() => {
    const movedId = lastMovedRef.current;
    if (!movedId || !boardRef.current) return;
    lastMovedRef.current = null;
    const card = boardRef.current.querySelector(`[data-card-id="${movedId}"]`);
    if (!card) return;
    const { gsap } = getGsap();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;
    gsap.fromTo(
      card,
      { opacity: 0, y: 10, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power2.out" },
    );
  }, [notices]);

  const advance = (id: string) => {
    const { gsap } = getGsap();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const card = boardRef.current?.querySelector(`[data-card-id="${id}"]`);

    const commit = () => {
      lastMovedRef.current = id;
      setNotices((prev) =>
        prev.map((n) => (n.id === id ? { ...n, stage: nextStage(n.stage) } : n)),
      );
    };

    if (!card || reduceMotion) {
      commit();
      return;
    }

    gsap.to(card, {
      opacity: 0,
      x: 14,
      scale: 0.96,
      duration: 0.15,
      ease: "power2.in",
      onComplete: commit,
    });
  };

  const resetSimulation = () => {
    setNotices(INITIAL_NOTICES);
    const { gsap } = getGsap();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || !boardRef.current) return;
    const cards = boardRef.current.querySelectorAll('[data-card-id]');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.25, stagger: 0.02, ease: "power2.out" },
    );
  };

  // Self-playing demo: an animated fake cursor walks to whichever card is
  // next in line and "clicks" it, so the board keeps moving on its own —
  // pausing whenever a visitor hovers in or clicks a card themselves.
  useEffect(() => {
    if (!rootRef.current || !boardRef.current) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const { gsap } = getGsap();
    let cancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );
    observer.observe(rootRef.current);

    function tweenPromise(target: gsap.TweenTarget, vars: gsap.TweenVars) {
      return new Promise<void>((resolve) => {
        gsap.to(target, { ...vars, onComplete: resolve });
      });
    }

    async function loop() {
      while (!cancelled) {
        await wait(250);
        if (cancelled) return;
        if (!visibleRef.current || hoveredRef.current) continue;
        if (Date.now() - manualAtRef.current < AUTOPLAY_MANUAL_COOLDOWN) continue;

        const board = boardRef.current;
        const cursor = cursorRef.current;
        if (!board || !cursor) continue;

        const target = board.querySelector<HTMLButtonElement>("[data-card-action]");

        if (!target) {
          await wait(AUTOPLAY_RESET_PAUSE);
          if (cancelled || hoveredRef.current) continue;
          if (Date.now() - manualAtRef.current < AUTOPLAY_MANUAL_COOLDOWN) continue;
          resetSimulation();
          await wait(AUTOPLAY_STEP_PAUSE);
          continue;
        }

        const id = target.dataset.cardAction;
        if (!id) continue;

        const boardRect = board.getBoundingClientRect();
        const btnRect = target.getBoundingClientRect();
        const x = btnRect.left - boardRect.left + btnRect.width - 8;
        const y = btnRect.top - boardRect.top + btnRect.height / 2 - 6;

        if (Number(gsap.getProperty(cursor, "opacity")) < 1) {
          gsap.set(cursor, { x, y });
          await tweenPromise(cursor, { opacity: 1, duration: 0.18 });
        } else {
          await tweenPromise(cursor, { x, y, duration: 0.38, ease: "power2.inOut" });
        }
        if (cancelled) return;

        await tweenPromise(cursor, { scale: 0.8, duration: 0.07, yoyo: true, repeat: 1 });
        if (cancelled) return;

        advance(id);
        await wait(AUTOPLAY_STEP_PAUSE);
      }
    }

    loop();

    const cursorEl = cursorRef.current;
    return () => {
      cancelled = true;
      observer.disconnect();
      gsap.to(cursorEl, { opacity: 0, duration: 0.2 });
    };
  }, []);

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { gsap } = getGsap();
    spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, "rgba(201,175,128,0.4)");
    onRequestDemo();
  };

  return (
    <section id="control-tower" ref={rootRef} className="border-y border-border bg-lavender-50 py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <span data-tower="item" className="mb-2 inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.14em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          Practice control tower
        </span>
        <h2 data-tower="item" className="max-w-[680px] text-[32px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[38px] lg:text-[42px]">
          One practice. Every notice. Nothing hidden.
        </h2>
        <p data-tower="item" className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-ink/60">
          LitWatch brings GST notice management into one controlled
          workflow.
        </p>

        <div data-tower="item" className="mt-8 flex items-center justify-between">
          <p className="text-[12.5px] text-ink/45">
            Click a card to move it forward.
          </p>
          <button
            type="button"
            onClick={() => {
              manualAtRef.current = Date.now();
              resetSimulation();
            }}
            className="text-[12.5px] font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline"
          >
            Reset simulation
          </button>
        </div>

        <div
          ref={boardRef}
          data-tower="item"
          onMouseEnter={() => {
            hoveredRef.current = true;
          }}
          onMouseLeave={() => {
            hoveredRef.current = false;
          }}
          className="relative mt-4 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          <div
            ref={cursorRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 opacity-0"
          >
            <HugeiconsIcon
              icon={Cursor02Icon}
              size={20}
              strokeWidth={1.5}
              className="text-primary drop-shadow-[0_2px_4px_rgba(24,21,31,0.25)]"
            />
          </div>
          {STAGE_ORDER.map((stage) => {
            const meta = STAGE_META[stage];
            const stageNotices = notices.filter((n) => n.stage === stage);
            return (
              <div
                key={stage}
                className="flex h-[480px] flex-col rounded-lg border border-border bg-white/60 p-3"
              >
                <div className="mb-3 flex shrink-0 items-center gap-2 px-1.5 pt-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  <span className="text-[12.5px] font-medium tracking-[0.04em] text-ink/70">
                    {meta.label}
                  </span>
                  <span className="text-[12.5px] text-ink/35">
                    {stageNotices.length}
                  </span>
                </div>

                <div className="tower-scroll flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
                  {stageNotices.map((n) => (
                    <div
                      key={n.id}
                      data-card-id={n.id}
                      className="rounded-md border border-border bg-white p-3.5 shadow-[0_1px_2px_rgba(24,21,31,0.03)]"
                    >
                      <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                        {n.urgent && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                        {n.client}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] text-ink/55">
                        {n.type}
                      </span>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        {n.urgency ? (
                          <span
                            className={`inline-flex w-fit items-center rounded-[3px] px-2 py-1 text-[10.5px] font-medium ${URGENCY_STYLE[n.urgency]}`}
                          >
                            {URGENCY_LABEL[n.urgency]}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[11.5px] text-ink/45">
                            <HugeiconsIcon icon={Calendar01Icon} size={11} strokeWidth={1.8} />
                            {n.note}
                          </span>
                        )}

                        {stage === "resolved" ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-ink/40">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
                            Closed
                          </span>
                        ) : (
                          <button
                            type="button"
                            data-card-action={n.id}
                            onClick={() => {
                              manualAtRef.current = Date.now();
                              advance(n.id);
                            }}
                            className="group inline-flex items-center gap-1 text-[11.5px] font-medium text-primary transition-colors hover:text-primary-dark"
                          >
                            {stage === "triage" ? "Start review" : "Mark resolved"}
                            <HugeiconsIcon
                              icon={ArrowRight02Icon}
                              size={12}
                              strokeWidth={2.2}
                              className="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                            />
                          </button>
                        )}
                      </div>

                      {n.urgency && (
                        <span className="mt-2 flex items-center gap-1.5 text-[11px] text-ink/40">
                          <HugeiconsIcon icon={Calendar01Icon} size={11} strokeWidth={1.8} />
                          {n.note}
                        </span>
                      )}
                    </div>
                  ))}

                  {stageNotices.length === 0 && (
                    <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border px-3 py-8 text-center text-[12px] text-ink/35">
                      Nothing here yet
                    </div>
                  )}
                </div>

                {stageNotices.length > DEFAULT_VISIBLE_CARDS && (
                  <div className="mt-2 flex shrink-0 items-center justify-center gap-1.5">
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-lavender-100 px-1.5 text-[11px] font-medium text-primary">
                      +{stageNotices.length - DEFAULT_VISIBLE_CARDS}
                    </span>
                    <span className="text-[11px] text-ink/40">pending</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleCtaClick}
            data-tower="item"
            className="group relative inline-flex h-[39px] items-center gap-[10px] overflow-hidden rounded-[11.7px] border border-primary bg-primary px-[15px] py-[10px] text-[14.5px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Request a demo
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={16}
              strokeWidth={2}
              className="transition-transform duration-200 ease-out group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
