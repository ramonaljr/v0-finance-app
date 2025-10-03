import { ReactNode, Suspense } from 'react'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/server'
import { getCurrentPeriod } from '@/lib/utils'

async function prefetchDashboardData() {
  const queryClient = new QueryClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return queryClient

  // Get current period for KPI cache
  const currentPeriod = getCurrentPeriod()

  try {
    // Prefetch KPI cache
    await queryClient.prefetchQuery({
      queryKey: ['kpi-cache', currentPeriod],
      queryFn: async () => {
        const [year, month] = currentPeriod.split('-').map(Number)
        const { data } = await supabase
          .from('kpi_cache')
          .select('*')
          .eq('user_id', user.id)
          .eq('period_year', year)
          .eq('period_month', month)
          .single()
        return data
      },
    })

    // Prefetch calendar cache for current month
    const now = new Date()
    await queryClient.prefetchQuery({
      queryKey: ['calendar-cache', now.getFullYear(), now.getMonth() + 1],
      queryFn: async () => {
        const { data } = await supabase
          .from('calendar_cache')
          .select('*')
          .eq('user_id', user.id)
          .eq('y', now.getFullYear())
          .eq('m', now.getMonth() + 1)
          .single()
        return data
      },
    })

    // Prefetch recent transactions
    await queryClient.prefetchQuery({
      queryKey: ['transactions'],
      queryFn: async () => {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('occurred_at', { ascending: false })
          .limit(100)
        return data || []
      },
    })
  } catch (error) {
    console.error('Dashboard prefetch error:', error)
    // Don't fail rendering if prefetch fails
  }

  return queryClient
}

export default async function HomeLayout({ children }: { children: ReactNode }) {
  const queryClient = await prefetchDashboardData()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/40 animate-pulse" />}>
        {children}
      </Suspense>
    </HydrationBoundary>
  )
}
