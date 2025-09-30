"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, PiggyBank, TrendingUp, Wallet, Plus } from "lucide-react"

export function BankingSection({ showBalances }: { showBalances: boolean }) {
  return (
    <>
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
    </>
  )
}


