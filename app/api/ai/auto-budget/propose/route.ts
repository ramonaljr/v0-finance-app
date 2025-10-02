import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateAutoBudget } from "@/lib/ai/auto-budget"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const AutoBudgetRequestSchema = z.object({
  ym: z.string().regex(/^\d{4}-\d{2}$/, "ym must be in YYYY-MM format"),
  options: z.object({
    targetSavingsRate: z.number().min(0).max(100).optional(),
    zeroBased: z.boolean().optional(),
    includeRollover: z.boolean().optional(),
  }).optional(),
})

// POST /api/ai/auto-budget/propose
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)

    // Validate request body
    const validation = AutoBudgetRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: "Invalid request body",
        details: validation.error.errors
      }, { status: 400 })
    }

    const { ym, options = {} } = validation.data

    if (!ym || !/^\d{4}-\d{2}$/.test(ym)) {
      return NextResponse.json({ error: "ym required (YYYY-MM)" }, { status: 400 })
    }

    const [yearStr, monthStr] = ym.split("-")
    const periodYear = parseInt(yearStr, 10)
    const periodMonth = parseInt(monthStr, 10)

    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has consented to AI usage
    const { data: consentData } = await supabase
      .from('users')
      .select('ai_consent_at')
      .eq('id', user.id)
      .single()

    if (!consentData?.ai_consent_at) {
      return NextResponse.json({
        error: "AI consent required",
        requires_consent: true
      }, { status: 403 })
    }

    // Generate auto-budget proposal
    const budgetProposal = await generateAutoBudget(
      user.id,
      periodYear,
      periodMonth,
      options
    )

    return NextResponse.json(budgetProposal)
  } catch (error) {
    console.error('Auto-budget proposal error:', error)

    return NextResponse.json({
      error: "Failed to generate budget proposal",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}


