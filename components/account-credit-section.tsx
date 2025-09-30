"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, CreditCard, AlertCircle, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function CreditSection({ showBalances }: { showBalances: boolean }) {
  return (
    <>
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
              Your Chase Sapphire card is at 62% utilization. Consider paying down $1,200 to improve your credit score.
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
                  {showBalances ? `$${card.balance.toLocaleString()} / $${card.limit.toLocaleString()}` : "•••• / ••••"}
                </span>
              </div>
              <Progress value={utilization} className="h-2" />
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${isHighUtilization ? "text-warning" : "text-muted-foreground"}`}>
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
    </>
  )
}


