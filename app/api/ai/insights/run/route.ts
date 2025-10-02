import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { selectLedgerSummary } from "@/lib/ai/select-ledger"

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get ledger summary for last 90 days
    const since = new Date()
    since.setDate(since.getDate() - 90)
    
    const ledgerSummary = await selectLedgerSummary(user.id, since)
    
    // Generate insights based on patterns
    const insights = []
    
    // Check for spending trends
    if (ledgerSummary.months.length >= 2) {
      const currentMonth = ledgerSummary.months[0]
      const previousMonth = ledgerSummary.months[1]
      
      const spendingIncrease = currentMonth.expense_minor - previousMonth.expense_minor
      const spendingIncreasePercent = (spendingIncrease / previousMonth.expense_minor) * 100
      
      if (spendingIncreasePercent > 20) {
        insights.push({
          type: 'spending_trend',
          title: 'Spending Increase Detected',
          body: `Your spending increased by ${spendingIncreasePercent.toFixed(1)}% compared to last month. Consider reviewing your budget.`,
          severity: 'warning',
          kpi: { spending_increase_percent: spendingIncreasePercent },
          source_span: { period: currentMonth.ym }
        })
      }
      
      // Check for savings rate
      const currentSavingsRate = (currentMonth.net_minor / currentMonth.income_minor) * 100
      if (currentSavingsRate < 10 && currentMonth.income_minor > 0) {
        insights.push({
          type: 'savings_rate',
          title: 'Low Savings Rate',
          body: `Your savings rate is ${currentSavingsRate.toFixed(1)}%. Consider increasing your savings to build a stronger financial foundation.`,
          severity: 'info',
          kpi: { savings_rate_percent: currentSavingsRate },
          source_span: { period: currentMonth.ym }
        })
      }
    }
    
    // Check top spending categories
    if (ledgerSummary.topCategories.length > 0) {
      const topCategory = ledgerSummary.topCategories[0]
      insights.push({
        type: 'top_category',
        title: 'Top Spending Category',
        body: `Your highest spending category is ${topCategory.name || 'Uncategorized'} at $${(topCategory.amount_minor / 100).toFixed(2)}.`,
        severity: 'info',
        kpi: { category_amount_minor: topCategory.amount_minor },
        source_span: { category_id: topCategory.category_id }
      })
    }
    
    // Insert insights into database
    if (insights.length > 0) {
      const insightsToInsert = insights.map(insight => ({
        user_id: user.id,
        ...insight,
        created_at: new Date().toISOString()
      }))
      
      const { error: insertError } = await supabase
        .from('insights')
        .insert(insightsToInsert)
      
      if (insertError) {
        console.error('Error inserting insights:', insertError)
        return NextResponse.json({ error: "Failed to save insights" }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      created: insights.length,
      insights: insights.map(i => ({ type: i.type, title: i.title }))
    })
  } catch (error) {
    console.error('Insights run error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


