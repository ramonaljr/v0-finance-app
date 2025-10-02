"use client"

import React from "react"
import { BottomNav } from "@/components/bottom-nav"
import { FABButton } from "@/components/fab-button"
import { Card } from "@/components/ui/card"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, Settings, Zap } from "lucide-react"
import { useBudgets, useFormattedBudgets } from "@/lib/hooks/use-api"
import { BudgetsLoadingSkeleton, CardSkeleton } from "@/components/ui/loading-skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const dynamic = 'force-dynamic'

const BudgetsPage = React.memo(() => {
  const [view, setView] = React.useState("month")
  const { data: budgets, isLoading, error } = useFormattedBudgets()

  if (isLoading) {
    return <BudgetsLoadingSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="mx-auto max-w-lg px-6 py-6">
          <Alert>
            <AlertDescription>
              Failed to load budgets. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
        <BottomNav />
        <FABButton />
      </div>
    )
  }

  // Group budgets into categories for display
  const budgetCategories = React.useMemo(() => {
    if (!budgets) return { essentials: [], lifestyle: [], goals: [] }

    return {
      essentials: budgets.slice(0, 3),
      lifestyle: budgets.slice(3, 5),
      goals: budgets.slice(5, 7),
    }
  }, [budgets])

  // Memoize budget calculations to avoid recalculating on every render
  const calculateBudgetData = React.useCallback((category: any) => {
    // Since allocated and spent are now currency strings, we need to parse them back to numbers
    const allocated = parseFloat(category.allocated.replace(/[$,]/g, ''))
    const spent = parseFloat(category.spent.replace(/[$,]/g, ''))
    const percentage = allocated > 0 ? (spent / allocated) * 100 : 0
    const isOverBudget = percentage > 100
    const remaining = allocated - spent

    return {
      percentage,
      isOverBudget,
      remaining,
      allocated,
      spent,
    }
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6 py-4">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Budgets</h1>
              <p className="text-sm text-muted-foreground">October 2024</p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <SegmentedControl
              options={[
                { label: "Week", value: "week" },
                { label: "Month", value: "month" },
                { label: "Quarter", value: "quarter" },
              ]}
              value={view}
              onValueChange={setView}
              size="sm"
            />
            <div className="rounded-md bg-muted/50 px-3 py-2 text-xs tabular-nums">
              <span className="text-muted-foreground mr-2">Remaining</span>
              <span className="font-semibold text-success">$325</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        {/* Budget Summary */}
        <Card className="mb-6 p-6">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-3xl font-semibold text-foreground">$4,250</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Spent</p>
              <p className="text-lg font-semibold text-foreground">$3,925</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="text-lg font-semibold text-success">$325</p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: "92%" }} />
          </div>
        </Card>

        {/* Automation Panel */}
        <Card className="mb-6 border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Automations</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Paycheck Allocation</p>
                <p className="text-xs text-muted-foreground">Auto-distribute income to envelopes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Dynamic Rebalancing</p>
                <p className="text-xs text-muted-foreground">Adjust budgets based on spending</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Round-ups to Goals</p>
                <p className="text-xs text-muted-foreground">Save spare change automatically</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Essentials */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Essentials</h2>
          <div className="space-y-3">
            {budgetCategories.essentials.map((category) => {
              const { percentage, isOverBudget, remaining } = calculateBudgetData(category)

              return (
                <Card key={category.name} className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${category.color}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {category.spent} of {category.allocated}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${isOverBudget ? "bg-destructive" : category.color}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={isOverBudget ? "text-destructive" : "text-success"}>
                      {isOverBudget ? `Over by $${Math.abs(remaining).toFixed(2)}` : `$${remaining.toFixed(2)} left`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Rollover</span>
                      <Switch checked={category.rollover} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Lifestyle</h2>
          <div className="space-y-3">
            {budgetCategories.lifestyle.map((category) => {
              const { percentage, isOverBudget, remaining } = calculateBudgetData(category)

              return (
                <Card key={category.name} className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${category.color}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {category.spent} of {category.allocated}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${isOverBudget ? "bg-destructive" : category.color}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={isOverBudget ? "text-destructive" : "text-success"}>
                      {isOverBudget ? `Over by $${Math.abs(remaining).toFixed(2)}` : `$${remaining.toFixed(2)} left`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Rollover</span>
                      <Switch checked={category.rollover} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Goals */}
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Goals</h2>
          <div className="space-y-3">
            {budgetCategories.goals.map((category) => {
              const { percentage } = calculateBudgetData(category)

              return (
                <Card key={category.name} className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${category.color}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {category.spent} of {category.allocated}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full transition-all ${category.color}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-success">On track</span>
                    <span className="text-muted-foreground">{percentage.toFixed(1)}% complete</span>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <BottomNav />
      <FABButton />
    </div>
  )
})

BudgetsPage.displayName = 'BudgetsPage'

export default BudgetsPage
