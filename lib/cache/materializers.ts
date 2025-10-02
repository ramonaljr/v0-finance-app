import { createServiceClient } from "@/lib/supabase/server"

export async function materializeKPICache(userId: string, periodYear: number, periodMonth: number) {
  const supabase = createServiceClient()
  
  try {
    // Calculate period start and end dates
    const startDate = new Date(periodYear, periodMonth - 1, 1)
    const endDate = new Date(periodYear, periodMonth, 0, 23, 59, 59)
    
    // Get transactions for this period
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('amount_minor, direction, category_id')
      .eq('user_id', userId)
      .gte('occurred_at', startDate.toISOString())
      .lte('occurred_at', endDate.toISOString())
      .is('deleted_at', null)

    if (error) {
      console.error('Error fetching transactions for KPI cache:', error)
      return { error }
    }

    // Calculate totals
    let income_minor = 0
    let expense_minor = 0
    
    const categoryTotals = new Map<string, number>()
    
    transactions?.forEach(t => {
      if (t.direction === 'in') {
        income_minor += t.amount_minor
      } else {
        expense_minor += t.amount_minor
      }
      
      // Track category spending
      if (t.category_id && t.direction === 'out') {
        const current = categoryTotals.get(t.category_id) || 0
        categoryTotals.set(t.category_id, current + t.amount_minor)
      }
    })

    const net_minor = income_minor - expense_minor
    
    // Get top categories
    const topCategories = Array.from(categoryTotals.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([categoryId, amount]) => ({ category_id: categoryId, amount_minor: amount }))

    // Upsert KPI cache
    const { error: upsertError } = await supabase
      .from('kpi_cache')
      .upsert({
        user_id: userId,
        period_year: periodYear,
        period_month: periodMonth,
        income_minor,
        expense_minor,
        net_minor,
        top_cats: topCategories,
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Error upserting KPI cache:', upsertError)
      return { error: upsertError }
    }

    return { 
      success: true, 
      income_minor, 
      expense_minor, 
      net_minor, 
      topCategories 
    }
  } catch (error) {
    console.error('Materialize KPI cache error:', error)
    return { error }
  }
}

export async function materializeCalendarCache(userId: string, year: number, month: number) {
  const supabase = createServiceClient()
  
  try {
    // Calculate month start and end dates
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)
    
    // Get transactions for this month grouped by day
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('amount_minor, direction, occurred_at')
      .eq('user_id', userId)
      .gte('occurred_at', startDate.toISOString())
      .lte('occurred_at', endDate.toISOString())
      .is('deleted_at', null)

    if (error) {
      console.error('Error fetching transactions for calendar cache:', error)
      return { error }
    }

    // Group by day and calculate daily totals
    const dayTotals = new Map<string, { income_minor: number, expense_minor: number }>()
    
    transactions?.forEach(t => {
      const day = new Date(t.occurred_at).toISOString().split('T')[0]
      const current = dayTotals.get(day) || { income_minor: 0, expense_minor: 0 }
      
      if (t.direction === 'in') {
        current.income_minor += t.amount_minor
      } else {
        current.expense_minor += t.amount_minor
      }
      
      dayTotals.set(day, current)
    })

    // Convert to array format for storage
    const days = Array.from(dayTotals.entries()).map(([date, totals]) => ({
      date,
      income_minor: totals.income_minor,
      expense_minor: totals.expense_minor,
      net_minor: totals.income_minor - totals.expense_minor
    }))

    // Upsert calendar cache
    const { error: upsertError } = await supabase
      .from('calendar_cache')
      .upsert({
        user_id: userId,
        y: year,
        m: month,
        days,
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Error upserting calendar cache:', upsertError)
      return { error: upsertError }
    }

    return { success: true, days }
  } catch (error) {
    console.error('Materialize calendar cache error:', error)
    return { error }
  }
}

export async function refreshAllCaches(userId: string) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  
  // Refresh current month
  const kpiResult = await materializeKPICache(userId, currentYear, currentMonth)
  const calendarResult = await materializeCalendarCache(userId, currentYear, currentMonth)
  
  // Refresh previous month (for rollover calculations)
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
  
  await materializeKPICache(userId, prevYear, prevMonth)
  await materializeCalendarCache(userId, prevYear, prevMonth)
  
  return {
    current: { kpi: kpiResult, calendar: calendarResult },
    refreshed: true
  }
}
