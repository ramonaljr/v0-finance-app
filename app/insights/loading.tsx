export default function Loading() {
  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="h-6 w-40 mb-4 rounded bg-muted animate-pulse" />
      <div className="space-y-3">
        <div className="h-24 rounded bg-muted animate-pulse" />
        <div className="h-24 rounded bg-muted animate-pulse" />
      </div>
    </div>
  )
}

