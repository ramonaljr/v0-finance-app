"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalculatorInput } from "@/components/ui/calculator-input"
import { Plus, Keyboard, Mic, Camera, Loader2, Check } from "lucide-react"

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)

  // Manual form state
  const [merchant, setMerchant] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")

  const categories = [
    "Food & Drink",
    "Groceries",
    "Shopping",
    "Transportation",
    "Utilities",
    "Health Care",
    "Entertainment",
    "Housing",
    "Other",
  ]

  const handleVoiceInput = async () => {
    setIsRecording(true)
    setIsProcessing(true)

    try {
      // In production, this would use Web Speech API + AI SDK
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate AI extraction from voice
      const mockExtraction = {
        merchant: "Starbucks",
        amount: "12.50",
        category: "Food & Drink",
        date: new Date().toISOString().split("T")[0],
        notes: "Morning coffee",
      }

      setExtractedData(mockExtraction)
      setMerchant(mockExtraction.merchant)
      setAmount(mockExtraction.amount)
      setCategory(mockExtraction.category)
      setDate(mockExtraction.date)
      setNotes(mockExtraction.notes)
    } catch (error) {
      console.error("[v0] Voice processing error:", error)
    } finally {
      setIsRecording(false)
      setIsProcessing(false)
    }
  }

  const handleCameraInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string

        // Call AI API to extract receipt data
        const response = await fetch("/api/extract-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        })

        const data = await response.json()

        if (data.extractedData) {
          setExtractedData(data.extractedData)
          setMerchant(data.extractedData.merchant || "")
          setAmount(data.extractedData.amount?.toString() || "")
          setCategory(data.extractedData.category || "")
          setDate(data.extractedData.date || new Date().toISOString().split("T")[0])
          setNotes(data.extractedData.notes || "")
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("[v0] Camera processing error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("[v0] Transaction saved:", { merchant, amount, category, date, notes })

      // Reset form and close dialog
      setMerchant("")
      setAmount("")
      setCategory("")
      setDate(new Date().toISOString().split("T")[0])
      setNotes("")
      setExtractedData(null)
      setOpen(false)
    } catch (error) {
      console.error("[v0] Save transaction error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-gray-900 shadow-lg hover:bg-gray-800"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="gap-1.5">
              <Keyboard className="h-4 w-4" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="voice" className="gap-1.5">
              <Mic className="h-4 w-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="camera" className="gap-1.5">
              <Camera className="h-4 w-4" />
              Camera
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            {extractedData && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
                <Check className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700">Data extracted successfully! Review and submit.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="merchant">Merchant</Label>
                <Input
                  id="merchant"
                  placeholder="e.g., Starbucks"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <CalculatorInput
                  value={amount}
                  onChange={setAmount}
                  placeholder="0.00"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Add Transaction"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-900">
                {isRecording ? (
                  <div className="h-4 w-4 animate-pulse rounded-full bg-red-500" />
                ) : (
                  <Mic className="h-8 w-8 text-white" />
                )}
              </div>

              <h3 className="mb-2 font-semibold text-gray-900">{isRecording ? "Listening..." : "Voice Input"}</h3>
              <p className="mb-4 text-sm text-gray-600">
                {isRecording
                  ? "Speak naturally about your transaction"
                  : 'Say something like "I spent $12.50 at Starbucks for coffee"'}
              </p>

              <Button onClick={handleVoiceInput} disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>

              {extractedData && (
                <div className="mt-4 rounded-lg bg-white p-4 text-left">
                  <div className="mb-2 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-semibold text-gray-900">Extracted Data</p>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Merchant:</strong> {extractedData.merchant}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${extractedData.amount}
                    </p>
                    <p>
                      <strong>Category:</strong> {extractedData.category}
                    </p>
                  </div>
                  <Button onClick={() => handleSubmit({ preventDefault: () => {} } as any)} className="mt-4 w-full">
                    Confirm & Add
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="camera" className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-900">
                <Camera className="h-8 w-8 text-white" />
              </div>

              <h3 className="mb-2 font-semibold text-gray-900">Receipt Scanner</h3>
              <p className="mb-4 text-sm text-gray-600">
                Capture a photo of your receipt and AI will extract the details automatically
              </p>

              <label htmlFor="receipt-upload">
                <Button asChild className="w-full" disabled={isProcessing}>
                  <span>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Receipt...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Capture Receipt
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <input
                id="receipt-upload"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraInput}
                disabled={isProcessing}
              />

              <p className="mt-3 text-xs text-gray-500">Camera will open automatically on mobile devices</p>

              {extractedData && (
                <div className="mt-4 rounded-lg bg-white p-4 text-left">
                  <div className="mb-2 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-semibold text-gray-900">Receipt Scanned</p>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Merchant:</strong> {extractedData.merchant}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${extractedData.amount}
                    </p>
                    <p>
                      <strong>Category:</strong> {extractedData.category}
                    </p>
                  </div>
                  <Button onClick={() => handleSubmit({ preventDefault: () => {} } as any)} className="mt-4 w-full">
                    Confirm & Add
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
