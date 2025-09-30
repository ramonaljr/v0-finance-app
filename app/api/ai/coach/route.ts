import { NextResponse } from "next/server"

// POST /api/ai/coach
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "messages[] required" }, { status: 400 })
  }
  // TODO: call model with redacted, summarized ledger from lib/ai/select-ledger
  return NextResponse.json({ reply: "Coach is not yet connected. This is a stub." })
}


