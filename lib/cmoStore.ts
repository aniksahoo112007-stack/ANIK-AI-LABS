import { promises as fs } from "fs";
import path from "path";
import type { CmoContentItem } from "./types";

// ===========================================================================
// AI CMO STORAGE LAYER
// ===========================================================================
// Production: Upstash Redis (via its REST API — no extra npm dependency, uses
//   the env vars the Vercel Upstash integration already provides).
// Local dev:  falls back to data/ai-cmo-content.json so the app runs without
//   Redis configured.
//
// All AI CMO content lives under a single Redis key: "ai-cmo-content".
// The value is a JSON array of items, stored NEWEST FIRST.
// ===========================================================================

export const REDIS_KEY = "ai-cmo-content";

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/** True when Upstash Redis env vars are present (i.e. on Vercel/production). */
export function isRedis(): boolean {
  return Boolean(REST_URL && REST_TOKEN);
}

const DATA_FILE = path.join(process.cwd(), "data", "ai-cmo-content.json");

// Run a single Redis command through the Upstash REST API.
// Body format is the command-array form, e.g. ["SET","ai-cmo-content","..."].
async function redisCmd<T = unknown>(command: string[]): Promise<T> {
  const res = await fetch(REST_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash Redis error: ${res.status}`);
  const data = (await res.json()) as { result?: T };
  return data.result as T;
}

// Tolerant parse: accepts a raw array OR a { items: [...] } wrapper.
function coerceItems(value: unknown): CmoContentItem[] {
  if (Array.isArray(value)) return value as CmoContentItem[];
  if (value && typeof value === "object" && Array.isArray((value as { items?: unknown }).items)) {
    return (value as { items: CmoContentItem[] }).items;
  }
  return [];
}

/** Read all items (newest first). */
export async function readItems(): Promise<CmoContentItem[]> {
  if (isRedis()) {
    const raw = await redisCmd<string | null>(["GET", REDIS_KEY]);
    if (!raw) return [];
    try {
      return coerceItems(JSON.parse(raw));
    } catch {
      return [];
    }
  }
  // local dev fallback
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return coerceItems(JSON.parse(raw));
  } catch {
    return [];
  }
}

/** Persist the full items array. */
export async function writeItems(items: CmoContentItem[]): Promise<void> {
  if (isRedis()) {
    await redisCmd(["SET", REDIS_KEY, JSON.stringify(items)]);
    return;
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify({ items }, null, 2), "utf8");
}

/** Clear the Redis key (or empty the local file in dev). */
export async function clearItems(): Promise<void> {
  if (isRedis()) {
    await redisCmd(["DEL", REDIS_KEY]);
    return;
  }
  await writeItems([]);
}
