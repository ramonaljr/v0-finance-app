"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, ChevronRight, TrendingUp, Target, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface AIInsightAction {
  type: 'adjust_budget' | 'view_transactions' | 'create_goal' | 'view_details'
  label: string
  params?: Record<string, any>
}

interface AIInsight {
  message: string
  severity?: 'info' | 'warning' | 'success'
  actions?: AIInsightAction[]
}

interface AIInsightCardProps {
  context: {
    budgets?: any[]
    transactions?: any[]
    accounts?: any[]
    type?: 'budget' | 'spending' | 'recurring' | 'general'
  }
  className?: string
}

export function AIInsightCard({ context, className }: AIInsightCardProps) {
  const router = useRouter()
  const [insight, setInsight] = useState<AIInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchInsight()
  }, [context.type])

  const fetchInsight = async () => {
    try {
      setLoading(true)
      setError(false)

      // Check cache first (24 hour TTL)
      const cacheKey = `ai_insight_${context.type || 'general'}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { insight: cachedInsight, timestamp } = JSON.parse(cached)
        const age = Date.now() - timestamp
        if (age < 24 * 60 * 60 * 1000) { // 24 hours
          setInsight(cachedInsight)
          setLoading(false)
          return
        }
      }

      const response = await fetch('/api/ai/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            type: context.type || 'general',
            budgets: context.budgets,
            transactions: context.transactions,
            accounts: context.accounts
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setInsight(data.insight)

        // Cache the insight
        localStorage.setItem(cacheKey, JSON.stringify({
          insight: data.insight,
          timestamp: Date.now()
        }))
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('Failed to fetch AI insight:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action: AIInsightAction) => {
    switch (action.type) {
      case 'adjust_budget':
        router.push('/budget')
        break
      case 'view_transactions':
        router.push('/transactions')
        break
      case 'create_goal':
        // Future: Open goal creation modal
        router.push('/budget')
        break
      case 'view_details':
        // Custom action handler
        if (action.params?.url) {
          router.push(action.params.url)
        }
        break
    }
  }

  if (loading) {
    return (
      <Card className={`p-4 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Loader2 className="h-6 w-6 text-white animate-spin" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </Card>
    )
  }

  if (error || !insight) {
    return null // Silently fail - don't show broken insights
  }

  const severityColors = {
    info: 'from-blue-500 to-indigo-600',
    warning: 'from-amber-500 to-orange-600',
    success: 'from-emerald-500 to-green-600'
  }

  const bgColors = {
    info: 'from-blue-50/50 to-indigo-50/50',
    warning: 'from-amber-50/50 to-orange-50/50',
    success: 'from-emerald-50/50 to-green-50/50'
  }

  const severity = insight.severity || 'info'

  return (
    <Card className={`p-4 border-indigo-200 bg-gradient-to-br ${bgColors[severity]} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${severityColors[severity]} shadow-lg border-2 border-white`}>
          <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">AI Insight</p>
            <Badge className="border-0 bg-indigo-100 text-indigo-700 text-xs">
              AI
            </Badge>
          </div>
          <p className="text-sm leading-relaxed text-gray-700 mb-3">
            {insight.message}
          </p>

          {insight.actions && insight.actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {insight.actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 border-indigo-300 hover:bg-indigo-50 text-xs"
                  onClick={() => handleAction(action)}
                >
                  {action.type === 'adjust_budget' && <Target className="h-3 w-3" />}
                  {action.type === 'view_transactions' && <Eye className="h-3 w-3" />}
                  {action.type === 'create_goal' && <TrendingUp className="h-3 w-3" />}
                  {action.type === 'view_details' && <ChevronRight className="h-3 w-3" />}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
