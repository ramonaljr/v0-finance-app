"use client"

import { useState, useEffect } from "react"
import { Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalculatorInput } from "@/components/ui/calculator-input"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  icon?: string
  color?: string
}

interface Account {
  id: string
  name: string
  type: string
}

export function QuickAddFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])

  const [formData, setFormData] = useState({
    amount: "",
    category_id: "",
    account_id: "",
    payee: "",
    notes: "",
    direction: "out" as "in" | "out"
  })

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      const [categoriesRes, accountsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/accounts')
      ])

      if (categoriesRes.ok) {
        const data = await categoriesRes.json()
        setCategories(data.categories || [])
      }

      if (accountsRes.ok) {
        const data = await accountsRes.json()
        setAccounts(data.accounts || [])
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.category_id) {
      alert('Please fill in amount and category')
      return
    }

    setIsSubmitting(true)

    try {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount')
        setIsSubmitting(false)
        return
      }

      const transaction = {
        amount_minor: Math.round(amount * 100),
        currency_code: 'USD',
        direction: formData.direction,
        occurred_at: new Date().toISOString(),
        payee: formData.payee || null,
        notes: formData.notes || null,
        category_id: formData.category_id || null,
        account_id: formData.account_id || null
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      })

      if (response.ok) {
        // Reset form
        setFormData({
          amount: "",
          category_id: "",
          account_id: "",
          payee: "",
          notes: "",
          direction: "out"
        })
        setIsOpen(false)

        // Refresh the page to show new transaction
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to create transaction'}`)
      }
    } catch (error) {
      console.error('Failed to create transaction:', error)
      alert('Failed to create transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Add Drawer */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="max-w-lg mx-auto p-6 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Add</h2>
              <p className="text-sm text-gray-600">Add transaction in seconds</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Direction Toggle */}
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              variant={formData.direction === "out" ? "default" : "outline"}
              className={cn(
                "flex-1 h-12",
                formData.direction === "out" && "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
              )}
              onClick={() => setFormData({ ...formData, direction: "out" })}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={formData.direction === "in" ? "default" : "outline"}
              className={cn(
                "flex-1 h-12",
                formData.direction === "in" && "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              )}
              onClick={() => setFormData({ ...formData, direction: "in" })}
            >
              Income
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount - Calculator Input */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">Amount *</Label>
              <CalculatorInput
                value={formData.amount}
                onChange={(value) => setFormData({ ...formData, amount: value })}
                placeholder="0.00"
                className="mt-1.5 h-14 text-2xl font-bold"
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger className="mt-1.5 h-12">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payee (Optional) */}
            <div>
              <Label className="text-sm font-medium text-gray-600">Payee (optional)</Label>
              <CalculatorInput
                value={formData.payee}
                onChange={(value) => setFormData({ ...formData, payee: value })}
                placeholder="e.g., Starbucks"
                className="mt-1.5"
                showCalculator={false}
              />
            </div>

            {/* Account (Optional) */}
            {accounts.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Account (optional)</Label>
                <Select
                  value={formData.account_id}
                  onValueChange={(value) => setFormData({ ...formData, account_id: value })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select account..." />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Notes (Optional) */}
            <div>
              <Label className="text-sm font-medium text-gray-600">Notes (optional)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes..."
                className="mt-1.5 resize-none"
                rows={2}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-base font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add ${formData.direction === 'out' ? 'Expense' : 'Income'}`
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed right-6 z-30 h-16 w-16 rounded-full shadow-2xl transition-all",
          "bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700",
          "flex items-center justify-center hover:scale-110 active:scale-95",
          "shadow-indigo-500/50",
          isOpen ? "bottom-[-100px]" : "bottom-24"
        )}
      >
        <Plus className="h-8 w-8 text-white" strokeWidth={3} />
      </button>
    </>
  )
}
