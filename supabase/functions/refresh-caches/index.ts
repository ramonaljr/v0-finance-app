import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body to check for specific user IDs
    const body = await req.json().catch(() => ({}))
    const userIds = body.user_ids

    let users
    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      // Refresh specific users
      const { data: specificUsers, error: usersError } = await supabase
        .from('users')
        .select('id')
        .in('id', userIds)

      if (usersError) {
        throw usersError
      }
      users = specificUsers
    } else {
      // Fallback to all users (for backward compatibility)
      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('id')

      if (usersError) {
        throw usersError
      }
      users = allUsers
    }

    const results = []
    // Process users in parallel batches for better performance
    const batchSize = 10
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize)
      const batchPromises = batch.map(async (user) => {
        // Refresh KPI cache for current month
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth() + 1

        // Calculate period start and end dates
        const startDate = new Date(currentYear, currentMonth - 1, 1)
        const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59)

        // Get transactions for this period
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('amount_minor, direction, category_id')
          .eq('user_id', user.id)
          .gte('occurred_at', startDate.toISOString())
          .lte('occurred_at', endDate.toISOString())
          .is('deleted_at', null)

        if (txError) {
          console.error(`Error fetching transactions for user ${user.id}:`, txError)
          return {
            user_id: user.id,
            kpi_updated: false,
            calendar_updated: false,
            error: txError.message
          }
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
        const { error: kpiError } = await supabase
          .from('kpi_cache')
          .upsert({
            user_id: user.id,
            period_year: currentYear,
            period_month: currentMonth,
            income_minor,
            expense_minor,
            net_minor,
            top_cats: topCategories,
            updated_at: new Date().toISOString()
          })

        if (kpiError) {
          console.error(`Error upserting KPI cache for user ${user.id}:`, kpiError)
          return {
            user_id: user.id,
            kpi_updated: false,
            calendar_updated: false,
            error: kpiError.message
          }
        }

        // Refresh Calendar cache for current month
        const { data: calendarTransactions, error: calTxError } = await supabase
          .from('transactions')
          .select('amount_minor, direction, occurred_at')
          .eq('user_id', user.id)
          .gte('occurred_at', startDate.toISOString())
          .lte('occurred_at', endDate.toISOString())
          .is('deleted_at', null)

        if (calTxError) {
          console.error(`Error fetching calendar transactions for user ${user.id}:`, calTxError)
          return {
            user_id: user.id,
            kpi_updated: true,
            calendar_updated: false,
            error: calTxError.message
          }
        }

        // Group by day and calculate daily totals
        const dayTotals = new Map<string, { income_minor: number, expense_minor: number }>()

        calendarTransactions?.forEach(t => {
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
        const { error: calError } = await supabase
          .from('calendar_cache')
          .upsert({
            user_id: user.id,
            y: currentYear,
            m: currentMonth,
            days,
            updated_at: new Date().toISOString()
          })

        if (calError) {
          console.error(`Error upserting calendar cache for user ${user.id}:`, calError)
          return {
            user_id: user.id,
            kpi_updated: true,
            calendar_updated: false,
            error: calError.message
          }
        }

        return {
          user_id: user.id,
          kpi_updated: !kpiError,
          calendar_updated: !calError,
          income_minor,
          expense_minor,
          net_minor
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed_users: results.length,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Cache refresh error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

