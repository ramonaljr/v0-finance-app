"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Camera, Upload, X, Check, Loader2 } from "lucide-react"
import Image from "next/image"

interface PhotoReceiptCaptureProps {
  isOpen: boolean
  onClose: () => void
  onSave: (transaction: any) => void
}

interface ParsedReceipt {
  merchant: string
  amount: number
  date: string
  items?: string[]
}

export function PhotoReceiptCapture({ isOpen, onClose, onSave }: PhotoReceiptCaptureProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedReceipt | null>(null)
  const [editedData, setEditedData] = useState({
    payee: "",
    amount: "",
    category_id: "",
    occurred_at: new Date().toISOString().split('T')[0],
    notes: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
      processReceipt(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const processReceipt = async (imageData: string) => {
    setIsProcessing(true)
    try {
      // In a real implementation, this would call an OCR API
      // For now, we'll simulate the OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulated OCR result
      const mockParsed: ParsedReceipt = {
        merchant: "Whole Foods Market",
        amount: 127.45,
        date: new Date().toISOString().split('T')[0],
        items: ["Organic Apples", "Milk", "Bread", "Chicken"]
      }

      setParsedData(mockParsed)
      setEditedData({
        payee: mockParsed.merchant,
        amount: mockParsed.amount.toString(),
        category_id: "",
        occurred_at: mockParsed.date,
        notes: mockParsed.items?.join(", ") || "",
      })
    } catch (error) {
      console.error('OCR processing failed:', error)
      alert('Failed to process receipt. Please enter details manually.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSave = () => {
    if (!editedData.payee || !editedData.amount) {
      alert('Please fill in required fields')
      return
    }

    const transaction = {
      amount_minor: Math.round(parseFloat(editedData.amount) * 100),
      currency_code: 'USD',
      direction: 'out' as const,
      payee: editedData.payee,
      occurred_at: new Date(editedData.occurred_at).toISOString(),
      category_id: editedData.category_id || undefined,
      notes: editedData.notes || undefined,
      receipt_image: image || undefined,
    }

    onSave(transaction)
    handleClose()
  }

  const handleClose = () => {
    setImage(null)
    setParsedData(null)
    setEditedData({
      payee: "",
      amount: "",
      category_id: "",
      occurred_at: new Date().toISOString().split('T')[0],
      notes: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Receipt</DialogTitle>
          <DialogDescription>
            Take a photo or upload a receipt to automatically extract transaction details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!image ? (
            <>
              {/* Upload Options */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-3 border-2 border-dashed hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-8 w-8 text-indigo-600" />
                  <span className="font-semibold">Take Photo</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-32 flex-col gap-3 border-2 border-dashed hover:border-purple-500 hover:bg-purple-50 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-purple-600" />
                  <span className="font-semibold">Upload File</span>
                </Button>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </>
          ) : (
            <>
              {/* Image Preview */}
              <Card className="p-3 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                  onClick={() => setImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt="Receipt"
                    fill
                    className="object-contain"
                  />
                </div>
              </Card>

              {/* Processing Indicator */}
              {isProcessing && (
                <Card className="p-4 bg-indigo-50 border-indigo-200">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Processing receipt...</p>
                      <p className="text-sm text-gray-600">Extracting transaction details</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Parsed Data Preview */}
              {parsedData && !isProcessing && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">Receipt processed!</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Merchant:</span> {parsedData.merchant}</p>
                        <p><span className="font-medium">Amount:</span> ${parsedData.amount.toFixed(2)}</p>
                        <p><span className="font-medium">Date:</span> {parsedData.date}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Edit Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payee">Merchant / Payee *</Label>
                  <Input
                    id="payee"
                    value={editedData.payee}
                    onChange={(e) => setEditedData({ ...editedData, payee: e.target.value })}
                    placeholder="Enter merchant name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={editedData.amount}
                    onChange={(e) => setEditedData({ ...editedData, amount: e.target.value })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editedData.category_id}
                    onValueChange={(value) => setEditedData({ ...editedData, category_id: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groceries">Groceries</SelectItem>
                      <SelectItem value="dining">Dining</SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editedData.occurred_at}
                    onChange={(e) => setEditedData({ ...editedData, occurred_at: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={editedData.notes}
                    onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                    placeholder="Add notes (optional)"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  onClick={handleSave}
                  disabled={!editedData.payee || !editedData.amount}
                >
                  Save Transaction
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
