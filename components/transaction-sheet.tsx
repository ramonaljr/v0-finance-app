"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Mic, Type, Calendar, Tag, FileText, CreditCard } from "lucide-react"

export function TransactionSheet({ children }: { children: React.ReactNode }) {
  const [amount, setAmount] = useState("0")
  const [captureMode, setCaptureMode] = useState<"text" | "photo" | "voice">("text")

  const handleNumberClick = (num: string) => {
    if (amount === "0") {
      setAmount(num)
    } else {
      setAmount(amount + num)
    }
  }

  const handleBackspace = () => {
    if (amount.length === 1) {
      setAmount("0")
    } else {
      setAmount(amount.slice(0, -1))
    }
  }

  const handleDecimal = () => {
    if (!amount.includes(".")) {
      setAmount(amount + ".")
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border p-6">
            <SheetTitle>Add Transaction</SheetTitle>
            <SheetDescription>Choose how you'd like to capture this transaction</SheetDescription>
          </SheetHeader>

          {/* Capture Mode Tabs */}
          <Tabs value={captureMode} onValueChange={(v) => setCaptureMode(v as any)} className="flex-1">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border">
              <TabsTrigger value="text" className="gap-2">
                <Type className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="photo" className="gap-2">
                <Camera className="h-4 w-4" />
                Photo
              </TabsTrigger>
              <TabsTrigger value="voice" className="gap-2">
                <Mic className="h-4 w-4" />
                Voice
              </TabsTrigger>
            </TabsList>

            {/* Text Entry */}
            <TabsContent value="text" className="flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-lg space-y-6">
                {/* Amount Display */}
                <div className="mb-8 text-center">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-5xl font-semibold text-foreground">${amount}</p>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "Food", color: "bg-[oklch(var(--category-food))]" },
                      { name: "Transport", color: "bg-[oklch(var(--category-transport))]" },
                      { name: "Shopping", color: "bg-[oklch(var(--category-shopping))]" },
                      { name: "Health", color: "bg-[oklch(var(--category-health))]" },
                    ].map((cat) => (
                      <Button key={cat.name} variant="outline" className="h-auto flex-col gap-2 py-3 bg-transparent">
                        <div className={`h-8 w-8 rounded-full ${cat.color}`} />
                        <span className="text-xs">{cat.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payee">Payee</Label>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <Input id="payee" placeholder="Where did you spend?" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account">Account</Label>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <Input id="account" placeholder="Select account" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Input id="notes" placeholder="Add a note (optional)" />
                    </div>
                  </div>
                </div>

                {/* Calculator Keypad */}
                <div className="grid grid-cols-4 gap-2">
                  {["7", "8", "9", "÷"].map((key) => (
                    <Button
                      key={key}
                      variant={key === "÷" ? "secondary" : "outline"}
                      className="h-14 text-lg"
                      onClick={() => key !== "÷" && handleNumberClick(key)}
                    >
                      {key}
                    </Button>
                  ))}
                  {["4", "5", "6", "×"].map((key) => (
                    <Button
                      key={key}
                      variant={key === "×" ? "secondary" : "outline"}
                      className="h-14 text-lg"
                      onClick={() => key !== "×" && handleNumberClick(key)}
                    >
                      {key}
                    </Button>
                  ))}
                  {["1", "2", "3", "-"].map((key) => (
                    <Button
                      key={key}
                      variant={key === "-" ? "secondary" : "outline"}
                      className="h-14 text-lg"
                      onClick={() => key !== "-" && handleNumberClick(key)}
                    >
                      {key}
                    </Button>
                  ))}
                  {["0", ".", "⌫", "+"].map((key) => (
                    <Button
                      key={key}
                      variant={["+", "⌫"].includes(key) ? "secondary" : "outline"}
                      className="h-14 text-lg"
                      onClick={() => {
                        if (key === "⌫") handleBackspace()
                        else if (key === ".") handleDecimal()
                        else if (key !== "+") handleNumberClick(key)
                      }}
                    >
                      {key}
                    </Button>
                  ))}
                </div>

                <Button className="w-full" size="lg">
                  Add Transaction
                </Button>
              </div>
            </TabsContent>

            {/* Photo Capture */}
            <TabsContent value="photo" className="flex-1 p-6">
              <div className="mx-auto flex max-w-lg flex-col items-center justify-center space-y-6">
                <Card className="flex h-64 w-full items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <Camera className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Take a photo of your receipt</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      We'll automatically extract the amount and merchant
                    </p>
                  </div>
                </Card>
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Choose from Gallery
                  </Button>
                  <Button className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Voice Capture */}
            <TabsContent value="voice" className="flex-1 p-6">
              <div className="mx-auto flex max-w-lg flex-col items-center justify-center space-y-6">
                <Card className="flex h-64 w-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Mic className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Tap to start recording</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Say something like "Groceries $45 at Whole Foods"
                    </p>
                  </div>
                </Card>
                <Button className="w-full" size="lg">
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
