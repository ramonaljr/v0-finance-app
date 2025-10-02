// Materializes calendar cache from transactions
import { SupabaseClient } from '@supabase/supabase-js'

export interface CalendarDay {
  d: number
  income_minor: number
  expense_minor: number
  net_minor: number
}

export interface CalendarCacheRow {
  user_id: string
  y: number
  m: number
  days: CalendarDay[]
}

export async function materializeCalendarCache(
  supabase: SupabaseClient,
  userId: string,
  year: number,
  month: number
): Promise<CalendarCacheRow> {
  // Build date range for the month
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59, 999)
  const daysInMonth = endDate.getDate()

  // Fetch transactions for this month
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('direction, amount_minor, occurred_at')
    .eq('user_id', userId)
    .gte('occurred_at', startDate.toISOString())
    .lte('occurred_at', endDate.toISOString())
    .is('deleted_at', null)

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`)
  }

  // Initialize days array
  const daysMap = new Map<number, CalendarDay>()
  for (let d = 1; d <= daysInMonth; d++) {
    daysMap.set(d, { d, income_minor: 0, expense_minor: 0, net_minor: 0 })
  }

  // Aggregate transactions by day
  transactions?.forEach(tx => {
    const txDate = new Date(tx.occurred_at)
    const day = txDate.getDate()
    const dayData = daysMap.get(day)

    if (dayData) {
      if (tx.direction === 'in') {
        dayData.income_minor += tx.amount_minor
      } else {
        dayData.expense_minor += tx.amount_minor
      }
      dayData.net_minor = dayData.income_minor - dayData.expense_minor
    }
  })

  // Convert to array
  const days = Array.from(daysMap.values()).sort((a, b) => a.d - b.d)

  const calendarRow: CalendarCacheRow = {
    user_id: userId,
    y: year,
    m: month,
    days,
  }

  // Upsert into calendar_cache
  const { error: upsertError } = await supabase
    .from('calendar_cache')
    .upsert(calendarRow, {
      onConflict: 'user_id,y,m',
    })

  if (upsertError) {
    throw new Error(`Failed to upsert calendar cache: ${upsertError.message}`)
  }

  return calendarRow
}

// Materialize calendar cache for multiple months
export async function materializeCalendarCacheForUser(
  supabase: SupabaseClient,
  userId: string,
  periods?: Array<{ year: number; month: number }>
): Promise<CalendarCacheRow[]> {
  // If no periods specified, materialize last 12 months
  if (!periods) {
    periods = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      periods.push({ year: date.getFullYear(), month: date.getMonth() + 1 })
    }
  }

  const results: CalendarCacheRow[] = []
  for (const { year, month } of periods) {
    const result = await materializeCalendarCache(supabase, userId, year, month)
    results.push(result)
  }

  return results
}
