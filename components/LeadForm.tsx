"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { getGsap } from "@/lib/gsap";
import { submitLead, type EntryPoint } from "@/services/leadService";
import { spawnRipple } from "@/animations/microInteractions";

interface LeadFormProps {
  open: boolean;
  entryPoint: EntryPoint;
  onClose: () => void;
}

const PRACTICE_SIZES = [
  "1–10 clients",
  "11–50 clients",
  "51–150 clients",
  "150+ clients",
];

const EMPTY_VALUES = {
  name: "",
  email: "",
  phone: "",
  company: "",
  practiceSize: "",
  city: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export function LeadForm({ open, entryPoint, onClose }: LeadFormProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [values, setValues] = useState(EMPTY_VALUES);

  const handleClose = () => {
    if (status === "submitting") return;
    const { gsap } = getGsap();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      onClose();
      setTimeout(() => {
        setStatus("idle");
        setValues(EMPTY_VALUES);
      }, 0);
      return;
    }

    gsap.to(panelRef.current, { opacity: 0, y: 12, duration: 0.22, ease: "power2.in" });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      delay: 0.04,
      onComplete: () => {
        onClose();
        setStatus("idle");
        setValues(EMPTY_VALUES);
      },
    });
  };

  useEffect(() => {
    if (!open) return;
    const { gsap } = getGsap();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.05 },
      );
      gsap.fromTo(
        '[data-lead="field"]',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, delay: 0.18, ease: "power2.out" },
      );
    });

    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const update =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    const result = await submitLead({ ...values, entryPoint });

    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error);
    }
  };

  const handleRippleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    tint = "rgba(201,175,128,0.4)",
  ) => {
    const { gsap } = getGsap();
    spawnRipple(gsap, e.currentTarget, e.clientX, e.clientY, tint);
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Request a demo"
      className="fixed inset-0 z-[100] flex items-stretch justify-center bg-ink/45 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        ref={panelRef}
        className="relative flex h-full w-full flex-col overflow-y-auto bg-white sm:h-auto sm:max-h-[88vh] sm:max-w-[460px] sm:rounded-lg sm:border sm:border-border sm:shadow-[0_40px_80px_-32px_rgba(24,21,31,0.35)]"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-neutral-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
        </button>

        {status === "success" ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-lavender-100 text-primary">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} strokeWidth={2} />
            </div>
            <h3 className="text-[21px] font-semibold text-ink">
              Thanks — we&apos;ll be in touch.
            </h3>
            <p className="mt-2 max-w-[300px] text-[14.5px] leading-relaxed text-ink/60">
              Your request has been received. Our team will get back to you
              shortly.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-8 rounded-[3px] border border-border px-5 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:bg-neutral-50"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="px-7 pb-8 pt-16 sm:px-8 sm:pt-9">
            <p className="mb-1.5 text-[11.5px] font-medium uppercase tracking-[0.12em] text-muted">
              Request a demo
            </p>
            <h3 className="mb-6 text-[21px] font-semibold text-ink">
              Tell us about your practice
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div data-lead="field">
                <label htmlFor="lead-name" className="mb-1.5 block text-[12.5px] font-medium text-ink/70">
                  Full name
                </label>
                <input
                  ref={firstFieldRef}
                  id="lead-name"
                  required
                  autoComplete="name"
                  value={values.name}
                  onChange={update("name")}
                  className="w-full rounded-[3px] border border-border bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-primary"
                />
              </div>

              <div data-lead="field">
                <label htmlFor="lead-email" className="mb-1.5 block text-[12.5px] font-medium text-ink/70">
                  Work email
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={values.email}
                  onChange={update("email")}
                  className="w-full rounded-[3px] border border-border bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div data-lead="field">
                  <label htmlFor="lead-phone" className="mb-1.5 block text-[12.5px] font-medium text-ink/70">
                    Phone number
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={values.phone}
                    onChange={update("phone")}
                    className="w-full rounded-[3px] border border-border bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div data-lead="field">
                  <label htmlFor="lead-city" className="mb-1.5 block text-[12.5px] font-medium text-ink/70">
                    City <span className="text-ink/40">(optional)</span>
                  </label>
                  <input
                    id="lead-city"
                    autoComplete="address-level2"
                    value={values.city}
                    onChange={update("city")}
                    className="w-full rounded-[3px] border border-border bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>

              <div data-lead="field">
                <label htmlFor="lead-company" className="mb-1.5 block text-[12.5px] font-medium text-ink/70">
                  Firm / organization
                </label>
                <input
                  id="lead-company"
                  required
                  autoComplete="organization"
                  value={values.company}
                  onChange={update("company")}
                  className="w-full rounded-[3px] border border-border bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-primary"
                />
              </div>

              <div data-lead="field">
                <label htmlFor="lead-practice-size" className="mb-1.5 block text-[12.5px] font-medium text-ink/70">
                  Number of clients / practice size
                </label>
                <select
                  id="lead-practice-size"
                  required
                  value={values.practiceSize}
                  onChange={update("practiceSize")}
                  className="w-full rounded-[3px] border border-border bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-primary"
                >
                  <option value="" disabled>
                    Select a range
                  </option>
                  {PRACTICE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div data-lead="field">
                <label htmlFor="lead-message" className="mb-1.5 block text-[12.5px] font-medium text-ink/70">
                  What would you like to know? <span className="text-ink/40">(optional)</span>
                </label>
                <textarea
                  id="lead-message"
                  rows={3}
                  value={values.message}
                  onChange={update("message")}
                  className="w-full resize-none rounded-[3px] border border-border bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-primary"
                />
              </div>

              {status === "error" && (
                <p data-lead="field" className="text-[13px] text-primary">
                  {errorMsg || "Something went wrong. Please try again."}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                onClick={(e) => handleRippleClick(e)}
                data-lead="field"
                className="relative mt-2 w-full overflow-hidden rounded-[3px] bg-primary px-5 py-3 text-[14.5px] font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? "Sending…" : "Request a demo"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
