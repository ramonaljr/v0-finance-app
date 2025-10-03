"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { isModernSoftTheme, toggleModernSoftTheme } from "@/lib/design-tokens"

type Theme = {
  id: string
  name: string
  primary: string
  secondary: string
  gradient: string
  category: "vibrant" | "professional" | "nature"
  isPopular?: boolean
}

const themes: Theme[] = [
  {
    id: "blue",
    name: "Ocean Blue",
    primary: "#3b82f6",
    secondary: "#0ea5e9",
    gradient: "from-blue-500 to-cyan-500",
    category: "professional"
  },
  {
    id: "purple",
    name: "Royal Purple",
    primary: "#a855f7",
    secondary: "#8b5cf6",
    gradient: "from-purple-500 to-indigo-500",
    category: "nature",
    isPopular: true
  },
  {
    id: "green",
    name: "Forest Green",
    primary: "#10b981",
    secondary: "#059669",
    gradient: "from-emerald-500 to-teal-500",
    category: "nature"
  },
  {
    id: "orange",
    name: "Sunset Orange",
    primary: "#f97316",
    secondary: "#ea580c",
    gradient: "from-orange-500 to-amber-500",
    category: "vibrant"
  },
  {
    id: "pink",
    name: "Cherry Pink",
    primary: "#ec4899",
    secondary: "#db2777",
    gradient: "from-pink-500 to-rose-500",
    category: "vibrant"
  },
  {
    id: "red",
    name: "Ruby Red",
    primary: "#ef4444",
    secondary: "#dc2626",
    gradient: "from-red-500 to-rose-500",
    category: "vibrant"
  },
  {
    id: "indigo",
    name: "Deep Indigo",
    primary: "#6366f1",
    secondary: "#4f46e5",
    gradient: "from-indigo-500 to-purple-500",
    category: "professional",
    isPopular: true
  },
  {
    id: "teal",
    name: "Ocean Teal",
    primary: "#14b8a6",
    secondary: "#0d9488",
    gradient: "from-teal-500 to-cyan-500",
    category: "professional"
  },
  {
    id: "violet",
    name: "Deep Violet",
    primary: "#7c3aed",
    secondary: "#6d28d9",
    gradient: "from-violet-500 to-purple-600",
    category: "nature"
  },
  {
    id: "lime",
    name: "Fresh Lime",
    primary: "#84cc16",
    secondary: "#65a30d",
    gradient: "from-lime-500 to-green-500",
    category: "nature"
  },
  {
    id: "amber",
    name: "Golden Amber",
    primary: "#f59e0b",
    secondary: "#d97706",
    gradient: "from-amber-500 to-orange-500",
    category: "vibrant"
  },
  {
    id: "cyan",
    name: "Bright Cyan",
    primary: "#06b6d4",
    secondary: "#0891b2",
    gradient: "from-cyan-500 to-blue-500",
    category: "professional"
  },
]

type ThemeContextType = {
  currentTheme: Theme
  setTheme: (themeId: string) => void
  themes: Theme[]
  modernSoftTheme: boolean
  toggleModernSoftTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])
  const [modernSoftTheme, setModernSoftTheme] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load legacy theme
    const savedThemeId = localStorage.getItem("app-theme")
    if (savedThemeId) {
      const theme = themes.find((t) => t.id === savedThemeId)
      if (theme) {
        setCurrentTheme(theme)
        applyTheme(theme)
      }
    }

    // Load modern-soft theme
    const savedModernSoft = localStorage.getItem("app-theme-modern-soft")
    const isModernSoft = savedModernSoft === "true" || isModernSoftTheme()
    setModernSoftTheme(isModernSoft)

    if (isModernSoft) {
      document.documentElement.classList.add("modern-soft")
    } else {
      document.documentElement.classList.remove("modern-soft")
    }

    // Ensure dark mode is never applied
    document.documentElement.classList.remove("dark")
  }, [])

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement

    root.style.setProperty("--primary", hexToOklch(theme.primary))
    root.style.setProperty("--ring", hexToOklch(theme.primary))
    root.style.setProperty("--chart-1", hexToOklch(theme.primary))

    root.style.setProperty("--chart-3", hexToOklch(theme.secondary))
  }

  const setTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      applyTheme(theme)
      localStorage.setItem("app-theme", themeId)
    }
  }

  const toggleModernSoftThemeHandler = () => {
    const newModernSoft = !modernSoftTheme
    console.log("[v0] Toggling modern-soft theme to:", newModernSoft)
    setModernSoftTheme(newModernSoft)
    toggleModernSoftTheme(newModernSoft)
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themes,
        modernSoftTheme,
        toggleModernSoftTheme: toggleModernSoftThemeHandler,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

function hexToOklch(hex: string): string {
  hex = hex.replace("#", "")

  const r = Number.parseInt(hex.substring(0, 2), 16) / 255
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255

  const lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 2
  const chroma = Math.max(r, g, b) - Math.min(r, g, b)

  let hue = 0
  if (chroma !== 0) {
    const max = Math.max(r, g, b)
    if (max === r) {
      hue = ((g - b) / chroma) % 6
    } else if (max === g) {
      hue = (b - r) / chroma + 2
    } else {
      hue = (r - g) / chroma + 4
    }
    hue = hue * 60
    if (hue < 0) hue += 360
  }

  return `oklch(${(lightness * 0.8 + 0.1).toFixed(2)} ${(chroma * 0.2).toFixed(2)} ${hue.toFixed(0)})`
}
