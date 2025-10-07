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
        <div className="border-b bg-white px-6 pb-8 pt-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-lg shadow-primary/10 ring-2 ring-offset-2 ring-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[12px] font-medium text-gray-700 uppercase tracking-wide">Welcome back</p>
                <h2 className="text-[20px] font-bold text-gray-900">{userEmail.split('@')[0]}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <ThemeToggleButton />
              <Button
                size="icon"
                variant="ghost"
                className="h-12 w-12 hover:bg-gray-100 rounded-xl transition-all"
                onClick={() => router.push('/auth/login')}
              >
                <Eye className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Enhanced Balance Card */}
          <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 p-6 shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <p className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Total Balance</p>
            </div>
            <p className="mb-6 text-[28px] lg:text-[28px] font-bold tracking-tight text-gradient-primary tabular-nums">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                <span className="text-[16px] font-medium text-gray-700">
                  Income: <span className="font-bold text-emerald-600">${income.toFixed(2)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-600" />
                <span className="text-[16px] font-medium text-gray-700">
                  Expenses: <span className="font-bold text-red-600">${expenses.toFixed(2)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Condensed */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="text-[12px] text-gray-700 mb-1">Income</p>
              <p className="text-[20px] font-bold text-emerald-600">${income.toFixed(0)}</p>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-gray-700 mb-1">Expenses</p>
              <p className="text-[20px] font-bold text-red-600">${expenses.toFixed(0)}</p>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-gray-700 mb-1">Net</p>
              <p className={`text-[20px] font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${net.toFixed(0)}
              </p>
            </div>
          </div>

          {/* Quick Actions - Prominent */}
          <div className="space-y-3">
            <Button
              className="w-full h-14 justify-start gap-4 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md"
              onClick={() => router.push('/transactions')}
            >
              <Plus className="h-5 w-5" />
              <span className="text-[16px] font-semibold">Add Transaction</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 justify-start gap-4 border-2 hover:bg-gray-50"
              onClick={() => router.push('/budget')}
            >
              <Target className="h-5 w-5 text-indigo-600" />
              <span className="text-[16px] font-semibold text-gray-900">View Budget</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 justify-start gap-4 border-2 hover:bg-gray-50"
              onClick={() => router.push('/account')}
            >
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-[16px] font-semibold text-gray-900">Manage Accounts</span>
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
