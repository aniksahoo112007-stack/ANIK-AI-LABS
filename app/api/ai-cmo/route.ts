import { NextRequest, NextResponse } from "next/server";
import type { CmoContentItem } from "@/lib/types";
import { readItems, writeItems } from "@/lib/cmoStore";

// Storage is Redis-backed (see lib/cmoStore.ts). Always dynamic, never cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store, max-age=0" };

// Shared secret: prefer AI_CMO_SECRET, fall back to the older
// AI_CMO_WEBHOOK_SECRET so existing setups keep working.
const SECRET = process.env.AI_CMO_SECRET || process.env.AI_CMO_WEBHOOK_SECRET;

const str = (v: unknown): string =>
  typeof v === "string" ? v : v == null ? "" : String(v);

function normalizeItem(body: Record<string, unknown>): CmoContentItem {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: str(body.id) || `api-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    keyword: str(body.keyword),
    blog_title: str(body.blog_title),
    meta_title: str(body.meta_title),
    meta_description: str(body.meta_description),
    blog: str(body.blog),
    instagram_caption: str(body.instagram_caption),
    linkedin_post: str(body.linkedin_post),
    generated_date: str(body.generated_date) || today,
  };
}

// ---------------------------------------------------------------------------
// GET /api/ai-cmo
// Returns the latest items (newest first). Safety limit: default 20, max 100.
//   /api/ai-cmo?limit=50
// Response shape is unchanged so the dashboard keeps working.
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const items = await readItems(); // newest first

  const raw = Number(req.nextUrl.searchParams.get("limit"));
  const limit = Number.isFinite(raw) && raw > 0 ? Math.min(raw, 100) : 20;

  return NextResponse.json(
    {
      status: "success",
      total_content: items.length, // full count, even if the list is limited
      latest_item: items[0] ?? {},
      items: items.slice(0, limit),
    },
    { headers: noStore }
  );
}

// ---------------------------------------------------------------------------
// POST /api/ai-cmo  (n8n HTTP Request node sends generated content here)
// - Optional secret enforcement via x-ai-cmo-secret.
// - Duplicate protection: same blog_title + generated_date is skipped.
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  if (SECRET) {
    const provided = req.headers.get("x-ai-cmo-secret");
    if (provided !== SECRET) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: invalid x-ai-cmo-secret" },
        { status: 401, headers: noStore }
      );
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON body" },
      { status: 400, headers: noStore }
    );
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { status: "error", message: "Body must be a JSON object" },
      { status: 400, headers: noStore }
    );
  }

  const item = normalizeItem(body as Record<string, unknown>);

  if (!item.keyword && !item.blog_title && !item.blog) {
    return NextResponse.json(
      {
        status: "error",
        message: "Payload must include at least keyword, blog_title, or blog",
      },
      { status: 400, headers: noStore }
    );
  }

  const items = await readItems();

  // Duplicate protection: identical blog_title + generated_date already stored.
  const isDuplicate =
    item.blog_title.trim() !== "" &&
    items.some(
      (i) =>
        i.blog_title === item.blog_title &&
        i.generated_date === item.generated_date
    );

  if (isDuplicate) {
    return NextResponse.json(
      {
        status: "success",
        message: "Duplicate skipped",
        total_content: items.length,
      },
      { headers: noStore }
    );
  }

  items.unshift(item); // newest first
  await writeItems(items);

  return NextResponse.json(
    {
      status: "success",
      message: "Content saved",
      total_content: items.length,
      item,
    },
    { headers: noStore }
  );
}
