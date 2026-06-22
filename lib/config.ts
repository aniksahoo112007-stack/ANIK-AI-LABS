// ---------------------------------------------------------------------------
// LEAD FORM CONFIG
// ---------------------------------------------------------------------------
// To connect the "Ask Developer" form to your n8n workflow:
//   1. In n8n, create a Webhook node (HTTP POST) and copy its Production URL.
//   2. Paste that URL below (or set NEXT_PUBLIC_N8N_WEBHOOK_URL in .env.local).
//   3. The form will POST JSON: { name, email, phone, projectInterest,
//      budgetRange, message, submittedAt }.
//   4. From n8n, branch into: AI Lead Assistant -> Google Sheet CRM ->
//      Telegram Notification -> WhatsApp.
//
// While this is empty, the form simply shows a success message (no backend).
// ---------------------------------------------------------------------------

export const N8N_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? "";

export const projectInterestOptions = [
  "FileMind",
  "Nandarani POS",
  "Nandarani Catalog",
  "AI Data Detective",
  "Custom Software",
  "AI Automation",
  "Business Dashboard",
  "Website Development",
  "Other",
];

export const budgetRangeOptions = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Not sure yet",
];
