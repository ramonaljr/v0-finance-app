export const categoryColors = {
  "Food & Drink": {
    bg: "bg-emerald-50",
    chartColor: "#10b981",
    gradient: "from-emerald-500 to-teal-500",
    barColor: "#10b981",
    textColor: "#047857", // emerald-700
  },
  Groceries: {
    bg: "bg-emerald-50",
    chartColor: "#10b981",
    gradient: "from-emerald-500 to-teal-500",
    barColor: "#10b981",
    textColor: "#047857",
  },
  Dining: {
    bg: "bg-orange-50",
    chartColor: "#f97316",
    gradient: "from-orange-500 to-red-500",
    barColor: "#f97316",
    textColor: "#c2410c", // orange-700
  },
  "Dining Out": {
    bg: "bg-orange-50",
    chartColor: "#f97316",
    gradient: "from-orange-500 to-red-500",
    barColor: "#f97316",
    textColor: "#c2410c",
  },
  Transport: {
    bg: "bg-blue-50",
    chartColor: "#3b82f6",
    gradient: "from-blue-500 to-cyan-500",
    barColor: "#3b82f6",
    textColor: "#1d4ed8", // blue-700
  },
  Transportation: {
    bg: "bg-blue-50",
    chartColor: "#3b82f6",
    gradient: "from-blue-500 to-cyan-500",
    barColor: "#3b82f6",
    textColor: "#1d4ed8",
  },
  Shopping: {
    bg: "bg-pink-50",
    chartColor: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
    barColor: "#ec4899",
    textColor: "#be185d", // pink-700
  },
  Utilities: {
    bg: "bg-amber-50",
    chartColor: "#f59e0b",
    gradient: "from-amber-500 to-yellow-500",
    barColor: "#f59e0b",
    textColor: "#b45309", // amber-700
  },
  Entertainment: {
    bg: "bg-purple-50",
    chartColor: "#a855f7",
    gradient: "from-purple-500 to-indigo-500",
    barColor: "#a855f7",
    textColor: "#7e22ce", // purple-700
  },
  "Health Care": {
    bg: "bg-cyan-50",
    chartColor: "#06b6d4",
    gradient: "from-cyan-500 to-teal-500",
    barColor: "#06b6d4",
    textColor: "#0e7490", // cyan-700
  },
  "Health & Fitness": {
    bg: "bg-cyan-50",
    chartColor: "#06b6d4",
    gradient: "from-cyan-500 to-teal-500",
    barColor: "#06b6d4",
    textColor: "#0e7490",
  },
  Housing: {
    bg: "bg-red-50",
    chartColor: "#ef4444",
    gradient: "from-red-500 to-rose-500",
    barColor: "#ef4444",
    textColor: "#b91c1c", // red-700
  },
  Personal: {
    bg: "bg-indigo-50",
    chartColor: "#6366f1",
    gradient: "from-indigo-500 to-purple-500",
    barColor: "#6366f1",
    textColor: "#4338ca", // indigo-700
  },
  Other: {
    bg: "bg-gray-50",
    chartColor: "#6b7280",
    gradient: "from-gray-500 to-slate-500",
    barColor: "#6b7280",
    textColor: "#374151", // gray-700
  },
} as const

export type CategoryName = keyof typeof categoryColors

export function getCategoryColor(category: string) {
  return categoryColors[category as CategoryName] || categoryColors.Other
}
