"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Calculator, X } from "lucide-react"

interface CalculatorInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showCalculator?: boolean
}

export function CalculatorInput({
  value,
  onChange,
  placeholder = "0.00",
  className,
  showCalculator = true,
}: CalculatorInputProps) {
  const [displayValue, setDisplayValue] = useState(value || "0")
  const [showCalc, setShowCalc] = useState(false)
  const [expression, setExpression] = useState("")

  useEffect(() => {
    if (value) {
      setDisplayValue(value)
    }
  }, [value])

  const handleNumberClick = (num: string) => {
    const newValue = displayValue === "0" ? num : displayValue + num
    setDisplayValue(newValue)
    setExpression(newValue)
  }

  const handleOperatorClick = (operator: string) => {
    setDisplayValue(displayValue + operator)
    setExpression(displayValue + operator)
  }

  const handleDecimalClick = () => {
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".")
      setExpression(displayValue + ".")
    }
  }

  const handleClear = () => {
    setDisplayValue("0")
    setExpression("")
  }

  const handleBackspace = () => {
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1))
      setExpression(displayValue.slice(0, -1))
    } else {
      setDisplayValue("0")
      setExpression("")
    }
  }

  const handleEquals = () => {
    try {
      // Safe evaluation of mathematical expression
      const result = evaluateExpression(displayValue)
      const finalValue = result.toFixed(2)
      setDisplayValue(finalValue)
      setExpression("")
      onChange(finalValue)
    } catch (error) {
      setDisplayValue("Error")
      setTimeout(() => {
        setDisplayValue("0")
        setExpression("")
      }, 1000)
    }
  }

  const handleDone = () => {
    // If there's an incomplete expression, evaluate it first
    if (expression && /[+\-*/]$/.test(displayValue)) {
      // Remove trailing operator
      const cleanValue = displayValue.replace(/[+\-*/]$/, "")
      setDisplayValue(cleanValue)
      onChange(cleanValue)
    } else {
      onChange(displayValue)
    }
    setShowCalc(false)
  }

  // Safe expression evaluator (simple implementation)
  const evaluateExpression = (expr: string): number => {
    // Remove any non-math characters for safety
    const sanitized = expr.replace(/[^0-9+\-*/.]/g, "")

    // Use Function constructor for safer eval alternative
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${sanitized}`)()
      if (typeof result === "number" && !isNaN(result)) {
        return result
      }
      throw new Error("Invalid calculation")
    } catch {
      throw new Error("Invalid expression")
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex gap-2">
        <Input
          type="text"
          value={displayValue}
          onChange={(e) => {
            setDisplayValue(e.target.value)
            onChange(e.target.value)
          }}
          placeholder={placeholder}
          className="flex-1 text-2xl font-semibold text-center"
        />
        {showCalculator && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowCalc(!showCalc)}
          >
            <Calculator className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showCalc && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg p-4 z-50">
          {/* Expression Display */}
          {expression && (
            <div className="text-sm text-muted-foreground mb-2 text-right">
              {expression}
            </div>
          )}

          {/* Calculator Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("7")}
              className="h-12 text-lg"
            >
              7
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("8")}
              className="h-12 text-lg"
            >
              8
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("9")}
              className="h-12 text-lg"
            >
              9
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleBackspace}
              className="h-12"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Row 2 */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("4")}
              className="h-12 text-lg"
            >
              4
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("5")}
              className="h-12 text-lg"
            >
              5
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("6")}
              className="h-12 text-lg"
            >
              6
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOperatorClick("+")}
              className="h-12 text-lg"
            >
              +
            </Button>

            {/* Row 3 */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("1")}
              className="h-12 text-lg"
            >
              1
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("2")}
              className="h-12 text-lg"
            >
              2
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("3")}
              className="h-12 text-lg"
            >
              3
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOperatorClick("-")}
              className="h-12 text-lg"
            >
              -
            </Button>

            {/* Row 4 */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDecimalClick}
              className="h-12 text-lg"
            >
              .
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick("0")}
              className="h-12 text-lg"
            >
              0
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="h-12 text-lg"
            >
              C
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOperatorClick("*")}
              className="h-12 text-lg"
            >
              ×
            </Button>

            {/* Row 5 - Full width buttons */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOperatorClick("/")}
              className="h-12 text-lg"
            >
              ÷
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleEquals}
              className="h-12 text-lg col-span-2"
            >
              =
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleDone}
              className="h-12 text-lg bg-primary"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
