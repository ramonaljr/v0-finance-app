"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, PieChart, TrendingUp, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/budget", label: "Budget", icon: PieChart },
  { href: "/insights", label: "Insights", icon: TrendingUp },
  { href: "/more", label: "More", icon: MoreHorizontal },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card pb-safe modern-soft:bg-surface modern-soft:shadow-lg modern-soft:border-border/50">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around modern-soft:h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors hit-target",
                "modern-soft:transition-smooth modern-soft:rounded-sm modern-soft:btn-press",
                isActive 
                  ? "text-primary modern-soft:text-primary modern-soft:bg-primary-soft" 
                  : "text-muted-foreground hover:text-foreground modern-soft:hover:bg-surface-alt",
              )}
            >
              <Icon className={cn(
                "h-5 w-5 modern-soft:h-7 modern-soft:w-7",
                isActive ? "modern-soft:stroke-2" : "modern-soft:stroke-[1.5]"
              )} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "font-medium modern-soft:text-[10px] modern-soft:leading-tight",
                isActive ? "modern-soft:font-semibold" : "modern-soft:font-medium"
              )}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
