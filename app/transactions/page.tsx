"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCategoryIcon } from "@/lib/category-icons"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

export default function TransactionsNewPage() {
  const [selectedDate, setSelectedDate] = useState(15)
  const [selectedMonth, setSelectedMonth] = useState("2020 Dec")

  const calendarDays = [
    { day: 30, amount: 7.63, isOtherMonth: true },
    { day: 1, amount: 7.63 },
    { day: 2, amount: 21.37 },
    { day: 3, amount: 76.35 },
    { day: 4, amount: 76.35 },
    { day: 5, amount: 15.27 },
    { day: 6, amount: 3.05 },
    { day: 7, amount: 15.27 },
    { day: 8, amount: 15.27 },
    { day: 9, amount: 30.54 },
    { day: 10, amount: 15.27 },
    { day: 11, amount: 305.42 },
    { day: 12, amount: 61.08 },
    { day: 13, amount: 64.13 },
    { day: 14, amount: 15.27 },
    { day: 15, amount: 60.75, isToday: true },
    { day: 16, amount: 76.35 },
    { day: 17, amount: 15.27 },
    { day: 18, amount: 30.54 },
    { day: 19, amount: 0 },
    { day: 20, amount: 0 },
    { day: 21, amount: 0 },
    { day: 22, amount: 122.16 },
    { day: 23, amount: 0 },
    { day: 24, amount: 0 },
    { day: 25, amount: 0 },
    { day: 26, amount: 0 },
    { day: 27, amount: 0 },
    { day: 28, amount: 30.54 },
  ]

  const transactions = [
    { category: "Food & Drink", subcategory: "Breakfast", detail: "Coffee ☕", amount: -5, time: "10:50 AM", icon: "💳" },
    { category: "Health Care", subcategory: "Dental", detail: "", amount: -8, time: "10:45 AM", icon: "⚕️" },
    { category: "Shopping", subcategory: "Clothing", detail: "", amount: -100, time: "10:40 AM", icon: "🛍️" },
    { category: "Housing", subcategory: "Housing&Utilities", detail: "", amount: -20, time: "10:36 AM", icon: "🏠" },
  ]

  const monthlyStats = {
    income: 503.93,
    spending: 691.38,
    balance: -187.45,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 pb-20">
      {/* Header with Search */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-full">
            <span className="text-xs font-medium">Daily</span>
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Food | category , sub-category , notes"
              className="pl-10 bg-white border-gray-200 text-sm h-10"
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6 max-w-lg mx-auto">
        {/* Calendar Card */}
        <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{selectedMonth}</span>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs bg-gray-100">
                Month▼
              </Button>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="mb-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center text-xs text-gray-400 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayData, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(dayData.day)}
                  className={`
                    aspect-square rounded-lg p-1 text-center transition-all
                    ${dayData.isToday ? 'bg-yellow-300 font-semibold' : 'hover:bg-gray-50'}
                    ${dayData.isOtherMonth ? 'text-gray-300' : 'text-gray-700'}
                    ${selectedDate === dayData.day && !dayData.isOtherMonth ? 'ring-2 ring-yellow-400' : ''}
                  `}
                >
                  <div className="text-sm">{dayData.day}</div>
                  {dayData.amount > 0 && (
                    <div className={`text-[10px] ${dayData.amount > 50 ? 'text-red-500' : 'text-gray-500'}`}>
                      ${dayData.amount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-gray-500 mb-1">Dec Income</p>
              <p className="text-lg font-bold text-green-600">${monthlyStats.income}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Dec Spending</p>
              <p className="text-lg font-bold text-red-600">${monthlyStats.spending}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Dec Balance</p>
              <p className={`text-lg font-bold ${monthlyStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${monthlyStats.balance >= 0 ? '+' : ''}{monthlyStats.balance}
              </p>
            </div>
          </div>
        </Card>

        {/* Daily Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Dec 14, Mon</h3>
            <span className="text-sm">
              <span className="text-red-500 font-semibold">OUT</span> ${transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)}
            </span>
          </div>

          <div className="space-y-2">
            {transactions.map((transaction, idx) => {
              const { icon: Icon, color } = getCategoryIcon(transaction.category)

              return (
                <Card
                  key={idx}
                  className="p-4 bg-white/90 backdrop-blur border-0 shadow hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{transaction.category}</span>
                        {transaction.icon && <span className="text-xs">{transaction.icon}</span>}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.subcategory && (
                          <>
                            <span className="text-gray-400">☕</span>
                            <span>{transaction.subcategory}</span>
                          </>
                        )}
                        {transaction.detail && <span className="ml-1">{transaction.detail}</span>}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`text-lg font-bold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount)}
                      </div>
                      <div className="text-xs text-gray-400">{transaction.time}</div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
