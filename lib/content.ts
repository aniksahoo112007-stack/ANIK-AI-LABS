import { defaultContent } from "./data";
import type { SiteContent } from "./types";

// localStorage keys
export const STORAGE_KEY = "anik_ai_labs_content_v1";
export const SESSION_KEY = "anik_ai_labs_admin_session";

// Admin credentials (demo only — not real security).
export const ADMIN_USERNAME = "anik";
export const ADMIN_PASSWORD = "anik@112007";

// Deep clone helper so we never mutate the defaults.
export function cloneDefault(): SiteContent {
  return JSON.parse(JSON.stringify(defaultContent)) as SiteContent;
}

// Merge saved content over defaults, section by section, so that adding new
// fields to the schema later won't break older saved data.
function mergeContent(saved: Partial<SiteContent>): SiteContent {
  const base = cloneDefault();
  return {
    hero: { ...base.hero, ...(saved.hero ?? {}) },
    about: { ...base.about, ...(saved.about ?? {}) },
    projects: Array.isArray(saved.projects) ? saved.projects : base.projects,
    gallery: Array.isArray(saved.gallery) ? saved.gallery : base.gallery,
    services: Array.isArray(saved.services) ? saved.services : base.services,
    contact: { ...base.contact, ...(saved.contact ?? {}) },
    media: { ...base.media, ...(saved.media ?? {}) },
    assistant: { ...base.assistant, ...(saved.assistant ?? {}) },
    videoShowcase: { ...base.videoShowcase, ...(saved.videoShowcase ?? {}) },
    cmo: { ...base.cmo, ...(saved.cmo ?? {}) },
  };
}

export function loadContent(): SiteContent {
  if (typeof window === "undefined") return cloneDefault();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefault();
    return mergeContent(JSON.parse(raw));
  } catch {
    return cloneDefault();
  }
}

export function saveContent(content: SiteContent): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function clearContent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

// --- admin session ---
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SESSION_KEY) === "true";
}

export function setLoggedIn(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) window.localStorage.setItem(SESSION_KEY, "true");
  else window.localStorage.removeItem(SESSION_KEY);
}
