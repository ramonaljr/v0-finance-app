"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  CreditCard,
  TrendingUp,
  Wallet,
  Plus,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PiggyBank,
  Car,
  GraduationCap,
  AlertCircle,
} from "lucide-react"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"

export default function AccountPage() {
  const [showBalances, setShowBalances] = useState(true)

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b bg-card px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
              <p className="text-sm text-muted-foreground">Manage your finances</p>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setShowBalances(!showBalances)}>
              {showBalances ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </Button>
          </div>

          <Card className="border-2 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Net Worth</p>
                <p className="text-3xl font-bold text-foreground">{showBalances ? "$48,258.32" : "••••••"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-success/5 p-4">
                <div className="mb-1 flex items-center gap-1.5">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                  <p className="text-xs font-semibold text-success">Assets</p>
                </div>
                <p className="text-xl font-bold text-foreground">{showBalances ? "$62,450" : "••••••"}</p>
              </div>
              <div className="rounded-xl border bg-destructive/5 p-4">
                <div className="mb-1 flex items-center gap-1.5">
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                  <p className="text-xs font-semibold text-destructive">Liabilities</p>
                </div>
                <p className="text-xl font-bold text-foreground">{showBalances ? "$14,192" : "••••••"}</p>
              </div>
            </div>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        <Tabs defaultValue="banking" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="banking" className="gap-2">
              <Building2 className="h-4 w-4" />
              Banking
            </TabsTrigger>
            <TabsTrigger value="credit" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Credit
            </TabsTrigger>
            <TabsTrigger value="investments" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Invest
            </TabsTrigger>
          </TabsList>

          {/* Banking Tab */}
          <TabsContent value="banking" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Bank Accounts</h2>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {[
              {
                name: "Chase Checking",
                balance: 12458.32,
                type: "Checking",
                last4: "4829",
                icon: Wallet,
                bgColor: "bg-primary/10",
                borderColor: "border-primary/20",
                iconColor: "text-primary",
              },
              {
                name: "Ally Savings",
                balance: 25000.0,
                type: "Savings",
                last4: "7392",
                icon: PiggyBank,
                bgColor: "bg-success/10",
                borderColor: "border-success/20",
                iconColor: "text-success",
              },
              {
                name: "Vanguard Investment",
                balance: 18500.0,
                type: "Investment",
                last4: "1847",
                icon: TrendingUp,
                bgColor: "bg-purple-500/10",
                borderColor: "border-purple-500/20",
                iconColor: "text-purple-600",
              },
            ].map((account) => {
              const Icon = account.icon
              return (
                <Card key={account.name} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${account.bgColor} border ${account.borderColor}`}
                      >
                        <Icon className={`h-6 w-6 ${account.iconColor}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{account.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {account.type} •••• {account.last4}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-foreground">
                        {showBalances
                          ? `$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : "••••••"}
                      </p>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </TabsContent>

          {/* Credit Tab */}
          <TabsContent value="credit" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Credit Cards</h2>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <Card className="border-l-4 border-l-warning bg-warning/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/20">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-1">High Credit Utilization</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    Your Chase Sapphire card is at 62% utilization. Consider paying down $1,200 to improve your credit
                    score.
                  </p>
                  <Badge variant="outline" className="text-xs border-warning/30 text-warning">
                    AI Recommendation
                  </Badge>
                </div>
              </div>
            </Card>

            {[
              {
                name: "Chase Sapphire",
                balance: 6240.0,
                limit: 10000,
                minDue: 187.0,
                dueDate: "Oct 8",
                last4: "8392",
              },
              {
                name: "Amex Gold",
                balance: 2850.0,
                limit: 15000,
                minDue: 85.0,
                dueDate: "Oct 12",
                last4: "1005",
              },
            ].map((card) => {
              const utilization = (card.balance / card.limit) * 100
              const isHighUtilization = utilization > 30

              return (
                <Card key={card.name} className="p-4 hover:shadow-md transition-shadow">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{card.name}</p>
                        <p className="text-xs text-muted-foreground">•••• {card.last4}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Balance</span>
                      <span className="font-semibold text-foreground">
                        {showBalances
                          ? `$${card.balance.toLocaleString()} / $${card.limit.toLocaleString()}`
                          : "•••• / ••••"}
                      </span>
                    </div>
                    <Progress value={utilization} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-medium ${isHighUtilization ? "text-warning" : "text-muted-foreground"}`}
                      >
                        {utilization.toFixed(1)}% utilization
                      </span>
                      {isHighUtilization && (
                        <Badge variant="outline" className="border-warning/30 text-warning text-xs">
                          High Usage
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Min Payment</p>
                      <p className="font-semibold text-foreground">{showBalances ? `$${card.minDue}` : "••••"}</p>
                    </div>
                    <div className="rounded-xl border bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                      <p className="font-semibold text-foreground">{card.dueDate}</p>
                    </div>
                  </div>
                </Card>
              )
            })}

            {/* Loans Section */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Loans</h2>
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {[
                {
                  name: "Student Loan",
                  balance: 8500.0,
                  original: 25000,
                  payment: 285.0,
                  icon: GraduationCap,
                  bgColor: "bg-teal-500/10",
                  borderColor: "border-teal-500/20",
                  iconColor: "text-teal-600",
                },
                {
                  name: "Auto Loan",
                  balance: 15600.0,
                  original: 28000,
                  payment: 425.0,
                  icon: Car,
                  bgColor: "bg-rose-500/10",
                  borderColor: "border-rose-500/20",
                  iconColor: "text-rose-600",
                },
              ].map((loan) => {
                const Icon = loan.icon
                const paidPercentage = ((loan.original - loan.balance) / loan.original) * 100

                return (
                  <Card key={loan.name} className="mb-3 p-4 hover:shadow-md transition-shadow">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${loan.bgColor} border ${loan.borderColor}`}
                        >
                          <Icon className={`h-6 w-6 ${loan.iconColor}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{loan.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {showBalances ? `$${loan.balance.toLocaleString()} remaining` : "•••• remaining"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="mb-3 space-y-2">
                      <Progress value={paidPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{paidPercentage.toFixed(1)}% paid off</p>
                    </div>

                    <div className="rounded-xl border bg-muted/50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Payment</span>
                        <span className="font-semibold text-foreground">
                          {showBalances ? `$${loan.payment}` : "••••"}
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Investment Accounts</h2>
              <Button
                size="sm"
                className="gap-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Add Account
              </Button>
            </div>

            {[
              {
                name: "Vanguard 401(k)",
                balance: 45200.0,
                gain: 5240.0,
                gainPercent: 13.1,
                type: "Retirement",
                color: "from-emerald-500 to-teal-500",
              },
              {
                name: "Robinhood",
                balance: 8950.0,
                gain: -320.0,
                gainPercent: -3.5,
                type: "Brokerage",
                color: "from-green-500 to-lime-500",
              },
              {
                name: "Coinbase",
                balance: 2450.0,
                gain: 890.0,
                gainPercent: 57.1,
                type: "Crypto",
                color: "from-blue-500 to-indigo-500",
              },
            ].map((account) => {
              const isPositive = account.gain >= 0

              return (
                <Card key={account.name} className="overflow-hidden border-0 shadow-md transition-all hover:shadow-lg">
                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${account.color} shadow-lg`}
                        >
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{account.name}</p>
                          <p className="text-xs text-muted-foreground">{account.type}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Balance</p>
                        <p className="text-lg font-bold text-foreground">
                          {showBalances ? `$${account.balance.toLocaleString()}` : "••••••"}
                        </p>
                      </div>
                      <div className={`rounded-lg p-3 ${isPositive ? "bg-green-50" : "bg-red-50"}`}>
                        <p className="text-xs text-muted-foreground">Total Gain</p>
                        <p className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                          {showBalances
                            ? `${isPositive ? "+" : ""}$${Math.abs(account.gain).toLocaleString()}`
                            : "••••••"}
                        </p>
                        <p className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                          {isPositive ? "+" : ""}
                          {account.gainPercent}%
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  )
}
