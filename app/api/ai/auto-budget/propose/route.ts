import { NextResponse } from "next/server"

// POST /api/ai/auto-budget/propose
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const period = body?.ym
  if (!period || !/^\d{4}-\d{2}$/.test(period)) {
    return NextResponse.json({ error: "ym required (YYYY-MM)" }, { status: 400 })
  }
  // TODO: summarize last N months, propose allocations per category with rationale
  return NextResponse.json({ ym: period, items: [], rationale: "stub" })
}


