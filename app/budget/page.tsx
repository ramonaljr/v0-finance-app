"use client"
import dynamic from "next/dynamic"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingDown,
  AlertCircle,
  Sparkles,
  Target,
  DollarSign,
  PieChartIcon,
  Calendar,
  CreditCard,
  Home,
  Zap,
  RefreshCw,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { useState, useEffect } from "react"
const AICoachFAB = dynamic(() => import("@/components/ai-coach-fab").then(m => m.AICoachFAB), { ssr: false })
const BudgetPieChart = dynamic(() => import("@/components/budget-pie-chart").then(m => m.BudgetPieChart), { ssr: false })
const AIInsightCard = dynamic(() => import("@/components/ai-insight-card").then(m => m.AIInsightCard), { ssr: false })
import { getCategoryColor } from "@/lib/category-colors"
import { Loader2 } from "lucide-react"

interface BudgetItem {
  id: string
  category_id?: string
  limit_minor: number
  spent_minor?: number
  allocated_minor: number
  category?: {
    id: string
    name: string
    icon?: string
    color?: string
  }
}

interface Budget {
  id: string
  period_year: number
  period_month: number
  type: string
  rollover: boolean
  items: BudgetItem[]
}

export default function BudgetPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tab, setTab] = useState("plan")
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  useEffect(() => {
    fetchBudgets()
  }, [currentDate])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      setError(null)

      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1

      const response = await fetch(`/api/budgets?period_year=${year}&period_month=${month}`)
      if (!response.ok) {
        throw new Error('Failed to fetch budgets')
      }

      const data = await response.json()
      setBudgets(data.budgets || [])
    } catch (err) {
      console.error('Error fetching budgets:', err)
      setError(err instanceof Error ? err.message : 'Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  const currentBudget = budgets.length > 0 ? budgets[0] : null

  // Calculate budget stats from real data
  const budgetStats = currentBudget?.items.map(item => {
    const limit = item.limit_minor / 100
    const spent = (item.spent_minor || 0) / 100
    const percentage = limit > 0 ? (spent / limit) * 100 : 0
    const status = spent > limit ? 'over' : percentage > 85 ? 'warning' : 'good'

    return {
      id: item.id,
      category_id: item.category_id,
      name: item.category?.name || 'Uncategorized',
      spent,
      budget: limit,
      icon: item.category?.icon || '💰',
      status,
      ...getCategoryColor(item.category?.name || 'Other')
    }
  }) || []

  const totalSpent = budgetStats.reduce((sum, cat) => sum + cat.spent, 0)
  const totalBudget = budgetStats.reduce((sum, cat) => sum + cat.budget, 0)
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const recurringExpenses = [
    {
      id: "mortgage",
      name: "Mortgage Payment",
      amount: 1850.0,
      dueDate: 1,
      category: "Housing",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      status: "paid",
      autopay: true,
    },
    {
      id: "car-loan",
      name: "Car Loan",
      amount: 425.0,
      dueDate: 15,
      category: "Loans",
      icon: CreditCard,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      status: "upcoming",
      autopay: true,
    },
    {
      id: "credit-card",
      name: "Credit Card Payment",
      amount: 650.0,
      dueDate: 22,
      category: "Credit Cards",
      icon: CreditCard,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      status: "upcoming",
      autopay: false,
    },
    {
      id: "electricity",
      name: "Electricity Bill",
      amount: 145.0,
      dueDate: 10,
      category: "Utilities",
      icon: Zap,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50",
      status: "paid",
      autopay: true,
    },
    {
      id: "internet",
      name: "Internet & Cable",
      amount: 89.99,
      dueDate: 5,
      category: "Utilities",
      icon: Zap,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50",
      status: "paid",
      autopay: true,
    },
    {
      id: "insurance",
      name: "Home Insurance",
      amount: 175.0,
      dueDate: 28,
      category: "Insurance",
      icon: Home,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      status: "upcoming",
      autopay: true,
    },
  ]

  const totalRecurring = recurringExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const paidRecurring = recurringExpenses
    .filter((exp) => exp.status === "paid")
    .reduce((sum, exp) => sum + exp.amount, 0)
  const upcomingRecurring = totalRecurring - paidRecurring

  // Use real budget stats or fallback to empty array
  const budgetCategories = budgetStats.length > 0 ? budgetStats : []

  const pieChartData = budgetCategories.map((cat) => ({
    name: cat.name,
    value: cat.spent,
    fill: cat.chartColor,
    percentage: ((cat.spent / totalSpent) * 100).toFixed(1),
  }))

  const totalMonthlyObligations = totalBudget + totalRecurring
  const discretionaryBudget = totalBudget - totalRecurring
  const recurringPercentage = (totalRecurring / totalMonthlyObligations) * 100

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Header */}
      <header className="relative z-10 border-b border-border bg-white px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
              <p className="text-sm text-gray-600">Manage your spending</p>
            </div>
            <Button size="sm" className="gap-2 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all rounded-xl">
              <Plus className="h-4 w-4 strokeWidth={2.5}" />
              Add Category
            </Button>
          </div>

          {/* Month Selector */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-white p-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            <span className="text-sm font-semibold text-gray-900">{currentMonth}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          </div>

          {/* Budget Overview */}
          <Card className="bg-white p-6 shadow-md rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Budget</p>
                <p className="text-2xl font-bold text-gray-900">${totalBudget.toFixed(2)}</p>
              </div>
            </div>
            <Progress value={percentageUsed} className="mb-3 h-3" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{percentageUsed.toFixed(1)}% of budget used</span>
              <span className="text-sm font-semibold text-gray-900">
                ${(totalBudget - totalSpent).toFixed(2)} remaining
              </span>
            </div>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-lg px-6 py-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start gap-2 bg-transparent p-0 pointer-events-auto">
            <TabsTrigger
              value="plan"
              className="rounded-xl border bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white shadow-md data-[state=active]:shadow-lg transition-all"
            >
              Plan
            </TabsTrigger>
            <TabsTrigger
              value="recurring"
              className="gap-1.5 rounded-xl border bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white shadow-md data-[state=active]:shadow-lg transition-all"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
              Recurring
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="gap-1.5 rounded-xl border bg-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white shadow-md data-[state=active]:shadow-lg transition-all"
            >
              <PieChartIcon className="h-4 w-4" strokeWidth={2.5} />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-6">
            {/* AI Insights */}
            <AIInsightCard
              context={{
                type: 'budget',
                budgets: budgetCategories
              }}
            />

            {/* Budget Categories */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Categories</h3>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              )}

              {error && (
                <Card className="bg-red-50 border-red-200 p-6">
                  <p className="text-red-900 font-semibold">Failed to load budget</p>
                  <p className="text-sm text-red-700">{error}</p>
                </Card>
              )}

              {!loading && !error && budgetCategories.length === 0 && (
                <Card className="bg-white p-8 text-center">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-2">No budget yet</h3>
                  <Button className="gap-2 mt-4">
                    <Plus className="h-4 w-4" />
                    Create Budget
                  </Button>
                </Card>
              )}

              {!loading && !error && budgetCategories.map((category) => {
                const percentage = (category.spent / category.budget) * 100
                const isOver = category.spent > category.budget
                const isWarning = percentage > 85 && !isOver

                return (
                  <Card key={category.id} className="bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-2xl">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.bg}`}>
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{category.name}</p>
                          <p className="text-xs text-gray-600">
                            ${category.spent.toFixed(2)} of ${category.budget.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {isOver && (
                        <Badge className="border-0 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 gap-1">
                          <AlertCircle className="h-3 w-3" strokeWidth={2.5} />
                          Over
                        </Badge>
                      )}
                      {isWarning && (
                        <Badge className="border-0 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 gap-1">
                          <AlertCircle className="h-3 w-3" strokeWidth={2.5} />
                          {percentage.toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`mb-2 h-2.5 ${isOver ? "[&>div]:bg-red-600" : isWarning ? "[&>div]:bg-yellow-600" : ""}`}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-medium ${isOver ? "text-red-600 dark:text-red-400" : "text-gray-600"}`}
                      >
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${Math.max(category.budget - category.spent, 0).toFixed(2)} left
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Spending Trends */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Spending Trends</h3>
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-white p-4 shadow-sm rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                      <TrendingDown className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">vs Last Month</span>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">-8.5%</p>
                  <p className="text-xs text-gray-600">Saved $142</p>
                </Card>

                <Card className="bg-white p-4 shadow-sm rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <DollarSign className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Daily</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">$59.46</p>
                  <p className="text-xs text-gray-600">This month</p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recurring" className="space-y-6">
            {/* Recurring Overview */}
            <Card className="bg-white p-6 shadow-md rounded-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Monthly Recurring</p>
                  <p className="text-3xl font-bold text-gray-900">${totalRecurring.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid This Month</p>
                  <p className="text-2xl font-bold text-green-600">${paidRecurring.toFixed(2)}</p>
                </div>
              </div>
              <Progress value={(paidRecurring / totalRecurring) * 100} className="mb-3 h-3 [&>div]:bg-green-600" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {recurringExpenses.filter((e) => e.status === "paid").length} of {recurringExpenses.length} paid
                </span>
                <span className="text-sm font-semibold text-gray-900">${upcomingRecurring.toFixed(2)} upcoming</span>
              </div>
            </Card>

            {/* AI Insights for Recurring */}
            <AIInsightCard
              context={{
                type: 'recurring'
              }}
            />

            {/* Budget Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-white p-4 shadow-md rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                    <RefreshCw className="h-5 w-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Fixed Expenses</span>
                </div>
                <p className="text-xl font-bold text-gray-900">${totalRecurring.toFixed(2)}</p>
                <p className="text-xs text-gray-600">{recurringPercentage.toFixed(1)}% of income</p>
              </Card>

              <Card className="bg-white p-4 shadow-md rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
                    <DollarSign className="h-5 w-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Discretionary</span>
                </div>
                <p className="text-xl font-bold text-gray-900">${discretionaryBudget.toFixed(2)}</p>
                <p className="text-xs text-gray-600">{(100 - recurringPercentage).toFixed(1)}% available</p>
              </Card>
            </div>

            {/* Recurring Expenses List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Monthly Bills</h3>
                <Button size="sm" variant="outline" className="h-9 gap-1.5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-3 w-3" strokeWidth={2.5} />
                  Add Bill
                </Button>
              </div>

              {recurringExpenses
                .sort((a, b) => a.dueDate - b.dueDate)
                .map((expense) => {
                  const Icon = expense.icon
                  const isPaid = expense.status === "paid"
                  const isUpcoming = expense.status === "upcoming"

                  return (
                    <Card key={expense.id} className="bg-white p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${expense.bgColor}`}
                          >
                            <Icon className="h-7 w-7 text-gray-700 dark:text-gray-300" strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900">{expense.name}</p>
                              {expense.autopay && (
                                <Badge className="border-0 bg-blue-100 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-300">
                                  Auto
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{expense.category}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar className="h-3 w-3 text-gray-600" strokeWidth={2.5} />
                              <span className="text-gray-600">
                                Due: {currentMonth.split(" ")[0]} {expense.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 mb-1">${expense.amount.toFixed(2)}</p>
                          {isPaid && (
                            <Badge className="border-0 bg-green-100 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
                              <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                              Paid
                            </Badge>
                          )}
                          {isUpcoming && (
                            <Badge className="border-0 bg-amber-100 text-amber-700 text-xs dark:bg-amber-900 dark:text-amber-300">
                              <Clock className="h-3 w-3" strokeWidth={2.5} />
                              Upcoming
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
            </div>

            {/* Payment Calendar */}
            <Card className="bg-white p-4 shadow-md rounded-2xl">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Payment Schedule</h3>
              <div className="space-y-2">
                {recurringExpenses
                  .sort((a, b) => a.dueDate - b.dueDate)
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900 text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {expense.dueDate}
                        </div>
                        <span className="text-sm text-gray-900">{expense.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">${expense.amount.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {/* Pie Chart */}
            <Card className="bg-white p-6 shadow-md rounded-2xl">
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Budget</p>
                <p className="text-4xl font-bold text-gray-900">${totalBudget.toFixed(0)}</p>
                <p className="mt-1 text-sm text-gray-600">${totalSpent.toFixed(2)} spent</p>
              </div>

              <BudgetPieChart data={pieChartData} />

              {/* Category Breakdown */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Category Breakdown</h3>
                <div className="space-y-3">
                  {budgetCategories.map((category) => {
                    const percentage = (category.spent / category.budget) * 100
                    const isOver = category.spent > category.budget

                    return (
                      <Card key={category.id} className="bg-gray-50 p-4 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.bg}`}>
                              <span className="text-xl">{category.icon}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{category.name}</p>
                              <p className="text-xs text-gray-600">
                                ${category.spent.toFixed(2)} of ${category.budget.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          {isOver && (
                            <Badge className="border-0 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                              Over Budget
                            </Badge>
                          )}
                        </div>
                        <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: isOver ? "#dc2626" : category.barColor,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className={`font-medium ${isOver ? "text-red-600 dark:text-red-400" : "text-gray-600"}`}
                          >
                            {percentage.toFixed(1)}% used
                          </span>
                          <span className="font-semibold text-gray-900">
                            ${Math.max(category.budget - category.spent, 0).toFixed(2)} left
                          </span>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="border-blue-200 bg-white p-4 dark:border-blue-800 shadow-md rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 border-2 border-white">
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">Budget Insight</p>
                    <Badge className="border-0 bg-blue-100 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-300">
                      AI
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Your largest spending category is Shopping at $
                    {budgetCategories.find((c) => c.id === "shopping")?.spent.toFixed(2)}. Consider setting subcategory
                    limits to track spending better.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
      <AICoachFAB />
    </div>
  )
}
