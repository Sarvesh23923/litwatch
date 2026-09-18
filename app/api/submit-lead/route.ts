import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  company: string;
  practiceSize: string;
  city?: string;
  message?: string;
  source?: string;
  entryPoint?: string;
}

const REQUIRED_FIELDS: (keyof LeadPayload)[] = [
  "name",
  "email",
  "phone",
  "company",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function csvEscape(value: string) {
  const escaped = value.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

/**
 * Lead destination.
 *
 * Local dev / no integration configured: appends a row to
 * data/leads.csv (Excel-openable). This is a real, working store — not
 * a stub — but on serverless hosts (Vercel etc.) the filesystem is
 * ephemeral, so this is a development fallback, not a production one.
 *
 * To go live against real Excel:
 *   Option A — Microsoft Graph / Power Automate: set LEAD_API_URL to a
 *   Power Automate "When an HTTP request is received" flow that writes
 *   into the workbook identified by EXCEL_WORKBOOK_ID / EXCEL_SHEET_ID,
 *   and LEAD_API_KEY if the flow requires a bearer token.
 *   Option B — Google Sheets: set LEAD_API_URL to an Apps Script Web
 *   App URL that appends a row.
 * Either way, once LEAD_API_URL is set this handler forwards the
 * payload there instead of touching the local CSV — no UI changes
 * needed.
 */
export async function POST(request: Request) {
  let payload: Partial<LeadPayload>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    const value = payload[field];
    if (!value || !String(value).trim()) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }
  }

  if (!EMAIL_RE.test(payload.email!.trim())) {
    return NextResponse.json(
      { error: "Enter a valid work email." },
      { status: 400 },
    );
  }

  const row = [
    new Date().toISOString(),
    payload.name,
    payload.email,
    payload.phone,
    payload.company,
    payload.practiceSize,
    payload.city ?? "",
    payload.message ?? "",
    payload.source ?? "litwatch-web",
    payload.entryPoint ?? "unknown",
  ]
    .map((value) => csvEscape(String(value)))
    .join(",");

  if (process.env.LEAD_API_URL) {
    try {
      const upstream = await fetch(process.env.LEAD_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEAD_API_KEY
            ? { Authorization: `Bearer ${process.env.LEAD_API_KEY}` }
            : {}),
        },
        // Google Apps Script Web Apps can't read custom headers, so the
        // key also travels in the body for that integration path.
        body: JSON.stringify({
          ...payload,
          ...(process.env.LEAD_API_KEY ? { apiKey: process.env.LEAD_API_KEY } : {}),
        }),
      });
      if (!upstream.ok) throw new Error(`Upstream responded ${upstream.status}`);

      // Apps Script always returns HTTP 200, so failures must be read
      // from the body. Other integrations that omit `ok` are treated
      // as successful based on status alone.
      const data = await upstream.json().catch(() => null);
      if (data && data.ok === false) {
        throw new Error(data.error ?? "Upstream rejected the lead.");
      }

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 },
      );
    }
  }

  try {
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "leads.csv");
    await fs.mkdir(dataDir, { recursive: true });

    let needsHeader = false;
    try {
      await fs.access(filePath);
    } catch {
      needsHeader = true;
    }

    const header =
      "Timestamp,Full Name,Work Email,Phone Number,Firm/Organization,Practice Size,City,Message,Source,Entry Point\n";
    await fs.appendFile(filePath, (needsHeader ? header : "") + row + "\n", "utf8");
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
