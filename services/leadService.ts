export type EntryPoint =
  | "hero"
  | "workflow"
  | "product_showcase"
  | "features"
  | "control_tower"
  | "final_cta";

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  practiceSize: string;
  city?: string;
  message?: string;
  entryPoint: EntryPoint;
}

export type SubmitLeadResult = { ok: true } | { ok: false; error: string };

/**
 * The UI never knows or cares where a lead actually lands — Excel,
 * Microsoft Graph, Google Sheets, a database, a webhook. It just calls
 * this function. Swapping the destination is a server-side change in
 * app/api/submit-lead/route.ts, not a UI change.
 */
export async function submitLead(input: LeadInput): Promise<SubmitLeadResult> {
  try {
    const res = await fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, source: "litwatch-web" }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        ok: false,
        error: data.error ?? "Something went wrong. Please try again.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
