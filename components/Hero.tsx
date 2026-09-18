"use client";

import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { buildHeroAmbient, buildHeroTimeline } from "@/animations/heroAnimations";
import { spawnRipple } from "@/animations/microInteractions";
import { NoticeJourneyCard } from "@/components/NoticeJourneyCard";

export function Hero({ onRequestDemo }: { onRequestDemo: () => void }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const { gsap } = getGsap();
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      const tl = buildHeroTimeline(gsap, root);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let ambient: ReturnType<typeof buildHeroAmbient> = null;
      if (!reduceMotion) {
        tl.eventCallback("onComplete", () => {
          ambient = buildHeroAmbient(gsap, root);
        });
      } else {
        tl.progress(1);
      }

      // GSAP has now set the timeline's initial (or, for reduced motion,
      // final) inline styles above — safe to reveal the wrapper.
      root.setAttribute("data-hero-ready", "");

      return () => {
        ambient?.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  const handleCtaClick = (
    e: React.MouseEvent<HTMLElement>,
    tint: string,
    action?: () => void,
  ) => {
    const { gsap } = getGsap();
    spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, tint);
    action?.();
  };

  return (
    <section
      id="top"
      ref={rootRef}
      data-hero-root
      className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(55,30,113,0.09) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 68% 42%, black 0%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 68% 42%, black 0%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1360px] gap-16 px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div className="flex flex-col justify-center lg:col-span-5">
          <span
            data-hero="eyebrow"
            className="mb-6 inline-flex w-fit items-center gap-2 text-[14px] font-medium tracking-[0.14em] text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            AI-powered GST notice management
          </span>

          <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[48px] lg:text-[54px]">
            <span className="block overflow-hidden">
              <span data-hero="headline-line" className="block">
                Turn GST notices into
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero="headline-line" className="block">
                clear next actions.
              </span>
            </span>
          </h1>

          <p
            data-hero="paragraph"
            className="mt-6 max-w-[480px] text-[16.5px] leading-relaxed text-ink/65"
          >
            LitWatch helps tax consultants manage GST notices across clients - 
            from intake and classification to validation, drafting and tracking, 
            with AI assisting and you staying in control.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              data-hero="cta-btn"
              onClick={(e) =>
                handleCtaClick(e, "rgba(201,175,128,0.45)", onRequestDemo)
              }
              className="group relative inline-flex h-[39px] items-center gap-[10px] overflow-hidden rounded-[11.7px] border border-primary bg-primary px-[15px] py-[10px] text-[14.5px] font-medium text-white transition-[background-color,transform] duration-200 hover:bg-primary-dark active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Request a demo
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              />
            </button>
            <a
              href="#workflow"
              data-hero="cta-btn"
              onClick={(e) => handleCtaClick(e, "rgba(55,30,113,0.1)")}
              className="group relative inline-flex h-[39px] items-center gap-[10px] overflow-hidden rounded-[11.7px] border border-secondary bg-secondary px-[15px] py-[10px] text-[14.5px] font-medium text-ink transition-colors duration-200 hover:border-secondary-dark hover:bg-secondary-dark active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Explore how it works
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        <div className="relative flex items-center lg:col-span-6 lg:col-start-7">
          <NoticeJourneyCard />
        </div>
      </div>
    </section>
  );
}
