"use client"

import { useState } from "react"
import { Plus, Image as ImageIcon, Mic, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { PhotoReceiptCapture } from "./photo-receipt-capture"
import { VoiceTransactionEntry } from "./voice-transaction-entry"
import dynamic from "next/dynamic"

const QuickAddFAB = dynamic(() => import("./quick-add-fab").then(m => ({ default: m.QuickAddFAB })), { ssr: false })

export function EnhancedQuickAddFAB() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false)
  const [manualDialogOpen, setManualDialogOpen] = useState(false)

  const handleSaveTransaction = async (transaction: any) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      })

      if (response.ok) {
        alert('Transaction saved successfully!')
        window.location.reload()
      } else {
        throw new Error('Failed to save transaction')
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Failed to save transaction. Please try again.')
    }
  }

  return (
    <>
      {/* Main FAB */}
      <Button
        className="fixed bottom-24 left-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all hover:scale-110"
        onClick={() => setIsMenuOpen(true)}
      >
        <Plus className="h-6 w-6" strokeWidth={3} />
      </Button>

      {/* Method Selection Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">Add Transaction</SheetTitle>
          </SheetHeader>

          <div className="mt-6 grid grid-cols-3 gap-4 pb-safe">
            {/* Photo Receipt */}
            <button
              onClick={() => {
                setIsMenuOpen(false)
                setPhotoDialogOpen(true)
              }}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
                <ImageIcon className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">Photo</p>
                <p className="text-xs text-gray-600">Scan receipt</p>
              </div>
            </button>

            {/* Voice Entry */}
            <button
              onClick={() => {
                setIsMenuOpen(false)
                setVoiceDialogOpen(true)
              }}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                <Mic className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">Voice</p>
                <p className="text-xs text-gray-600">Speak it</p>
              </div>
            </button>

            {/* Manual Entry */}
            <button
              onClick={() => {
                setIsMenuOpen(false)
                setManualDialogOpen(true)
              }}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                <Edit3 className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">Manual</p>
                <p className="text-xs text-gray-600">Type it</p>
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Photo Receipt Capture Dialog */}
      <PhotoReceiptCapture
        isOpen={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        onSave={handleSaveTransaction}
      />

      {/* Voice Transaction Entry Dialog */}
      <VoiceTransactionEntry
        isOpen={voiceDialogOpen}
        onClose={() => setVoiceDialogOpen(false)}
        onSave={handleSaveTransaction}
      />

      {/* Manual Entry (Original QuickAddFAB) */}
      {manualDialogOpen && <QuickAddFAB />}
    </>
  )
}
