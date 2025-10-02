"use client"

import { useState } from "react"
import { CalculatorInput } from "@/components/ui/calculator-input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function TestCalculatorPage() {
  const [amount, setAmount] = useState("")
  const [budgetLimit, setBudgetLimit] = useState("")

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Calculator Input Component</h1>
          <p className="text-muted-foreground mt-2">
            Test the calculator feature for transaction and budget inputs
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Transaction Amount</h2>
            <div className="space-y-2">
              <Label>Amount (with Calculator)</Label>
              <CalculatorInput
                value={amount}
                onChange={setAmount}
                placeholder="0.00"
              />
              <p className="text-sm text-muted-foreground">
                Click the calculator icon to use the built-in calculator. Try entering: 12+4
              </p>
            </div>

            {amount && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium">Current Value:</p>
                <p className="text-2xl font-bold">${amount}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Budget Limit</h2>
            <div className="space-y-2">
              <Label>Monthly Budget Limit</Label>
              <CalculatorInput
                value={budgetLimit}
                onChange={setBudgetLimit}
                placeholder="0.00"
              />
              <p className="text-sm text-muted-foreground">
                Use calculator for complex calculations like splitting costs: 200+150+75
              </p>
            </div>

            {budgetLimit && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium">Budget Limit:</p>
                <p className="text-2xl font-bold">${budgetLimit}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2">Calculator Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Click calculator icon to open</li>
            <li>Supports +, -, ×, ÷ operations</li>
            <li>Type directly or use on-screen buttons</li>
            <li>Press = to evaluate expression</li>
            <li>Press Done to confirm and close</li>
            <li>Examples: 12+4, 100-25, 50*2, 200/4</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
