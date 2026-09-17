"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  ArrowRight02Icon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  FileSearchIcon,
  Route02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { revealOnScroll } from "@/animations/scrollReveal";
import { spawnRipple } from "@/animations/microInteractions";

const CLIENTS = ["ABC Industries", "Meridian Textiles", "Kavya Apparels", "Orion Logistics"];

export function FeaturesSection({ onRequestDemo }: { onRequestDemo: () => void }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const root = rootRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      revealOnScroll(gsap, ScrollTrigger, root, '[data-feature="tile"]', { stagger: 0.1 });
    }, root);

    return () => ctx.revert();
  }, []);

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { gsap } = getGsap();
    spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, "rgba(201,175,128,0.4)");
    onRequestDemo();
  };

  return (
    <section id="features" ref={rootRef} className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <span className="mb-2 inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.14em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          Features
        </span>
        <h2 className="max-w-[680px] text-[32px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[38px] lg:text-[42px]">
          Everything a notice needs, in one place.
        </h2>

        <div className="mt-14 grid grid-cols-12 gap-5">
          {/* Notice intelligence — large */}
          <div
            data-feature="tile"
            className="col-span-12 rounded-lg border border-border bg-white p-8 lg:col-span-7"
          >
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-lavender-50 text-primary">
              <HugeiconsIcon icon={FileSearchIcon} size={18} strokeWidth={1.8} />
            </div>
            <h3 className="mb-2 text-[18px] font-semibold text-ink">Notice intelligence</h3>
            <p className="mb-6 max-w-[420px] text-[14.5px] leading-relaxed text-ink/60">
              Extract important details from incoming notices — client,
              notice type, issuing authority and the dates that matter —
              without opening every PDF by hand.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Section 73", "CGST Range 4", "Deadline: 12 days"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-[3px] border border-border bg-neutral-50 px-2.5 py-1.5 text-[12px] font-medium text-ink/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Deadline awareness */}
          <div
            data-feature="tile"
            className="col-span-12 rounded-lg border border-border bg-white p-8 sm:col-span-6 lg:col-span-5"
          >
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-lavender-50 text-primary">
              <HugeiconsIcon icon={Calendar01Icon} size={18} strokeWidth={1.8} />
            </div>
            <h3 className="mb-2 text-[18px] font-semibold text-ink">Deadline awareness</h3>
            <p className="mb-6 text-[14.5px] leading-relaxed text-ink/60">
              Surface the dates and actions that need attention before they
              get buried in the workday.
            </p>
            <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-lavender-50/60 px-3.5 py-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[13px] font-medium text-primary">Reply due in 2 days</span>
            </div>
          </div>

          {/* AI-assisted drafting */}
          <div
            data-feature="tile"
            className="col-span-12 rounded-lg border border-border bg-white p-8 sm:col-span-6 lg:col-span-4"
          >
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-lavender-50 text-primary">
              <HugeiconsIcon icon={AiMagicIcon} size={18} strokeWidth={1.8} />
            </div>
            <h3 className="mb-2 text-[18px] font-semibold text-ink">AI-assisted drafting</h3>
            <p className="mb-6 text-[14px] leading-relaxed text-ink/60">
              Generate an editable first draft using legal and rule-based
              reasoning — a starting point, not a final answer.
            </p>
            <div className="space-y-2">
              <span className="block h-1.5 w-full rounded-full bg-neutral-100" />
              <span className="block h-1.5 w-[80%] rounded-full bg-neutral-100" />
              <span className="block h-1.5 w-[60%] rounded-full bg-neutral-100" />
            </div>
          </div>

          {/* Reviewer workflow */}
          <div
            data-feature="tile"
            className="col-span-12 rounded-lg border border-border bg-white p-8 sm:col-span-6 lg:col-span-4"
          >
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-lavender-50 text-primary">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={1.8} />
            </div>
            <h3 className="mb-2 text-[18px] font-semibold text-ink">Reviewer workflow</h3>
            <p className="mb-6 text-[14px] leading-relaxed text-ink/60">
              Every draft is routed for review — edit, approve or override
              before anything goes out.
            </p>
            <div className="flex gap-2">
              <span className="rounded-[3px] border border-border bg-white px-2.5 py-1.5 text-[11.5px] font-medium text-ink">Edit</span>
              <span className="rounded-[3px] bg-primary px-2.5 py-1.5 text-[11.5px] font-medium text-white">Approve</span>
            </div>
          </div>

          {/* Case tracking */}
          <div
            data-feature="tile"
            className="col-span-12 rounded-lg border border-border bg-white p-8 sm:col-span-6 lg:col-span-4"
          >
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-lavender-50 text-primary">
              <HugeiconsIcon icon={Route02Icon} size={18} strokeWidth={1.8} />
            </div>
            <h3 className="mb-2 text-[18px] font-semibold text-ink">Case tracking</h3>
            <p className="mb-6 text-[14px] leading-relaxed text-ink/60">
              Track hearings, orders, payments and appeals in one timeline,
              end to end.
            </p>
            <div className="flex items-center">
              {[true, true, false].map((done, i) => (
                <div key={i} className="flex flex-1 items-center last:flex-none">
                  <span className={`h-2.5 w-2.5 rounded-full ${done ? "bg-primary" : "border border-border bg-white"}`} />
                  {i < 2 && <span className="mx-1.5 h-px flex-1 bg-border" />}
                </div>
              ))}
            </div>
          </div>

          {/* Client workspace — wide banner */}
          <div
            data-feature="tile"
            className="col-span-12 flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-white p-8 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-4 sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lavender-50 text-primary">
                <HugeiconsIcon icon={UserGroupIcon} size={18} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="mb-1 text-[18px] font-semibold text-ink">Client workspace</h3>
                <p className="max-w-[440px] text-[14.5px] leading-relaxed text-ink/60">
                  Organize notice activity by client, so every case has a
                  clear home.
                </p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {CLIENTS.map((client) => (
                <div
                  key={client}
                  title={client}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-lavender-100 text-[12px] font-semibold text-primary"
                >
                  {client.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleCtaClick}
            className="group relative inline-flex h-[39px] items-center gap-[10px] overflow-hidden rounded-[11.7px] border border-secondary bg-secondary px-[15px] py-[10px] text-[14.5px] font-medium text-ink transition-colors duration-200 hover:border-secondary-dark hover:bg-secondary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            See it on your notices
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
