import { NextResponse } from "next/server"

// POST /api/imports/csv
// Accepts text/csv or multipart with file; returns parsed row counts and mapping hints
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("text/csv")) {
    const csv = await request.text()
    if (!csv || csv.length === 0) return NextResponse.json({ error: "CSV required" }, { status: 400 })
    // TODO: parse, detect columns, return header mapping skeleton
    return NextResponse.json({ parsed: true, rows: csv.split(/\r?\n/).length - 1 })
  }
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "file required" }, { status: 400 })
    const text = await file.text()
    // TODO: parse
    return NextResponse.json({ parsed: true, rows: text.split(/\r?\n/).length - 1 })
  }
  return NextResponse.json({ error: "Unsupported content type" }, { status: 415 })
}


