"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronRight, Sparkles } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type CategoryFilter = "all" | "vibrant" | "professional" | "nature"

export function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all")
  const [open, setOpen] = useState(false)

  const filteredThemes = themes.filter((theme) => {
    if (selectedCategory === "all") return true
    return theme.category === selectedCategory
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 transition-all hover:scale-105">
          <div className="flex gap-1">
            <div
              className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: currentTheme.primary }}
            />
            <div
              className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: currentTheme.secondary }}
            />
          </div>
          <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose Theme</DialogTitle>
          <DialogDescription>Select a color theme for your app</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Themes
            </button>
            <button
              onClick={() => setSelectedCategory("vibrant")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === "vibrant"
                  ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Vibrant
            </button>
            <button
              onClick={() => setSelectedCategory("professional")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === "professional"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Professional
            </button>
            <button
              onClick={() => setSelectedCategory("nature")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === "nature"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Nature
            </button>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id)
                  setOpen(false)
                }}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                  currentTheme.id === theme.id ? "ring-2 ring-offset-2" : ""
                }`}
                style={{
                  borderColor: currentTheme.id === theme.id ? theme.primary : "#e5e7eb",
                  ...(currentTheme.id === theme.id && { "--tw-ring-color": theme.primary } as any),
                }}
              >
                {/* Gradient Preview */}
                <div className={`relative h-20 bg-gradient-to-br ${theme.gradient} p-3 overflow-hidden`}>
                  <div
                    className="absolute -top-6 -left-6 h-16 w-16 rounded-full blur-xl opacity-40"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full blur-xl opacity-40"
                    style={{ backgroundColor: theme.secondary }}
                  />

                  {theme.isPopular && (
                    <Badge className="absolute top-2 right-2 gap-1 border-0 bg-white/90 text-gray-900 shadow-lg backdrop-blur-sm text-xs py-0 h-5">
                      <Sparkles className="h-2.5 w-2.5" />
                      Popular
                    </Badge>
                  )}

                  {currentTheme.id === theme.id && (
                    <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-lg">
                      <Check className="h-3 w-3" style={{ color: theme.primary }} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="bg-white p-2.5">
                  <p className="text-xs font-semibold text-gray-900 mb-1.5">{theme.name}</p>
                  <div className="flex gap-1">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div
                      className={`h-3 w-3 rounded-full bg-gradient-to-br ${theme.gradient}`}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
