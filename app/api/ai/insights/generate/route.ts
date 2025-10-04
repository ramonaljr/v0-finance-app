import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { context } = await request.json()
    const { type, budgets, transactions, accounts } = context

    // Generate insights based on type and data
    const insight = generateInsightFromData(type, { budgets, transactions, accounts })

    return NextResponse.json({
      insight,
      generated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI insight generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    )
  }
}

// Helper function to generate insights based on data
function generateInsightFromData(
  type: string,
  data: { budgets?: any[]; transactions?: any[]; accounts?: any[] }
) {
  const { budgets, transactions, accounts } = data

  // Budget-specific insights
  if (type === 'budget' && budgets && budgets.length > 0) {
    const overBudget = budgets.filter(b => b.spent > b.budget)
    if (overBudget.length > 0) {
      const category = overBudget[0]
      const overspend = category.spent - category.budget
      return {
        message: `You're over budget on ${category.name} by $${overspend.toFixed(2)}. Consider reducing spending in this category to stay on track.`,
        severity: 'warning' as const,
        actions: [
          { type: 'adjust_budget' as const, label: 'Adjust Budget' },
          { type: 'view_transactions' as const, label: 'View Transactions' }
        ]
      }
    }

    const nearLimit = budgets.filter(b => {
      const percentage = (b.spent / b.budget) * 100
      return percentage > 85 && percentage <= 100
    })

    if (nearLimit.length > 0) {
      const category = nearLimit[0]
      return {
        message: `You've used ${((category.spent / category.budget) * 100).toFixed(0)}% of your ${category.name} budget. Slow down spending to stay within your limit.`,
        severity: 'warning' as const,
        actions: [
          { type: 'view_transactions' as const, label: 'View Details' }
        ]
      }
    }
  }

  // Spending pattern insights
  if (type === 'spending' && transactions && transactions.length > 0) {
    const expenses = transactions.filter(t => t.direction === 'out')
    const totalSpent = expenses.reduce((sum, t) => sum + (t.amount_minor || 0), 0) / 100

    if (expenses.length > 10) {
      const avgTransaction = totalSpent / expenses.length
      return {
        message: `You've made ${expenses.length} transactions totaling $${totalSpent.toFixed(2)} this month. Average spend per transaction: $${avgTransaction.toFixed(2)}.`,
        severity: 'info' as const,
        actions: [
          { type: 'view_transactions' as const, label: 'View All' }
        ]
      }
    }
  }

  // Recurring expense insights
  if (type === 'recurring') {
    return {
      message: `Your recurring expenses are on track. Keep monitoring your monthly subscriptions and bills to avoid surprises.`,
      severity: 'success' as const,
      actions: [
          { type: 'view_details' as const, label: 'View Details', params: { url: '/budget' } }
        ]
    }
  }

  // Default general insight
  return {
    message: `Great job tracking your finances! Keep logging transactions and reviewing your budgets regularly to build healthy money habits.`,
    severity: 'info' as const,
    actions: [
      { type: 'view_transactions' as const, label: 'Add Transaction' }
    ]
  }
}
