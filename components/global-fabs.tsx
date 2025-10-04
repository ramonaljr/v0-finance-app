"use client"

import dynamic from "next/dynamic"

const AICoachFAB = dynamic(() => import("@/components/ai-coach-fab").then(m => ({ default: m.AICoachFAB })), { ssr: false })
const EnhancedQuickAddFAB = dynamic(() => import("@/components/enhanced-quick-add-fab").then(m => ({ default: m.EnhancedQuickAddFAB })), { ssr: false })

export function GlobalFABs() {
  return (
    <>
      <EnhancedQuickAddFAB />
      <AICoachFAB />
    </>
  )
}
