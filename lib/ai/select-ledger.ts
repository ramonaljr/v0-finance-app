// Minimal data-access layer for AI: returns windowed aggregates only (no raw PII)
// Replace with Supabase queries once configured

export type Period = { year: number; month: number }

export async function selectLedgerSummary(_userId: string, _since: Date): Promise<{
  months: Array<{ ym: string; income_minor: number; expense_minor: number; net_minor: number }>
  topCategories: Array<{ category_id: string; name?: string; amount_minor: number }>
}> {
  // Stub: read from kpi_cache and summarized category views
  return {
    months: [],
    topCategories: [],
  }
}


