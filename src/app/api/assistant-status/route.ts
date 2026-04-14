import { isChatLlmConfigured } from "@/lib/server/chatLlmConfigured";
import { NextResponse } from "next/server";

/** Lightweight probe for UI (reset tooltip) — no LLM call. */
export async function GET() {
  return NextResponse.json({ configured: isChatLlmConfigured() });
}
