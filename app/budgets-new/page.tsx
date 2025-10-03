"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Plus, X, Target, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface Budget {
  id: string
  period_year: number
  period_month: number
  type: string
  rollover: boolean
  items: BudgetItem[]
}

interface BudgetItem {
  id: string
  limit_minor: number
  allocated_minor: number
  category_id?: string
  category?: {
    id: string
    name: string
    icon?: string
    color?: string
  }
}

interface Category {
  id: string
  name: string
  icon?: string
  color?: string
}

export default function BudgetsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  const currentDate = new Date()
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)

  // Form state
  const [budgetItems, setBudgetItems] = useState<Array<{ category_id: string, limit: string }>>([
    { category_id: '', limit: '' }
  ])

  useEffect(() => {
    loadData()
  }, [selectedYear, selectedMonth])

  const loadData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)

    try {
      // Load budgets
      const budgetResponse = await fetch(`/api/budgets?period_year=${selectedYear}&period_month=${selectedMonth}`)
      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json()
        setBudgets(budgetData.budgets || [])
      }

      // Load categories
      const catResponse = await fetch('/api/categories')
      if (catResponse.ok) {
        const catData = await catResponse.json()
        setCategories(catData.categories || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const items = budgetItems
        .filter(item => item.category_id && item.limit)
        .map(item => ({
          category_id: item.category_id,
          limit_minor: Math.round(parseFloat(item.limit) * 100),
          allocated_minor: 0,
          rollover_from_prev_minor: 0,
        }))

      if (items.length === 0) {
        alert('Please add at least one category with a budget')
        return
      }

      const budgetData = {
        period_year: selectedYear,
        period_month: selectedMonth,
        type: 'zero',
        rollover: true,
        items
      }

      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData)
      })

      if (response.ok) {
        setBudgetItems([{ category_id: '', limit: '' }])
        setShowAddForm(false)
        await loadData()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to create budget'}`)
      }
    } catch (error) {
      console.error('Error creating budget:', error)
      alert('Failed to create budget')
    }
  }

  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, { category_id: '', limit: '' }])
  }

  const removeBudgetItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index))
  }

  const updateBudgetItem = (index: number, field: 'category_id' | 'limit', value: string) => {
    const updated = [...budgetItems]
    updated[index][field] = value
    setBudgetItems(updated)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading budgets...</p>
        </div>
      </div>
    )
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const currentBudget = budgets.find(b => b.period_year === selectedYear && b.period_month === selectedMonth)
  const totalBudgeted = currentBudget?.items.reduce((sum, item) => sum + item.limit_minor, 0) || 0
  const totalAllocated = currentBudget?.items.reduce((sum, item) => sum + item.allocated_minor, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Budgets</h1>
          <div className="flex gap-3">
            <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthNames.map((month, idx) => (
                  <SelectItem key={idx} value={(idx + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Card */}
        {currentBudget && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-indigo-50 to-purple-50">
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-3">
              {monthNames[selectedMonth - 1]} {selectedYear} Budget
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Budgeted</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(totalBudgeted / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(totalAllocated / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Add Budget Button */}
        {!currentBudget && (
          <div className="mb-6">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              {showAddForm ? <X className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
              {showAddForm ? 'Cancel' : 'Create Budget'}
            </Button>
          </div>
        )}

        {/* Add Budget Form */}
        {showAddForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">
              Create Budget for {monthNames[selectedMonth - 1]} {selectedYear}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {budgetItems.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-1">
                    <Select
                      value={item.category_id}
                      onValueChange={(value) => updateBudgetItem(index, 'category_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={item.limit}
                      onChange={(e) => updateBudgetItem(index, 'limit', e.target.value)}
                    />
                  </div>
                  {budgetItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBudgetItem(index)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addBudgetItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>

              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                Create Budget
              </Button>
            </form>
          </Card>
        )}

        {/* Budget Items List */}
        {currentBudget && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>

            {currentBudget.items.map((item) => {
              const spent = item.allocated_minor
              const limit = item.limit_minor
              const percentage = limit > 0 ? (spent / limit) * 100 : 0
              const remaining = limit - spent

              return (
                <Card key={item.id} className="p-5 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                        style={{
                          backgroundColor: `${item.category?.color || '#2196F3'}20`,
                          color: item.category?.color || '#2196F3'
                        }}
                      >
                        {item.category?.icon || '📁'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.category?.name || 'Uncategorized'}</p>
                        <p className="text-xs text-gray-500">
                          ${(spent / 100).toFixed(2)} of ${(limit / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(remaining / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{remaining >= 0 ? 'remaining' : 'over'}</p>
                    </div>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={`h-2 ${percentage > 100 ? 'bg-red-100' : 'bg-gray-100'}`}
                  />
                  <p className="text-xs text-gray-600 mt-2">{percentage.toFixed(1)}% used</p>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!currentBudget && !showAddForm && (
          <Card className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No budget for {monthNames[selectedMonth - 1]} {selectedYear}</p>
            <Button onClick={() => setShowAddForm(true)}>Create Budget</Button>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
