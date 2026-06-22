import { NextRequest, NextResponse } from "next/server";
import { clearItems } from "@/lib/cmoStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store, max-age=0" };

// Same shared secret as the main route.
const SECRET = process.env.AI_CMO_SECRET || process.env.AI_CMO_WEBHOOK_SECRET;

// ---------------------------------------------------------------------------
// POST /api/ai-cmo/clear
// Clears the Redis key "ai-cmo-content" (or empties the local dev file).
// Protected by the x-ai-cmo-secret header when a secret env var is configured.
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

  try {
    await clearItems();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Failed to clear AI CMO content" },
      { status: 500, headers: noStore }
    );
  }

  return NextResponse.json(
    { status: "success", message: "AI CMO content cleared", total_content: 0 },
    { headers: noStore }
  );
}
