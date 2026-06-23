import type { AssistantContent } from "./types";

// ===========================================================================
// TELEGRAM BOT — status + deep-link helpers (single source of truth)
// ===========================================================================
// Bot is ACTIVE only when a URL is set AND status === "active".
// Mobile uses the tg:// deep link FIRST (opens the Telegram app), with a
// t.me web fallback. Desktop opens t.me in a new tab.
// ===========================================================================

export const TELEGRAM_BOT_USERNAME = "anik_ai_labs_assist";

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

/** Resolve the username to use: from the admin URL, else the default bot. */
export function resolveTelegramUsername(assistant: AssistantContent): string {
  return extractTelegramUsername(assistant.telegramUrl) || TELEGRAM_BOT_USERNAME;
}

/**
 * Core opener. On Android/iOS it sets window.location to the tg:// deep link
 * IMMEDIATELY (inside the click handler — no async wrapper first), then falls
 * back to the t.me web link after 1500ms if the app didn't take over.
 * On desktop it opens the t.me link in a new tab.
 */
export function openTelegramBot(username: string): void {
  if (typeof window === "undefined" || !username) return;

  const webUrl = `https://t.me/${username}`;
  const appUrl = `tg://resolve?domain=${username}`;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    // Try the app first (this is what opens Telegram on the phone).
    window.location.href = appUrl;
    // Fallback to the web link if the app did not open.
    setTimeout(() => {
      window.location.href = webUrl;
    }, 1500);
  } else {
    window.open(webUrl, "_blank", "noopener,noreferrer");
  }
}

/**
 * Convenience wrapper used across the site. Prefers the username from the
 * admin Telegram URL; if the admin entered a non-Telegram URL it opens that
 * directly; otherwise it uses the default bot username.
 */
export function openTelegram(assistant: AssistantContent): void {
  if (typeof window === "undefined") return;
  const username = extractTelegramUsername(assistant.telegramUrl);
  if (username) {
    openTelegramBot(username);
    return;
  }
  const adminUrl = assistant.telegramUrl.trim();
  if (adminUrl) {
    window.open(adminUrl, "_blank", "noopener,noreferrer");
    return;
  }
  openTelegramBot(TELEGRAM_BOT_USERNAME);
}
