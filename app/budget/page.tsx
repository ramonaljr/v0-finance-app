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
import { useState } from "react"
const AICoachFAB = dynamic(() => import("@/components/ai-coach-fab").then(m => m.AICoachFAB), { ssr: false })
const BudgetPieChart = dynamic(() => import("@/components/budget-pie-chart").then(m => m.BudgetPieChart), { ssr: false })
import { getCategoryColor } from "@/lib/category-colors"

export default function BudgetPage() {
  const [currentMonth, setCurrentMonth] = useState("October 2024")
  const [tab, setTab] = useState("plan")

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

  const budgetCategories = [
    {
      id: "groceries",
      name: "Groceries",
      spent: 487.32,
      budget: 600,
      icon: "🛒",
      status: "good" as const,
    },
    {
      id: "dining",
      name: "Dining Out",
      spent: 342.15,
      budget: 300,
      icon: "🍽️",
      status: "over" as const,
    },
    {
      id: "transport",
      name: "Transportation",
      spent: 215.8,
      budget: 250,
      icon: "🚗",
      status: "good" as const,
    },
    {
      id: "entertainment",
      name: "Entertainment",
      spent: 178.5,
      budget: 200,
      icon: "🎬",
      status: "warning" as const,
    },
    {
      id: "shopping",
      name: "Shopping",
      spent: 425.0,
      budget: 400,
      icon: "🛍️",
      status: "over" as const,
    },
    {
      id: "utilities",
      name: "Utilities",
      spent: 145.0,
      budget: 200,
      icon: "💡",
      status: "good" as const,
    },
  ].map((cat) => ({
    ...cat,
    ...getCategoryColor(cat.name),
  }))

  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0)
  const percentageUsed = (totalSpent / totalBudget) * 100

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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Budget</h1>
              <p className="text-sm text-muted-foreground">Manage your spending</p>
            </div>
            <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>

          {/* Month Selector */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card p-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold text-foreground">{currentMonth}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Budget Overview */}
          <Card className="bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-3xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Budget</p>
                <p className="text-2xl font-bold text-foreground">${totalBudget.toFixed(2)}</p>
              </div>
            </div>
            <Progress value={percentageUsed} className="mb-3 h-3" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{percentageUsed.toFixed(1)}% of budget used</span>
              <span className="text-sm font-semibold text-foreground">
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
              className="rounded-lg border bg-card data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Plan
            </TabsTrigger>
            <TabsTrigger
              value="recurring"
              className="gap-1.5 rounded-lg border bg-card data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <RefreshCw className="h-4 w-4" />
              Recurring
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="gap-1.5 rounded-lg border bg-card data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <PieChartIcon className="h-4 w-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-6">
            {/* AI Insights */}
            <Card className="border-blue-200 bg-card p-4 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Budget Insight</p>
                    <Badge className="border-0 bg-blue-100 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-300">
                      AI
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                    You're over budget on Dining Out by $42. Consider meal prepping to save $120/month.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 border-blue-300 bg-background dark:border-blue-700"
                  >
                    <Target className="h-3 w-3" />
                    View Tips
                  </Button>
                </div>
              </div>
            </Card>

            {/* Budget Categories */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Categories</h3>
              {budgetCategories.map((category) => {
                const percentage = (category.spent / category.budget) * 100
                const isOver = category.spent > category.budget
                const isWarning = percentage > 85 && !isOver

                return (
                  <Card key={category.id} className="bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.bg}`}>
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${category.spent.toFixed(2)} of ${category.budget.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {isOver && (
                        <Badge className="border-0 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Over
                        </Badge>
                      )}
                      {isWarning && (
                        <Badge className="border-0 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {percentage.toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`mb-2 h-2 ${isOver ? "[&>div]:bg-red-600" : isWarning ? "[&>div]:bg-yellow-600" : ""}`}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-medium ${isOver ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                      >
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className="font-semibold text-foreground">
                        ${Math.max(category.budget - category.spent, 0).toFixed(2)} left
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Spending Trends */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Spending Trends</h3>
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-card p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                      <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">vs Last Month</span>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">-8.5%</p>
                  <p className="text-xs text-muted-foreground">Saved $142</p>
                </Card>

                <Card className="bg-card p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                      <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Avg Daily</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">$59.46</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recurring" className="space-y-6">
            {/* Recurring Overview */}
            <Card className="bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Recurring</p>
                  <p className="text-3xl font-bold text-foreground">${totalRecurring.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">Paid This Month</p>
                  <p className="text-2xl font-bold text-green-600">${paidRecurring.toFixed(2)}</p>
                </div>
              </div>
              <Progress value={(paidRecurring / totalRecurring) * 100} className="mb-3 h-3 [&>div]:bg-green-600" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {recurringExpenses.filter((e) => e.status === "paid").length} of {recurringExpenses.length} paid
                </span>
                <span className="text-sm font-semibold text-foreground">${upcomingRecurring.toFixed(2)} upcoming</span>
              </div>
            </Card>

            {/* AI Insights for Recurring */}
            <Card className="border-purple-200 bg-card p-4 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Smart Budget Analysis</p>
                    <Badge className="border-0 bg-blue-100 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-300">
                      AI
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    Your recurring expenses account for {recurringPercentage.toFixed(1)}% (${totalRecurring.toFixed(2)})
                    of your total monthly obligations. After fixed expenses, you have ${discretionaryBudget.toFixed(2)}{" "}
                    for discretionary spending.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                      <span className="text-muted-foreground">
                        {recurringExpenses.filter((e) => e.autopay).length} bills on autopay - reducing late payment
                        risk
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span className="text-muted-foreground">
                        Credit card payment of $
                        {recurringExpenses.find((e) => e.id === "credit-card")?.amount.toFixed(2)} due on the 22nd - not
                        on autopay
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Budget Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                    <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Fixed Expenses</span>
                </div>
                <p className="text-xl font-bold text-foreground">${totalRecurring.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{recurringPercentage.toFixed(1)}% of income</p>
              </Card>

              <Card className="bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Discretionary</span>
                </div>
                <p className="text-xl font-bold text-foreground">${discretionaryBudget.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{(100 - recurringPercentage).toFixed(1)}% available</p>
              </Card>
            </div>

            {/* Recurring Expenses List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Monthly Bills</h3>
                <Button size="sm" variant="outline" className="h-8 gap-1.5 bg-transparent">
                  <Plus className="h-3 w-3" />
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
                    <Card key={expense.id} className="bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${expense.bgColor}`}
                          >
                            <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-foreground">{expense.name}</p>
                              {expense.autopay && (
                                <Badge className="border-0 bg-blue-100 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-300">
                                  Auto
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{expense.category}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar className="h-3 w-3 text-muted-foreground dark:text-gray-500" />
                              <span className="text-muted-foreground dark:text-gray-300">
                                Due: {currentMonth.split(" ")[0]} {expense.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground mb-1">${expense.amount.toFixed(2)}</p>
                          {isPaid && (
                            <Badge className="border-0 bg-green-100 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
                              <CheckCircle2 className="h-3 w-3" />
                              Paid
                            </Badge>
                          )}
                          {isUpcoming && (
                            <Badge className="border-0 bg-amber-100 text-amber-700 text-xs dark:bg-amber-900 dark:text-amber-300">
                              <Clock className="h-3 w-3" />
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
            <Card className="bg-card p-4">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Payment Schedule</h3>
              <div className="space-y-2">
                {recurringExpenses
                  .sort((a, b) => a.dueDate - b.dueDate)
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between py-2 border-b border-border dark:border-border-inverted last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900 text-xs font-semibold text-muted-foreground dark:text-foreground">
                          {expense.dueDate}
                        </div>
                        <span className="text-sm text-foreground">{expense.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">${expense.amount.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {/* Pie Chart */}
            <Card className="bg-card p-6">
              <div className="mb-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-4xl font-bold text-foreground">${totalBudget.toFixed(0)}</p>
                <p className="mt-1 text-sm text-muted-foreground">${totalSpent.toFixed(2)} spent</p>
              </div>

              <BudgetPieChart data={pieChartData} />

              {/* Category Breakdown */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-foreground">Category Breakdown</h3>
                <div className="space-y-3">
                  {budgetCategories.map((category) => {
                    const percentage = (category.spent / category.budget) * 100
                    const isOver = category.spent > category.budget

                    return (
                      <Card key={category.id} className="bg-card p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.bg}`}>
                              <span className="text-xl">{category.icon}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{category.name}</p>
                              <p className="text-xs text-muted-foreground">
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
                        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-muted">
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
                            className={`font-medium ${isOver ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                          >
                            {percentage.toFixed(1)}% used
                          </span>
                          <span className="font-semibold text-foreground">
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
            <Card className="border-blue-200 bg-card p-4 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Budget Insight</p>
                    <Badge className="border-0 bg-blue-100 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-300">
                      AI
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
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
