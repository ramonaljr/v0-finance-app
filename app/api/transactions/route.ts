import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const TransactionSchema = z.object({
  amount_minor: z.number().int(),
  currency_code: z.string().min(3).max(3),
  direction: z.enum(['in', 'out']),
  occurred_at: z.string().datetime(),
  account_id: z.string().uuid().optional(),
  category_id: z.string().uuid().optional(),
  payee: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  attachment_url: z.string().url().optional(),
  is_recurring: z.boolean().optional(),
  recur_rule: z.string().optional(),
})

const BulkTransactionsSchema = z.object({
  transactions: z.array(TransactionSchema),
})

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    
    // Validate request body
    const validation = BulkTransactionsSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Invalid request body", 
        details: validation.error.errors 
      }, { status: 400 })
    }

    const { transactions } = validation.data
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prepare transactions for insertion
    const transactionsToInsert = transactions.map(t => ({
      ...t,
      user_id: user.id,
      occurred_at: new Date(t.occurred_at).toISOString(),
      tags: t.tags || [],
      is_recurring: t.is_recurring || false,
      is_reconciled: false,
    }))

    // Insert transactions
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionsToInsert)
      .select('id')

    if (error) {
      console.error('Error inserting transactions:', error)
      return NextResponse.json({ error: "Failed to insert transactions" }, { status: 500 })
    }

    // Trigger cache refresh for the user
    try {
      await supabase.functions.invoke('refresh-caches', {
        body: { user_ids: [user.id] }
      })
    } catch (refreshError) {
      console.error('Cache refresh failed:', refreshError)
      // Don't fail the transaction insert if cache refresh fails
    }

    return NextResponse.json({
      accepted: transactions.length,
      inserted: data?.length || 0,
      transaction_ids: data?.map(t => t.id) || []
    }, { status: 202 })
  } catch (error) {
    console.error('Transactions POST error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


