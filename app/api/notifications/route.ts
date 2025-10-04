import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's notifications from database
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json({ notifications: [] }, { status: 200 })
    }

    // If no notifications exist, generate some based on user's financial data
    if (!notifications || notifications.length === 0) {
      const generatedNotifications = await generateNotifications(supabase, user.id)
      return NextResponse.json({ notifications: generatedNotifications }, { status: 200 })
    }

    return NextResponse.json({ notifications }, { status: 200 })
  } catch (error) {
    console.error('Error in notifications API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateNotifications(supabase: any, userId: string) {
  const notifications = []
  const now = new Date()

  // Check for upcoming bills (next 7 days)
  const { data: upcomingTransactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('occurred_at', now.toISOString())
    .lte('occurred_at', new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())

  if (upcomingTransactions && upcomingTransactions.length > 0) {
    notifications.push({
      id: 'upcoming-bills',
      type: 'alert',
      title: 'Upcoming Bills',
      message: `You have ${upcomingTransactions.length} bill${upcomingTransactions.length > 1 ? 's' : ''} due in the next 7 days`,
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: '/transactions',
      actionLabel: 'View Bills'
    })
  }

  // Check budget status
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const { data: budgets } = await supabase
    .from('budget_items')
    .select('*, budgets(*)')
    .eq('budgets.user_id', userId)
    .eq('budgets.month', currentMonth)

  if (budgets && budgets.length > 0) {
    const overBudget = budgets.filter((b: any) => {
      const spent = b.spent_minor / 100
      const planned = b.planned_minor / 100
      return spent > planned
    })

    if (overBudget.length > 0) {
      notifications.push({
        id: 'over-budget',
        type: 'warning',
        title: 'Budget Alert',
        message: `You're over budget in ${overBudget.length} categor${overBudget.length > 1 ? 'ies' : 'y'}`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/budget',
        actionLabel: 'Review Budget'
      })
    }
  }

  // Check for low account balances
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)

  if (accounts && accounts.length > 0) {
    const lowBalanceAccounts = accounts.filter((acc: any) => {
      const balance = acc.balance_minor / 100
      return acc.type === 'checking' && balance < 500
    })

    if (lowBalanceAccounts.length > 0) {
      notifications.push({
        id: 'low-balance',
        type: 'warning',
        title: 'Low Balance Alert',
        message: `${lowBalanceAccounts[0].name} is running low (${(lowBalanceAccounts[0].balance_minor / 100).toFixed(2)} USD)`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/account',
        actionLabel: 'View Account'
      })
    }
  }

  // Positive reinforcement for good behavior
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const { data: lastMonthTransactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('occurred_at', lastMonth.toISOString())
    .lte('occurred_at', lastMonthEnd.toISOString())

  if (lastMonthTransactions) {
    const totalSpent = lastMonthTransactions
      .filter((t: any) => t.direction === 'out')
      .reduce((sum: number, t: any) => sum + (t.amount_minor / 100), 0)

    const totalIncome = lastMonthTransactions
      .filter((t: any) => t.direction === 'in')
      .reduce((sum: number, t: any) => sum + (t.amount_minor / 100), 0)

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0

    if (savingsRate > 20) {
      notifications.push({
        id: 'good-savings',
        type: 'success',
        title: 'Great Job!',
        message: `You saved ${savingsRate.toFixed(0)}% of your income last month`,
        timestamp: new Date().toISOString(),
        read: false
      })
    }
  }

  return notifications
}
