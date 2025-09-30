"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"
import { Moon, Sun, Palette, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { darkMode, toggleDarkMode, modernSoftTheme, toggleModernSoftTheme } = useTheme()

  return (
    <div className="space-y-4">
      {/* Modern Soft Theme Toggle */}
      <Card className="p-4 modern-soft:rounded-card modern-soft:shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 modern-soft:rounded-sm modern-soft:bg-primary-soft">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Modern Soft Theme</h3>
              <p className="text-xs text-muted-foreground">
                Soft, rounded aesthetics with subtle shadows
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={modernSoftTheme ? "default" : "secondary"}
              className={cn(
                "text-xs",
                modernSoftTheme && "modern-soft:bg-primary modern-soft:text-primary-foreground"
              )}
            >
              {modernSoftTheme ? "Enabled" : "Disabled"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleModernSoftTheme}
              className="modern-soft:rounded-sm modern-soft:shadow-xs"
            >
              {modernSoftTheme ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Dark Mode Toggle */}
      <Card className="p-4 modern-soft:rounded-card modern-soft:shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted modern-soft:rounded-sm modern-soft:bg-surface-alt">
              {darkMode ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Dark Mode</h3>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={darkMode ? "default" : "secondary"}
              className={cn(
                "text-xs",
                darkMode && "modern-soft:bg-primary modern-soft:text-primary-foreground"
              )}
            >
              {darkMode ? "Dark" : "Light"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="modern-soft:rounded-sm modern-soft:shadow-xs"
            >
              {darkMode ? "Light" : "Dark"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Legacy Color Themes */}
      <Card className="p-4 modern-soft:rounded-card modern-soft:shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted modern-soft:rounded-sm modern-soft:bg-surface-alt">
            <Palette className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Color Themes</h3>
            <p className="text-xs text-muted-foreground">
              Choose your preferred color scheme
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {["blue", "purple", "green", "orange", "pink", "red", "indigo", "teal"].map((color) => (
            <Button
              key={color}
              variant="outline"
              size="sm"
              className={cn(
                "capitalize modern-soft:rounded-sm modern-soft:shadow-xs",
                `hover:bg-${color}-50 hover:text-${color}-700 hover:border-${color}-200`
              )}
            >
              {color}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
