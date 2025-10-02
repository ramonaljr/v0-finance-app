import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Plus, TrendingUp, Sparkles, Target, ArrowRight, Zap, Brain, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

const AICoachFAB = dynamic(() => import("@/components/ai-coach-fab").then(m => m.AICoachFAB), { ssr: false })

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-20 modern-soft:bg-background">
      <main className="mx-auto max-w-lg">
        <div className="border-b bg-card px-6 pb-6 pt-8 modern-soft:bg-surface modern-soft:border-border/50 modern-soft:shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarFallback className="bg-muted text-foreground font-semibold">JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <h1 className="text-xl font-semibold text-foreground">John Doe</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggleButton />
              <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-muted">
                <Eye className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/30 p-6 modern-soft:rounded-card modern-soft:bg-surface-alt modern-soft:border-border/50 modern-soft:shadow-sm">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Total Net Worth</p>
            <p className="mb-4 text-4xl font-bold tracking-tight text-foreground tabular-nums">$2,382,919.69</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Assets: $2.5M</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Liabilities: $117K</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
            </div>
            <Badge variant="secondary" className="gap-1.5 bg-muted text-muted-foreground border">
              <Sparkles className="h-3 w-3" />
              <span className="text-xs font-medium">AI Powered</span>
            </Badge>
          </div>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-warning p-4 hover:shadow-sm transition-shadow cursor-pointer modern-soft:rounded-card modern-soft:shadow-sm modern-soft:card-hover">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10 modern-soft:rounded-sm modern-soft:bg-warning-soft">
                  <Zap className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Spending Alert</p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground leading-relaxed">
                    You've spent 15% more on dining out this month compared to your average.
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-warning/30 text-warning bg-warning/5">
                      Save $120/month
                    </Badge>
                    <span className="text-xs text-muted-foreground">• Meal prep recommended</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-success p-4 hover:shadow-sm transition-shadow cursor-pointer modern-soft:rounded-card modern-soft:shadow-sm modern-soft:card-hover">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10 modern-soft:rounded-sm modern-soft:bg-success-soft">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Investment Opportunity</p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground leading-relaxed">
                    Your portfolio is performing well. Consider increasing your monthly contribution by $200.
                  </p>
                  <Badge variant="outline" className="text-xs border-success/30 text-success bg-success/5">
                    +$24K potential gain/year
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-primary p-4 hover:shadow-sm transition-shadow cursor-pointer modern-soft:rounded-card modern-soft:shadow-sm modern-soft:card-hover">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 modern-soft:rounded-sm modern-soft:bg-primary-soft">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Goal Progress</p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground leading-relaxed">
                    You're on track to reach your Emergency Fund goal 2 months early!
                  </p>
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
                    75% complete
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          <Button variant="outline" className="mt-4 w-full gap-2 border-dashed bg-transparent">
            <Sparkles className="h-4 w-4" />
            Get More AI Insights
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </div>

        <div className="px-6 pb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Savings Goals</h2>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary hover:bg-primary/10">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </div>
          <div className="space-y-3">
            <Card className="p-4 hover:shadow-sm transition-shadow">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Emergency Fund</p>
                    <p className="text-xs text-muted-foreground">2 months ahead of schedule</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary">75%</p>
              </div>
              <Progress value={75} className="mb-2 h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">$7,500 of $10,000</span>
                <span className="font-medium text-foreground">$2,500 to go</span>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-sm transition-shadow">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <Target className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Vacation Fund</p>
                    <p className="text-xs text-muted-foreground">On track for June 2025</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-success">40%</p>
              </div>
              <Progress value={40} className="mb-2 h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">$2,000 of $5,000</span>
                <span className="font-medium text-foreground">$3,000 to go</span>
              </div>
            </Card>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Accounts</h2>
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary hover:bg-primary/10">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              <Card className="p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-sm font-bold text-primary">HS</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">HSBC Checking</p>
                      <p className="text-xs text-muted-foreground">****1234</p>
                    </div>
                  </div>
                  <p className="text-base font-bold text-foreground">$45,280.50</p>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20">
                      <span className="text-sm font-bold text-destructive">HS</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">HSBC Credit</p>
                      <p className="text-xs text-muted-foreground">****5678 • Due Oct 15</p>
                    </div>
                  </div>
                  <p className="text-base font-bold text-destructive">-$2,450.00</p>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10 border border-success/20">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Investment Portfolio</p>
                      <p className="text-xs text-success">+12.5% this year</p>
                    </div>
                  </div>
                  <p className="text-base font-bold text-foreground">$310,000</p>
                </div>
              </Card>
            </div>

            <Button variant="outline" className="mt-4 w-full bg-transparent" asChild>
              <a href="/account">
                View All Accounts
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
      <AICoachFAB />
    </div>
  )
}
