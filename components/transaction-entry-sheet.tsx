"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag, FileText, CreditCard, Calendar, Repeat, Ban, Smile, X } from "lucide-react"

interface TransactionEntrySheetProps {
  category: {
    id: string
    name: string
    icon: string
    color: string
    iconBg: string
  }
  children: React.ReactNode
  onOpen?: () => void
}

export function TransactionEntrySheet({ category, children, onOpen }: TransactionEntrySheetProps) {
  const [amount, setAmount] = useState("0")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  const subcategories: Record<string, string[]> = {
    food: ["Breakfast", "Lunch", "Dinner", "Snacks", "Alcohol", "Coffee", "Groceries"],
    transport: ["Gas", "Parking", "Public Trans", "Toll", "Maintenance"],
    home: ["Mortgage", "Rent", "Electric", "Gas", "Phone", "Cable", "Internet", "Water"],
    selfcare: ["Haircuts", "Hair color", "Nail salon", "Massage", "SkinCare"],
    shopping: ["Clothing", "Shoes", "Bags", "Cosmetic", "Digital", "Jewelry", "Accessories"],
    health: ["Dental", "Mental", "Vision", "Drugs", "Vitamins", "Hospital"],
    salary: ["Salary", "Bonus", "Subsidy", "Commission"],
    freelance: ["Project", "Consulting", "Other"],
    investment: ["Dividends", "Interest", "Capital Gains"],
  }

  const handleNumberClick = (num: string) => {
    if (amount === "0") {
      setAmount(num)
    } else {
      setAmount(amount + num)
    }
  }

  const handleOperatorClick = (op: string) => {
    setAmount(amount + op)
  }

  const handleClear = () => {
    setAmount("0")
  }

  const handleDelete = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1))
    } else {
      setAmount("0")
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild onClick={onOpen}>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="text-center text-lg">{category.name}</SheetTitle>
        </SheetHeader>

        <div className="flex h-[calc(100%-60px)] flex-col">
          {/* Amount Display */}
          <div className="flex items-center justify-center py-8">
            <p className="text-5xl font-semibold text-foreground">${amount}</p>
          </div>

          {/* Subcategories */}
          {subcategories[category.id] && (
            <div className="border-b border-border px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {subcategories[category.id].map((sub) => (
                  <Badge
                    key={sub}
                    variant={selectedSubcategory === sub ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedSubcategory(sub)}
                  >
                    {sub}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-around border-b border-border bg-[#FFFBEB] px-4 py-3">
            <button className="flex flex-col items-center gap-1">
              <Tag className="h-5 w-5 text-primary" />
              <span className="text-xs text-foreground">Tag</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-xs text-foreground">Note</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-xs text-foreground">Account</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-xs text-foreground">Today</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Repeat className="h-5 w-5 text-primary" />
              <span className="text-xs text-foreground">Recurring</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Ban className="h-5 w-5 text-primary" />
              <span className="text-xs text-foreground">Exclude</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Smile className="h-5 w-5 text-primary" />
              <span className="text-xs text-foreground">Cont. Input</span>
            </button>
          </div>

          {/* Calculator Keypad */}
          <div className="flex-1 bg-white p-4">
            <div className="grid h-full grid-cols-4 gap-2">
              {/* Numbers and operators */}
              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("7")}>
                7
              </Button>
              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("8")}>
                8
              </Button>
              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("9")}>
                9
              </Button>
              <Button variant="ghost" className="h-full" onClick={handleDelete}>
                <X className="h-6 w-6" />
              </Button>

              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("4")}>
                4
              </Button>
              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("5")}>
                5
              </Button>
              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("6")}>
                6
              </Button>
              <Button variant="ghost" className="h-full text-xl" onClick={() => handleOperatorClick("+")}>
                +/×
              </Button>

              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("1")}>
                1
              </Button>
              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("2")}>
                2
              </Button>
              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("3")}>
                3
              </Button>
              <Button variant="ghost" className="h-full text-xl" onClick={() => handleOperatorClick("-")}>
                -/÷
              </Button>

              <Button variant="ghost" className="h-full text-base" onClick={handleClear}>
                $<br />
                USD
              </Button>
              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick("0")}>
                0
              </Button>
              <Button variant="ghost" className="h-full text-2xl font-medium" onClick={() => handleNumberClick(".")}>
                .
              </Button>
              <Button className="h-full bg-[#FCD34D] text-2xl hover:bg-[#FCD34D]/90">✓</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
