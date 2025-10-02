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

    // TODO: For zero-based budgets, validate that sum of allocated_minor equals income
    // TODO: Implement actual budget creation with items in transaction

    return NextResponse.json({
      id: "stub",
      message: "Budget validation passed - implementation pending"
    }, { status: 201 })
  } catch (error) {
    console.error('Budget POST error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


