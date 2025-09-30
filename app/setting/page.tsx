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
  const { darkMode, toggleDarkMode } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-1 text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 py-6">
        <Card className="mb-6 overflow-hidden border border-border bg-card">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-gray-200 dark:border-gray-800">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    AJ
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-900 dark:bg-gray-800 shadow-sm transition-colors hover:bg-gray-800 dark:hover:bg-gray-700">
                  <Camera className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Alex Johnson</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">alex.johnson@email.com</p>
                <Badge className="mt-2 gap-1 border-0 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-300">
                  <Sparkles className="h-3 w-3" />
                  Premium
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 dark:border-gray-800 bg-transparent dark:bg-gray-900"
              >
                Edit
              </Button>
            </div>
          </div>
          <Separator className="bg-border" />
          <div className="grid grid-cols-3 divide-x divide-border bg-muted">
            <button className="flex flex-col items-center gap-1.5 py-4 transition-colors hover:bg-muted/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground">Email</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 py-4 transition-colors hover:bg-muted/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground">Phone</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 py-4 transition-colors hover:bg-muted/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground">Profile</span>
            </button>
          </div>
        </Card>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Appearance</h3>
          <Card className="divide-y divide-border border border-border bg-card">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                  <Moon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Switch to dark theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/80">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Palette className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Theme Color</p>
                      <p className="text-xs text-muted-foreground">Customize accent color</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose Theme Color</DialogTitle>
                  <DialogDescription>Select your preferred color theme for the app</DialogDescription>
                </DialogHeader>
                <ThemeSelector />
              </DialogContent>
            </Dialog>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preferences</h3>
          <Card className="divide-y divide-border border border-border bg-card">
            <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Currency</p>
                  <p className="text-xs text-muted-foreground">USD ($)</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Language</p>
                  <p className="text-xs text-muted-foreground">English (US)</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Start of Month</p>
                  <p className="text-xs text-muted-foreground">1st of each month</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Bills, budgets, insights</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Security</h3>
          <Card className="divide-y divide-border border border-border bg-card">
            <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-500">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Change Password</p>
                  <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add extra security layer</p>
                </div>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Biometric Login</p>
                  <p className="text-xs text-muted-foreground">Face ID or fingerprint</p>
                </div>
              </div>
              <Switch checked={biometric} onCheckedChange={setBiometric} />
            </div>

            <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Connected Accounts</p>
                  <p className="text-xs text-muted-foreground">3 banks linked</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-green-600 text-green-700 dark:border-green-400 dark:text-green-500"
                >
                  Active
                </Badge>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Data & Privacy
          </h3>
          <Card className="divide-y divide-border border border-border bg-card">
            <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Export Data</p>
                  <p className="text-xs text-muted-foreground">Download your financial data</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-gray-500">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Privacy Policy</p>
                  <p className="text-xs text-muted-foreground">How we handle your data</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Support</h3>
          <Card className="divide-y divide-border border border-border bg-card">
            <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Help Center</p>
                  <p className="text-xs text-muted-foreground">FAQs and guides</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Terms of Service</p>
                  <p className="text-xs text-muted-foreground">Legal information</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-500">
                    <Info className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">App Version</p>
                    <p className="text-xs text-muted-foreground">2.4.1 (Build 1024)</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-600 text-green-700 dark:border-green-400 dark:text-green-500"
                >
                  Up to date
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">Danger Zone</p>
              <p className="text-xs text-red-700 dark:text-red-300">Irreversible actions</p>
            </div>
          </div>
          <Button variant="destructive" className="w-full gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </Card>

        {/* Logout Button */}
        <Button variant="outline" className="w-full gap-2 border-border text-foreground hover:bg-muted bg-card">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}
