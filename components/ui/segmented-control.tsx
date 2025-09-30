"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Option = {
  label: string
  value: string
}

type SegmentedControlProps = {
  options: Option[]
  value: string
  onValueChange: (value: string) => void
  className?: string
  size?: "sm" | "md"
}

export function SegmentedControl({ options, value, onValueChange, className, size = "md" }: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border bg-card p-1 shadow-soft",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            className={cn(
              "hit-target rounded-md px-3 py-1.5 font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              size === "sm" ? "px-2 py-1" : "px-3 py-1.5",
            )}
            onClick={() => onValueChange(opt.value)}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}


