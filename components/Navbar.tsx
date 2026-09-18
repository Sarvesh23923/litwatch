"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

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

  // Avoid a stuck-open mobile panel if the viewport is resized past the
  // lg breakpoint (e.g. rotating a tablet, or a resizable desktop window).
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleRequestDemo = () => {
    closeMenu();
    onRequestDemo();
  };

  const isSolid = scrolled || menuOpen;

  return (
    <header
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-300 ease-out ${
        isSolid
          ? "border-b border-border bg-offwhite/90 backdrop-saturate-150 py-3"
          : "border-b border-transparent bg-transparent py-5"
      }`}
      style={isSolid ? { backdropFilter: "blur(6px)" } : undefined}
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 lg:px-10">
        <a href="#top" className="shrink-0" onClick={closeMenu}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.svg"
            alt="Litwatch"
            className="h-auto w-[160px] sm:w-[190px] lg:w-[220px]"
          />
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRequestDemo}
            className="group hidden h-[39px] items-center gap-[10px] rounded-[11.7px] border border-primary bg-primary px-[15px] py-[10px] text-[14px] font-medium text-white transition-colors hover:bg-primary-dark lg:inline-flex"
          >
            Request a demo
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[11.7px] border border-border text-ink transition-colors hover:border-primary/40 lg:hidden"
          >
            <HugeiconsIcon
              icon={menuOpen ? Cancel01Icon : Menu01Icon}
              size={20}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-offwhite px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-[16px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleRequestDemo}
            className="mt-6 inline-flex h-[42px] w-full items-center justify-center gap-[10px] rounded-[11.7px] border border-primary bg-primary text-[14.5px] font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Request a demo
            <span aria-hidden>→</span>
          </button>
        </div>
      )}
    </header>
  );
}
