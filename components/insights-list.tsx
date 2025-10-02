'use client'

import { useInsights } from "@/lib/hooks/use-api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Info, AlertTriangle } from "lucide-react"

export function InsightsList() {
  const { data, loading, error } = useInsights()

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">AI Insights</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">AI Insights</h2>
        <p className="text-sm text-muted-foreground">Failed to load insights: {error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Card>
    )
  }

  const insights = data?.items || []

  if (insights.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">AI Insights</h2>
        <p className="text-sm text-muted-foreground">No insights available yet. Add some transactions to get started!</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={async () => {
            await fetch('/api/ai/insights/run', { method: 'POST' })
            window.location.reload()
          }}
        >
          Generate Insights
        </Button>
      </Card>
    )
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'success':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning':
        return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950'
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
        <Badge variant="secondary" className="text-xs">
          {insights.length} insights
        </Badge>
      </div>

      <div className="space-y-3">
        {insights.map((insight: any) => (
          <div 
            key={insight.id} 
            className={`rounded-lg border p-4 ${getSeverityColor(insight.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getSeverityIcon(insight.severity)}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground mb-1">
                  {insight.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {insight.body}
                </p>
                {insight.source_span && (
                  <p className="text-xs text-muted-foreground">
                    Based on: {JSON.stringify(insight.source_span)}
                  </p>
                )}
              </div>
              <Badge 
                variant="outline" 
                className="text-xs"
              >
                {insight.severity}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
