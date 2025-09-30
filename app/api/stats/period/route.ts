import { NextResponse } from "next/server"

// Stub: replace with Supabase query against kpi_cache
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ym = searchParams.get("ym")
  if (!ym || !/^\d{4}-\d{2}$/.test(ym)) {
    return NextResponse.json({ error: "Invalid ym; expected YYYY-MM" }, { status: 400 })
  }
  // Placeholder response; wire to DB later
  return NextResponse.json({
    ym,
    income_minor: 0,
    expense_minor: 0,
    net_minor: 0,
    top_cats: [],
  })
}


