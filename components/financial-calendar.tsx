"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface DayData {
  date: number
  amount: number
  isCurrentMonth: boolean
}

export function FinancialCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2020, 11, 1)) // December 2020
  const [selectedDate, setSelectedDate] = useState(15)

  const dailyBalances: Record<number, number> = {
    1: 12.5,
    2: 45.2,
    3: -34.2,
    4: -87.8,
    5: 67.4,
    6: 18,
    7: -15.27,
    8: -29.1,
    9: 34.8,
    10: -30.54,
    11: -58.7,
    12: -23.4,
    13: -73.9,
    14: -12.3,
    15: -43.8,
    16: 34.2,
    17: -15.27,
    18: -87.8,
    19: -23.4,
    20: -89.1,
    21: -12.3,
    22: -45.8,
    23: -56.7,
    24: -34.5,
    25: -78.9,
    26: -23.4,
    27: -45.6,
    28: -87.8,
    29: -67.8,
    30: -12.3,
    31: -34.2,
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Adjust for Monday start

    const days: DayData[] = []

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDate = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push({
        date: prevMonthDate.getDate(),
        amount: 0,
        isCurrentMonth: false,
      })
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        amount: dailyBalances[i] || 0,
        isCurrentMonth: true,
      })
    }

    // Add empty cells to complete the grid
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: i,
        amount: 0,
        isCurrentMonth: false,
      })
    }

    return days
  }

  const days = getDaysInMonth(currentDate)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date(2020, 11, 15)) // December 15, 2020
    setSelectedDate(15)
  }

  // Calculate monthly totals
  const monthlyIncome = 503.93
  const monthlySpending = 691.38
  const monthlyBalance = monthlyIncome - monthlySpending

  return (
    <Card className="border border-gray-200 bg-white p-4">
      {/* Calendar Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-gray-300 text-xs bg-transparent"
            onClick={goToToday}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" className="h-8 border-gray-300 text-xs bg-transparent">
            Month view
          </Button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="mb-4 grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = day.date === selectedDate && day.isCurrentMonth
          const isPositive = day.amount > 0
          const isNegative = day.amount < 0

          return (
            <button
              key={index}
              onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
              className={`relative min-h-[60px] rounded-lg border p-2 text-left transition-all hover:border-gray-400 ${
                isSelected
                  ? "border-gray-900 bg-gray-900 text-white"
                  : day.isCurrentMonth
                    ? "border-gray-200 bg-white"
                    : "border-transparent bg-gray-50"
              }`}
              disabled={!day.isCurrentMonth}
            >
              <div
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {day.date}
              </div>
              {day.isCurrentMonth && day.amount !== 0 && (
                <div
                  className={`mt-1 text-xs font-semibold ${
                    isSelected ? "text-white" : isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${Math.abs(day.amount).toFixed(2)}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-3 gap-3 border-t border-gray-200 pt-4">
        <div className="text-center">
          <p className="text-xs text-gray-600">Dec Income</p>
          <p className="text-lg font-bold text-green-600">${monthlyIncome.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Dec Spending</p>
          <p className="text-lg font-bold text-red-600">${monthlySpending.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Dec Balance</p>
          <p className={`text-lg font-bold ${monthlyBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${monthlyBalance >= 0 ? "" : "-"}${Math.abs(monthlyBalance).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  )
}
