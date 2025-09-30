import { NextResponse } from "next/server"

// POST /api/budgets
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.period_year !== "number" || typeof body.period_month !== "number") {
    return NextResponse.json({ error: "period_year and period_month required" }, { status: 400 })
  }
  // TODO: insert budget and items; ensure zero-based total equals income if type zero
  return NextResponse.json({ id: "stub" }, { status: 201 })
}


