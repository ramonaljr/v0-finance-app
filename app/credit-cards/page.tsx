"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  ChevronRight,
  Info,
  Lock
} from "lucide-react"

interface CreditCardData {
  id: string
  name: string
  last4: string
  network: string
  statementBalance: number
  currentBalance: number
  creditLimit: number
  minPayment: number
  dueDate: string
  apr: number
  rewards?: string
}

export default function CreditCardsPage() {
  const router = useRouter()
  const featureEnabled = process.env.NEXT_PUBLIC_FEATURE_CREDIT_CARDS === 'true'

  useEffect(() => {
    if (!featureEnabled) {
      router.push('/more')
    }
  }, [featureEnabled, router])

  if (!featureEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md p-8 text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Not Available</h2>
          <p className="text-gray-600 mb-4">
            Credit card tracking is currently disabled. Contact your administrator to enable this feature.
          </p>
          <Button onClick={() => router.push('/more')}>
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const [cards] = useState<CreditCardData[]>([
    {
      id: "1",
      name: "Chase Sapphire Reserve",
      last4: "4532",
      network: "Visa",
      statementBalance: 2450.00,
      currentBalance: 2650.00,
      creditLimit: 15000,
      minPayment: 75.00,
      dueDate: "2025-10-22",
      apr: 18.99,
      rewards: "3x Points on Travel & Dining"
    },
    {
      id: "2",
      name: "American Express Gold",
      last4: "1007",
      network: "Amex",
      statementBalance: 1250.00,
      currentBalance: 1380.00,
      creditLimit: 10000,
      minPayment: 35.00,
      dueDate: "2025-10-15",
      apr: 20.24,
      rewards: "4x Points on Restaurants"
    }
  ])

  const calculateUtilization = (balance: number, limit: number) => {
    return (balance / limit) * 100
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 30) return "text-green-600"
    if (utilization < 70) return "text-amber-600"
    return "text-red-600"
  }

  const getUtilizationBgColor = (utilization: number) => {
    if (utilization < 30) return "bg-green-500"
    if (utilization < 70) return "bg-amber-500"
    return "bg-red-500"
  }

  const totalBalance = cards.reduce((sum, card) => sum + card.currentBalance, 0)
  const totalLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0)
  const totalMinPayment = cards.reduce((sum, card) => sum + card.minPayment, 0)
  const overallUtilization = calculateUtilization(totalBalance, totalLimit)

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Header */}
      <header className="border-b bg-white px-6 pb-6 pt-8 shadow-sm">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Credit Cards</h1>
              <p className="text-sm font-medium text-gray-600">{cards.length} active cards</p>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          </div>

          {/* Overall Summary */}
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-white/80 uppercase tracking-wider">Total Balance</p>
                <p className="text-4xl font-bold">${totalBalance.toFixed(2)}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <CreditCard className="h-7 w-7" strokeWidth={2.5} />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white/80">Credit Utilization</span>
                  <span className="font-bold">{overallUtilization.toFixed(1)}%</span>
                </div>
                <Progress
                  value={overallUtilization}
                  className="h-2 bg-white/20"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <div>
                  <p className="text-xs text-white/80">Min Payment Due</p>
                  <p className="text-xl font-bold">${totalMinPayment.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/80">Available Credit</p>
                  <p className="text-xl font-bold">${(totalLimit - totalBalance).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6 space-y-4">
        {/* Individual Cards */}
        {cards.map((card) => {
          const utilization = calculateUtilization(card.currentBalance, card.creditLimit)
          const daysUntilDue = getDaysUntilDue(card.dueDate)
          const isDueSoon = daysUntilDue <= 7

          return (
            <Card key={card.id} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{card.name}</h3>
                    {card.rewards && (
                      <Badge className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                        Rewards
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{card.network} •••• {card.last4}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 border-2 border-white">
                  <CreditCard className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Balance Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Balance</p>
                  <p className="text-2xl font-bold text-gray-900">${card.currentBalance.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Credit Limit</p>
                  <p className="text-2xl font-bold text-gray-900">${card.creditLimit.toFixed(0)}</p>
                </div>
              </div>

              {/* Utilization */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Utilization</span>
                  <span className={`font-bold ${getUtilizationColor(utilization)}`}>
                    {utilization.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getUtilizationBgColor(utilization)} transition-all`}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>
                {utilization > 70 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>High utilization may affect credit score</span>
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className={`p-4 rounded-xl ${isDueSoon ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className={`h-4 w-4 ${isDueSoon ? 'text-red-600' : 'text-gray-600'}`} />
                    <span className={`text-sm font-semibold ${isDueSoon ? 'text-red-600' : 'text-gray-700'}`}>
                      Due in {daysUntilDue} days
                    </span>
                  </div>
                  {isDueSoon && (
                    <Badge className="bg-red-100 text-red-700 text-xs font-semibold">
                      Due Soon
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Min Payment</p>
                    <p className="text-lg font-bold text-gray-900">${card.minPayment.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Statement Balance</p>
                    <p className="text-lg font-bold text-gray-900">${card.statementBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  Min Payment
                  <span className="ml-1 text-xs">${card.minPayment.toFixed(2)}</span>
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Pay Full
                  <span className="ml-1 text-xs">${card.statementBalance.toFixed(2)}</span>
                </Button>
              </div>

              {/* Card Details */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>APR: {card.apr}%</span>
                  {card.rewards && (
                    <>
                      <span>•</span>
                      <span>{card.rewards}</span>
                    </>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </Card>
          )
        })}

        {/* Tips Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Credit Health Tips</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Keep utilization below 30% for best credit score</li>
                <li>• Pay statement balance in full to avoid interest</li>
                <li>• Set up autopay to never miss a payment</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
