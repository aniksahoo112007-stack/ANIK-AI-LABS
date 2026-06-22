import type { SiteContent } from "./types";
import { siteData } from "./site-data";

// ---------------------------------------------------------------------------
// DEFAULT WEBSITE CONTENT
// ---------------------------------------------------------------------------
// The permanent source of truth lives in lib/site-data.ts (`siteData`).
// We re-export it here as `defaultContent` so the rest of the app keeps using
// a single, stable name. The website loads this first; localStorage (admin
// edits) only override it for preview on the current browser.
// ---------------------------------------------------------------------------

export const defaultContent: SiteContent = siteData;

// ---------------------------------------------------------------------------
// STATIC DATA (not edited in the admin panel)
// ---------------------------------------------------------------------------

export const workflowSteps = [
  { label: "Website Visitor", desc: "Lands on your site" },
  { label: "Ask Developer Form", desc: "Submits project details" },
  { label: "AI Lead Assistant", desc: "Qualifies & summarizes" },
  { label: "Google Sheet CRM", desc: "Logs lead automatically" },
  { label: "Telegram Notification", desc: "Instant alert to you" },
  { label: "WhatsApp Conversation", desc: "Direct chat begins" },
  { label: "Project Discussion", desc: "Scope, quote & kickoff" },
];

export const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#workflow", label: "Workflow" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

// Re-export the content type for convenience.
export type { SiteContent } from "./types";
