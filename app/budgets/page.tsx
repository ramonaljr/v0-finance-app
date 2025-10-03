"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCategoryIcon } from "@/lib/category-icons"
import { ChevronLeft, ChevronRight, Plus, Edit2 } from "lucide-react"

export default function BudgetsNewPage() {
  const [view, setView] = useState("month")

  const totalBudget = 50000
  const totalSpent = 18666.67
  const remaining = totalBudget - totalSpent

  const mainCategories = [
    { name: "Food & Drink", percentage: 12, budget: 6000, spent: 4000, subcategories: [
      { name: "Breakfast", budget: 1000, spent: 800 },
      { name: "Lunch", budget: 3000, spent: 2000 },
      { name: "Dinner", budget: 2000, spent: 1200 },
    ]},
    { name: "Transportation", percentage: 10, budget: 5000, spent: 3500 },
    { name: "Shopping", percentage: 16, budget: 8000, spent: 6400 },
    { name: "Health Care", percentage: 18, budget: 9000, spent: 4766.67 },
  ]

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 12, children }: any) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative drop-shadow-lg" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient-progress)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 drop-shadow-md"
          />
          <defs>
            <linearGradient id="gradient-progress" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    )
  }

  const DonutChart = ({ categories }: any) => {
    const total = categories.reduce((sum: number, cat: any) => sum + cat.percentage, 0)
    let currentAngle = 0

    const colors = ['#10b981', '#3b82f6', '#ec4899', '#f59e0b']

    return (
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {categories.map((cat: any, idx: number) => {
            const angle = (cat.percentage / total) * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            currentAngle = endAngle

            const start = polarToCartesian(50, 50, 35, startAngle)
            const end = polarToCartesian(50, 50, 35, endAngle)
            const largeArcFlag = angle > 180 ? 1 : 0

            const pathData = [
              `M ${start.x} ${start.y}`,
              `A 35 35 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
            ].join(' ')

            return (
              <path
                key={idx}
                d={pathData}
                fill="none"
                stroke={colors[idx % colors.length]}
                strokeWidth="10"
              />
            )
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
    )
  }

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white backdrop-blur-lg border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full mb-2 shadow-sm">
              <span className="text-xs font-semibold">Daily</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
              <h2 className="text-lg font-bold text-gray-900">This Month</h2>
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-xl transition-all">
            <Edit2 className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-lg mx-auto">
        {/* Main Budget Circle */}
        <Card className="p-8 bg-white backdrop-blur border-0 shadow-xl rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-center mb-6">
            <CircularProgress percentage={(totalSpent / totalBudget) * 100} size={160} strokeWidth={16}>
              <div className="text-center">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Remain</p>
                <p className="text-2xl font-bold text-green-600">
                  ¥{(remaining / 100).toLocaleString()}
                </p>
              </div>
            </CircularProgress>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Spent</span>
            <span className="text-lg font-bold text-gray-900">
              ¥{(totalSpent / 100).toLocaleString()}
            </span>
          </div>
        </Card>

        {/* Category Breakdown with Donut Chart */}
        <Card className="p-6 bg-white backdrop-blur border-0 shadow-xl rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Budget</p>
              <p className="text-3xl font-bold text-gray-900">${(totalBudget / 100).toLocaleString()}</p>
              <p className="text-sm text-gray-600">${(totalSpent / 100).toFixed(2)}</p>
            </div>
            <DonutChart categories={mainCategories} />
          </div>

          <div className="space-y-3">
            {mainCategories.map((cat, idx) => {
              const { icon: Icon, gradient, bgGradient, glowColor } = getCategoryIcon(cat.name)
              const colors = ['text-green-600', 'text-blue-600', 'text-pink-600', 'text-orange-600']

              return (
                <div key={cat.name} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-xl transition-all">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-full ${bgGradient} flex items-center justify-center text-white shadow-lg ${glowColor} border-2 border-white`}>
                      <Icon className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                        <span className={`text-xs font-bold ${colors[idx % colors.length]}`}>{cat.percentage}%</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 ml-4">${(cat.budget / 100).toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Subcategory Breakdown Example */}
        <Card className="p-6 bg-white backdrop-blur border-0 shadow-xl rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30 border-2 border-white">
                {(() => {
                  const { icon: Icon } = getCategoryIcon("Food & Drink")
                  return <Icon className="h-7 w-7" strokeWidth={2.5} />
                })()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Food & Drink</h3>
                <p className="text-xs text-gray-600 font-semibold">3 subcategories</p>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">${(6000 / 100).toLocaleString()}</span>
          </div>

          <div className="space-y-3">
            {mainCategories[0].subcategories?.map((sub) => (
              <div key={sub.name} className="pl-4 border-l-2 border-green-300 hover:bg-gray-50 p-2 rounded-r-xl transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">{sub.name}</span>
                  <span className="text-sm font-bold text-gray-900">${(sub.budget / 100).toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 shadow-sm"
                    style={{ width: `${(sub.spent / sub.budget) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
              <Plus className="h-4 w-4 mr-1" strokeWidth={2.5} />
              Add Subcategory
            </Button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-12 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold">
            Plan
          </Button>
          <Button variant="outline" className="flex-1 h-12 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold">
            Remain
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
