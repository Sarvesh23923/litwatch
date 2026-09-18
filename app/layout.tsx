import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-assisted GST notice management for tax consultants, CA firms and businesses",
  description:
    "Manage GST notices across clients and GSTINs with LitWatch. Track deadlines, validate notice data, create AI-assisted drafts and manage cases in one controlled workflow",
  keywords: [
    "GST notice management",
    "GST notice software",
    "GST notice management software",
    "GST notice tracking",
    "GST compliance software",
    "GST notice AI",
    "GST software for CA",
    "GST software for tax consultants",
    "GST litigation management",
    "GST notice tracker",
  ],
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
