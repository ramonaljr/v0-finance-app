"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Sparkles, Send } from "lucide-react"

export function AICoachSheet({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI financial coach. How can I help you today?",
    },
  ])

  const actionChips = [
    "Explain this week",
    "Can I afford a $500 purchase?",
    "Reallocate my budget",
    "Simulate loan payoff",
    "Create automation rule",
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle>AI Financial Coach</SheetTitle>
                <SheetDescription>Get personalized financial advice</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-lg space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <Card
                    className={`max-w-[80%] p-4 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </Card>
                </div>
              ))}

              {/* Action Chips */}
              <div className="flex flex-wrap gap-2 pt-4">
                {actionChips.map((chip) => (
                  <Button
                    key={chip}
                    variant="outline"
                    size="sm"
                    className="h-auto whitespace-normal py-2 text-xs bg-transparent"
                  >
                    {chip}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="mx-auto flex max-w-lg gap-2">
              <Input placeholder="Ask me anything about your finances..." className="flex-1" />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
