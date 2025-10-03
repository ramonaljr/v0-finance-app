"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState, useEffect } from "react"

interface DayData {
  date: number
  income: number
  spending: number
  isCurrentMonth: boolean
}

interface FinancialCalendarProps {
  onDateSelect?: (date: Date) => void
  onAddTransaction?: () => void
}

export function FinancialCalendarFunctional({ onDateSelect, onAddTransaction }: FinancialCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().getDate())
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [currentDate])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      const startDate = new Date(year, month, 1).toISOString()
      const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

      const response = await fetch(`/api/transactions?start_date=${startDate}&end_date=${endDate}&limit=1000`)
      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: DayData[] = []

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDate = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push({
        date: prevMonthDate.getDate(),
        income: 0,
        spending: 0,
        isCurrentMonth: false,
      })
    }

    // Calculate daily totals from transactions
    const dailyTotals: Record<number, { income: number; spending: number }> = {}

    transactions.forEach((tx) => {
      const txDate = new Date(tx.occurred_at)
      const day = txDate.getDate()

      if (!dailyTotals[day]) {
        dailyTotals[day] = { income: 0, spending: 0 }
      }

      const amount = tx.amount_minor / 100

      if (tx.direction === 'in') {
        dailyTotals[day].income += amount
      } else {
        dailyTotals[day].spending += amount
      }
    })

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayData = dailyTotals[i] || { income: 0, spending: 0 }
      days.push({
        date: i,
        income: dayData.income,
        spending: dayData.spending,
        isCurrentMonth: true,
      })
    }

    // Add empty cells to complete the grid (6 rows * 7 days = 42 cells)
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: i,
        income: 0,
        spending: 0,
        isCurrentMonth: false,
      })
    }

    return days
  }

  const days = getDaysInMonth(currentDate)

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    setCurrentDate(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today.getDate())
    if (onDateSelect) {
      onDateSelect(today)
    }
  }

  const handleDateClick = (day: DayData) => {
    if (!day.isCurrentMonth) return

    setSelectedDate(day.date)
    if (onDateSelect) {
      const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date)
      onDateSelect(selected)
    }
  }

  // Calculate monthly totals
  const monthlyIncome = transactions
    .filter(tx => tx.direction === 'in')
    .reduce((sum, tx) => sum + (tx.amount_minor / 100), 0)

  const monthlySpending = transactions
    .filter(tx => tx.direction === 'out')
    .reduce((sum, tx) => sum + (tx.amount_minor / 100), 0)

  const monthlyBalance = monthlyIncome - monthlySpending

  return (
    <Card className="border border-gray-200 bg-white p-4 rounded-2xl shadow-md">
      {/* Calendar Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center min-w-[140px]">
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
            className="h-8 border-gray-300 text-xs bg-white hover:bg-gray-50"
            onClick={goToToday}
          >
            Today
          </Button>
          {onAddTransaction && (
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              onClick={onAddTransaction}
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          )}
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
          const netAmount = day.income - day.spending
          const isPositive = netAmount > 0
          const hasTransactions = day.income > 0 || day.spending > 0

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`relative min-h-[60px] rounded-lg border p-2 text-left transition-all hover:border-gray-400 ${
                isSelected
                  ? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                  : day.isCurrentMonth
                    ? "border-gray-200 bg-white hover:shadow-md"
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
              {day.isCurrentMonth && hasTransactions && (
                <div className="mt-1 space-y-0.5">
                  {day.income > 0 && (
                    <div className={`text-xs font-semibold ${isSelected ? "text-white" : "text-green-600"}`}>
                      +${day.income.toFixed(0)}
                    </div>
                  )}
                  {day.spending > 0 && (
                    <div className={`text-xs font-semibold ${isSelected ? "text-white" : "text-red-600"}`}>
                      -${day.spending.toFixed(0)}
                    </div>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-3 gap-3 border-t border-gray-200 pt-4">
        <div className="text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">
            {monthNames[currentDate.getMonth()].slice(0, 3)} Income
          </p>
          <p className="text-lg font-bold text-green-600">${monthlyIncome.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">
            {monthNames[currentDate.getMonth()].slice(0, 3)} Spending
          </p>
          <p className="text-lg font-bold text-red-600">${monthlySpending.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">
            {monthNames[currentDate.getMonth()].slice(0, 3)} Balance
          </p>
          <p className={`text-lg font-bold ${monthlyBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {monthlyBalance >= 0 ? "$" : "-$"}{Math.abs(monthlyBalance).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  )
}
