"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleButtonProps {
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function ThemeToggleButton({ 
  className, 
  size = "sm", 
  variant = "outline" 
}: ThemeToggleButtonProps) {
  const { modernSoftTheme, toggleModernSoftTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleModernSoftTheme}
      className={cn(
        "gap-2 modern-soft:rounded-sm modern-soft:shadow-xs",
        className
      )}
      title={modernSoftTheme ? "Switch to Legacy Theme" : "Switch to Modern Soft Theme"}
    >
      <Sparkles className={cn(
        "h-4 w-4",
        modernSoftTheme && "text-primary"
      )} />
      <span className="hidden sm:inline">
        {modernSoftTheme ? "Legacy" : "Modern"}
      </span>
    </Button>
  )
}
