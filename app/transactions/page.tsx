"use client"
import dynamic from "next/dynamic"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
const FinancialCalendar = dynamic(() => import("@/components/financial-calendar-functional").then(m => m.FinancialCalendarFunctional), { ssr: false })
const AddTransactionDialog = dynamic(() => import("@/components/add-transaction-dialog").then(m => m.AddTransactionDialog), { ssr: false })
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CalendarIcon,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Heart,
  Briefcase,
  Sparkles,
  BarChart3,
  DollarSign,
  Receipt,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
const TransactionSpendingPieChart = dynamic(
  () => import("@/components/transaction-spending-pie-chart").then(m => m.TransactionSpendingPieChart),
  { ssr: false }
)
import { TransactionFilters, FilterState } from "@/components/transaction-filters"

interface Transaction {
  id: string
  amount_minor: number
  currency_code: string
  direction: 'in' | 'out'
  occurred_at: string
  payee?: string
  notes?: string
  category?: {
    id: string
    name: string
    icon?: string
    color?: string
  }
  account?: {
    id: string
    name: string
    type: string
  }
}

export default function TransactionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [filters, setFilters] = useState<FilterState>({ categoryIds: [], direction: 'all' })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
  }, [filters])

  useEffect(() => {
    // Listen for transaction added event
    const handleTransactionAdded = () => {
      fetchTransactions()
    }
    window.addEventListener('transactionAdded', handleTransactionAdded)
    return () => window.removeEventListener('transactionAdded', handleTransactionAdded)
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.direction !== 'all') {
        params.append('direction', filters.direction)
      }
      if (filters.categoryIds.length > 0) {
        params.append('category_id', filters.categoryIds[0])
      }
      if (filters.minAmount) {
        params.append('min_amount', (filters.minAmount * 100).toString())
      }
      if (filters.maxAmount) {
        params.append('max_amount', (filters.maxAmount * 100).toString())
      }

      const response = await fetch(`/api/transactions?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err instanceof Error ? err.message : 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleExport = async () => {
    try {
      const currentMonth = new Date()
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString()
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString()

      const response = await fetch(`/api/export/transactions?format=csv&start_date=${startDate}&end_date=${endDate}`)
      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting transactions:', error)
      alert('Failed to export transactions. Please try again.')
    }
  }

  const mockTransactions = [
    {
      id: 1,
      name: "Whole Foods Market",
      category: "Groceries",
      amount: -127.45,
      date: "Today, 2:30 PM",
      icon: ShoppingBag,
      bgGradient: "bg-gradient-to-br from-orange-500 to-amber-600",
      glowColor: "shadow-orange-500/20",
    },
    {
      id: 2,
      name: "Starbucks",
      category: "Coffee & Dining",
      amount: -8.75,
      date: "Today, 9:15 AM",
      icon: Coffee,
      bgGradient: "bg-gradient-to-br from-amber-500 to-yellow-600",
      glowColor: "shadow-amber-500/20",
    },
    {
      id: 3,
      name: "Monthly Salary",
      category: "Income",
      amount: 5200.0,
      date: "Yesterday, 12:00 PM",
      icon: Briefcase,
      bgGradient: "bg-gradient-to-br from-emerald-500 to-green-600",
      glowColor: "shadow-emerald-500/20",
    },
    {
      id: 4,
      name: "Shell Gas Station",
      category: "Transportation",
      amount: -52.3,
      date: "Yesterday, 6:45 PM",
      icon: Car,
      bgGradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
      glowColor: "shadow-blue-500/20",
    },
    {
      id: 5,
      name: "Electric Bill",
      category: "Utilities",
      amount: -145.0,
      date: "Oct 1, 2024",
      icon: Home,
      bgGradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
      glowColor: "shadow-purple-500/20",
    },
    {
      id: 6,
      name: "Gym Membership",
      category: "Health & Fitness",
      amount: -49.99,
      date: "Oct 1, 2024",
      icon: Heart,
      bgGradient: "bg-gradient-to-br from-pink-500 to-rose-600",
      glowColor: "shadow-pink-500/20",
    },
  ]

  const categoryStats = [
    {
      name: "Groceries",
      amount: 487.32,
      percentage: 28,
      count: 12,
      chartColor: "#10b981",
      barColor: "#10b981",
    },
    {
      name: "Dining",
      amount: 342.15,
      percentage: 20,
      count: 18,
      chartColor: "#f97316",
      barColor: "#f97316",
    },
    {
      name: "Transport",
      amount: 215.8,
      percentage: 13,
      count: 8,
      chartColor: "#3b82f6",
      barColor: "#3b82f6",
    },
    {
      name: "Shopping",
      amount: 425.0,
      percentage: 25,
      count: 15,
      chartColor: "#ec4899",
      barColor: "#ec4899",
    },
    {
      name: "Utilities",
      amount: 145.0,
      percentage: 8,
      count: 3,
      chartColor: "#f59e0b",
      barColor: "#f59e0b",
    },
    {
      name: "Other",
      amount: 108.22,
      percentage: 6,
      count: 5,
      chartColor: "#6b7280",
      barColor: "#6b7280",
    },
  ]

  const pieChartData = categoryStats.map((cat) => ({
    name: cat.name,
    value: cat.amount,
    fill: cat.chartColor,
    percentage: cat.percentage,
  }))

  const totalSpending = categoryStats.reduce((sum, cat) => sum + cat.amount, 0)

  // Calculate stats from real transactions
  const transactionStats = transactions.reduce((acc, t) => {
    const amount = t.amount_minor / 100
    if (t.direction === 'out') {
      acc.totalExpenses += amount
      acc.expenseCount++
    } else {
      acc.totalIncome += amount
      acc.incomeCount++
    }
    return acc
  }, { totalExpenses: 0, totalIncome: 0, expenseCount: 0, incomeCount: 0 })

  // Client-side search filtering
  const displayTransactions = transactions.filter((t) => {
    if (searchQuery && t.payee && !t.payee.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (searchQuery && t.notes && !t.notes.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  // Map API transactions to UI format
  const getCategoryIcon = (name?: string) => {
    if (!name) return DollarSign
    const lower = name.toLowerCase()
    if (lower.includes('groc')) return ShoppingBag
    if (lower.includes('food') || lower.includes('dining') || lower.includes('restaurant')) return Coffee
    if (lower.includes('transport') || lower.includes('gas') || lower.includes('car')) return Car
    if (lower.includes('home') || lower.includes('rent') || lower.includes('utilit')) return Home
    if (lower.includes('health') || lower.includes('fitness')) return Heart
    if (lower.includes('income') || lower.includes('salary')) return Briefcase
    return DollarSign
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
              <p className="text-sm font-medium text-gray-600">October 2024</p>
            </div>
            <Button size="sm" variant="outline" className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all rounded-xl h-9 font-semibold" onClick={handleExport}>
              <Download className="h-4 w-4" strokeWidth={2.5} />
              Export
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <Card className="bg-white p-5 rounded-2xl shadow-sm transition-all duration-200">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 border-2 border-white">
                <Receipt className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</p>
              <p className="text-xl font-bold text-gray-900">{loading ? '...' : transactions.length}</p>
              <p className="text-xs font-medium text-gray-600">transactions</p>
            </Card>

            <Card className="bg-white p-5 rounded-2xl shadow-sm transition-all duration-200">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 border-2 border-white">
                <ArrowDownRight className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Expenses</p>
              <p className="text-xl font-bold text-gray-900">{loading ? '...' : `$${transactionStats.totalExpenses.toFixed(0)}`}</p>
              <p className="text-xs font-medium text-gray-600">{transactionStats.expenseCount} transactions</p>
            </Card>

            <Card className="bg-white p-5 rounded-2xl shadow-sm transition-all duration-200">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 border-2 border-white">
                <ArrowUpRight className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Income</p>
              <p className="text-xl font-bold text-gray-900">{loading ? '...' : `$${transactionStats.totalIncome.toFixed(0)}`}</p>
              <p className="text-xs font-medium text-gray-600">{transactionStats.incomeCount} transactions</p>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" strokeWidth={2.5} />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl h-9 border-gray-300 shadow-sm"
              />
            </div>
            <TransactionFilters
              categories={categories.map(c => ({
                id: c.id,
                name: c.name,
                icon: c.icon,
                color: c.color
              }))}
              onApplyFilters={setFilters}
              activeFilters={filters}
            />
            <Button variant="outline" size="icon" className="shrink-0 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <CalendarIcon className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="mb-6 w-full justify-start gap-2 bg-transparent p-0">
            <TabsTrigger
              value="reports"
              className="rounded-xl border border-gray-300 bg-white shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:shadow-lg font-semibold transition-all"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="gap-1.5 rounded-xl border border-gray-300 bg-white shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:shadow-lg font-semibold transition-all"
            >
              <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">Calendar & Transactions</h3>
              <FinancialCalendar />
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            )}

            {error && (
              <Card className="bg-red-50 border-red-200 p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Failed to load transactions</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {!loading && !error && displayTransactions.length === 0 && (
              <Card className="bg-white p-8 text-center">
                <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-[16px] text-gray-700">No transactions yet</p>
              </Card>
            )}

            {!loading && !error && displayTransactions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Recent Transactions</h3>
                  <p className="text-sm font-medium text-gray-600">{displayTransactions.length} total</p>
                </div>
                {displayTransactions.slice(0, 20).map((transaction) => {
                  const Icon = getCategoryIcon(transaction.category?.name)
                  const isIncome = transaction.direction === 'in'
                  const amount = transaction.amount_minor / 100
                  const date = new Date(transaction.occurred_at)

                  return (
                    <Card key={transaction.id} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${isIncome ? 'bg-emerald-600' : 'bg-red-600'} border-2 border-white`}
                        >
                          <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-gray-900">{transaction.payee || 'Transaction'}</p>
                          <p className="text-xs font-semibold text-gray-600">{transaction.category?.name || 'Uncategorized'}</p>
                          <p className="text-xs font-medium text-gray-600">{date.toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p
                              className={`text-xl font-bold ${isIncome ? "text-green-600" : "text-gray-900"}`}
                            >
                              {isIncome ? "+" : "-"}${Math.abs(amount).toFixed(2)}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">Spending Overview</h3>
              <Card className="bg-white p-6 rounded-2xl shadow-md">
                <div className="mb-6 text-center">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Spending</p>
                  <p className="text-4xl font-bold text-gray-900">${totalSpending.toFixed(2)}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1">
                    <TrendingUp className="h-3.5 w-3.5 text-red-600" strokeWidth={2.5} />
                    <span className="text-sm font-semibold text-red-600">+12% from last month</span>
                  </div>
                </div>

                <TransactionSpendingPieChart data={pieChartData} />

                <div className="space-y-3">
                  {pieChartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full shadow-lg" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm font-bold text-gray-900">{item.name}</span>
                        <span className="text-sm font-semibold text-gray-600">{item.percentage}%</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">${item.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Monthly Overview */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">Monthly Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 border-2 border-white">
                      <DollarSign className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <Badge variant="outline" className="font-semibold">Avg</Badge>
                  </div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Daily Spending</p>
                  <p className="text-2xl font-bold text-gray-900">$57.46</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-red-600" strokeWidth={2.5} />
                    <span className="text-xs font-semibold text-red-600">+8% from average</span>
                  </div>
                </Card>

                <Card className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/20 border-2 border-white">
                      <Receipt className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <Badge variant="outline" className="font-semibold">Avg</Badge>
                  </div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Per Transaction</p>
                  <p className="text-2xl font-bold text-gray-900">$12.14</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingDown className="h-3.5 w-3.5 text-green-600" strokeWidth={2.5} />
                    <span className="text-xs font-semibold text-green-600">-3% from average</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Spending by Category */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Category Details</h3>
              </div>

              <Card className="bg-white p-5 rounded-2xl shadow-md">
                <div className="space-y-4">
                  {categoryStats.map((category) => (
                    <div key={category.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full shadow-lg" style={{ backgroundColor: category.chartColor }} />
                          <span className="text-sm font-bold text-gray-900">{category.name}</span>
                          <span className="text-sm font-semibold text-gray-600">({category.count})</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">${category.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-50">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${category.percentage}%`,
                              backgroundColor: category.barColor,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-600">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Weekly Spending Trend */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Weekly Spending Trend</h3>
                <Button size="sm" variant="ghost" className="h-9 gap-1.5 hover:bg-gray-50 rounded-xl font-semibold">
                  <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
                  Details
                </Button>
              </div>

              <Card className="bg-white p-5 rounded-2xl shadow-md">
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { day: "Mon", amount: 45, height: 40, color: "bg-gradient-to-t from-blue-500 to-cyan-400 shadow-lg" },
                    { day: "Tue", amount: 78, height: 70, color: "bg-gradient-to-t from-emerald-500 to-teal-400 shadow-lg" },
                    { day: "Wed", amount: 52, height: 50, color: "bg-gradient-to-t from-purple-500 to-indigo-400 shadow-lg" },
                    { day: "Thu", amount: 95, height: 85, color: "bg-gradient-to-t from-pink-500 to-rose-400 shadow-lg" },
                    { day: "Fri", amount: 120, height: 100, color: "bg-gradient-to-t from-orange-500 to-amber-400 shadow-lg" },
                    { day: "Sat", amount: 88, height: 75, color: "bg-gradient-to-t from-indigo-500 to-purple-400 shadow-lg" },
                    { day: "Sun", amount: 62, height: 55, color: "bg-gradient-to-t from-cyan-500 to-blue-400 shadow-lg" },
                  ].map((day) => (
                    <div key={day.day} className="flex flex-col items-center">
                      <div className="mb-2 flex h-24 w-full items-end">
                        <div className={`w-full rounded-t-lg ${day.color}`} style={{ height: `${day.height}%` }} />
                      </div>
                      <p className="text-xs font-bold text-gray-900">{day.day}</p>
                      <p className="text-xs font-semibold text-gray-600">${day.amount}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Top Merchants */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">Top Merchants</h3>
              <Card className="divide-y divide-gray-100 bg-white rounded-2xl shadow-md">
                {[
                  {
                    name: "Whole Foods",
                    amount: 487.32,
                    transactions: 12,
                    icon: ShoppingBag,
                    bgGradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
                    glowColor: "shadow-emerald-500/20",
                  },
                  {
                    name: "Shell Gas",
                    amount: 215.8,
                    transactions: 8,
                    icon: Car,
                    bgGradient: "bg-gradient-to-br from-blue-500 to-blue-600",
                    glowColor: "shadow-blue-500/20",
                  },
                  {
                    name: "Amazon",
                    amount: 425.0,
                    transactions: 15,
                    icon: ShoppingBag,
                    bgGradient: "bg-gradient-to-br from-pink-500 to-pink-600",
                    glowColor: "shadow-pink-500/20",
                  },
                  {
                    name: "Starbucks",
                    amount: 156.25,
                    transactions: 18,
                    icon: Coffee,
                    bgGradient: "bg-gradient-to-br from-orange-500 to-orange-600",
                    glowColor: "shadow-orange-500/20",
                  },
                ].map((merchant, index) => {
                  const Icon = merchant.icon
                  return (
                    <div key={merchant.name} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-all cursor-pointer">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold text-gray-600">
                        #{index + 1}
                      </div>
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${merchant.bgGradient} shadow-lg ${merchant.glowColor} border-2 border-white`}
                      >
                        <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{merchant.name}</p>
                        <p className="text-xs font-semibold text-gray-600">{merchant.transactions} transactions</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">${merchant.amount.toFixed(2)}</p>
                    </div>
                  )
                })}
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-2xl shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20 border-2 border-white">
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">Spending Pattern Detected</p>
                    <Badge className="border-0 bg-purple-100 text-purple-700 text-xs font-semibold">AI</Badge>
                  </div>
                  <p className="text-sm leading-relaxed font-medium text-gray-700">
                    Your weekend spending is 45% higher than weekdays. Setting a weekend budget could save you
                    $180/month.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
      <AddTransactionDialog />
    </div>
  )
}
