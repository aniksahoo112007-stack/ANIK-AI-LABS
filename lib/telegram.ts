import type { AssistantContent } from "./types";

// ===========================================================================
// TELEGRAM BOT — status + deep-link helpers (single source of truth)
// ===========================================================================
// Bot is ACTIVE only when a URL is set AND status === "active".
// Used by: navbar AI Assistant button, AI Assistant section, AI CMO dashboard
// status card, and the admin preview button — so they always agree.
// ===========================================================================

// Fallback bot username when none can be extracted from the admin URL.
const DEFAULT_TELEGRAM_USERNAME = "anik_ai_labs_assist";

export function isTelegramActive(assistant: AssistantContent): boolean {
  return (
    assistant.telegramUrl.trim().length > 0 && assistant.status === "active"
  );
}

export function telegramStatusLabel(
  assistant: AssistantContent
): "Active" | "Coming Soon" {
  return isTelegramActive(assistant) ? "Active" : "Coming Soon";
}

// Pull a bare @username out of any Telegram URL/string the admin might enter:
//   https://t.me/foo, t.me/foo, telegram.me/foo, tg://resolve?domain=foo, @foo, foo
export function extractTelegramUsername(url: string): string {
  const u = (url || "").trim();
  if (!u) return "";
  let m = u.match(
    /(?:t(?:elegram)?\.me\/|tg:\/\/resolve\?domain=)([A-Za-z0-9_]{3,})/i
  );
  if (m) return m[1];
  m = u.match(/^@?([A-Za-z0-9_]{3,})$/); // bare "foo" or "@foo"
  if (m) return m[1];
  return "";
}

function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

/**
 * Open the Telegram bot the right way:
 *  - Mobile: try the app via tg://resolve?domain=<user>; if it doesn't open
 *    within 1200ms, fall back to https://t.me/<user>.
 *  - Desktop: open https://t.me/<user>.
 *  - If a username can't be extracted but an admin URL exists, open it directly.
 */
export function openTelegram(assistant: AssistantContent): void {
  if (typeof window === "undefined") return;

  const adminUrl = assistant.telegramUrl.trim();
  const username = extractTelegramUsername(adminUrl) ||
    (adminUrl ? "" : DEFAULT_TELEGRAM_USERNAME);

  // Admin URL present but no extractable username → just open it as-is.
  if (!username) {
    window.open(adminUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const webUrl = `https://t.me/${username}`;
  const appUrl = `tg://resolve?domain=${username}`;

  if (!isMobile()) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return;
  }

  // Mobile: attempt the app, fall back to the web link if it doesn't take over.
  let switched = false;
  const onHide = () => {
    switched = true;
  };
  document.addEventListener("visibilitychange", onHide);
  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", onHide);
    if (!switched && !document.hidden) {
      window.location.href = webUrl;
    }
  }, 1200);

  window.location.href = appUrl;
}
