import { NextResponse } from "next/server"

// POST /api/transactions/recurring/run (cron)
export async function POST() {
  // TODO: find due recurring rules and materialize transactions, update next_run
  return NextResponse.json({ run: true, created: 0 })
}


