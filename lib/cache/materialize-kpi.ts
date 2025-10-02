// Materializes KPI cache from transactions
import { SupabaseClient } from '@supabase/supabase-js'

export interface KpiCacheRow {
  user_id: string
  period_year: number
  period_month: number
  income_minor: number
  expense_minor: number
  net_minor: number
  top_cats: Array<{ category_id: string; amount_minor: number }>
}

export async function materializeKpiCache(
  supabase: SupabaseClient,
  userId: string,
  periodYear: number,
  periodMonth: number
): Promise<KpiCacheRow> {
  // Build date range for the period
  const startDate = new Date(periodYear, periodMonth - 1, 1)
  const endDate = new Date(periodYear, periodMonth, 0, 23, 59, 59, 999)

  // Fetch transactions for this period
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('direction, amount_minor, category_id')
    .eq('user_id', userId)
    .gte('occurred_at', startDate.toISOString())
    .lte('occurred_at', endDate.toISOString())
    .is('deleted_at', null)

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`)
  }

  // Calculate totals
  let income_minor = 0
  let expense_minor = 0
  const categoryTotals = new Map<string, number>()

  transactions?.forEach(tx => {
    if (tx.direction === 'in') {
      income_minor += tx.amount_minor
    } else {
      expense_minor += tx.amount_minor
    }

    // Track category totals (only for expenses)
    if (tx.direction === 'out' && tx.category_id) {
      const current = categoryTotals.get(tx.category_id) || 0
      categoryTotals.set(tx.category_id, current + tx.amount_minor)
    }
  })

  const net_minor = income_minor - expense_minor

  // Get top 5 categories
  const top_cats = Array.from(categoryTotals.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category_id, amount_minor]) => ({ category_id, amount_minor }))

  const kpiRow: KpiCacheRow = {
    user_id: userId,
    period_year: periodYear,
    period_month: periodMonth,
    income_minor,
    expense_minor,
    net_minor,
    top_cats,
  }

  // Upsert into kpi_cache
  const { error: upsertError } = await supabase
    .from('kpi_cache')
    .upsert(kpiRow, {
      onConflict: 'user_id,period_year,period_month',
    })

  if (upsertError) {
    throw new Error(`Failed to upsert KPI cache: ${upsertError.message}`)
  }

  return kpiRow
}

// Materialize KPI cache for multiple periods
export async function materializeKpiCacheForUser(
  supabase: SupabaseClient,
  userId: string,
  periods?: Array<{ year: number; month: number }>
): Promise<KpiCacheRow[]> {
  // If no periods specified, materialize last 12 months
  if (!periods) {
    periods = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      periods.push({ year: date.getFullYear(), month: date.getMonth() + 1 })
    }
  }

  const results: KpiCacheRow[] = []
  for (const { year, month } of periods) {
    const result = await materializeKpiCache(supabase, userId, year, month)
    results.push(result)
  }

  return results
}
