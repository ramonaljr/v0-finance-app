import {
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Utensils,
  ShoppingCart,
  Heart,
  Zap,
  Smartphone,
  Plane,
  Gift,
  DollarSign
} from "lucide-react"

export const categoryIcons = {
  "Food & Drink": {
    icon: Coffee,
    color: "bg-orange-100 text-orange-600",
    gradient: "from-orange-400 to-orange-600",
    glowColor: "shadow-orange-500/30",
    bgGradient: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"
  },
  "Groceries": {
    icon: ShoppingCart,
    color: "bg-emerald-100 text-emerald-600",
    gradient: "from-emerald-400 to-emerald-600",
    glowColor: "shadow-emerald-500/30",
    bgGradient: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600"
  },
  "Shopping": {
    icon: ShoppingBag,
    color: "bg-pink-100 text-pink-600",
    gradient: "from-pink-400 to-pink-600",
    glowColor: "shadow-pink-500/30",
    bgGradient: "bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600"
  },
  "Transportation": {
    icon: Car,
    color: "bg-blue-100 text-blue-600",
    gradient: "from-blue-400 to-blue-600",
    glowColor: "shadow-blue-500/30",
    bgGradient: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
  },
  "Housing": {
    icon: Home,
    color: "bg-amber-100 text-amber-600",
    gradient: "from-amber-400 to-amber-600",
    glowColor: "shadow-amber-500/30",
    bgGradient: "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600"
  },
  "Health Care": {
    icon: Heart,
    color: "bg-teal-100 text-teal-600",
    gradient: "from-teal-400 to-teal-600",
    glowColor: "shadow-teal-500/30",
    bgGradient: "bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600"
  },
  "Utilities": {
    icon: Zap,
    color: "bg-yellow-100 text-yellow-600",
    gradient: "from-yellow-400 to-yellow-600",
    glowColor: "shadow-yellow-500/30",
    bgGradient: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"
  },
  "Entertainment": {
    icon: Smartphone,
    color: "bg-purple-100 text-purple-600",
    gradient: "from-purple-400 to-purple-600",
    glowColor: "shadow-purple-500/30",
    bgGradient: "bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600"
  },
  "Travel": {
    icon: Plane,
    color: "bg-indigo-100 text-indigo-600",
    gradient: "from-indigo-400 to-indigo-600",
    glowColor: "shadow-indigo-500/30",
    bgGradient: "bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600"
  },
  "Gifts": {
    icon: Gift,
    color: "bg-rose-100 text-rose-600",
    gradient: "from-rose-400 to-rose-600",
    glowColor: "shadow-rose-500/30",
    bgGradient: "bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600"
  },
  "Income": {
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
    gradient: "from-green-400 to-green-600",
    glowColor: "shadow-green-500/30",
    bgGradient: "bg-gradient-to-br from-green-400 via-green-500 to-green-600"
  },
  "Dining": {
    icon: Utensils,
    color: "bg-orange-100 text-orange-600",
    gradient: "from-orange-400 to-orange-600",
    glowColor: "shadow-orange-500/30",
    bgGradient: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"
  },
  "Other": {
    icon: DollarSign,
    color: "bg-gray-100 text-gray-600",
    gradient: "from-gray-400 to-gray-600",
    glowColor: "shadow-gray-500/30",
    bgGradient: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600"
  },
}

export function getCategoryIcon(categoryName: string) {
  return categoryIcons[categoryName as keyof typeof categoryIcons] || categoryIcons.Other
}
