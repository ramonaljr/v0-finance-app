"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeSelector } from "@/components/theme-selector"
import { useTheme } from "@/contexts/theme-context"
import {
  Bell,
  Lock,
  Globe,
  Moon,
  Download,
  Trash2,
  ChevronRight,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  Palette,
  Calendar,
  DollarSign,
  User,
  Sparkles,
  Camera,
  Mail,
  Phone,
  CreditCard,
  Smartphone,
  Info,
  Sun,
  Laptop,
} from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SettingPage() {
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <header className="border-b border-gray-200 bg-white px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">Manage your account and preferences</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        <Card className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-shadow">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback className="bg-white text-lg font-semibold text-gray-900">
                      AJ
                    </AvatarFallback>
                  </Avatar>
                </div>
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transition-all hover:shadow-xl hover:scale-110">
                  <Camera className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">Alex Johnson</h2>
                <p className="text-sm text-gray-600">alex.johnson@email.com</p>
                <Badge className="mt-2 gap-1 border-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
                  <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                  Premium
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 bg-white hover:bg-gray-50 rounded-xl h-9 shadow-sm"
              >
                Edit
              </Button>
            </div>
          </div>
          <Separator className="bg-gray-200" />
          <div className="grid grid-cols-3 divide-x divide-gray-200 bg-gray-50">
            <button className="flex flex-col items-center gap-1.5 py-4 transition-all hover:bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20 border-2 border-white">
                <Mail className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-medium text-gray-900">Email</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 py-4 transition-all hover:bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/20 border-2 border-white">
                <Phone className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-medium text-gray-900">Phone</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 py-4 transition-all hover:bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20 border-2 border-white">
                <User className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-medium text-gray-900">Profile</span>
            </button>
          </div>
        </Card>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-600">Appearance</h3>
          <Card className="rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-shadow">
            {/* Theme Color - Only Option */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20 border-2 border-white">
                      <Palette className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Theme Color</p>
                      <p className="text-sm text-gray-600 leading-relaxed">Customize your accent color</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Choose Theme Color</DialogTitle>
                  <DialogDescription>Select your preferred color theme for the app</DialogDescription>
                </DialogHeader>
                <ThemeSelector />
              </DialogContent>
            </Dialog>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-600">Preferences</h3>
          <Card className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-shadow">
            <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/20 border-2 border-white">
                  <DollarSign className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Currency</p>
                  <p className="text-sm text-gray-600 leading-relaxed">USD ($)</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </button>

            <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20 border-2 border-white">
                  <Globe className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Language</p>
                  <p className="text-sm text-gray-600 leading-relaxed">English (US)</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </button>

            <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20 border-2 border-white">
                  <Calendar className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start of Month</p>
                  <p className="text-sm text-gray-600 leading-relaxed">1st of each month</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </button>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 shadow-lg shadow-yellow-500/20 border-2 border-white">
                  <Bell className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Notifications</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Bills, budgets, insights</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-600">Security</h3>
          <Card className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-shadow">
            <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-500 shadow-lg shadow-red-500/20 border-2 border-white">
                  <Lock className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Last changed 3 months ago</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </button>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20 border-2 border-white">
                  <Shield className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Add extra security layer</p>
                </div>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20 border-2 border-white">
                  <Smartphone className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Biometric Login</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Face ID or fingerprint</p>
                </div>
              </div>
              <Switch checked={biometric} onCheckedChange={setBiometric} />
            </div>

            <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20 border-2 border-white">
                  <CreditCard className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Connected Accounts</p>
                  <p className="text-sm text-gray-600 leading-relaxed">3 banks linked</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-green-600 text-green-700"
                >
                  Active
                </Badge>
                <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
              </div>
            </button>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Data & Privacy
          </h3>
          <Card className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-shadow">
            <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 border-2 border-white">
                  <Download className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Export Data</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Download your financial data</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </button>

            <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-gray-500 shadow-lg shadow-slate-500/20 border-2 border-white">
                  <FileText className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Privacy Policy</p>
                  <p className="text-sm text-gray-600 leading-relaxed">How we handle your data</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </button>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-600">Support</h3>
          <Card className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-shadow">
            <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20 border-2 border-white">
                  <HelpCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Help Center</p>
                  <p className="text-sm text-gray-600 leading-relaxed">FAQs and guides</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </button>

            <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/20 border-2 border-white">
                  <FileText className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Terms of Service</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Legal information</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
            </button>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 shadow-lg shadow-sky-500/20 border-2 border-white">
                    <Info className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">App Version</p>
                    <p className="text-sm text-gray-600 leading-relaxed">2.4.1 (Build 1024)</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-600 text-green-700"
                >
                  Up to date
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-6 border-2 border-red-200 bg-red-50 rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20 border-2 border-white">
              <Trash2 className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-semibold text-xl text-gray-900">Danger Zone</p>
              <p className="text-sm text-gray-600">Irreversible actions</p>
            </div>
          </div>
          <Button variant="destructive" className="w-full gap-2 bg-gradient-to-r from-red-500 to-rose-600 shadow-lg hover:shadow-xl transition-all rounded-xl h-12">
            <Trash2 className="h-5 w-5" strokeWidth={2.5} />
            Delete Account
          </Button>
        </Card>

        {/* Logout Button */}
        <Button variant="outline" className="w-full gap-2 border-gray-300 text-gray-900 hover:bg-gray-50 bg-white rounded-xl h-12 shadow-sm">
          <LogOut className="h-5 w-5" strokeWidth={2.5} />
          Log Out
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}
