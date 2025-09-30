"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinancialCalendar } from "@/components/financial-calendar"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
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
} from "lucide-react"
import { useState } from "react"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function TransactionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())

  const transactions = [
    {
      id: 1,
      name: "Whole Foods Market",
      category: "Groceries",
      amount: -127.45,
      date: "Today, 2:30 PM",
      icon: ShoppingBag,
      bgColor: "bg-gray-100 dark:bg-muted",
      iconColor: "text-gray-700 dark:text-muted-foreground",
    },
    {
      id: 2,
      name: "Starbucks",
      category: "Coffee & Dining",
      amount: -8.75,
      date: "Today, 9:15 AM",
      icon: Coffee,
      bgColor: "bg-gray-100 dark:bg-muted",
      iconColor: "text-gray-700 dark:text-muted-foreground",
    },
    {
      id: 3,
      name: "Monthly Salary",
      category: "Income",
      amount: 5200.0,
      date: "Yesterday, 12:00 PM",
      icon: Briefcase,
      bgColor: "bg-green-50 dark:bg-green-950",
      iconColor: "text-green-700 dark:text-green-400",
    },
    {
      id: 4,
      name: "Shell Gas Station",
      category: "Transportation",
      amount: -52.3,
      date: "Yesterday, 6:45 PM",
      icon: Car,
      bgColor: "bg-gray-100 dark:bg-muted",
      iconColor: "text-gray-700 dark:text-muted-foreground",
    },
    {
      id: 5,
      name: "Electric Bill",
      category: "Utilities",
      amount: -145.0,
      date: "Oct 1, 2024",
      icon: Home,
      bgColor: "bg-gray-100 dark:bg-muted",
      iconColor: "text-gray-700 dark:text-muted-foreground",
    },
    {
      id: 6,
      name: "Gym Membership",
      category: "Health & Fitness",
      amount: -49.99,
      date: "Oct 1, 2024",
      icon: Heart,
      bgColor: "bg-gray-100 dark:bg-muted",
      iconColor: "text-gray-700 dark:text-muted-foreground",
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

  const filteredTransactions = transactions.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
              <p className="text-sm text-muted-foreground">October 2024</p>
            </div>
            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <Card className="bg-card p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Receipt className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-foreground">142</p>
              <p className="text-xs text-muted-foreground">transactions</p>
            </Card>

            <Card className="bg-card p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950">
                <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-xl font-bold text-foreground">$1,724</p>
              <p className="text-xs text-red-600 dark:text-red-400">+12% vs last</p>
            </Card>

            <Card className="bg-card p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="text-xl font-bold text-foreground">$5,200</p>
              <p className="text-xs text-muted-foreground">Same as last</p>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
              <CalendarIcon className="h-4 w-4" />
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
              className="rounded-lg border bg-card data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="gap-1.5 rounded-lg border bg-card data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Calendar & Transactions</h3>
              <FinancialCalendar />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Dec 14, Mon</h3>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">OUT $60.75</p>
              </div>
              {filteredTransactions.slice(0, 4).map((transaction) => {
                const Icon = transaction.icon
                const isIncome = transaction.amount > 0

                return (
                  <Card key={transaction.id} className="bg-card p-4 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${transaction.bgColor}`}
                      >
                        <Icon className={`h-6 w-6 ${transaction.iconColor}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-foreground">{transaction.name}</p>
                        <p className="text-xs text-muted-foreground">{transaction.category}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${isIncome ? "text-green-600 dark:text-green-400" : "text-foreground"}`}
                          >
                            {isIncome ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Spending Overview</h3>
              <Card className="bg-card p-6">
                <div className="mb-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Spending</p>
                  <p className="text-4xl font-bold text-foreground">${totalSpending.toFixed(2)}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950 px-3 py-1">
                    <TrendingUp className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">+12% from last month</span>
                  </div>
                </div>

                <div className="mb-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-card p-3 shadow-lg">
                                <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
                                <p className="text-sm text-muted-foreground">
                                  ${payload[0].value.toFixed(2)} ({payload[0].payload.percentage}%)
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {pieChartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">${item.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Monthly Overview */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Monthly Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-card p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Badge variant="outline">Avg</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Daily Spending</p>
                  <p className="text-2xl font-bold text-foreground">$57.46</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    <span className="text-xs text-red-600 dark:text-red-400">+8% from average</span>
                  </div>
                </Card>

                <Card className="bg-card p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Badge variant="outline">Avg</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Per Transaction</p>
                  <p className="text-2xl font-bold text-foreground">$12.14</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingDown className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-600 dark:text-green-400">-3% from average</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Spending by Category */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Category Details</h3>
              </div>

              <Card className="bg-card p-5">
                <div className="space-y-4">
                  {categoryStats.map((category) => (
                    <div key={category.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.chartColor }} />
                          <span className="text-sm font-medium text-foreground">{category.name}</span>
                          <span className="text-sm text-muted-foreground">({category.count})</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">${category.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${category.percentage}%`,
                              backgroundColor: category.barColor,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Weekly Spending Trend */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Weekly Spending Trend</h3>
                <Button size="sm" variant="ghost" className="h-8 gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  Details
                </Button>
              </div>

              <Card className="bg-card p-5">
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { day: "Mon", amount: 45, height: 40, color: "bg-gradient-to-t from-blue-500 to-cyan-400" },
                    { day: "Tue", amount: 78, height: 70, color: "bg-gradient-to-t from-emerald-500 to-teal-400" },
                    { day: "Wed", amount: 52, height: 50, color: "bg-gradient-to-t from-purple-500 to-indigo-400" },
                    { day: "Thu", amount: 95, height: 85, color: "bg-gradient-to-t from-pink-500 to-rose-400" },
                    { day: "Fri", amount: 120, height: 100, color: "bg-gradient-to-t from-orange-500 to-amber-400" },
                    { day: "Sat", amount: 88, height: 75, color: "bg-gradient-to-t from-indigo-500 to-purple-400" },
                    { day: "Sun", amount: 62, height: 55, color: "bg-gradient-to-t from-cyan-500 to-blue-400" },
                  ].map((day) => (
                    <div key={day.day} className="flex flex-col items-center">
                      <div className="mb-2 flex h-24 w-full items-end">
                        <div className={`w-full rounded-t-lg ${day.color}`} style={{ height: `${day.height}%` }} />
                      </div>
                      <p className="text-xs font-medium text-foreground">{day.day}</p>
                      <p className="text-xs text-muted-foreground">${day.amount}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Top Merchants */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Top Merchants</h3>
              <Card className="divide-y divide-border bg-card">
                {[
                  {
                    name: "Whole Foods",
                    amount: 487.32,
                    transactions: 12,
                    icon: ShoppingBag,
                    bgColor: "bg-gray-100 dark:bg-muted",
                    iconColor: "text-gray-700 dark:text-muted-foreground",
                  },
                  {
                    name: "Shell Gas",
                    amount: 215.8,
                    transactions: 8,
                    icon: Car,
                    bgColor: "bg-gray-100 dark:bg-muted",
                    iconColor: "text-gray-700 dark:text-muted-foreground",
                  },
                  {
                    name: "Amazon",
                    amount: 425.0,
                    transactions: 15,
                    icon: ShoppingBag,
                    bgColor: "bg-gray-100 dark:bg-muted",
                    iconColor: "text-gray-700 dark:text-muted-foreground",
                  },
                  {
                    name: "Starbucks",
                    amount: 156.25,
                    transactions: 18,
                    icon: Coffee,
                    bgColor: "bg-gray-100 dark:bg-muted",
                    iconColor: "text-gray-700 dark:text-muted-foreground",
                  },
                ].map((merchant, index) => {
                  const Icon = merchant.icon
                  return (
                    <div key={merchant.name} className="flex items-center gap-4 p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${merchant.bgColor}`}
                      >
                        <Icon className={`h-5 w-5 ${merchant.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{merchant.name}</p>
                        <p className="text-xs text-muted-foreground">{merchant.transactions} transactions</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">${merchant.amount.toFixed(2)}</p>
                    </div>
                  )
                })}
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="border-border bg-muted p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground">
                  <Sparkles className="h-5 w-5 text-background" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Spending Pattern Detected</p>
                    <Badge className="border-0 bg-muted-foreground/20 text-xs">AI</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
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
