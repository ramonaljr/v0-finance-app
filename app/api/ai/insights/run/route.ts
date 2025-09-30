import { NextResponse } from "next/server"

// POST /api/ai/insights/run (cron or on-demand)
export async function POST() {
  // TODO: compute insights over last 90 days summary; write to insights table
  return NextResponse.json({ created: 0 })
}


