import { NextResponse } from "next/server"

// POST /api/transactions (bulk supported)
// Body: { transactions: Array<{ amount_minor:number, currency_code:string, direction:'in'|'out', occurred_at:string, account_id?:string, category_id?:string, payee?:string, notes?:string, tags?:string[] }> }
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || !Array.isArray(body.transactions)) {
      return NextResponse.json({ error: "transactions[] required" }, { status: 400 })
    }
    const invalid = body.transactions.find((t: any) => (
      typeof t.amount_minor !== "number" ||
      !t.currency_code ||
      (t.direction !== "in" && t.direction !== "out") ||
      !t.occurred_at
    ))
    if (invalid) {
      return NextResponse.json({ error: "Invalid transaction in payload" }, { status: 400 })
    }
    // TODO: insert into DB, enqueue cache refresh; idempotency via client-provided key
    return NextResponse.json({ accepted: body.transactions.length }, { status: 202 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to process" }, { status: 500 })
  }
}


