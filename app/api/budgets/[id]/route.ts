import { NextResponse } from "next/server"

// PUT /api/budgets/:id
export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  // TODO: update budget/items; validate ownership via RLS
  return NextResponse.json({ id, updated: true })
}


