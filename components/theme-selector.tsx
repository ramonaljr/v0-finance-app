"use client"

import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className="group relative overflow-hidden rounded-xl border-2 transition-all hover:scale-105"
            style={{
              borderColor: currentTheme.id === theme.id ? theme.primary : "#e5e7eb",
            }}
          >
            <div className={`h-24 bg-gradient-to-br ${theme.gradient} p-4`}>
              {currentTheme.id === theme.id && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg">
                  <Check className="h-4 w-4" style={{ color: theme.primary }} />
                </div>
              )}
            </div>
            <div className="bg-white p-3">
              <p className="text-sm font-semibold text-gray-900">{theme.name}</p>
              <div className="mt-2 flex gap-1">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.secondary }} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <Card className="border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          Selected theme: <span className="font-semibold">{currentTheme.name}</span>
        </p>
        <p className="mt-2 text-xs text-gray-600">
          Theme is automatically applied across the entire app. Changes are saved to your preferences.
        </p>
      </Card>
    </div>
  )
}
