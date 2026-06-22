import type { CmoContentItem, CmoDashboardContent } from "./types";

// ===========================================================================
// AI CMO DASHBOARD — DATA SERVICE (API-backed, no CSV / Google Sheets)
// ===========================================================================
// Architecture:  n8n  ->  POST /api/ai-cmo  ->  data/ai-cmo-content.json
//                                                        |
//                                 Dashboard <- GET /api/ai-cmo
//
// The dashboard's single source of truth is GET /api/ai-cmo. Items are stored
// newest-first by the API (it unshifts new rows), so no client-side sorting or
// CSV parsing is needed.
// ===========================================================================

export type CmoSource = "api";

export type CmoLoadResult = {
  items: CmoContentItem[];
  source: CmoSource;
  live: boolean;
};

export type CmoStats = {
  totalBlogs: number;
  totalKeywords: number;
  totalSocialPosts: number;
  totalContent: number;
  latestDate: string;
};

export const AI_CMO_ENDPOINT = "/api/ai-cmo";

export function getCmoStats(items: CmoContentItem[]): CmoStats {
  const totalBlogs = items.filter((i) => i.blog.trim()).length;
  const totalKeywords = new Set(
    items.map((i) => i.keyword.trim().toLowerCase()).filter(Boolean)
  ).size;
  const totalSocialPosts =
    items.filter((i) => i.instagram_caption.trim()).length +
    items.filter((i) => i.linkedin_post.trim()).length;
  // items are newest-first from the API
  const latestDate = items[0]?.generated_date ?? "";
  return {
    totalBlogs,
    totalKeywords,
    totalSocialPosts,
    totalContent: items.length,
    latestDate,
  };
}

const str = (v: unknown): string =>
  typeof v === "string" ? v : v == null ? "" : String(v);

function normalize(raw: Record<string, unknown>, idx: number): CmoContentItem {
  return {
    id: str(raw.id) || `item-${idx}`,
    keyword: str(raw.keyword),
    blog_title: str(raw.blog_title),
    meta_title: str(raw.meta_title),
    meta_description: str(raw.meta_description),
    blog: str(raw.blog),
    instagram_caption: str(raw.instagram_caption),
    linkedin_post: str(raw.linkedin_post),
    generated_date: str(raw.generated_date),
  };
}

/** Fetch the live content from GET /api/ai-cmo (cache-busted, no-store). */
export async function fetchCmoFromApi(): Promise<CmoContentItem[]> {
  const url = `${AI_CMO_ENDPOINT}?limit=100&t=${Date.now()}`;
  if (process.env.NODE_ENV !== "production") {
    console.log("[AI CMO] Fetching API:", url);
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  const data = await res.json();
  const items: CmoContentItem[] = Array.isArray(data.items)
    ? data.items.map((r: Record<string, unknown>, i: number) => normalize(r, i))
    : [];
  if (process.env.NODE_ENV !== "production") {
    console.log("[AI CMO] Items received:", items.length);
    console.log("[AI CMO] Latest keyword:", items[0]?.keyword ?? "(none)");
  }
  return items;
}

/** Single entry point used by the dashboard. */
export async function loadCmoData(
  _cmo: CmoDashboardContent
): Promise<CmoLoadResult> {
  const items = await fetchCmoFromApi();
  return { items, source: "api", live: true };
}
