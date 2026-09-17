import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Litwatch — AI-powered GST notice management for tax consultants",
  description:
    "Litwatch helps tax consultants ingest, classify, draft and track GST notices across clients — with AI doing the heavy lifting and you staying in control.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased no-js"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <Script id="remove-no-js" strategy="beforeInteractive">
          {"document.documentElement.classList.remove('no-js')"}
        </Script>
        {children}
      </body>
    </html>
  );
}
