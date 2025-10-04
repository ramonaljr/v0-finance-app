"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  ChevronRight,
  Bell,
  DollarSign,
  Calendar,
  Music,
  Film,
  Dumbbell,
  Cloud,
  Zap,
  Gamepad2
} from "lucide-react"

interface Subscription {
  id: string
  name: string
  icon: any
  amount: number
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate: string
  category: string
  status: 'active' | 'cancelled' | 'paused'
  autoDetected: boolean
  priceChange?: {
    oldPrice: number
    newPrice: number
    effectiveDate: string
  }
}

export default function SubscriptionsPage() {
  const [subscriptions] = useState<Subscription[]>([
    {
      id: "1",
      name: "Netflix Premium",
      icon: Film,
      amount: 19.99,
      billingCycle: 'monthly',
      nextBillingDate: '2025-10-15',
      category: 'Entertainment',
      status: 'active',
      autoDetected: true
    },
    {
      id: "2",
      name: "Spotify Family",
      icon: Music,
      amount: 16.99,
      billingCycle: 'monthly',
      nextBillingDate: '2025-10-08',
      category: 'Entertainment',
      status: 'active',
      autoDetected: true
    },
    {
      id: "3",
      name: "Planet Fitness",
      icon: Dumbbell,
      amount: 24.99,
      billingCycle: 'monthly',
      nextBillingDate: '2025-10-01',
      category: 'Health & Fitness',
      status: 'active',
      autoDetected: true,
      priceChange: {
        oldPrice: 22.99,
        newPrice: 24.99,
        effectiveDate: '2025-11-01'
      }
    },
    {
      id: "4",
      name: "iCloud Storage",
      icon: Cloud,
      amount: 2.99,
      billingCycle: 'monthly',
      nextBillingDate: '2025-10-12',
      category: 'Cloud Storage',
      status: 'active',
      autoDetected: true
    },
    {
      id: "5",
      name: "Adobe Creative Cloud",
      icon: Zap,
      amount: 54.99,
      billingCycle: 'monthly',
      nextBillingDate: '2025-10-20',
      category: 'Software',
      status: 'active',
      autoDetected: false
    },
    {
      id: "6",
      name: "PlayStation Plus",
      icon: Gamepad2,
      amount: 9.99,
      billingCycle: 'monthly',
      nextBillingDate: '2025-09-28',
      category: 'Gaming',
      status: 'cancelled',
      autoDetected: true
    }
  ])

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
    return sum + (sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12)
  }, 0)
  const totalYearly = totalMonthly * 12
  const priceIncreases = subscriptions.filter(s => s.priceChange && s.status === 'active')

  const getDaysUntilBilling = (date: string) => {
    const today = new Date()
    const billing = new Date(date)
    const diffTime = billing.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 text-xs font-semibold">Active</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-700 text-xs font-semibold">Cancelled</Badge>
      case 'paused':
        return <Badge className="bg-amber-100 text-amber-700 text-xs font-semibold">Paused</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Header */}
      <header className="border-b bg-white px-6 pb-6 pt-8 shadow-sm">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
              <p className="text-sm font-medium text-gray-600">{activeSubscriptions.length} active subscriptions</p>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-white/80 uppercase tracking-wider">Monthly Spend</p>
                <p className="text-4xl font-bold">${totalMonthly.toFixed(2)}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <RefreshCw className="h-7 w-7" strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <div>
                <p className="text-xs text-white/80">Yearly Total</p>
                <p className="text-xl font-bold">${totalYearly.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/80">Avg per Service</p>
                <p className="text-xl font-bold">${(totalMonthly / activeSubscriptions.length).toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6 space-y-6">
        {/* Price Increase Alerts */}
        {priceIncreases.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Price Changes</h3>
            {priceIncreases.map((sub) => (
              <Card key={sub.id} className="bg-amber-50 border-amber-200 p-4 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{sub.name} Price Increase</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Price increasing from ${sub.priceChange?.oldPrice} to ${sub.priceChange?.newPrice} on{' '}
                      {new Date(sub.priceChange?.effectiveDate!).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        Review Options
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-amber-600 hover:text-amber-700">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Active Subscriptions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Active</h3>
          {activeSubscriptions.map((sub) => {
            const Icon = sub.icon
            const daysUntilBilling = getDaysUntilBilling(sub.nextBillingDate)
            const isDueSoon = daysUntilBilling <= 7

            return (
              <Card key={sub.id} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 border-2 border-white">
                    <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{sub.name}</h3>
                      {sub.autoDetected && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs font-semibold">
                          Auto-detected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{sub.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span className={`text-xs font-medium ${isDueSoon ? 'text-red-600' : 'text-gray-600'}`}>
                        Next billing in {daysUntilBilling} days
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${sub.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</p>
                    {getStatusBadge(sub.status)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-9 text-xs">
                    Pause
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-9 text-xs text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
                    Cancel
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Savings Opportunities */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-green-200">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 mb-2">Potential Savings</p>
              <p className="text-sm text-gray-700 mb-3">
                We found 2 subscriptions you haven't used in 30+ days. Cancel to save $34.98/month.
              </p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 h-9">
                Review Unused Services
              </Button>
            </div>
          </div>
        </Card>

        {/* Cancelled/Inactive */}
        {subscriptions.filter(s => s.status !== 'active').length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Inactive</h3>
            {subscriptions.filter(s => s.status !== 'active').map((sub) => {
              const Icon = sub.icon

              return (
                <Card key={sub.id} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-4 opacity-60">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-200">
                      <Icon className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-700">{sub.name}</p>
                      <p className="text-xs text-gray-600">{sub.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-700">${sub.amount.toFixed(2)}</p>
                      {getStatusBadge(sub.status)}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Tips */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Subscription Management Tips</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Set up billing alerts 3 days before charges</li>
                <li>• Review yearly subscriptions for annual discounts</li>
                <li>• Track free trial end dates to avoid surprise charges</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
