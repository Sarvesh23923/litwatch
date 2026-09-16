"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Calendar01Icon } from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { revealOnScroll } from "@/animations/scrollReveal";
import { spawnRipple } from "@/animations/microInteractions";

type StatusKey =
  | "open"
  | "due_soon"
  | "needs_review"
  | "overdue"
  | "in_progress"
  | "resolved";

interface Notice {
  client: string;
  type: string;
  deadline: string;
  status: StatusKey;
  urgent: boolean;
}

const STATUS_LABEL: Record<StatusKey, string> = {
  open: "Open",
  due_soon: "Due soon",
  needs_review: "Needs review",
  overdue: "Overdue",
  in_progress: "In progress",
  resolved: "Resolved",
};

const STATUS_STYLE: Record<StatusKey, string> = {
  open: "bg-neutral-100 text-ink/70",
  due_soon: "bg-cream-100 text-secondary-dark",
  needs_review: "bg-lavender-100 text-primary",
  overdue: "bg-primary text-white",
  in_progress: "bg-neutral-100 text-ink/70",
  resolved: "border border-border text-muted",
};

const NOTICES: Notice[] = [
  { client: "ABC Industries", type: "Section 73 notice", deadline: "Due in 2 days", status: "needs_review", urgent: true },
  { client: "Meridian Textiles", type: "Mismatch notice", deadline: "Due in 6 days", status: "due_soon", urgent: false },
  { client: "Kavya Apparels", type: "Section 74 notice", deadline: "Due in 9 days", status: "in_progress", urgent: false },
  { client: "Orion Logistics", type: "Reconciliation notice", deadline: "Closed", status: "resolved", urgent: false },
  { client: "Sundar Exports", type: "Section 61 notice", deadline: "Overdue by 3 days", status: "overdue", urgent: true },
  { client: "Vikram Textiles", type: "Late fee notice", deadline: "Due in 1 day", status: "due_soon", urgent: true },
  { client: "Nalanda Traders", type: "Show cause notice", deadline: "Due in 14 days", status: "open", urgent: false },
  { client: "Prakash Chemicals", type: "Recovery notice", deadline: "Due in 4 days", status: "needs_review", urgent: false },
];

const FILTERS: { key: "all" | StatusKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "due_soon", label: "Due soon" },
  { key: "needs_review", label: "Needs review" },
  { key: "overdue", label: "Overdue" },
  { key: "in_progress", label: "In progress" },
  { key: "resolved", label: "Resolved" },
];

export function ControlTower({ onRequestDemo }: { onRequestDemo: () => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | StatusKey>("all");
  const mountedFilter = useRef(false);

  const filtered = useMemo(
    () => (filter === "all" ? NOTICES : NOTICES.filter((n) => n.status === filter)),
    [filter],
  );

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

  useEffect(() => {
    if (!mountedFilter.current) {
      mountedFilter.current = true;
      return;
    }
    if (!listRef.current) return;
    const { gsap } = getGsap();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const rows = listRef.current.querySelectorAll('[data-tower="row"]');
    if (reduceMotion) {
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      rows,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.035, ease: "power2.out" },
    );
  }, [filter]);

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { gsap } = getGsap();
    spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, "rgba(201,175,128,0.4)");
    onRequestDemo();
  };

  return (
    <section id="control-tower" ref={rootRef} className="border-y border-border bg-lavender-50 py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <span data-tower="item" className="mb-5 inline-flex items-center gap-2 text-[12.5px] font-medium uppercase tracking-[0.14em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          Practice control tower
        </span>
        <h2 data-tower="item" className="max-w-[680px] text-[32px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[38px] lg:text-[42px]">
          See the whole practice at a glance.
        </h2>
        <p data-tower="item" className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-ink/60">
          Every client, every notice, one prioritized view — filter by what
          needs attention right now.
        </p>

        <div
          data-tower="item"
          className="mt-10 flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-[3px] border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                filter === f.key
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-ink/60 hover:border-primary/40 hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div
          data-tower="item"
          className="mt-6 overflow-hidden rounded-lg border border-border bg-white"
        >
          <div className="grid grid-cols-[1.4fr_1.4fr_1fr_1fr] gap-3 border-b border-border px-5 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
            <span>Client</span>
            <span>Notice type</span>
            <span>Deadline</span>
            <span>Status</span>
          </div>
          <div ref={listRef} className="divide-y divide-border">
            {filtered.map((n) => (
              <div
                key={n.client}
                data-tower="row"
                className="grid grid-cols-[1.4fr_1.4fr_1fr_1fr] items-center gap-3 px-5 py-3.5"
              >
                <span className="flex items-center gap-2 truncate text-[13.5px] font-medium text-ink">
                  {n.urgent && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  {n.client}
                </span>
                <span className="truncate text-[13px] text-ink/60">{n.type}</span>
                <span className="flex items-center gap-1.5 text-[12.5px] text-ink/50">
                  <HugeiconsIcon icon={Calendar01Icon} size={12} strokeWidth={1.8} />
                  {n.deadline}
                </span>
                <span className={`inline-flex w-fit items-center rounded-[3px] px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLE[n.status]}`}>
                  {STATUS_LABEL[n.status]}
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-5 py-8 text-center text-[13.5px] text-muted">
                No notices in this view.
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCtaClick}
          data-tower="item"
          className="group relative mt-10 inline-flex items-center gap-2 overflow-hidden rounded-[3px] bg-primary px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
    </section>
  );
}
