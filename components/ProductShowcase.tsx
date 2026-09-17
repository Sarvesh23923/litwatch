"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  CheckmarkCircle02Icon,
  Exchange01Icon,
  ListViewIcon,
  LegalDocument01Icon,
  PencilEdit01Icon,
  Route02Icon,
  SparklesIcon,
  ArrowRight01Icon,
  Calendar01Icon,
  UserIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { spawnRipple } from "@/animations/microInteractions";
import {
  moveTabIndicator,
  switchPanel,
  switchPanelInstant,
} from "@/animations/showcaseAnimations";

const TABS = [
  { key: "board", label: "Notice board", icon: ListViewIcon },
  { key: "detail", label: "Case detail", icon: LegalDocument01Icon },
  { key: "draft", label: "Draft reply", icon: PencilEdit01Icon },
  { key: "tracking", label: "Tracking", icon: Route02Icon },
] as const;

const NOTICES = [
  {
    client: "ABC Industries",
    type: "Section 73 notice",
    deadline: "Due in 2 days",
    status: "Needs review",
    tone: "primary" as const,
    amount: "₹2.4L",
    urgent: true,
  },
  {
    client: "Meridian Textiles",
    type: "Mismatch notice",
    deadline: "Due in 6 days",
    status: "Draft ready",
    tone: "secondary" as const,
    amount: "₹1.8L",
    urgent: false,
  },
  {
    client: "Kavya Apparels",
    type: "Section 74 notice",
    deadline: "Due in 9 days",
    status: "In progress",
    tone: "neutral" as const,
    amount: "₹950K",
    urgent: false,
  },
  {
    client: "Orion Logistics",
    type: "Reconciliation notice",
    deadline: "Closed",
    status: "Resolved",
    tone: "muted" as const,
    urgent: false,
  },
];

const STATUS_STYLES: Record<string, string> = {
  primary: "bg-lavender-100 text-primary border border-primary/20",
  secondary: "bg-cream-100 text-secondary-dark border border-secondary/20",
  neutral: "bg-neutral-100 text-ink/70 border border-neutral-200",
  muted: "bg-neutral-50 border border-border text-muted",
};

function BoardPanel() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div>
      <div
        data-showcase="item"
        className="mb-6 grid grid-cols-[1.5fr_1.3fr_1fr_1fr_0.8fr] gap-4 rounded-lg bg-lavender-50 p-4"
      >
        <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-primary">
          <HugeiconsIcon icon={UserIcon} size={12} strokeWidth={2} />
          Client
        </span>
        <span className="text-[11px] font-bold tracking-[0.1em] text-primary">Notice type</span>
        <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-primary">
          <HugeiconsIcon icon={Calendar01Icon} size={12} strokeWidth={2} />
          Deadline
        </span>
        <span className="text-[11px] font-bold tracking-[0.1em] text-primary">Status</span>
        <span className="text-[11px] font-bold tracking-[0.1em] text-primary">Amount</span>
      </div>
      <div className="space-y-2">
        {NOTICES.map((n, idx) => (
          <div
            key={n.client}
            data-showcase="item"
            onMouseEnter={() => setHoveredRow(idx)}
            onMouseLeave={() => setHoveredRow(null)}
            className={`group relative grid grid-cols-[1.5fr_1.3fr_1fr_1fr_0.8fr] items-center gap-4 rounded-lg border p-4 transition-all duration-200 ${
              hoveredRow === idx
                ? "border-primary/30 bg-lavender-50/50 shadow-md"
                : "border-border bg-white hover:bg-neutral-50"
            }`}
          >
            {n.urgent && (
              <div className="absolute -left-1 -top-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <HugeiconsIcon icon={AlertCircleIcon} size={12} strokeWidth={2.5} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lavender-50 font-bold text-primary transition-transform group-hover:scale-110">
                {n.client.charAt(0)}
              </div>
              <span className="font-semibold text-ink">{n.client}</span>
            </div>

            <span className="text-[13px] text-ink/70">{n.type}</span>

            <span className={`text-[13px] font-medium ${n.urgent ? "text-primary" : "text-ink/60"}`}>
              {n.deadline}
            </span>

            <span className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-[11px] font-semibold ${STATUS_STYLES[n.tone]}`}>
              {n.status}
            </span>

            {n.amount && (
              <span className="font-semibold text-secondary-dark">{n.amount}</span>
            )}

            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailPanel() {
  const events = [
    { text: "Notice ingested", time: "10:42 AM", icon: LegalDocument01Icon },
    { text: "AI classification complete", time: "10:44 AM", icon: SparklesIcon },
    { text: "Draft generated", time: "10:47 AM", icon: AiMagicIcon },
  ];

  const fields = [
    { label: "Notice type", value: "Section 73", icon: LegalDocument01Icon },
    { label: "Issuing authority", value: "CGST Range 4", icon: UserIcon },
    { label: "Deadline", value: "12 days", icon: Calendar01Icon },
    { label: "GST portal match", value: "Confirmed", icon: CheckmarkCircle02Icon },
  ];

  return (
    <div>
      <div data-showcase="item" className="mb-6 overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-lavender-50 to-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-[20px] font-bold text-white shadow-lg">
              A
            </div>
            <div>
              <p className="text-[17px] font-bold text-ink">ABC Industries</p>
              <p className="text-[13px] text-ink/60">Section 73 notice</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 text-[12px] font-medium text-primary">
                  <HugeiconsIcon icon={AlertCircleIcon} size={14} strokeWidth={2} />
                  Due in 2 days
                </span>
              </div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-lavender-100 px-3 py-1.5 text-[11px] font-bold text-primary shadow-sm">
            <HugeiconsIcon icon={SparklesIcon} size={12} strokeWidth={2.5} />
            Needs review
          </span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        {fields.map((f) => (
          <div
            key={f.label}
            data-showcase="item"
            className="group relative overflow-hidden rounded-xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-muted">{f.label}</p>
              <div className="rounded-lg bg-lavender-50 p-2 transition-colors group-hover:bg-lavender-100">
                <HugeiconsIcon icon={f.icon} size={14} strokeWidth={2} className="text-primary" />
              </div>
            </div>
            <p className="text-[15px] font-bold text-ink">{f.value}</p>
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-neutral-50 p-5">
        <p className="mb-4 flex items-center gap-2 text-[13px] font-bold text-ink">
          <HugeiconsIcon icon={Route02Icon} size={16} strokeWidth={2} className="text-primary" />
          Activity timeline
        </p>
        <div className="space-y-4">
          {events.map((event, idx) => (
            <div
              key={event.text}
              data-showcase="item"
              className="flex items-start gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
                <HugeiconsIcon icon={event.icon} size={16} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-ink">{event.text}</p>
                <p className="text-[11px] text-muted">{event.time}</p>
              </div>
              {idx < events.length - 1 && (
                <div className="absolute left-[18px] mt-9 h-4 w-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DraftPanel() {
  return (
    <div>
      <div data-showcase="item" className="mb-6 overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-lavender-50 to-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-lg">
              <HugeiconsIcon icon={PencilEdit01Icon} size={22} strokeWidth={2} className="text-white" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-ink">Draft reply — ABC Industries</p>
              <p className="text-[12px] text-ink/60">Section 73 response</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-lavender-100 to-cream-100 px-3 py-1.5 shadow-sm">
            <HugeiconsIcon icon={AiMagicIcon} size={14} strokeWidth={2.5} className="text-primary" />
            <span className="text-[11px] font-bold text-primary">AI-generated</span>
          </div>
        </div>
      </div>

      <div data-showcase="item" className="mb-6 overflow-hidden rounded-xl border border-border bg-white p-6 shadow-sm">
        <p className="mb-4 text-[13px] font-bold text-ink">Response preview</p>
        <div className="space-y-3">
          {[100, 92, 85, 70].map((w, i) => (
            <div
              key={i}
              data-showcase="item"
              className="h-2.5 rounded-full bg-neutral-100"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-[12px] text-ink/55">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          Grammar &amp; legal accuracy verified
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button data-showcase="item" className="group flex h-[39px] items-center gap-[10px] rounded-[11.7px] border border-border bg-white px-[15px] py-[10px] text-[13px] font-semibold text-ink shadow-sm transition-all hover:border-primary/30 hover:bg-lavender-50 hover:shadow-md">
          <HugeiconsIcon icon={PencilEdit01Icon} size={16} strokeWidth={2} />
          Edit draft
        </button>
        <button data-showcase="item" className="group flex h-[39px] items-center gap-[10px] rounded-[11.7px] border border-transparent bg-gradient-to-r from-primary to-primary-dark px-[15px] py-[10px] text-[13px] font-semibold text-white shadow-md transition-all hover:shadow-lg">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2} />
          Approve & send
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
        </button>
        <button data-showcase="item" className="group flex h-[39px] items-center gap-[10px] rounded-[11.7px] border border-border bg-white px-[15px] py-[10px] text-[13px] font-semibold text-ink shadow-sm transition-all hover:border-primary/30 hover:bg-lavender-50 hover:shadow-md">
          <HugeiconsIcon icon={Exchange01Icon} size={16} strokeWidth={2} />
          Regenerate
        </button>
      </div>
    </div>
  );
}

function TrackingPanel() {
  const steps = [
    { label: "Hearing", done: true, date: "Jan 15", icon: Calendar01Icon },
    { label: "Response", done: true, date: "Jan 22", icon: LegalDocument01Icon },
    { label: "Order", current: true, date: "Feb 05", icon: Route02Icon },
    { label: "Payment", done: false, date: "TBD", icon: CheckmarkCircle02Icon },
  ];

  return (
    <div>
      <div data-showcase="item" className="mb-6 overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-lavender-50 to-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-lg">
              <HugeiconsIcon icon={Route02Icon} size={22} strokeWidth={2} className="text-white" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-ink">Case timeline</p>
              <p className="text-[12px] text-ink/60">ABC Industries · Section 73</p>
            </div>
          </div>
          <span className="rounded-[3px] bg-neutral-100 px-3 py-1.5 text-[11px] font-bold tracking-[0.06em] text-ink/70">
            In progress
          </span>
        </div>
      </div>

      <div className="mb-6 space-y-2">
        {steps.map((step) => (
          <div
            key={step.label}
            data-showcase="item"
            className={`group relative overflow-hidden rounded-xl border p-5 transition-all ${
              step.current
                ? "border-primary bg-lavender-50/50 shadow-md"
                : step.done
                  ? "border-border bg-white hover:bg-neutral-50"
                  : "border-border bg-neutral-50/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-all ${
                  step.done
                    ? "border-primary bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg"
                    : step.current
                      ? "border-primary bg-white text-primary shadow-md"
                      : "border-neutral-300 bg-white text-neutral-400"
                }`}
              >
                {step.done ? (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} strokeWidth={2.5} />
                ) : (
                  <HugeiconsIcon icon={step.icon} size={20} strokeWidth={2} />
                )}
              </div>

              <div className="flex-1">
                <p className={`text-[15px] font-bold ${step.current ? "text-primary" : "text-ink"}`}>
                  {step.label}
                </p>
                <p className="text-[12px] text-ink/60">{step.date}</p>
              </div>

              {step.current && (
                <HugeiconsIcon icon={Calendar01Icon} size={18} strokeWidth={1.8} className="animate-pulse text-primary" />
              )}
            </div>
            {step.current && (
              <div className="absolute bottom-0 left-0 h-1 w-full bg-primary" />
            )}
          </div>
        ))}
      </div>

      <div data-showcase="item" className="flex items-center justify-between rounded-xl border border-border bg-neutral-50 p-5">
        <p className="text-[13px] text-ink/60">
          Recovery risk: <span className="font-semibold text-secondary-dark">Low</span>
        </p>
      </div>
    </div>
  );
}

const PANELS = [BoardPanel, DetailPanel, DraftPanel, TrackingPanel];

export function ProductShowcase({ onRequestDemo }: { onRequestDemo: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mounted = useRef(false);
  const activeTabRef = useRef(activeTab);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Matter loads with font-display: swap — if the tab bar first measures
  // itself on the fallback font, the underline locks in the wrong
  // width/position and never re-checks. Snap it once fonts settle.
  useEffect(() => {
    document.fonts?.ready.then(() => {
      const container = containerRef.current;
      const indicator = indicatorRef.current;
      const activeTabEl = tabRefs.current[activeTabRef.current];
      if (!container || !indicator || !activeTabEl) return;

      const { gsap } = getGsap();
      gsap.set(indicator, {
        x: activeTabEl.getBoundingClientRect().left - container.getBoundingClientRect().left,
        width: activeTabEl.getBoundingClientRect().width,
      });
    });
  }, []);

  useEffect(() => {
    const { gsap } = getGsap();
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    const activeTabEl = tabRefs.current[activeTab];
    const panels = panelRefs.current.filter((p): p is HTMLDivElement => !!p);

    if (container && indicator && activeTabEl) {
      if (reducedMotion) {
        gsap.set(indicator, {
          x: activeTabEl.getBoundingClientRect().left - container.getBoundingClientRect().left,
          width: activeTabEl.getBoundingClientRect().width,
        });
      } else {
        moveTabIndicator(gsap, indicator, activeTabEl, container);
      }
    }

    if (panels.length === PANELS.length) {
      if (reducedMotion) {
        switchPanelInstant(gsap, panels, activeTab);
      } else if (!mounted.current) {
        gsap.set(panels, { opacity: 0, x: 10, pointerEvents: "none" });
        switchPanel(gsap, panels, activeTab);
        mounted.current = true;
      } else {
        switchPanel(gsap, panels, activeTab);
      }
    }
  }, [activeTab, reducedMotion]);

  return (
    <section id="product" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <span className="mb-5 inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.14em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          Product
        </span>

        <h2 className="max-w-[680px] text-[32px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[38px] lg:text-[42px]">
          One workspace for every notice.
        </h2>
        <p className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-ink/60">
          Move seamlessly between the board, case details, draft replies and
          tracking — it&apos;s the same workspace throughout.
        </p>

        <div
          ref={containerRef}
          className="relative mt-12 flex gap-2 overflow-x-auto rounded-xl border border-border bg-white p-2 shadow-sm"
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`relative flex h-[39px] items-center gap-[10px] rounded-[11.7px] border border-transparent px-[15px] py-[10px] text-[14px] font-semibold transition-all ${
                activeTab === i
                  ? "bg-lavender-50 text-primary shadow-sm"
                  : "text-ink/60 hover:bg-neutral-50 hover:text-ink"
              }`}
            >
              <HugeiconsIcon icon={tab.icon} size={18} strokeWidth={2} />
              {tab.label}
            </button>
          ))}
          <div
            ref={indicatorRef}
            className="absolute bottom-1 left-0 h-1 rounded-full bg-gradient-to-r from-primary to-primary-soft"
            style={{ width: 0 }}
          />
        </div>

        <div className="relative mt-8 min-h-[480px] overflow-hidden rounded-2xl border-2 border-border bg-white shadow-[0_4px_6px_rgba(24,21,31,0.04),0_40px_80px_-32px_rgba(24,21,31,0.25)]">
          <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-primary to-primary-soft" />

          <div className="p-8">
            {PANELS.map((Panel, i) => (
              <div
                key={TABS[i].key}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="absolute inset-8"
              >
                <Panel />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            const { gsap } = getGsap();
            spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, "rgba(201,175,128,0.4)");
            onRequestDemo();
          }}
          className="group relative mt-8 inline-flex h-[39px] items-center gap-[10px] overflow-hidden rounded-[11.7px] border border-transparent px-[15px] py-[10px] text-[14.5px] font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          See it on your own notices
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            strokeWidth={2}
            className="transition-transform duration-200 ease-out group-hover:translate-x-1"
          />
        </button>
      </div>
    </section>
  );
}
