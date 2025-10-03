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
import { ArrowUpCircle, ArrowDownCircle, Plus, X } from "lucide-react"

interface Transaction {
  id: string
  amount_minor: number
  currency_code: string
  direction: 'in' | 'out'
  occurred_at: string
  payee: string | null
  notes: string | null
  category?: { id: string; name: string; icon?: string; color?: string }
  account?: { id: string; name: string; type: string }
}

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

export default function TransactionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    direction: 'out' as 'in' | 'out',
    payee: '',
    notes: '',
    category_id: '',
    account_id: '',
    occurred_at: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)

    try {
      // Load transactions
      const txResponse = await fetch('/api/transactions?limit=50')
      if (txResponse.ok) {
        const txData = await txResponse.json()
        setTransactions(txData.transactions || [])
      }

      // Load categories
      const catResponse = await fetch('/api/categories')
      if (catResponse.ok) {
        const catData = await catResponse.json()
        setCategories(catData.categories || [])
      }

      // Load accounts
      const accResponse = await fetch('/api/accounts')
      if (accResponse.ok) {
        const accData = await accResponse.json()
        setAccounts(accData.accounts || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount')
        return
      }

      const transaction = {
        amount_minor: Math.round(amount * 100),
        currency_code: 'USD',
        direction: formData.direction,
        occurred_at: new Date(formData.occurred_at).toISOString(),
        payee: formData.payee || null,
        notes: formData.notes || null,
        category_id: formData.category_id || null,
        account_id: formData.account_id || null,
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: [transaction] })
      })

      if (response.ok) {
        // Reset form
        setFormData({
          amount: '',
          direction: 'out',
          payee: '',
          notes: '',
          category_id: '',
          account_id: '',
          occurred_at: new Date().toISOString().split('T')[0]
        })
        setShowAddForm(false)

        // Refresh transactions
        await loadData()

        // Refresh cache
        await fetch('/api/cache/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to create transaction'}`)
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert('Failed to create transaction')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            {showAddForm ? <X className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
            {showAddForm ? 'Cancel' : 'Add Transaction'}
          </Button>
        </div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={formData.direction} onValueChange={(value: 'in' | 'out') => setFormData({ ...formData, direction: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="out">Expense</SelectItem>
                      <SelectItem value="in">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Payee / Description</Label>
                <Input
                  placeholder="e.g., Starbucks"
                  value={formData.payee}
                  onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
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
                <div>
                  <Label>Account</Label>
                  <Select value={formData.account_id} onValueChange={(value) => setFormData({ ...formData, account_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.occurred_at}
                  onChange={(e) => setFormData({ ...formData, occurred_at: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Input
                  placeholder="Optional notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                Add Transaction
              </Button>
            </form>
          </Card>
        )}

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">No transactions yet</p>
              <Button onClick={() => setShowAddForm(true)}>Add Your First Transaction</Button>
            </Card>
          ) : (
            transactions.map((tx) => (
              <Card key={tx.id} className="p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {tx.direction === 'in' ? (
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <ArrowDownCircle className="h-5 w-5 text-red-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{tx.payee || 'Unknown'}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {tx.category && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {tx.category.icon} {tx.category.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(tx.occurred_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${tx.direction === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.direction === 'in' ? '+' : '-'}${(tx.amount_minor / 100).toFixed(2)}
                    </p>
                    {tx.account && (
                      <p className="text-xs text-gray-500">{tx.account.name}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
