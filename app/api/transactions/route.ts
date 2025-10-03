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

    // Enqueue cache refresh for the user (with retry mechanism)
    try {
      const { data: queueResult, error: queueError } = await supabase
        .rpc('enqueue_cache_refresh', { p_user_id: user.id })

      if (queueError) {
        console.error('Failed to enqueue cache refresh:', queueError)
        // Fallback: try direct invocation
        await supabase.functions.invoke('refresh-caches', {
          body: { user_ids: [user.id] }
        }).catch(err => console.error('Direct cache refresh also failed:', err))
      }
    } catch (refreshError) {
      console.error('Cache refresh enqueue failed:', refreshError)
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const category_id = searchParams.get("category_id")
    const account_id = searchParams.get("account_id")
    const start_date = searchParams.get("start_date")
    const end_date = searchParams.get("end_date")
    const direction = searchParams.get("direction")

    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from('transactions')
      .select(`
        *,
        category:categories(id, name, icon, color),
        account:accounts(id, name, type)
      `)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('occurred_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (category_id) {
      query = query.eq('category_id', category_id)
    }
    if (account_id) {
      query = query.eq('account_id', account_id)
    }
    if (start_date) {
      query = query.gte('occurred_at', start_date)
    }
    if (end_date) {
      query = query.lte('occurred_at', end_date)
    }
    if (direction && (direction === 'in' || direction === 'out')) {
      query = query.eq('direction', direction)
    }

    const { data: transactions, error } = await query

    if (error) {
      console.error('Error fetching transactions:', error)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    return NextResponse.json({
      transactions: transactions || [],
      count: transactions?.length || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('Transaction GET error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

