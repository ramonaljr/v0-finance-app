import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const UpdateTransactionSchema = z.object({
  amount_minor: z.number().int().optional(),
  currency_code: z.string().min(3).max(3).optional(),
  direction: z.enum(['in', 'out']).optional(),
  occurred_at: z.string().datetime().optional(),
  account_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  payee: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
})

// GET single transaction
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: transaction, error } = await supabase
      .from('transactions')
      .select(`
        *,
        category:categories(id, name, icon, color),
        account:accounts(id, name, type)
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()

    if (error) {
      console.error('Error fetching transaction:', error)
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Transaction GET error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT/PATCH update transaction
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validation = UpdateTransactionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid request body",
        details: validation.error.errors
      }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prepare update data
    const updateData: any = { ...validation.data }
    if (updateData.occurred_at) {
      updateData.occurred_at = new Date(updateData.occurred_at).toISOString()
    }
    updateData.updated_at = new Date().toISOString()

    // Update transaction
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .select()
      .single()

    if (error) {
      console.error('Error updating transaction:', error)
      return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ transaction: data })
  } catch (error) {
    console.error('Transaction PUT error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE transaction (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Soft delete by setting deleted_at timestamp
    const { data, error } = await supabase
      .from('transactions')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .select()
      .single()

    if (error) {
      console.error('Error deleting transaction:', error)
      return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully"
    })
  } catch (error) {
    console.error('Transaction DELETE error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
