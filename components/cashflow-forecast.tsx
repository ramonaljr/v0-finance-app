"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  DollarSign,
  ArrowRight,
  ArrowDown,
  ArrowUp
} from "lucide-react"

interface CashflowEvent {
  date: string
  type: 'income' | 'expense' | 'bill'
  description: string
  amount: number
  category?: string
  recurring?: boolean
}

interface DayForecast {
  date: string
  balance: number
  income: number
  expenses: number
  events: CashflowEvent[]
  isToday?: boolean
  isLowBalance?: boolean
}

export function CashflowForecast() {
  const [forecast, setForecast] = useState<DayForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [currentBalance] = useState(2850.00) // This would come from actual account data

  useEffect(() => {
    generateForecast()
  }, [])

  const generateForecast = () => {
    // This would normally fetch from an API
    // For now, we'll generate mock forecast data
    const today = new Date()
    const forecastData: DayForecast[] = []

    // Sample recurring events
    const events: CashflowEvent[] = [
      { date: '2025-10-05', type: 'income', description: 'Salary', amount: 5200, recurring: true },
      { date: '2025-10-10', type: 'bill', description: 'Electricity Bill', amount: 145, category: 'Utilities', recurring: true },
      { date: '2025-10-15', type: 'bill', description: 'Gym Membership', amount: 50, category: 'Health', recurring: true },
      { date: '2025-10-15', type: 'bill', description: 'Netflix', amount: 19.99, category: 'Entertainment', recurring: true },
      { date: '2025-10-22', type: 'bill', description: 'Credit Card Payment', amount: 650, category: 'Credit Cards' },
      { date: '2025-10-01', type: 'expense', description: 'Rent', amount: 1850, category: 'Housing', recurring: true },
    ]

    let runningBalance = currentBalance

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      // Get events for this date
      const dayEvents = events.filter(e => e.date === dateStr)

      // Calculate income and expenses for the day
      const income = dayEvents
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0)

      const expenses = dayEvents
        .filter(e => e.type === 'expense' || e.type === 'bill')
        .reduce((sum, e) => sum + e.amount, 0)

      runningBalance = runningBalance + income - expenses

      forecastData.push({
        date: dateStr,
        balance: runningBalance,
        income,
        expenses,
        events: dayEvents,
        isToday: i === 0,
        isLowBalance: runningBalance < 500
      })
    }

    setForecast(forecastData)
    setLoading(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const lowestBalance = Math.min(...forecast.map(d => d.balance))
  const highestBalance = Math.max(...forecast.map(d => d.balance))
  const endingBalance = forecast[forecast.length - 1]?.balance || currentBalance
  const balanceChange = endingBalance - currentBalance
  const criticalDays = forecast.filter(d => d.isLowBalance)

  if (loading) {
    return (
      <Card className="p-6 rounded-2xl">
        <p className="text-center text-gray-600">Loading forecast...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white/80 uppercase tracking-wider">30-Day Forecast</p>
            <p className="text-4xl font-bold">${endingBalance.toFixed(2)}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <Calendar className="h-7 w-7" strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {balanceChange >= 0 ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
          <span className="font-semibold">
            {balanceChange >= 0 ? '+' : ''}${balanceChange.toFixed(2)} from today
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          <div>
            <p className="text-xs text-white/80">Lowest Point</p>
            <p className="text-lg font-bold">${lowestBalance.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/80">Highest Point</p>
            <p className="text-lg font-bold">${highestBalance.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      {/* Critical Days Warning */}
      {criticalDays.length > 0 && (
        <Card className="bg-red-50 border-red-200 p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Low Balance Alert</p>
              <p className="text-sm text-gray-700 mt-1">
                Your balance will drop below $500 on {criticalDays.length} day{criticalDays.length > 1 ? 's' : ''} this month
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Upcoming Events</h3>
        {forecast.filter(d => d.events.length > 0).slice(0, 10).map((day) => (
          <Card
            key={day.date}
            className={`p-4 rounded-2xl ${day.isToday ? 'bg-indigo-50 border-indigo-200' : 'bg-white'} ${day.isLowBalance ? 'border-red-200' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900">
                  {formatDate(day.date)}
                  {day.isToday && <Badge className="ml-2 bg-indigo-600 text-white text-xs">Today</Badge>}
                </p>
                <p className={`text-sm font-medium ${day.isLowBalance ? 'text-red-600' : 'text-gray-600'}`}>
                  Balance: ${day.balance.toFixed(2)}
                  {day.isLowBalance && ' ⚠️'}
                </p>
              </div>
              <div className="text-right">
                {day.income > 0 && (
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowDown className="h-4 w-4" />
                    <span className="text-sm font-semibold">+${day.income.toFixed(2)}</span>
                  </div>
                )}
                {day.expenses > 0 && (
                  <div className="flex items-center gap-1 text-red-600">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-sm font-semibold">-${day.expenses.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {day.events.map((event, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm bg-white/50 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${event.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium text-gray-900">{event.description}</span>
                    {event.recurring && (
                      <Badge className="bg-gray-100 text-gray-600 text-xs">
                        Recurring
                      </Badge>
                    )}
                  </div>
                  <span className={`font-bold ${event.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {event.type === 'income' ? '+' : '-'}${event.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
