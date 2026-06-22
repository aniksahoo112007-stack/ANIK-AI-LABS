import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { CmoContentItem } from "@/lib/types";

// This route reads/writes a local JSON file, so it must run on the Node runtime
// and never be statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "ai-cmo-content.json");

type Store = { items: CmoContentItem[] };

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return { items: [] };
  }
}

async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

const str = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));

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

const noStore = { "Cache-Control": "no-store, max-age=0" };

// GET /api/ai-cmo — dashboard reads from here (source of truth)
export async function GET() {
  const { items } = await readStore();
  return NextResponse.json(
    {
      status: "success",
      total_content: items.length,
      latest_item: items[0] ?? {},
      items,
    },
    { headers: noStore }
  );
}

// POST /api/ai-cmo — n8n sends generated content here
export async function POST(req: NextRequest) {
  // Optional secret: if AI_CMO_WEBHOOK_SECRET is set, the header must match.
  const secret = process.env.AI_CMO_WEBHOOK_SECRET;
  if (secret) {
    const provided = req.headers.get("x-ai-cmo-secret");
    if (provided !== secret) {
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

  // Minimal validation: require at least some real content.
  if (!item.keyword && !item.blog_title && !item.blog) {
    return NextResponse.json(
      {
        status: "error",
        message: "Payload must include at least keyword, blog_title, or blog",
      },
      { status: 400, headers: noStore }
    );
  }

  const store = await readStore();
  store.items.unshift(item); // newest first
  await writeStore(store);

  return NextResponse.json(
    {
      status: "success",
      message: "Content saved",
      total_content: store.items.length,
      item,
    },
    { headers: noStore }
  );
}
