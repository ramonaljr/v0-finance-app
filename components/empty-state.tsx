import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center bg-white rounded-2xl shadow-md">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
        <Icon className="h-10 w-10 text-gray-400" strokeWidth={2} />
      </div>

      <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mb-6 text-sm text-gray-600 max-w-sm mx-auto">{description}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          {actionLabel}
        </Button>

        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="outline">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}
