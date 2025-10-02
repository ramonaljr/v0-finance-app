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
  "Food & Drink": { icon: Coffee, color: "bg-orange-100 text-orange-600", gradient: "from-orange-400 to-orange-600" },
  "Groceries": { icon: ShoppingCart, color: "bg-green-100 text-green-600", gradient: "from-green-400 to-green-600" },
  "Shopping": { icon: ShoppingBag, color: "bg-pink-100 text-pink-600", gradient: "from-pink-400 to-pink-600" },
  "Transportation": { icon: Car, color: "bg-blue-100 text-blue-600", gradient: "from-blue-400 to-blue-600" },
  "Housing": { icon: Home, color: "bg-yellow-100 text-yellow-600", gradient: "from-yellow-400 to-yellow-600" },
  "Health Care": { icon: Heart, color: "bg-teal-100 text-teal-600", gradient: "from-teal-400 to-teal-600" },
  "Utilities": { icon: Zap, color: "bg-orange-100 text-orange-600", gradient: "from-orange-400 to-orange-600" },
  "Entertainment": { icon: Smartphone, color: "bg-purple-100 text-purple-600", gradient: "from-purple-400 to-purple-600" },
  "Travel": { icon: Plane, color: "bg-indigo-100 text-indigo-600", gradient: "from-indigo-400 to-indigo-600" },
  "Gifts": { icon: Gift, color: "bg-red-100 text-red-600", gradient: "from-red-400 to-red-600" },
  "Income": { icon: DollarSign, color: "bg-green-100 text-green-600", gradient: "from-green-400 to-green-600" },
  "Dining": { icon: Utensils, color: "bg-orange-100 text-orange-600", gradient: "from-orange-400 to-orange-600" },
  "Other": { icon: DollarSign, color: "bg-gray-100 text-gray-600", gradient: "from-gray-400 to-gray-600" },
}

export function getCategoryIcon(categoryName: string) {
  return categoryIcons[categoryName as keyof typeof categoryIcons] || categoryIcons.Other
}
