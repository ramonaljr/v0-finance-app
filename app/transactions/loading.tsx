export default function Loading() {
  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="h-6 w-48 mb-4 rounded bg-muted animate-pulse" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-14 rounded bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  )
}

