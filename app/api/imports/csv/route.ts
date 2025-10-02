import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { parseCSV, detectColumns, mapCSVToTransactions, type ImportMapping } from "@/lib/csv-parser"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const ImportSchema = z.object({
  csvContent: z.string(),
  mapping: z.object({
    dateColumn: z.string(),
    amountColumn: z.string(),
    descriptionColumn: z.string(),
    payeeColumn: z.string().optional(),
    categoryColumn: z.string().optional(),
    accountColumn: z.string().optional(),
    notesColumn: z.string().optional(),
    tagsColumn: z.string().optional(),
  }),
  options: z.object({
    skipErrors: z.boolean().default(false),
    createMissingCategories: z.boolean().default(false),
  }).optional(),
})

// POST /api/imports/csv
// Accepts CSV content and mapping; returns parsed data and import results
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)

    // Validate request body
    const validation = ImportSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid request body",
        details: validation.error.errors
      }, { status: 400 })
    }

    const { csvContent, mapping, options = { skipErrors: false, createMissingCategories: false } } = validation.data

    if (!csvContent || csvContent.length === 0) {
      return NextResponse.json({ error: "CSV content required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse CSV
    const parsedData = parseCSV(csvContent)

    if (parsedData.errors.length > 0) {
      return NextResponse.json({
        error: "CSV parsing errors",
        details: parsedData.errors
      }, { status: 400 })
    }

    // Map to transactions
    const { transactions, errors, warnings } = await mapCSVToTransactions(
      parsedData.data,
      mapping as ImportMapping,
      user.id,
      supabase
    )

    if (errors.length > 0 && !options.skipErrors) {
      return NextResponse.json({
        error: "Transaction mapping errors",
        errors,
        warnings,
        transactions_mapped: transactions.length,
        total_rows: parsedData.data.length
      }, { status: 400 })
    }

    // Insert transactions
    if (transactions.length > 0) {
      const { data: insertedData, error: insertError } = await supabase
        .from('transactions')
        .insert(transactions.map(t => ({
          ...t,
          user_id: user.id,
          occurred_at: new Date(t.occurred_at).toISOString(),
          tags: t.tags || [],
          is_recurring: false,
          is_reconciled: false,
        })))
        .select('id')

      if (insertError) {
        console.error('Error inserting imported transactions:', insertError)
        return NextResponse.json({ error: "Failed to insert transactions" }, { status: 500 })
      }

      // Trigger cache refresh after import
      try {
        await supabase.functions.invoke('refresh-caches', {
          body: { user_ids: [user.id] }
        })
      } catch (refreshError) {
        console.error('Cache refresh failed:', refreshError)
        // Don't fail the import if cache refresh fails
      }

      return NextResponse.json({
        success: true,
        imported: insertedData?.length || 0,
        total_rows: parsedData.data.length,
        errors,
        warnings,
        mapping_suggestions: detectColumns(parsedData.data)
      }, { status: 201 })
    }

    return NextResponse.json({
      success: true,
      imported: 0,
      total_rows: parsedData.data.length,
      errors,
      warnings,
      message: "No valid transactions to import"
    })

  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


