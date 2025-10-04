"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { logger } from "@/lib/utils/logger"
import { PageErrorBoundary } from "@/components/ui/page-error-boundary"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Globe,
  ChevronRight,
  Sparkles,
  Camera,
  DollarSign,
  LogOut,
  Palette,
  Loader2,
  Sun,
} from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserData {
  id: string
  email: string
  currency_code: string
  country?: string
  ai_consent_at?: string
}

function SettingPageNew() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCurrencyDialogOpen, setIsCurrencyDialogOpen] = useState(false)
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [tempCurrency, setTempCurrency] = useState("USD")
  const [tempCountry, setTempCountry] = useState("")

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')

      if (!response.ok) {
        // Try to get error details from response
        const errorText = await response.text()
        let errorDetails = errorText
        try {
          const errorJson = JSON.parse(errorText)
          errorDetails = JSON.stringify(errorJson, null, 2)
        } catch {
          // errorText is not JSON, use as is
        }
        logger.error('User API error:', response.status, response.statusText, '\nDetails:', errorDetails)
        return
      }

      const text = await response.text()
      if (!text) {
        logger.error('Empty response from /api/user')
        return
      }

      const data = JSON.parse(text)
      if (data.user) {
        setUser(data.user)
        setTempCurrency(data.user.currency_code || "USD")
        setTempCountry(data.user.country || "")
      }
    } catch (error) {
      logger.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCurrency = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency_code: tempCurrency,
          country: user.country,
          ai_consent_at: user.ai_consent_at,
        }),
      })

      if (response.ok) {
        await fetchUserData()
        setIsCurrencyDialogOpen(false)
      }
    } catch (error) {
      logger.error('Failed to update currency:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveCountry = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency_code: user.currency_code,
          country: tempCountry,
          ai_consent_at: user.ai_consent_at,
        }),
      })

      if (response.ok) {
        await fetchUserData()
        setIsCountryDialogOpen(false)
      }
    } catch (error) {
      logger.error('Failed to update country:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      PHP: '₱',
    }
    return symbols[code] || code
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load user data</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load your settings. This might be a temporary issue.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()} className="flex-1">
              Try Again
            </Button>
            <Button onClick={() => router.push('/')} variant="outline" className="flex-1">
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <header className="border-b border-gray-200 bg-white px-6 pb-6 pt-8">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">Manage your account and preferences</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-6">
        <Card className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarFallback className="bg-white text-lg font-semibold text-gray-900">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transition-all hover:shadow-xl hover:scale-110">
                  <Camera className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {user.email.split('@')[0]}
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <Badge className="mt-2 gap-1 border-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
                  <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                  Free Plan
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Preferences
          </h3>
          <Card className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-md">
            {/* Theme Selector */}
            <div className="flex w-full items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20 border-2 border-white">
                  <Sun className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Appearance</p>
                  <p className="text-sm text-gray-600">Choose your theme</p>
                </div>
              </div>
              <ThemeSelector />
            </div>

            <Dialog open={isCurrencyDialogOpen} onOpenChange={setIsCurrencyDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/20 border-2 border-white">
                      <DollarSign className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Currency</p>
                      <p className="text-sm text-gray-600">{user.currency_code} ({getCurrencySymbol(user.currency_code)})</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Currency</DialogTitle>
                  <DialogDescription>Select your preferred currency</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={tempCurrency} onValueChange={setTempCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="PHP">PHP (₱)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCurrencyDialogOpen(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCurrency} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex w-full items-center justify-between p-5 text-left transition-all hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20 border-2 border-white">
                      <Globe className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Country/Region</p>
                      <p className="text-sm text-gray-600">{user.country || "Not set"}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Country/Region</DialogTitle>
                  <DialogDescription>Select your country or region</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      placeholder="e.g. United States"
                      value={tempCountry}
                      onChange={(e) => setTempCountry(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCountryDialogOpen(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCountry} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Notifications
          </h3>
          <Card className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-md">
            <div className="flex w-full items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20 border-2 border-white">
                  <Bell className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Budget Alerts</p>
                  <p className="text-sm text-gray-600">Get notified when nearing budget limits</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex w-full items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20 border-2 border-white">
                  <Bell className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Transaction Alerts</p>
                  <p className="text-sm text-gray-600">Notify me of new transactions</p>
                </div>
              </div>
              <Switch />
            </div>

            <div className="flex w-full items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/20 border-2 border-white">
                  <Bell className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Monthly Summary</p>
                  <p className="text-sm text-gray-600">Receive end-of-month reports</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
            AI Features
          </h3>
          <Card className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-md">
            <div className="flex w-full items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 border-2 border-white">
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">AI Coach</p>
                  <p className="text-sm text-gray-600">
                    {user.ai_consent_at ? "Enabled" : "Get personalized financial insights"}
                  </p>
                </div>
              </div>
              <Switch
                checked={!!user.ai_consent_at}
                onCheckedChange={(checked) => {
                  if (checked) {
                    // Enable AI consent
                    fetch('/api/user', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        currency_code: user.currency_code,
                        country: user.country,
                        ai_consent_at: new Date().toISOString(),
                      }),
                    }).then(() => fetchUserData())
                  } else {
                    // Disable AI consent
                    fetch('/api/user', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        currency_code: user.currency_code,
                        country: user.country,
                        ai_consent_at: null,
                      }),
                    }).then(() => fetchUserData())
                  }
                }}
              />
            </div>
          </Card>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2 border-gray-300 text-gray-900 hover:bg-gray-50 bg-white rounded-xl h-12 shadow-sm"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" strokeWidth={2.5} />
          Log Out
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}


export default function SettingPageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <SettingPageNew />
    </PageErrorBoundary>
  )
}
