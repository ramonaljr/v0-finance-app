import { NextResponse } from "next/server"

// Stub: replace with Supabase query against calendar_cache
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ym = searchParams.get("ym")
  if (!ym || !/^\d{4}-\d{2}$/.test(ym)) {
    return NextResponse.json({ error: "Invalid ym; expected YYYY-MM" }, { status: 400 })
  }
  const [yearStr, monthStr] = ym.split("-")
  const y = parseInt(yearStr, 10)
  const m = parseInt(monthStr, 10)
  // Placeholder response; wire to DB later
  return NextResponse.json({
    y,
    m,
    days: [],
    totals: { income_minor: 0, expense_minor: 0, net_minor: 0 },
  })
}


