"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Palette, Sparkles } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useState } from "react"

type CategoryFilter = "all" | "vibrant" | "professional" | "nature"

export function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all")

  const filteredThemes = themes.filter((theme) => {
    if (selectedCategory === "all") return true
    return theme.category === selectedCategory
  })

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Themes
        </button>
        <button
          onClick={() => setSelectedCategory("vibrant")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            selectedCategory === "vibrant"
              ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/30"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Vibrant
        </button>
        <button
          onClick={() => setSelectedCategory("professional")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            selectedCategory === "professional"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Professional
        </button>
        <button
          onClick={() => setSelectedCategory("nature")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            selectedCategory === "nature"
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Nature
        </button>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
        {filteredThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-xl ${
              currentTheme.id === theme.id ? "ring-2 ring-offset-2" : ""
            }`}
            style={{
              borderColor: currentTheme.id === theme.id ? theme.primary : "#e5e7eb",
              ...(currentTheme.id === theme.id && { "--tw-ring-color": theme.primary } as any),
            }}
          >
            {/* Gradient Preview with Animated Background */}
            <div className={`relative h-28 bg-gradient-to-br ${theme.gradient} p-4 overflow-hidden`}>
              {/* Animated blur circles */}
              <div
                className="absolute -top-8 -left-8 h-24 w-24 rounded-full blur-2xl opacity-40 animate-pulse"
                style={{ backgroundColor: theme.primary }}
              />
              <div
                className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-40 animate-pulse"
                style={{ backgroundColor: theme.secondary, animationDelay: "1s" }}
              />

              {/* Popular Badge */}
              {theme.isPopular && (
                <Badge className="absolute top-3 right-3 gap-1 border-0 bg-white/90 text-gray-900 shadow-lg backdrop-blur-sm">
                  <Sparkles className="h-3 w-3" />
                  Popular
                </Badge>
              )}

              {/* Selected Checkmark */}
              {currentTheme.id === theme.id && (
                <div className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-xl">
                  <Check className="h-4 w-4" style={{ color: theme.primary }} strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Theme Info */}
            <div className="bg-white p-3">
              <p className="text-sm font-semibold text-gray-900 mb-2">{theme.name}</p>
              {/* Color Swatches */}
              <div className="flex gap-1.5">
                <div
                  className="h-4 w-4 rounded-full transition-transform hover:scale-125"
                  style={{ backgroundColor: theme.primary }}
                  title="Primary"
                />
                <div
                  className="h-4 w-4 rounded-full transition-transform hover:scale-125"
                  style={{ backgroundColor: theme.secondary }}
                  title="Secondary"
                />
                <div
                  className={`h-4 w-4 rounded-full bg-gradient-to-br ${theme.gradient} transition-transform hover:scale-125`}
                  title="Gradient"
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Current Theme Info Card */}
      <Card className="border-2 bg-gradient-to-br from-gray-50 to-white p-4 shadow-md" style={{ borderColor: currentTheme.primary }}>
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${currentTheme.gradient} shadow-lg`}
          >
            <Palette className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Current Theme</p>
            <p className="text-lg font-bold" style={{ color: currentTheme.primary }}>
              {currentTheme.name}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: currentTheme.primary }} />
                <span className="font-mono">{currentTheme.primary}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: currentTheme.secondary }} />
                <span className="font-mono">{currentTheme.secondary}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pro Tip Card */}
      <Card className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 flex-shrink-0 text-amber-600" strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold text-gray-900">Pro Tip</p>
            <p className="mt-1 text-xs text-gray-700 leading-relaxed">
              Your theme is automatically applied across the entire app and synced with your account. Try different
              categories to find your perfect color scheme.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
