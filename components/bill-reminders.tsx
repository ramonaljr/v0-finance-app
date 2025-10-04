"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Home,
  Zap,
  Heart,
  Plus
} from "lucide-react"

interface Bill {
  id: string
  name: string
  amount: number
  dueDate: number // Day of month
  status: 'upcoming' | 'due' | 'overdue' | 'paid'
  category: string
  autopay: boolean
  icon: any
}

export function BillReminders() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock bills - replace with API call
    const mockBills: Bill[] = [
      {
        id: '1',
        name: 'Rent Payment',
        amount: 1850,
        dueDate: 1,
        status: 'paid',
        category: 'Housing',
        autopay: false,
        icon: Home
      },
      {
        id: '2',
        name: 'Credit Card Payment',
        amount: 650,
        dueDate: 22,
        status: 'upcoming',
        category: 'Credit Cards',
        autopay: false,
        icon: CreditCard
      },
      {
        id: '3',
        name: 'Electricity Bill',
        amount: 145,
        dueDate: 10,
        status: 'paid',
        category: 'Utilities',
        autopay: true,
        icon: Zap
      },
      {
        id: '4',
        name: 'Gym Membership',
        amount: 50,
        dueDate: 15,
        status: 'upcoming',
        category: 'Health',
        autopay: true,
        icon: Heart
      },
    ]

    setTimeout(() => {
      setBills(mockBills)
      setLoading(false)
    }, 500)
  }, [])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          badge: 'bg-green-100 text-green-700 border-green-200',
          icon: CheckCircle2,
          label: 'Paid'
        }
      case 'upcoming':
        return {
          badge: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: Clock,
          label: 'Upcoming'
        }
      case 'due':
        return {
          badge: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: AlertCircle,
          label: 'Due Soon'
        }
      case 'overdue':
        return {
          badge: 'bg-red-100 text-red-700 border-red-200',
          icon: AlertCircle,
          label: 'Overdue'
        }
      default:
        return {
          badge: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Calendar,
          label: 'Pending'
        }
    }
  }

  const getDaysUntilDue = (dueDate: number) => {
    const today = new Date()
    const currentDay = today.getDate()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

    if (dueDate >= currentDay) {
      return dueDate - currentDay
    } else {
      return daysInMonth - currentDay + dueDate
    }
  }

  const upcomingBills = bills.filter(b => b.status === 'upcoming' || b.status === 'due')
  const paidBills = bills.filter(b => b.status === 'paid')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Bill Reminders
        </h3>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-indigo-600 hover:bg-indigo-50">
          <Plus className="h-4 w-4" />
          Add Bill
        </Button>
      </div>

      {loading ? (
        <Card className="p-6 rounded-2xl">
          <p className="text-center text-gray-600">Loading bills...</p>
        </Card>
      ) : (
        <>
          {/* Upcoming Bills */}
          {upcomingBills.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Upcoming</p>
              {upcomingBills.map((bill) => {
                const Icon = bill.icon
                const statusConfig = getStatusConfig(bill.status)
                const StatusIcon = statusConfig.icon
                const daysUntil = getDaysUntilDue(bill.dueDate)

                return (
                  <Card key={bill.id} className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 border-2 border-white">
                        <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900">{bill.name}</p>
                          {bill.autopay && (
                            <Badge className="bg-blue-50 text-blue-600 text-xs font-semibold border-blue-200">
                              Auto-pay
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600 font-medium">
                            Due in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{bill.category}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ${bill.amount.toFixed(2)}
                        </p>
                        <Badge className={`${statusConfig.badge} text-xs font-semibold mt-1`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Paid Bills */}
          {paidBills.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid This Month</p>
              {paidBills.map((bill) => {
                const Icon = bill.icon
                const statusConfig = getStatusConfig(bill.status)
                const StatusIcon = statusConfig.icon

                return (
                  <Card key={bill.id} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-4 opacity-75">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-200">
                        <Icon className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-700 text-sm">{bill.name}</p>
                        <p className="text-xs text-gray-500">{bill.category}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-700">
                          ${bill.amount.toFixed(2)}
                        </p>
                        <Badge className={`${statusConfig.badge} text-xs font-semibold mt-1`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {bills.length === 0 && !loading && (
            <Card className="p-8 text-center rounded-2xl">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium mb-2">No bills added yet</p>
              <p className="text-sm text-gray-500 mb-4">Add your recurring bills to get reminders</p>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Bill
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
