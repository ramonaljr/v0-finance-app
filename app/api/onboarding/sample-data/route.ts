import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sample Account 1: Checking
    const { data: checkingAccount } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        name: 'Chase Checking',
        type: 'checking',
        balance_minor: 250000, // $2,500
        currency_code: 'USD'
      })
      .select()
      .single()

    // Sample Account 2: Credit Card
    const { data: creditAccount } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        name: 'Visa Credit Card',
        type: 'credit',
        balance_minor: 65000, // $650
        currency_code: 'USD'
      })
      .select()
      .single()

    // Create sample categories
    const categoriesData = [
      { name: 'Groceries', icon: '🛒', color: '#10b981' },
      { name: 'Dining', icon: '🍽️', color: '#f59e0b' },
      { name: 'Transportation', icon: '🚗', color: '#3b82f6' },
      { name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
      { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
      { name: 'Utilities', icon: '💡', color: '#6366f1' }
    ]

    const { data: categories } = await supabase
      .from('categories')
      .insert(
        categoriesData.map(cat => ({
          user_id: user.id,
          ...cat
        }))
      )
      .select()

    // Sample Transactions (last 2 weeks)
    const now = new Date()
    const transactions = [
      {
        user_id: user.id,
        account_id: checkingAccount?.id,
        category_id: categories?.[0]?.id, // Groceries
        amount_minor: 12745,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        payee: 'Whole Foods Market',
        notes: 'Weekly groceries'
      },
      {
        user_id: user.id,
        account_id: checkingAccount?.id,
        category_id: categories?.[1]?.id, // Dining
        amount_minor: 4250,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        payee: 'Starbucks',
        notes: 'Coffee'
      },
      {
        user_id: user.id,
        account_id: checkingAccount?.id,
        category_id: categories?.[2]?.id, // Transportation
        amount_minor: 5230,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        payee: 'Shell Gas Station',
        notes: 'Gas'
      },
      {
        user_id: user.id,
        account_id: checkingAccount?.id,
        amount_minor: 520000,
        currency_code: 'USD',
        direction: 'in',
        occurred_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        payee: 'Acme Corp',
        notes: 'Monthly salary'
      },
      {
        user_id: user.id,
        account_id: creditAccount?.id,
        category_id: categories?.[4]?.id, // Shopping
        amount_minor: 8950,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        payee: 'Amazon',
        notes: 'Office supplies'
      },
      {
        user_id: user.id,
        account_id: checkingAccount?.id,
        category_id: categories?.[5]?.id, // Utilities
        amount_minor: 14500,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        payee: 'Electric Company',
        notes: 'Monthly bill'
      },
      {
        user_id: user.id,
        account_id: checkingAccount?.id,
        category_id: categories?.[1]?.id, // Dining
        amount_minor: 6800,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        payee: 'Pizza Hut',
        notes: 'Dinner'
      },
      {
        user_id: user.id,
        account_id: checkingAccount?.id,
        category_id: categories?.[0]?.id, // Groceries
        amount_minor: 9320,
        currency_code: 'USD',
        direction: 'out',
        occurred_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        payee: 'Safeway',
        notes: 'Weekly groceries'
      }
    ]

    await supabase.from('transactions').insert(transactions)

    // Create a simple budget for current month
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    const { data: budget } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        period_year: currentYear,
        period_month: currentMonth,
        type: 'zero',
        rollover: true
      })
      .select()
      .single()

    // Budget items
    if (budget && categories) {
      const budgetItems = [
        { category_id: categories[0].id, limit_minor: 60000, allocated_minor: 22065 }, // Groceries
        { category_id: categories[1].id, limit_minor: 30000, allocated_minor: 11050 }, // Dining
        { category_id: categories[2].id, limit_minor: 25000, allocated_minor: 5230 },  // Transport
        { category_id: categories[3].id, limit_minor: 20000, allocated_minor: 0 },     // Entertainment
        { category_id: categories[4].id, limit_minor: 40000, allocated_minor: 8950 },  // Shopping
        { category_id: categories[5].id, limit_minor: 20000, allocated_minor: 14500 }  // Utilities
      ]

      await supabase.from('budget_items').insert(
        budgetItems.map(item => ({
          budget_id: budget.id,
          ...item,
          rollover_from_prev_minor: 0
        }))
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully',
      accounts: 2,
      categories: categories?.length || 0,
      transactions: transactions.length,
      budget: budget ? 1 : 0
    })
  } catch (error) {
    console.error('Sample data creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create sample data' },
      { status: 500 }
    )
  }
}
