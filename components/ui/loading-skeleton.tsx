import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Generic skeleton for cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </Card>
  )
}

// Loading skeleton for transactions list
export function TransactionsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Card key={idx} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        </Card>
      ))}
    </div>
  )
}

// Loading skeleton for budget categories
export function BudgetsLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Card key={idx} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-5 w-5" />
          </div>
          <Skeleton className="h-2 w-full mb-2" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </Card>
      ))}
    </div>
  )
}

// Loading skeleton for stats cards
export function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-12" />
      </Card>
      <Card className="p-4">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-12" />
      </Card>
    </div>
  )
}

// Loading skeleton for charts
export function ChartLoadingSkeleton() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </Card>
  )
}

// Loading skeleton for calendar grid
export function CalendarLoadingSkeleton() {
  return (
    <div className="bg-card px-6 py-4">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8" />
      </div>
      <div className="mb-4 grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, idx) => (
          <Skeleton key={idx} className="h-4 w-8" />
        ))}
        {Array.from({ length: 31 }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center rounded-lg p-2">
            <Skeleton className="h-4 w-4 mb-1" />
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

// Main loading skeleton that adapts based on page type
export function PageLoadingSkeleton({ type }: { type?: 'transactions' | 'budgets' | 'insights' | 'stats' }) {
  switch (type) {
    case 'transactions':
      return (
        <div className="mx-auto max-w-lg p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <TransactionsLoadingSkeleton />
        </div>
      )
    case 'budgets':
      return (
        <div className="mx-auto max-w-lg p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <BudgetsLoadingSkeleton />
        </div>
      )
    case 'insights':
      return (
        <div className="mx-auto max-w-lg p-6 space-y-6">
          <StatsLoadingSkeleton />
          <ChartLoadingSkeleton />
          <ChartLoadingSkeleton />
        </div>
      )
    default:
      return (
        <div className="mx-auto max-w-lg p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-20 w-full rounded" />
            ))}
          </div>
        </div>
      )
  }
}
