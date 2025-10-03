import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const BudgetItemSchema = z.object({
  category_id: z.string().uuid().optional(),
  limit_minor: z.number().int(),
  rollover_from_prev_minor: z.number().int().default(0),
  allocated_minor: z.number().int().default(0),
  notes: z.string().optional(),
})

const CreateBudgetSchema = z.object({
  period_year: z.number().int(),
  period_month: z.number().int().min(1).max(12),
  type: z.enum(['zero', 'cap', 'envelope']).default('zero'),
  rollover: z.boolean().default(true),
  items: z.array(BudgetItemSchema).default([]),
})

// POST /api/budgets
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)

    // Validate request body
    const validation = CreateBudgetSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid request body",
        details: validation.error.errors
      }, { status: 400 })
    }

    const { period_year, period_month, type, rollover, items } = validation.data

    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if budget already exists for this period
    const { data: existingBudget } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', user.id)
      .eq('period_year', period_year)
      .eq('period_month', period_month)
      .single()

    if (existingBudget) {
      return NextResponse.json({
        error: "Budget already exists for this period"
      }, { status: 409 })
    }

    // Create budget and items in transaction
    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        period_year,
        period_month,
        type,
        rollover
      })
      .select()
      .single()

    if (budgetError) {
      console.error('Budget creation error:', budgetError)
      return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
    }

    // Insert budget items if provided
    if (items.length > 0) {
      const { error: itemsError } = await supabase
        .from('budget_items')
        .insert(
          items.map(item => ({
            ...item,
            budget_id: budget.id
          }))
        )

      if (itemsError) {
        console.error('Budget items creation error:', itemsError)
        // Clean up the budget if items fail
        await supabase.from('budgets').delete().eq('id', budget.id)
        return NextResponse.json({ error: "Failed to create budget items" }, { status: 500 })
      }
    }

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('Budget POST error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period_year = searchParams.get("period_year")
    const period_month = searchParams.get("period_month")

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from('budgets')
      .select(`
        *,
        items:budget_items(
          *,
          category:categories(id, name, icon, color)
        )
      `)
      .eq('user_id', user.id)
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false })

    if (period_year && period_month) {
      query = query
        .eq('period_year', parseInt(period_year))
        .eq('period_month', parseInt(period_month))
    }

    const { data: budgets, error } = await query

    if (error) {
      console.error('Error fetching budgets:', error)
      return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
    }

    return NextResponse.json({ budgets: budgets || [] })
  } catch (error) {
    console.error('Budget GET error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

