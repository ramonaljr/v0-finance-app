"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Wallet, Target, Sparkles, Check } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [accountData, setAccountData] = useState({
    name: "",
    type: "checking",
    balance: ""
  })

  const handleSkipWithSampleData = async () => {
    // Load sample data
    try {
      const response = await fetch('/api/onboarding/sample-data', {
        method: 'POST'
      })
      if (response.ok) {
        localStorage.setItem('onboarding_completed', 'true')
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to load sample data:', error)
      // Even if sample data fails, mark as completed
      localStorage.setItem('onboarding_completed', 'true')
      router.push('/')
    }
  }

  const handleCreateAccount = async () => {
    if (!accountData.name || !accountData.balance) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: accountData.name,
          type: accountData.type,
          balance_minor: Math.round(parseFloat(accountData.balance) * 100),
          currency_code: 'USD'
        })
      })

      if (response.ok) {
        setStep(3)
      }
    } catch (error) {
      console.error('Failed to create account:', error)
    }
  }

  const handleQuickStart = (type: string, name: string, balance: string) => {
    setAccountData({ name, type, balance })
    handleCreateAccount()
  }

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div className={`h-2 w-12 rounded-full transition-all ${
                step >= num ? 'bg-indigo-600' : 'bg-gray-300'
              }`} />
              {num < 3 && <div className="h-1 w-4 bg-gray-300 rounded" />}
            </div>
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-white/80 backdrop-blur border-0 shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50">
              <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-gray-900">Welcome to FinanceFlow</h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Your AI-powered financial companion. Track expenses, manage budgets, and achieve your goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Track Spending</h3>
                <p className="text-sm text-gray-600">Log transactions in seconds</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Budgets</h3>
                <p className="text-sm text-gray-600">Stay on track effortlessly</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Insights</h3>
                <p className="text-sm text-gray-600">Get personalized advice</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => setStep(2)}
                className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleSkipWithSampleData}
                variant="outline"
                className="flex-1 h-12 border-2"
              >
                Explore with Sample Data
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Add First Account */}
        {step === 2 && (
          <Card className="p-8 md:p-12 space-y-6 bg-white/80 backdrop-blur border-0 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50">
                <Wallet className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Add Your First Account</h2>
              <p className="text-gray-600">Track your money by connecting an account</p>
            </div>

            {/* Quick Start Templates */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Quick Start Templates:</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-1 hover:bg-indigo-50 hover:border-indigo-300"
                  onClick={() => handleQuickStart('checking', 'My Checking', '2500')}
                >
                  <span className="font-semibold">💳 Checking</span>
                  <span className="text-xs text-gray-500">$2,500</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-1 hover:bg-red-50 hover:border-red-300"
                  onClick={() => handleQuickStart('credit', 'Credit Card', '650')}
                >
                  <span className="font-semibold">💰 Credit Card</span>
                  <span className="text-xs text-gray-500">$650 balance</span>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or create custom</span>
              </div>
            </div>

            {/* Custom Account Form */}
            <div className="space-y-4">
              <div>
                <Label>Account Name</Label>
                <Input
                  placeholder="e.g., Chase Checking"
                  value={accountData.name}
                  onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={accountData.type} onValueChange={(value) => setAccountData({ ...accountData, type: value })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Current Balance</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={accountData.balance}
                    onChange={(e) => setAccountData({ ...accountData, balance: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateAccount}
                className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <button
              onClick={handleSkipWithSampleData}
              className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Skip with sample data
            </button>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-white/80 backdrop-blur border-0 shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/50">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-900">You're All Set! 🎉</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Your account has been created. Start tracking your finances and let AI help you save more.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900">What's Next?</h3>
              <ul className="text-left space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={3} />
                  <span>Add your first transaction to track spending</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={3} />
                  <span>Create a budget to stay on track</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={3} />
                  <span>Chat with AI Coach for personalized insights</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={completeOnboarding}
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
