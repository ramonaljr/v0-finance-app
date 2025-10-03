"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCategoryIcon } from "@/lib/category-icons"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"
import { useFormattedKPICache } from "@/lib/hooks/use-api"

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { data: kpiData, isLoading, error } = useFormattedKPICache()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state (but still render UI with mock data)
  if (error) {
    console.error('Dashboard data error:', error)
    // Continue rendering with mock data below
  }

  const todayCategories = [
    { name: "Food & Drink", amount: 28.4, spent: 28.4, budget: 100 },
    { name: "Transportation", amount: 92.9, spent: 92.9, budget: 200 },
    { name: "Shopping", amount: 103.7, spent: 103.7, budget: 150 },
    { name: "Health Care", amount: 500.6, spent: 500.6, budget: 600 },
  ]

  const totalToday = todayCategories.reduce((sum, cat) => sum + cat.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/40 pb-20">
      {/* Enhanced Header with Glass Effect */}
      <div className="sticky top-0 z-30 glass-strong border-b border-white/20 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-white/80 rounded-xl hover-scale-sm transition-all"
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() - 1)
                setSelectedDate(newDate)
              }}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-white/80 rounded-xl hover-scale-sm transition-all"
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() + 1)
                setSelectedDate(newDate)
              }}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-lg mx-auto">
        {/* Enhanced Budget Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Daily Total - Enhanced */}
          <Card className="p-6 glass-strong border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover-scale-sm rounded-2xl">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</p>
              <p className="text-4xl font-bold text-gray-900">${totalToday.toFixed(0)}</p>
              <div className="flex gap-2">
                {todayCategories.slice(0, 3).map((cat) => {
                  const { icon: Icon, bgGradient, glowColor } = getCategoryIcon(cat.name)
                  return (
                    <div key={cat.name} className={`w-11 h-11 rounded-xl ${bgGradient} flex items-center justify-center shadow-lg ${glowColor} hover-scale transition-all`}>
                      <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500 font-medium">Budget</p>
            </div>
          </Card>

          {/* Monthly Remaining */}
          <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Remain</p>
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#gradient1)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(23835 / 30000) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-xl font-bold text-center text-green-600">$23,835</p>
              <p className="text-xs text-gray-400 text-center">Budget</p>
            </div>
          </Card>
        </div>

        {/* Today's Spending */}
        <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today</h2>
            <span className="text-sm">
              <span className="text-red-500 font-semibold">OUT</span> ${totalToday.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {todayCategories.map((category) => {
              const { icon: Icon, color } = getCategoryIcon(category.name)
              const percentage = (category.spent / category.budget) * 100

              return (
                <div
                  key={category.name}
                  className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    {category.name.split(' ')[0]}
                  </p>
                  <p className="text-lg font-bold">${category.amount}</p>
                  {/* Progress indicator */}
                  <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getCategoryIcon(category.name).gradient} transition-all`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Quick Entry Widget */}
        <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Entry</h3>

          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal, idx) => (
              <Button
                key={meal}
                variant={idx === 1 ? "default" : "outline"}
                size="sm"
                className={idx === 1 ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-0" : ""}
              >
                {meal}
              </Button>
            ))}
          </div>

          {/* Calculator Keypad Preview */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="text-right mb-4">
              <p className="text-3xl font-bold">$150</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-12 text-lg font-medium bg-white hover:bg-gray-100"
                >
                  {num}
                </Button>
              ))}
              <Button variant="outline" className="h-12 text-lg bg-white hover:bg-gray-100">.</Button>
              <Button variant="outline" className="h-12 text-lg bg-white hover:bg-gray-100">0</Button>
              <Button className="h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900">✓</Button>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
