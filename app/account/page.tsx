"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountsLoadingSkeleton } from "@/components/loading-states"
import {
  Building2,
  CreditCard,
  TrendingUp,
  Plus,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  Wallet,
  PiggyBank,
  Loader2,
  Edit as EditIcon,
  Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Account {
  id: string
  name: string
  type: string
  balance_minor: number
  currency_code: string
  created_at: string
}

const ACCOUNT_ICONS: Record<string, any> = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  cash: Wallet,
}

const ACCOUNT_GRADIENTS: Record<string, string> = {
  checking: "bg-gradient-to-br from-indigo-500 to-purple-600",
  savings: "bg-gradient-to-br from-emerald-400 to-green-600",
  credit: "bg-gradient-to-br from-red-500 to-rose-600",
  investment: "bg-gradient-to-br from-purple-500 to-pink-600",
  cash: "bg-gradient-to-br from-blue-500 to-cyan-600",
}

export default function AccountPageNew() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [showBalances, setShowBalances] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "checking",
    balance: "0",
    currency_code: "USD",
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAccount = async () => {
    if (!newAccount.name || !newAccount.type) return

    setIsSubmitting(true)
    try {
      const balance_minor = Math.round(parseFloat(newAccount.balance || "0") * 100)

      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAccount.name,
          type: newAccount.type,
          balance_minor,
          currency_code: newAccount.currency_code,
        }),
      })

      if (response.ok) {
        await fetchAccounts()
        setIsAddDialogOpen(false)
        setNewAccount({ name: "", type: "checking", balance: "0", currency_code: "USD" })
      }
    } catch (error) {
      console.error('Failed to add account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditAccount = async () => {
    if (!editingAccount) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/accounts/${editingAccount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingAccount.name,
          type: editingAccount.type,
          balance_minor: editingAccount.balance_minor,
          currency_code: editingAccount.currency_code,
        }),
      })

      if (response.ok) {
        await fetchAccounts()
        setIsEditDialogOpen(false)
        setEditingAccount(null)
      }
    } catch (error) {
      console.error('Failed to update account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return

    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAccounts()
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
    }
  }

  const openEditDialog = (account: Account) => {
    setEditingAccount(account)
    setIsEditDialogOpen(true)
  }

  const calculateNetWorth = () => {
    return accounts.reduce((sum, acc) => {
      if (acc.type === 'credit') {
        return sum - (acc.balance_minor / 100)
      }
      return sum + (acc.balance_minor / 100)
    }, 0)
  }

  const calculateAssets = () => {
    return accounts
      .filter(acc => acc.type !== 'credit')
      .reduce((sum, acc) => sum + (acc.balance_minor / 100), 0)
  }

  const calculateLiabilities = () => {
    return accounts
      .filter(acc => acc.type === 'credit')
      .reduce((sum, acc) => sum + (acc.balance_minor / 100), 0)
  }

  const getBankingAccounts = () => accounts.filter(a => a.type === 'checking' || a.type === 'savings' || a.type === 'cash')
  const getCreditAccounts = () => accounts.filter(a => a.type === 'credit')
  const getInvestmentAccounts = () => accounts.filter(a => a.type === 'investment')

  if (loading) {
    return <AccountsLoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <header className="relative z-10 border-b bg-white px-6 pb-6 pt-8 shadow-sm">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
              <p className="text-sm font-medium text-gray-600">Manage your finances</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-gray-100 rounded-xl transition-all"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </Button>
          </div>

          <Card className="border-2 border-gray-200/50 p-6 rounded-2xl shadow-xl bg-gradient-to-br from-white via-indigo-50/10 to-purple-50/20">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Sparkles className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Total Net Worth</p>
                <p className="text-4xl font-bold text-gray-900 tabular-nums">
                  {showBalances ? `$${calculateNetWorth().toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "••••••"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-green-50/50 p-4 shadow-sm">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Assets</p>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">
                  {showBalances ? `$${calculateAssets().toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "••••••"}
                </p>
              </div>
              <div className="rounded-xl border-2 border-red-200/50 bg-gradient-to-br from-red-50 to-rose-50/50 p-4 shadow-sm">
                <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">Liabilities</p>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">
                  {showBalances ? `$${calculateLiabilities().toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "••••••"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-lg px-6 py-6">
        <Tabs defaultValue="banking" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger
              value="banking"
              className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Building2 className="h-4 w-4" />
              Banking
            </TabsTrigger>
            <TabsTrigger
              value="credit"
              className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <CreditCard className="h-4 w-4" />
              Credit
            </TabsTrigger>
            <TabsTrigger
              value="investments"
              className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              Invest
            </TabsTrigger>
          </TabsList>

          <TabsContent value="banking" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Bank Accounts</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg rounded-xl font-semibold">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                    <DialogDescription>Create a new account to track your finances</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Account Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. Chase Checking"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Account Type</Label>
                      <Select value={newAccount.type} onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="credit">Credit Card</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="balance">Current Balance</Label>
                      <Input
                        id="balance"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newAccount.balance}
                        onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAccount} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Add Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {getBankingAccounts().length === 0 ? (
              <Card className="p-8 text-center rounded-2xl">
                <p className="text-gray-600">No bank accounts yet. Add one to get started!</p>
              </Card>
            ) : (
              getBankingAccounts().map((account) => {
                const Icon = ACCOUNT_ICONS[account.type] || Wallet
                const gradient = ACCOUNT_GRADIENTS[account.type] || ACCOUNT_GRADIENTS.checking

                return (
                  <Card key={account.id} className="p-5 hover:shadow-xl transition-all duration-300 bg-white rounded-2xl shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${gradient} shadow-lg border-2 border-white`}>
                          <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{account.name}</p>
                          <p className="text-xs text-gray-600 font-medium capitalize">{account.type}</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-gray-900 tabular-nums">
                        {showBalances
                          ? `$${(account.balance_minor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                          : "••••••"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={() => openEditDialog(account)}
                      >
                        <EditIcon className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="credit" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Credit Cards</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg rounded-xl font-semibold">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            {getCreditAccounts().length === 0 ? (
              <Card className="p-8 text-center rounded-2xl">
                <p className="text-gray-600">No credit cards yet.</p>
              </Card>
            ) : (
              getCreditAccounts().map((account) => (
                <Card key={account.id} className="p-5 hover:shadow-xl transition-all duration-300 bg-white rounded-2xl shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg border-2 border-white">
                        <CreditCard className="h-7 w-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{account.name}</p>
                        <p className="text-xs text-gray-600 font-medium">Credit Card</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-red-600 tabular-nums">
                      {showBalances
                        ? `$${(account.balance_minor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : "••••••"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => openEditDialog(account)}
                    >
                      <EditIcon className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteAccount(account.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="investments" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Investment Accounts</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg rounded-xl font-semibold">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            {getInvestmentAccounts().length === 0 ? (
              <Card className="p-8 text-center rounded-2xl">
                <p className="text-gray-600">No investment accounts yet.</p>
              </Card>
            ) : (
              getInvestmentAccounts().map((account) => (
                <Card key={account.id} className="p-5 hover:shadow-xl transition-all duration-300 bg-white rounded-2xl shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg border-2 border-white">
                        <TrendingUp className="h-7 w-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{account.name}</p>
                        <p className="text-xs text-gray-600 font-medium">Investment</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-gray-900 tabular-nums">
                      {showBalances
                        ? `$${(account.balance_minor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : "••••••"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => openEditDialog(account)}
                    >
                      <EditIcon className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteAccount(account.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Account Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Account</DialogTitle>
              <DialogDescription>Update your account information</DialogDescription>
            </DialogHeader>
            {editingAccount && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Account Name</Label>
                  <Input
                    id="edit-name"
                    value={editingAccount.name}
                    onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Account Type</Label>
                  <Select
                    value={editingAccount.type}
                    onValueChange={(value) => setEditingAccount({ ...editingAccount, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-balance">Current Balance</Label>
                  <Input
                    id="edit-balance"
                    type="number"
                    step="0.01"
                    value={(editingAccount.balance_minor / 100).toFixed(2)}
                    onChange={(e) =>
                      setEditingAccount({
                        ...editingAccount,
                        balance_minor: Math.round(parseFloat(e.target.value || "0") * 100),
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingAccount(null)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleEditAccount} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <BottomNav />
    </div>
  )
}
