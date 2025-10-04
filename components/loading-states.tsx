import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function HomeLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <div className="mx-auto max-w-lg">
        {/* Header Skeleton */}
        <div className="border-b bg-white px-6 pb-6 pt-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>

          {/* Balance Card Skeleton */}
          <Card className="p-6 rounded-2xl">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-12 w-48 mb-4" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="px-6 py-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-16" />
              </Card>
            ))}
          </div>
        </div>

        {/* Accounts Skeleton */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-5">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i} className="p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TransactionsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Header */}
      <header className="border-b bg-white px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-5 rounded-2xl">
                <Skeleton className="h-12 w-12 rounded-xl mb-2" />
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-6 w-12 mb-1" />
                <Skeleton className="h-3 w-20" />
              </Card>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-9 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>

        {/* Calendar */}
        <Skeleton className="h-64 w-full rounded-2xl mb-6" />

        {/* Transaction List */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5 rounded-2xl">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export function BudgetLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Header */}
      <header className="border-b bg-white px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>

          {/* Month Selector */}
          <div className="mb-6">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Budget Overview */}
          <Card className="p-6 rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
            <Skeleton className="h-3 w-full mb-3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>

        {/* AI Insight */}
        <Card className="p-4 rounded-2xl mb-6">
          <div className="flex items-start gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>
        </Card>

        {/* Budget Categories */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-2.5 w-full mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export function AccountsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Header */}
      <header className="border-b bg-white px-6 pb-6 pt-8 shadow-sm">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>

          {/* Net Worth Card */}
          <Card className="p-6 rounded-2xl">
            <div className="mb-5 flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 rounded-xl">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-24" />
              </Card>
              <Card className="p-4 rounded-xl">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </Card>
            </div>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>

        {/* Account List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-20 rounded-xl" />
          </div>

          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <Skeleton className="h-9 flex-1 rounded-lg" />
                <Skeleton className="h-9 flex-1 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
