"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Plus, TrendingUp, Sparkles, Target, ArrowRight, Zap, Brain, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

const NotificationBell = dynamic(() => import("@/components/notification-bell").then(m => ({ default: m.NotificationBell })), { ssr: false })
const BillReminders = dynamic(() => import("@/components/bill-reminders").then(m => ({ default: m.BillReminders })), { ssr: false })
import { HomeLoadingSkeleton } from "@/components/loading-states"

interface KPIData {
  income_minor: number
  expense_minor: number
  net_minor: number
  top_cats: Array<{ category_id: string; amount_minor: number }>
}

interface Account {
  id: string
  name: string
  type: string
  balance_minor: number
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()

    const checkAuthAndLoadData = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Error retrieving session:', sessionError)
          return
        }

        const currentUser = session?.user

        if (!currentUser) {
          router.replace('/auth/login')
          return
        }

        if (!isMounted) return
        setUser(currentUser)

        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        const ym = `${year}-${month.toString().padStart(2, '0')}`

        try {
          const [kpiResult, accountsResult] = await Promise.allSettled([
            fetch(`/api/stats/period?ym=${ym}`, { signal: abortController.signal }),
            fetch('/api/accounts', { signal: abortController.signal }),
          ])

          if (!isMounted) return

          if (kpiResult.status === 'fulfilled') {
            if (kpiResult.value.ok) {
              const kpiJson = await kpiResult.value.json()
              setKpiData(kpiJson)
            } else {
              console.warn('KPI request failed:', kpiResult.value.status, kpiResult.value.statusText)
            }
          } else {
            console.error('KPI request error:', kpiResult.reason)
          }

          if (accountsResult.status === 'fulfilled') {
            if (accountsResult.value.ok) {
              const accountsJson = await accountsResult.value.json()
              const userAccounts = accountsJson.accounts || []
              setAccounts(userAccounts)

              // Check if user needs onboarding
              const onboardingCompleted = localStorage.getItem('onboarding_completed')
              if (!onboardingCompleted && userAccounts.length === 0) {
                router.replace('/onboarding')
                return
              }
            } else {
              console.warn('Accounts request failed:', accountsResult.value.status, accountsResult.value.statusText)
            }
          } else {
            console.error('Accounts request error:', accountsResult.reason)
          }
        } catch (error) {
          if ((error as DOMException).name !== 'AbortError') {
            console.error('Error fetching data:', error)
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkAuthAndLoadData()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [router])

  if (loading) {
    return <HomeLoadingSkeleton />
  }

  if (!user) {
    return null
  }

  // Calculate totals
  const income = (kpiData?.income_minor || 0) / 100
  const expenses = (kpiData?.expense_minor || 0) / 100
  const net = (kpiData?.net_minor || 0) / 100
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance_minor, 0) / 100

  // Get user initials
  const userEmail = user.email || 'User'
  const initials = userEmail.substring(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <main className="mx-auto max-w-lg">
        {/* Enhanced Header */}
        <div className="border-b bg-white px-6 pb-6 pt-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-lg shadow-primary/10 ring-2 ring-offset-2 ring-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Welcome back</p>
                <h1 className="text-xl font-bold text-gray-900">{userEmail.split('@')[0]}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <ThemeToggleButton />
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 hover:bg-gray-100 hover-scale-sm rounded-xl transition-all"
                onClick={() => router.push('/auth/login')}
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Enhanced Balance Card */}
          <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover-scale-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 pulse-glow" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Balance</p>
            </div>
            <p className="mb-4 text-4xl lg:text-5xl font-bold tracking-tight text-gradient-primary tabular-nums">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-500/50" />
                <span className="text-sm font-medium text-gray-700">
                  Income: <span className="font-bold text-emerald-600">${income.toFixed(2)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-sm shadow-red-500/50" />
                <span className="text-sm font-medium text-gray-700">
                  Expenses: <span className="font-bold text-red-600">${expenses.toFixed(2)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* This Month Summary */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">This Month</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center hover:shadow-lg transition-all">
              <p className="text-2xl font-bold text-emerald-600">${income.toFixed(0)}</p>
              <p className="text-xs text-gray-600 mt-1">Income</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-lg transition-all">
              <p className="text-2xl font-bold text-red-600">${expenses.toFixed(0)}</p>
              <p className="text-xs text-gray-600 mt-1">Expenses</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-lg transition-all">
              <p className={`text-2xl font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${net.toFixed(0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Net</p>
            </Card>
          </div>
        </div>

        {/* Accounts */}
        <div className="px-6 pb-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Accounts</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-1.5 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-xl px-3"
              onClick={() => router.push('/account')}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add
            </Button>
          </div>

          {accounts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">No accounts yet</p>
              <Button onClick={() => router.push('/account')}>Add Your First Account</Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <Card key={account.id} className="p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 shadow-lg
                        ${account.type === 'checking' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-200 shadow-indigo-500/20' : ''}
                        ${account.type === 'savings' ? 'bg-gradient-to-br from-emerald-400 to-green-600 border-emerald-200 shadow-emerald-500/20' : ''}
                        ${account.type === 'credit' ? 'bg-gradient-to-br from-red-400 to-red-600 border-red-200 shadow-red-500/20' : ''}
                        ${account.type === 'investment' ? 'bg-gradient-to-br from-amber-400 to-orange-600 border-amber-200 shadow-amber-500/20' : ''}
                        ${account.type === 'cash' ? 'bg-gradient-to-br from-gray-500 to-gray-700 border-gray-200 shadow-gray-500/20' : ''}
                      `}>
                        <span className="text-sm font-bold text-white">{account.name.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{account.name}</p>
                        <p className="text-xs text-gray-500 font-medium capitalize">{account.type}</p>
                      </div>
                    </div>
                    <p className={`text-lg font-bold tabular-nums ${account.balance_minor >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      ${(account.balance_minor / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            className="mt-5 w-full bg-white border-2 hover:bg-gray-50 h-12 rounded-xl font-semibold hover-scale-sm transition-all"
            onClick={() => router.push('/account')}
          >
            Manage Accounts
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Bill Reminders */}
        <div className="px-6 pb-6">
          <BillReminders />
        </div>

        {/* Quick Actions */}
        <div className="px-6 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="h-24 flex flex-col gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              onClick={() => router.push('/transactions')}
            >
              <Plus className="h-6 w-6" />
              <span>Add Transaction</span>
            </Button>
            <Button
              className="h-24 flex flex-col gap-2 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              onClick={() => router.push('/budget')}
            >
              <Target className="h-6 w-6" />
              <span>View Budget</span>
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
