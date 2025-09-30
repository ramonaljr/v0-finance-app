import { BottomNav } from "@/components/bottom-nav"
import { FABButton } from "@/components/fab-button"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Download, Calendar } from "lucide-react"

export default function InsightsPage() {
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
            <p className="text-2xl font-semibold text-success">32.5%</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+5.2%</span>
            </div>
          </Card>
          <Card className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Net Worth</p>
            <p className="text-2xl font-semibold text-foreground">$48.2K</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+12.8%</span>
            </div>
          </Card>
        </div>

        {/* Income vs Expenses Chart */}
        <Card className="mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Income vs Expenses</h2>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              This Year
            </Button>
          </div>

          {/* Stacked Bar Chart Placeholder */}
          <div className="space-y-3">
            {[
              { month: "Jan", income: 5000, expenses: 3200 },
              { month: "Feb", income: 5000, expenses: 3500 },
              { month: "Mar", income: 5200, expenses: 3100 },
              { month: "Apr", income: 5000, expenses: 3800 },
              { month: "May", income: 5500, expenses: 3400 },
              { month: "Jun", income: 5000, expenses: 3600 },
            ].map((data) => {
              const maxValue = 6000
              const incomeWidth = (data.income / maxValue) * 100
              const expenseWidth = (data.expenses / maxValue) * 100

              return (
                <div key={data.month} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{data.month}</span>
                    <div className="flex gap-4">
                      <span className="text-success">${data.income}</span>
                      <span className="text-destructive">${data.expenses}</span>
                    </div>
                  </div>
                  <div className="flex h-8 gap-1 overflow-hidden rounded-md">
                    <div className="bg-success/20" style={{ width: `${incomeWidth}%` }} />
                    <div className="bg-destructive/20" style={{ width: `${expenseWidth}%` }} />
                  </div>
                </div>
              )
            })}
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
                <p className="text-2xl font-semibold text-foreground">$3,925</p>
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
                  <span className="text-sm font-medium text-foreground">${category.amount}</span>
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
