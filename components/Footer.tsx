const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "For consultants", href: "#trust" },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[320px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.svg" alt="Litwatch" className="h-auto w-[140px] sm:w-[180px] lg:w-[220px]" />
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink/55">
              {/* AI-powered GST notice management, built for tax consultants
              and CA firms. */}
              Built for consultants. Governed by statute. Approved by you
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13.5px] text-ink/60 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-[12.5px] text-ink/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Litwatch. All rights reserved.</p>
          <p>Built for consultants. Designed for speed.</p>
        </div>
      </div>
    </footer>
  );
}
