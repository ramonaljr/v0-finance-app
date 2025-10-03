import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, getCurrentPeriod } from '@/lib/utils'

// Types for API responses
export interface Transaction {
  id: string
  amount_minor: number
  currency_code: string
  direction: 'in' | 'out'
  occurred_at: string
  account_id?: string
  category_id?: string
  payee?: string
  notes?: string
  tags?: string[]
  attachment_url?: string
  is_recurring?: boolean
  recur_rule?: string
  is_reconciled: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface BudgetCategory {
  id: string
  name: string
  allocated: number
  spent: number
  rollover: boolean
  color: string
}

export interface KPICache {
  id: string
  user_id: string
  period_year: number
  period_month: number
  income_minor: number
  expense_minor: number
  net_minor: number
  top_cats: Array<{
    category_id: string
    amount_minor: number
  }>
  updated_at: string
}

export interface CalendarCache {
  id: string
  user_id: string
  y: number
  m: number
  days: Array<{
    date: string
    income_minor: number
    expense_minor: number
    net_minor: number
  }>
  updated_at: string
}

// Query keys for consistent caching
export const queryKeys = {
  transactions: ['transactions'] as const,
  budgets: ['budgets'] as const,
  kpiCache: (period: string) => ['kpi-cache', period] as const,
  calendarCache: (year: number, month: number) => ['calendar-cache', year, month] as const,
  insights: ['insights'] as const,
}

// API functions
export async function fetchTransactions(): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('occurred_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return data || []
}

export async function fetchBudgets(): Promise<BudgetCategory[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // For now, return mock data since budgets aren't fully implemented
  return [
    { id: '1', name: 'Food & Drink', allocated: 60000, spent: 42000, rollover: true, color: 'bg-orange-500' },
    { id: '2', name: 'Transport', allocated: 30000, spent: 18000, rollover: false, color: 'bg-blue-500' },
    { id: '3', name: 'Home Bills', allocated: 180000, spent: 180000, rollover: false, color: 'bg-green-500' },
    { id: '4', name: 'Shopping', allocated: 40000, spent: 52000, rollover: true, color: 'bg-purple-500' },
    { id: '5', name: 'Self-Care', allocated: 20000, spent: 8500, rollover: true, color: 'bg-pink-500' },
    { id: '6', name: 'Health', allocated: 15000, spent: 12000, rollover: false, color: 'bg-red-500' },
  ]
}

export async function fetchKPICache(period: string): Promise<KPICache | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('Auth error in fetchKPICache:', authError)
      return null
    }

    if (!user) {
      console.warn('No user found in fetchKPICache')
      return null
    }

    const [year, month] = period.split('-').map(Number)

    const { data, error } = await supabase
      .from('kpi_cache')
      .select('*')
      .eq('user_id', user.id)
      .eq('period_year', year)
      .eq('period_month', month)
      .single()

    // PGRST116 = no rows returned (expected if cache empty)
    if (error && error.code !== 'PGRST116') {
      console.error('KPI cache fetch error:', error)
      return null
    }

    return data || null
  } catch (error) {
    console.error('Unexpected error in fetchKPICache:', error)
    return null
  }
}

export async function fetchCalendarCache(year: number, month: number): Promise<CalendarCache | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('calendar_cache')
    .select('*')
    .eq('user_id', user.id)
    .eq('y', year)
    .eq('m', month)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// React Query hooks
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: fetchTransactions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useBudgets() {
  return useQuery({
    queryKey: queryKeys.budgets,
    queryFn: fetchBudgets,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useKPICache(period?: string) {
  const currentPeriod = period || getCurrentPeriod()
  return useQuery({
    queryKey: queryKeys.kpiCache(currentPeriod),
    queryFn: () => fetchKPICache(currentPeriod),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    retryDelay: 1000, // 1 second between retries
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}

export function useCalendarCache(year?: number, month?: number) {
  const now = new Date()
  const y = year || now.getFullYear()
  const m = month || now.getMonth() + 1

  return useQuery({
    queryKey: queryKeys.calendarCache(y, m),
    queryFn: () => fetchCalendarCache(y, m),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransaction,
    onMutate: async (newTransaction) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.transactions })

      // Snapshot the previous value
      const previousTransactions = queryClient.getQueryData<Transaction[]>(queryKeys.transactions)

      // Optimistically update the cache
      if (previousTransactions) {
        const optimisticTransaction: Transaction = {
          id: `temp-${Date.now()}`, // Temporary ID
          ...newTransaction,
          user_id: 'current-user', // Will be replaced by server
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_reconciled: false,
        }

        queryClient.setQueryData<Transaction[]>(
          queryKeys.transactions,
          [optimisticTransaction, ...previousTransactions]
        )
      }

      // Return a context object with the snapshotted value
      return { previousTransactions }
    },
    onError: (err, newTransaction, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTransactions) {
        queryClient.setQueryData(queryKeys.transactions, context.previousTransactions)
      }
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch transactions and cache
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
      queryClient.invalidateQueries({ queryKey: queryKeys.kpiCache('') })
      queryClient.invalidateQueries({ queryKey: queryKeys.calendarCache(0, 0) })
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
    },
  })
}

// Utility hooks for formatted data
export function useFormattedTransactions() {
  const { data: transactions, ...rest } = useTransactions()

  return {
    ...rest,
    data: transactions?.map(t => ({
      ...t,
      amount: formatCurrency(t.amount_minor, t.currency_code),
    })),
  }
}

export function useFormattedBudgets() {
  const { data: budgets, ...rest } = useBudgets()

  return {
    ...rest,
    data: budgets?.map(b => ({
      ...b,
      allocated: formatCurrency(b.allocated),
      spent: formatCurrency(b.spent),
    })),
  }
}

export function useFormattedKPICache(period?: string) {
  const { data: kpi, ...rest } = useKPICache(period)

  if (!kpi) return { ...rest, data: null }

  return {
    ...rest,
    data: {
      ...kpi,
      income: formatCurrency(kpi.income_minor),
      expense: formatCurrency(kpi.expense_minor),
      net: formatCurrency(kpi.net_minor),
    },
  }
}
