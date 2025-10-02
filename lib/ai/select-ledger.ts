// Minimal data-access layer for AI: returns windowed aggregates only (no raw PII)
import { createServiceClient } from "@/lib/supabase/server"

export type Period = { year: number; month: number }

export async function selectLedgerSummary(userId: string, since: Date): Promise<{
  months: Array<{ ym: string; income_minor: number; expense_minor: number; net_minor: number }>
  topCategories: Array<{ category_id: string; name?: string; amount_minor: number }>
}> {
  const supabase = createServiceClient()
  
  try {
    // Get KPI cache data for the last 90 days
    const { data: kpiData, error } = await supabase
      .from('kpi_cache')
      .select('period_year, period_month, income_minor, expense_minor, net_minor, top_cats')
      .eq('user_id', userId)
      .gte('updated_at', since.toISOString())
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false })

    if (error) {
      console.error('Error fetching ledger summary:', error)
      return { months: [], topCategories: [] }
    }

    // Format months data
    const months = kpiData?.map(kpi => ({
      ym: `${kpi.period_year}-${kpi.period_month.toString().padStart(2, '0')}`,
      income_minor: kpi.income_minor || 0,
      expense_minor: kpi.expense_minor || 0,
      net_minor: kpi.net_minor || 0,
    })) || []

    // Aggregate top categories across all months
    const categoryTotals = new Map<string, { amount_minor: number; name?: string }>()
    
    kpiData?.forEach(kpi => {
      if (kpi.top_cats && Array.isArray(kpi.top_cats)) {
        kpi.top_cats.forEach((cat: any) => {
          const current = categoryTotals.get(cat.category_id) || { amount_minor: 0 }
          current.amount_minor += cat.amount_minor || 0
          categoryTotals.set(cat.category_id, current)
        })
      }
    })

    // Get category names for top categories
    const topCategoryIds = Array.from(categoryTotals.keys()).slice(0, 10)
    if (topCategoryIds.length > 0) {
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', topCategoryIds)

      categories?.forEach(cat => {
        const existing = categoryTotals.get(cat.id)
        if (existing) {
          existing.name = cat.name
          categoryTotals.set(cat.id, existing)
        }
      })
    }

    const topCategories = Array.from(categoryTotals.entries())
      .sort(([,a], [,b]) => b.amount_minor - a.amount_minor)
      .slice(0, 10)
      .map(([category_id, data]) => ({
        category_id,
        name: data.name,
        amount_minor: data.amount_minor
      }))

    return { months, topCategories }
  } catch (error) {
    console.error('Select ledger summary error:', error)
    return { months: [], topCategories: [] }
  }
}


