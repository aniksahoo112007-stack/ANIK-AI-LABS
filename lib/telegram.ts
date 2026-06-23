import type { AssistantContent } from "./types";

// ===========================================================================
// TELEGRAM BOT STATUS — single source of truth
// ===========================================================================
// The Telegram bot is considered ACTIVE only when BOTH are true:
//   1. A Telegram Bot URL is set (non-empty), AND
//   2. Bot Status === "active".
// Otherwise it is "Coming Soon". Used by the AI Assistant section, the AI CMO
// Dashboard infrastructure card, and any Telegram CTA buttons so they always
// agree. Values persist via lib/site-data.ts (and localStorage preview).
// ===========================================================================

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
