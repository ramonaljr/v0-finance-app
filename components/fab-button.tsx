"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TransactionSheet } from "@/components/transaction-sheet"

export function FABButton() {
  return (
    <TransactionSheet>
      <Button size="icon" className="fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-lg">
        <Plus className="h-6 w-6" />
      </Button>
    </TransactionSheet>
  )
}
