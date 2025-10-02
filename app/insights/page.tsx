import { BottomNav } from "@/components/bottom-nav"
import { FABButton } from "@/components/fab-button"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Download, Calendar } from "lucide-react"
import { useFormattedKPICache } from "@/lib/hooks/use-api"
import { StatsLoadingSkeleton, ChartLoadingSkeleton } from "@/components/ui/loading-skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const dynamic = 'force-dynamic'

const InsightsPage = () => {
  const { data: kpiData, isLoading, error } = useFormattedKPICache()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <StatsLoadingSkeleton />
        <div className="mx-auto max-w-lg px-6 py-6">
          <ChartLoadingSkeleton />
          <ChartLoadingSkeleton />
        </div>
        <BottomNav />
        <FABButton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="mx-auto max-w-lg px-6 py-6">
          <Alert>
            <AlertDescription>
              Failed to load insights data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
        <BottomNav />
        <FABButton />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
              <p className="text-sm text-muted-foreground">October 2024</p>
            </div>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        {/* Key Metrics */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Savings Rate</p>
            <p className="text-2xl font-semibold text-success">
              {kpiData?.income && kpiData?.expense && typeof kpiData.income === 'string' && typeof kpiData.expense === 'string'
                ? (() => {
                    const incomeVal = parseFloat(kpiData.income.replace(/[$,]/g, '')) || 0
                    const expenseVal = parseFloat(kpiData.expense.replace(/[$,]/g, '')) || 0
                    return incomeVal > 0 ? `${((1 - expenseVal / incomeVal) * 100).toFixed(1)}%` : '0.0%'
                  })()
                : '0.0%'
              }
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>This month</span>
            </div>
          </Card>
          <Card className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Net Income</p>
            <p className="text-2xl font-semibold text-foreground">
              {kpiData?.net || '$0.00'}
            </p>
            <div className={`mt-2 flex items-center gap-1 text-xs ${(() => {
              const netStr = String(kpiData?.net || '$0.00')
              const netVal = parseFloat(netStr.replace(/[$,]/g, '')) || 0
              return netVal >= 0 ? 'text-success' : 'text-destructive'
            })()}`}>
              <TrendingUp className={`h-3 w-3 ${(() => {
                const netStr = String(kpiData?.net || '$0.00')
                const netVal = parseFloat(netStr.replace(/[$,]/g, '')) || 0
                return netVal < 0 ? 'rotate-180' : ''
              })()}`} />
              <span>This month</span>
            </div>
          </Card>
        </div>

        {/* Income vs Expenses Chart */}
        <Card className="mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Income vs Expenses</h2>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              This Month
            </Button>
          </div>

          {/* Stacked Bar Chart with Real Data */}
          <div className="space-y-3">
            {kpiData?.income && kpiData?.expense ? (() => {
              // Ensure values are strings before calling replace
              const incomeStr = String(kpiData.income)
              const expenseStr = String(kpiData.expense)

              const incomeValue = parseFloat(incomeStr.replace(/[$,]/g, '')) || 0
              const expenseValue = parseFloat(expenseStr.replace(/[$,]/g, '')) || 0
              const total = incomeValue + expenseValue

              if (total === 0) {
                return (
                  <div className="p-8 text-center text-muted-foreground">
                    No data available
                  </div>
                )
              }

              return (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">This Month</span>
                    <div className="flex gap-4">
                      <span className="text-success">{kpiData.income}</span>
                      <span className="text-destructive">{kpiData.expense}</span>
                    </div>
                  </div>
                  <div className="flex h-8 gap-1 overflow-hidden rounded-md">
                    <div
                      className="bg-success/20"
                      style={{
                        width: `${(incomeValue / total) * 100}%`
                      }}
                    />
                    <div
                      className="bg-destructive/20"
                      style={{
                        width: `${(expenseValue / total) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )
            })() : (
              <div className="p-8 text-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-success/20" />
              <span className="text-muted-foreground">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-destructive/20" />
              <span className="text-muted-foreground">Expenses</span>
            </div>
          </div>
        </Card>

        {/* Spending by Category */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Spending by Category</h2>

          {/* Donut Chart Placeholder */}
          <div className="mb-6 flex items-center justify-center">
            <div className="relative h-48 w-48">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="oklch(var(--category-food))"
                  strokeWidth="20"
                  strokeDasharray="75.4 251.2"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="oklch(var(--category-transport))"
                  strokeWidth="20"
                  strokeDasharray="50.24 251.2"
                  strokeDashoffset="-75.4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="oklch(var(--category-shopping))"
                  strokeWidth="20"
                  strokeDasharray="62.8 251.2"
                  strokeDashoffset="-125.64"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="oklch(var(--category-health))"
                  strokeWidth="20"
                  strokeDasharray="37.68 251.2"
                  strokeDashoffset="-188.44"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="oklch(var(--muted))"
                  strokeWidth="20"
                  strokeDasharray="25.08 251.2"
                  strokeDashoffset="-226.12"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-semibold text-foreground">
                  {kpiData?.expense || '$0.00'}
                </p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            {[
              { name: "Food & Drink", amount: 840, percentage: 30, color: "bg-[oklch(var(--category-food))]" },
              { name: "Transport", amount: 560, percentage: 20, color: "bg-[oklch(var(--category-transport))]" },
              { name: "Shopping", amount: 700, percentage: 25, color: "bg-[oklch(var(--category-shopping))]" },
              { name: "Health", amount: 420, percentage: 15, color: "bg-[oklch(var(--category-health))]" },
              { name: "Other", amount: 280, percentage: 10, color: "bg-muted" },
            ].map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${category.color}`} />
                  <span className="text-sm text-foreground">{category.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">${category.amount.toFixed(2)}</span>
                  <span className="w-12 text-right text-sm text-muted-foreground">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Reports */}
        <Card className="mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">AI Reports</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { title: "Weekly Summary", date: "Oct 1-7, 2024", status: "Ready" },
              { title: "Monthly Report", date: "September 2024", status: "Ready" },
              { title: "Quarterly Review", date: "Q3 2024", status: "Generating..." },
            ].map((report) => (
              <div key={report.title} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{report.title}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <Button
                  variant={report.status === "Ready" ? "default" : "ghost"}
                  size="sm"
                  disabled={report.status !== "Ready"}
                >
                  {report.status === "Ready" ? "Download" : report.status}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Trends */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Trends</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Savings Improving</p>
                <p className="text-xs text-muted-foreground">You've saved 15% more this month compared to last month</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Shopping Increased</p>
                <p className="text-xs text-muted-foreground">Shopping expenses are 30% higher than your average</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Transport Optimized</p>
                <p className="text-xs text-muted-foreground">You're spending 20% less on transport this month</p>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
      <FABButton />
    </div>
  )
}

InsightsPage.displayName = 'InsightsPage'

export default InsightsPage
