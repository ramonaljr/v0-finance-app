"use client"

import dynamic from "next/dynamic"
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

const BankingSection = dynamic(() => import("@/components/account-banking-section").then(m => m.BankingSection), { ssr: false })
const CreditSection = dynamic(() => import("@/components/account-credit-section").then(m => m.CreditSection), { ssr: false })
const InvestmentsSection = dynamic(() => import("@/components/account-investments-section").then(m => m.InvestmentsSection), { ssr: false })

export default function AccountPage() {
  const [showBalances, setShowBalances] = useState(true)
  const [tab, setTab] = useState("banking")

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Enhanced Header */}
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
              className="h-10 w-10 hover:bg-gray-100 rounded-xl hover-scale-sm transition-all"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? <Eye className="h-5 w-5" strokeWidth={2.5} /> : <EyeOff className="h-5 w-5" strokeWidth={2.5} />}
            </Button>
          </div>

          {/* Enhanced Net Worth Card */}
          <Card className="border-2 border-gray-200/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover-scale-sm bg-gradient-to-br from-white via-indigo-50/10 to-purple-50/20">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Sparkles className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Total Net Worth</p>
                <p className="text-4xl font-bold text-gradient-primary tabular-nums">
                  {showBalances ? "$48,258.32" : "••••••"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-green-50/50 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-emerald-600" strokeWidth={2.5} />
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Assets</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{showBalances ? "$62,450" : "••••••"}</p>
              </div>
              <div className="rounded-xl border-2 border-red-200/50 bg-gradient-to-br from-red-50 to-rose-50/50 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <ArrowDownRight className="h-5 w-5 text-red-600" strokeWidth={2.5} />
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Liabilities</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 tabular-nums">{showBalances ? "$14,192" : "••••••"}</p>
              </div>
            </div>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-lg px-6 py-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 pointer-events-auto bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="banking" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              <Building2 className="h-4 w-4" strokeWidth={2.5} />
              Banking
            </TabsTrigger>
            <TabsTrigger value="credit" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              <CreditCard className="h-4 w-4" strokeWidth={2.5} />
              Credit
            </TabsTrigger>
            <TabsTrigger value="investments" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
              Invest
            </TabsTrigger>
          </TabsList>

          {/* Banking Tab - Enhanced */}
          <TabsContent value="banking" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Bank Accounts</h2>
              <Button size="sm" className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all h-9 rounded-xl font-semibold">
                <Plus className="h-4 w-4" strokeWidth={2.5} />
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
                bgGradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
                glowColor: "shadow-indigo-500/20",
              },
              {
                name: "Ally Savings",
                balance: 25000.0,
                type: "Savings",
                last4: "7392",
                icon: PiggyBank,
                bgGradient: "bg-gradient-to-br from-emerald-400 to-green-600",
                glowColor: "shadow-emerald-500/20",
              },
              {
                name: "Vanguard Investment",
                balance: 18500.0,
                type: "Investment",
                last4: "1847",
                icon: TrendingUp,
                bgGradient: "bg-gradient-to-br from-purple-500 to-pink-600",
                glowColor: "shadow-purple-500/20",
              },
            ].map((account) => {
              const Icon = account.icon
              return (
                <Card key={account.name} className="p-5 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-white rounded-2xl shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${account.bgGradient} shadow-lg ${account.glowColor} border-2 border-white`}>
                        <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{account.name}</p>
                        <p className="text-xs text-gray-600 font-medium">
                          {account.type} •••• {account.last4}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-gray-900 tabular-nums">
                        {showBalances
                          ? `$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : "••••••"}
                      </p>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </TabsContent>

          {/* Credit Tab - Enhanced */}
          <TabsContent value="credit" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Credit Cards</h2>
              <Button size="sm" className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all h-9 rounded-xl font-semibold">
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add
              </Button>
            </div>

            {/* AI Alert Card */}
            <Card className="border-l-4 border-l-amber-400 bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-2xl shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
                  <AlertCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900 mb-1.5">High Credit Utilization</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Your Chase Sapphire card is at 62% utilization. Consider paying down $1,200 to improve your credit
                    score.
                  </p>
                  <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-100 font-semibold px-2.5 py-0.5">
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
                <Card key={card.name} className="p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-200 shadow-lg shadow-indigo-500/20">
                        <CreditCard className="h-7 w-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{card.name}</p>
                        <p className="text-xs text-gray-600 font-medium">•••• {card.last4}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Balance</span>
                      <span className="font-bold text-gray-900">
                        {showBalances
                          ? `$${card.balance.toLocaleString()} / $${card.limit.toLocaleString()}`
                          : "•••• / ••••"}
                      </span>
                    </div>
                    <Progress value={utilization} className="h-2.5 bg-gray-100" />
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${isHighUtilization ? "text-amber-600" : "text-gray-600"}`}
                      >
                        {utilization.toFixed(1)}% utilization
                      </span>
                      {isHighUtilization && (
                        <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50 text-xs font-semibold px-2 py-0.5">
                          High Usage
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Min Payment</p>
                      <p className="font-bold text-gray-900">{showBalances ? `$${card.minDue}` : "••••"}</p>
                    </div>
                    <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Due Date</p>
                      <p className="font-bold text-gray-900">{card.dueDate}</p>
                    </div>
                  </div>
                </Card>
              )
            })}

            {/* Loans Section - Enhanced */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Loans</h2>
                <Button size="sm" variant="outline" className="gap-1.5 bg-white border-2 hover:bg-gray-50 h-9 rounded-xl font-semibold">
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
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
                  bgGradient: "bg-gradient-to-br from-teal-400 to-cyan-600",
                  glowColor: "shadow-teal-500/20",
                },
                {
                  name: "Auto Loan",
                  balance: 15600.0,
                  original: 28000,
                  payment: 425.0,
                  icon: Car,
                  bgGradient: "bg-gradient-to-br from-rose-400 to-pink-600",
                  glowColor: "shadow-rose-500/20",
                },
              ].map((loan) => {
                const Icon = loan.icon
                const paidPercentage = ((loan.original - loan.balance) / loan.original) * 100

                return (
                  <Card key={loan.name} className="mb-3 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${loan.bgGradient} border-2 border-white shadow-lg ${loan.glowColor}`}>
                          <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{loan.name}</p>
                          <p className="text-xs text-gray-600 font-medium">
                            {showBalances ? `$${loan.balance.toLocaleString()} remaining` : "•••• remaining"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="mb-4 space-y-2">
                      <Progress value={paidPercentage} className="h-2.5 bg-gray-100" />
                      <p className="text-xs text-gray-600 font-bold">{paidPercentage.toFixed(1)}% paid off</p>
                    </div>

                    <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 font-semibold">Monthly Payment</span>
                        <span className="font-bold text-gray-900 text-lg">
                          {showBalances ? `$${loan.payment}` : "••••"}
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Investments Tab - Enhanced */}
          <TabsContent value="investments" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Investment Accounts</h2>
              <Button
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all h-9 rounded-xl font-semibold"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
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
                bgGradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
              },
              {
                name: "Robinhood",
                balance: 8950.0,
                gain: -320.0,
                gainPercent: -3.5,
                type: "Brokerage",
                bgGradient: "bg-gradient-to-br from-green-500 to-lime-500",
              },
              {
                name: "Coinbase",
                balance: 2450.0,
                gain: 890.0,
                gainPercent: 57.1,
                type: "Crypto",
                bgGradient: "bg-gradient-to-br from-blue-500 to-indigo-500",
              },
            ].map((account) => {
              const isPositive = account.gain >= 0

              return (
                <Card key={account.name} className="overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 duration-300 bg-white rounded-2xl">
                  <div className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${account.bgGradient} shadow-lg border-2 border-white`}>
                          <TrendingUp className="h-7 w-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{account.name}</p>
                          <p className="text-xs text-gray-600 font-medium">{account.type}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-gray-50 border-2 border-gray-200 p-4">
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Balance</p>
                        <p className="text-xl font-bold text-gray-900 tabular-nums">
                          {showBalances ? `$${account.balance.toLocaleString()}` : "••••••"}
                        </p>
                      </div>
                      <div className={`rounded-xl p-4 border-2 ${isPositive ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200" : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"}`}>
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Total Gain</p>
                        <p className={`text-xl font-bold tabular-nums ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                          {showBalances
                            ? `${isPositive ? "+" : ""}$${Math.abs(account.gain).toLocaleString()}`
                            : "••••••"}
                        </p>
                        <p className={`text-xs font-bold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
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
