export default function Loading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="h-6 w-32 rounded bg-muted animate-pulse" />
              <div className="mt-2 h-4 w-20 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-8 w-20 rounded bg-muted animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded bg-muted animate-pulse" />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-9 flex-1 rounded bg-muted animate-pulse" />
            <div className="h-9 w-9 rounded bg-muted animate-pulse" />
            <div className="h-9 w-9 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-6 py-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded bg-muted animate-pulse" />
        ))}
      </main>
    </div>
  )
}
