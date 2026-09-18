"use client";

import { useEffect, useRef, useState } from "react";
import { getGsap } from "@/lib/gsap";

const NAV_LINKS = [
  // { label: "Product", href: "#product" },
  { label: "How it works", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "For consultants", href: "#trust" },
  // { label: "FAQ", href: "#faq" },
];

export function Navbar({ onRequestDemo }: { onRequestDemo: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const floaterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 },
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const { gsap } = getGsap();
    const mq = window.matchMedia("(max-width: 767px)");
    let played = false;

    const playPopIn = () => {
      if (played || !mq.matches || !floaterRef.current) return;
      played = true;
      gsap.fromTo(
        floaterRef.current,
        { opacity: 0, scale: 0.6, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)", delay: 1.2 },
      );
    };

    playPopIn();
    mq.addEventListener("change", playPopIn);
    return () => mq.removeEventListener("change", playPopIn);
  }, []);

  return (
    <>
      <header
        ref={navRef}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-300 ease-out ${
          scrolled
            ? "border-b border-border bg-offwhite/90 backdrop-saturate-150 py-3"
            : "border-b border-transparent bg-transparent py-5"
        }`}
        style={scrolled ? { backdropFilter: "blur(6px)" } : undefined}
      >
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 lg:px-10">
          <a href="#top" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.svg" alt="Litwatch" className="h-auto w-[140px] sm:w-[180px] lg:w-[220px]" />
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14.5px] text-ink/70 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={onRequestDemo}
            className="group hidden h-[39px] items-center gap-[10px] rounded-[11.7px] border border-primary bg-primary px-[15px] py-[10px] text-[14px] font-medium text-white transition-colors hover:bg-primary-dark md:inline-flex"
          >
            Request a demo
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </div>
      </header>

      <button
        ref={floaterRef}
        type="button"
        onClick={onRequestDemo}
        className="fixed bottom-5 right-5 z-50 inline-flex h-[46px] items-center gap-2 rounded-full border border-primary bg-primary px-5 text-[14px] font-medium text-white opacity-0 shadow-lg shadow-primary/30 transition-transform active:scale-95 md:hidden"
      >
        Request a demo
        <span aria-hidden className="inline-block">→</span>
      </button>
    </>
  );
}
