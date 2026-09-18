/**
 * Google Apps Script Web App that appends litwatch-web leads to a Sheet.
 *
 * Setup:
 *  1. Create/open the target Google Sheet.
 *  2. Extensions -> Apps Script, paste this file's contents in as Code.gs.
 *  3. Project Settings -> Script Properties -> add LEAD_API_KEY with a
 *     long random value. This must match the LEAD_API_KEY env var set
 *     on the Next.js app.
 *  4. Deploy -> New deployment -> type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *  5. Copy the deployment URL into LEAD_API_URL on the Next.js app.
 *
 * Redeploy (Deploy -> Manage deployments -> edit -> New version) after
 * any edit to this file, otherwise the live Web App keeps running the
 * old code.
 */

const SHEET_NAME = "Leads";

const COLUMNS = [
  "Timestamp",
  "Full Name",
  "Work Email",
  "Phone Number",
  "Firm/Organization",
  "Practice Size",
  "City",
  "Message",
  "Source",
  "Entry Point",
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    const expectedKey = PropertiesService.getScriptProperties().getProperty("LEAD_API_KEY");
    if (expectedKey && body.apiKey !== expectedKey) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    if (!body.name || !body.email || !body.phone || !body.company || !body.practiceSize) {
      return jsonResponse({ ok: false, error: "Missing required fields." });
    }

    const sheet = getOrCreateSheet();
    sheet.appendRow([
      new Date(),
      body.name,
      body.email,
      body.phone,
      body.company,
      body.practiceSize,
      body.city || "",
      body.message || "",
      body.source || "litwatch-web",
      body.entryPoint || "unknown",
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
  }
  return sheet;
}

// Apps Script Web Apps always respond with HTTP 200; failures are
// signalled via the `ok` field in the JSON body, not the status code.
function jsonResponse(payload) {
  const output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
