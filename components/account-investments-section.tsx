"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, TrendingUp, Plus } from "lucide-react"

export function InvestmentsSection({ showBalances }: { showBalances: boolean }) {
  return (
    <>
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
                <div className={`${isPositive ? "bg-green-50" : "bg-red-50"} rounded-lg p-3`}>
                  <p className="text-xs text-muted-foreground">Total Gain</p>
                  <p className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {showBalances ? `${isPositive ? "+" : ""}$${Math.abs(account.gain).toLocaleString()}` : "••••••"}
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
    </>
  )
}


