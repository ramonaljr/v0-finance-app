"use client"

import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  RefreshCw,
  TrendingUp,
  FileText,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  Download,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface MenuItem {
  id: string
  title: string
  description: string
  icon: any
  href: string
  badge?: string
  color: string
}

export default function MorePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user)
    }
    loadUser()
  }, [])

  const userEmail = user?.email || "user@example.com"
  const initials = userEmail.substring(0, 2).toUpperCase()

  const menuItems: MenuItem[] = [
    {
      id: "accounts",
      title: "Accounts",
      description: "Manage bank accounts & balances",
      icon: FileText,
      href: "/account",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "credit-cards",
      title: "Credit Cards",
      description: "Track utilization & payments",
      icon: CreditCard,
      href: "/credit-cards",
      badge: "New",
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "subscriptions",
      title: "Subscriptions",
      description: "Manage recurring payments",
      icon: RefreshCw,
      href: "/subscriptions",
      badge: "New",
      color: "from-pink-500 to-rose-500"
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Alerts & reminders",
      icon: Bell,
      href: "/notifications",
      color: "from-amber-500 to-orange-500"
    },
    {
      id: "export",
      title: "Export Data",
      description: "Download transactions & reports",
      icon: Download,
      href: "/export",
      color: "from-indigo-500 to-blue-500"
    },
    {
      id: "settings",
      title: "Settings",
      description: "Preferences & security",
      icon: Settings,
      href: "/setting",
      color: "from-gray-500 to-slate-500"
    },
    {
      id: "help",
      title: "Help & Support",
      description: "FAQs & contact support",
      icon: HelpCircle,
      href: "/help",
      color: "from-teal-500 to-cyan-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Header */}
      <header className="border-b bg-white px-6 pb-6 pt-8 shadow-sm">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-lg shadow-primary/10 ring-2 ring-offset-2 ring-primary/10">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{userEmail.split('@')[0]}</h1>
              <p className="text-sm font-medium text-gray-600">{userEmail}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 rounded-xl">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Accounts</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </Card>
            <Card className="p-3 rounded-xl">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Cards</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </Card>
            <Card className="p-3 rounded-xl">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <Card
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => router.push(item.href)}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg shadow-${item.color}/20 border-2 border-white`}>
                    <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      {item.badge && (
                        <Badge className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Premium Upgrade Card */}
        <Card className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 border-2 border-white/30">
              <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Upgrade to Premium</h3>
              <p className="text-sm text-white/90 mb-4">
                Unlock advanced features, unlimited AI insights, and priority support
              </p>
              <button className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-xl hover:bg-white/90 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </Card>

        {/* App Version */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">FinCoach v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">Made with ❤️ by your team</p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
