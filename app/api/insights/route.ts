import { NextResponse } from "next/server"

// GET /api/insights
export async function GET() {
  // TODO: query public.insights for current user
  return NextResponse.json({ items: [] })
}


