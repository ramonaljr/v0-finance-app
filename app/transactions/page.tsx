"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  DollarSign,
  Receipt,
  Sparkles,
  ShoppingBag,
  Coffee,
  Car,
} from "lucide-react"
import { useState } from "react"

export default function TransactionsPage() {
  const [currentMonth] = useState("December 2020")

  const calendarDays = [
    { date: 1, amount: 0 },
    { date: 2, amount: 12.5 },
    { date: 3, amount: 45.2 },
    { date: 4, amount: 0 },
    { date: 5, amount: 23.8 },
    { date: 6, amount: 67.4 },
    { date: 7, amount: 15.0 },
    { date: 8, amount: 89.3 },
    { date: 9, amount: 34.5 },
    { date: 10, amount: 0 },
    { date: 11, amount: 56.7 },
    { date: 12, amount: 23.4 },
    { date: 13, amount: 78.9 },
    { date: 14, amount: 12.3 },
    { date: 15, amount: 45.6 },
    { date: 16, amount: 0 },
    { date: 17, amount: 34.2 },
    { date: 18, amount: 67.8 },
    { date: 19, amount: 23.4 },
    { date: 20, amount: 89.1 },
    { date: 21, amount: 45.6 },
    { date: 22, amount: 12.3 },
    { date: 23, amount: 0 },
    { date: 24, amount: 56.7 },
    { date: 25, amount: 34.5 },
    { date: 26, amount: 78.9 },
    { date: 27, amount: 23.4 },
    { date: 28, amount: 45.6 },
    { date: 29, amount: 67.8 },
    { date: 30, amount: 12.3 },
    { date: 31, amount: 0 },
  ]

  const transactions = [
    { time: "14:30", category: "Food & Drink", amount: 23.5, icon: "🍔", color: "bg-yellow-100 text-yellow-600" },
    { time: "12:15", category: "Health Care", amount: 150.0, icon: "🏥", color: "bg-green-100 text-green-600" },
    { time: "09:45", category: "Shopping", amount: 89.99, icon: "🛍️", color: "bg-pink-100 text-pink-600" },
    {
      time: "08:00",
      category: "Housing & Utilities",
      amount: 1200.0,
      icon: "🏠",
      color: "bg-orange-100 text-orange-600",
    },
  ]

  const categoryStats = [
    { name: "Groceries", amount: 487.32, percentage: 28, count: 12, color: "bg-gray-700" },
    { name: "Dining", amount: 342.15, percentage: 20, count: 18, color: "bg-gray-600" },
    { name: "Transport", amount: 215.8, percentage: 13, count: 8, color: "bg-gray-500" },
    { name: "Shopping", amount: 425.0, percentage: 25, count: 15, color: "bg-gray-800" },
    { name: "Utilities", amount: 145.0, percentage: 8, count: 3, color: "bg-gray-400" },
    { name: "Other", amount: 108.22, percentage: 6, count: 5, color: "bg-gray-300" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="mx-auto max-w-lg">
        {/* Header */}
        <div className="bg-card px-6 py-4">
          <h1 className="mb-1 text-xl font-semibold text-foreground">Daily Balance, transactions</h1>
          <p className="text-sm text-muted-foreground">Track your spending patterns</p>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <div className="bg-card px-6 py-3">
            <TabsList className="w-full justify-start gap-2 bg-transparent p-0">
              <TabsTrigger
                value="reports"
                className="rounded-lg border border-gray-200 bg-white px-4 data-[state=active]:border-gray-900 data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="gap-1.5 rounded-lg border border-gray-200 bg-white px-4 data-[state=active]:border-gray-900 data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4" />
                Stats
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="reports" className="mt-0">
            {/* Transactions List */}
            <div className="px-6 pt-4">
              <h2 className="mb-3 text-base font-semibold text-foreground">Today's Transactions</h2>
              <Card className="divide-y divide-border">
                {transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.color}`}>
                        <span className="text-lg">{transaction.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{transaction.category}</p>
                        <p className="text-xs text-muted-foreground">{transaction.time}</p>
                      </div>
                    </div>
                    <p className="text-base font-semibold text-destructive">-${transaction.amount}</p>
                  </div>
                ))}
              </Card>
            </div>

            {/* Calendar */}
            <div className="mt-4 bg-card px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-base font-semibold text-foreground">{currentMonth}</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="mb-4 grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day) => (
                  <button
                    key={day.date}
                    className="flex flex-col items-center justify-center rounded-lg p-2 hover:bg-muted"
                  >
                    <span className="text-sm font-medium text-foreground">{day.date}</span>
                    {day.amount > 0 && <span className="text-xs text-destructive">${day.amount}</span>}
                  </button>
                ))}
              </div>

              {/* Month Summary */}
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Dec Income</p>
                  <p className="text-sm font-semibold text-success">$503.93</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dec Spending</p>
                  <p className="text-sm font-semibold text-destructive">$691.38</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dec Balance</p>
                  <p className="text-sm font-semibold text-destructive">-$187.45</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-0 space-y-6 px-6 py-6">
            {/* Monthly Overview */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Monthly Overview
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Card className="border border-gray-200 bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <DollarSign className="h-5 w-5 text-gray-700" />
                    </div>
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                      Avg
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Daily Spending</p>
                  <p className="text-2xl font-bold text-gray-900">$57.46</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-red-600" />
                    <span className="text-xs text-red-600">+8% from average</span>
                  </div>
                </Card>

                <Card className="border border-gray-200 bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Receipt className="h-5 w-5 text-gray-700" />
                    </div>
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                      Avg
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Per Transaction</p>
                  <p className="text-2xl font-bold text-gray-900">$12.14</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingDown className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs text-green-600">-3% from average</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Spending by Category */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Spending by Category
                </h3>
                <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-gray-600">
                  <PieChart className="h-4 w-4" />
                  Chart
                </Button>
              </div>

              <Card className="border border-gray-200 bg-white p-5">
                <div className="mb-6 text-center">
                  <p className="text-sm text-gray-600">Total Spending</p>
                  <p className="text-4xl font-bold text-gray-900">$1,723.49</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1">
                    <TrendingUp className="h-3.5 w-3.5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">+12% from last month</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {categoryStats.map((category) => (
                    <div key={category.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${category.color}`} />
                          <span className="text-sm font-medium text-gray-900">{category.name}</span>
                          <span className="text-xs text-gray-500">({category.count})</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">${category.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div className={`h-full ${category.color}`} style={{ width: `${category.percentage}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Weekly Spending Trend */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Weekly Trend</h3>
                <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-gray-600">
                  <BarChart3 className="h-4 w-4" />
                  Details
                </Button>
              </div>

              <Card className="border border-gray-200 bg-white p-5">
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { day: "Mon", amount: 45, height: 40 },
                    { day: "Tue", amount: 78, height: 70 },
                    { day: "Wed", amount: 52, height: 50 },
                    { day: "Thu", amount: 95, height: 85 },
                    { day: "Fri", amount: 120, height: 100 },
                    { day: "Sat", amount: 88, height: 75 },
                    { day: "Sun", amount: 62, height: 55 },
                  ].map((day) => (
                    <div key={day.day} className="flex flex-col items-center">
                      <div className="mb-2 flex h-24 w-full items-end">
                        <div className="w-full rounded-t-lg bg-gray-800" style={{ height: `${day.height}%` }} />
                      </div>
                      <p className="text-xs font-medium text-gray-900">{day.day}</p>
                      <p className="text-xs text-gray-600">${day.amount}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Top Merchants */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Top Merchants
              </h3>
              <Card className="divide-y divide-gray-200 border border-gray-200 bg-white">
                {[
                  { name: "Whole Foods", amount: 487.32, transactions: 12, icon: ShoppingBag },
                  { name: "Shell Gas", amount: 215.8, transactions: 8, icon: Car },
                  { name: "Amazon", amount: 425.0, transactions: 15, icon: ShoppingBag },
                  { name: "Starbucks", amount: 156.25, transactions: 18, icon: Coffee },
                ].map((merchant, index) => {
                  const Icon = merchant.icon
                  return (
                    <div key={merchant.name} className="flex items-center gap-4 p-4">
                      <div className="flex h-8 w-8 items-center justify-center text-sm font-bold text-gray-400">
                        #{index + 1}
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                        <Icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{merchant.name}</p>
                        <p className="text-xs text-gray-600">{merchant.transactions} transactions</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">${merchant.amount.toFixed(2)}</p>
                    </div>
                  )
                })}
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="border-blue-200 dark:border-blue-800 bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Spending Pattern Detected</p>
                    <Badge className="border-0 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs">
                      AI
                    </Badge>
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
    </div>
  )
}
