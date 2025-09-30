"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Send, Sparkles, TrendingUp, PiggyBank, Target, Brain, Lightbulb, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export function AICoachFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi John! I'm your AI financial coach. I've analyzed your spending patterns and I'm here to help you make smarter financial decisions. What would you like to explore today?",
    },
  ])

  const quickActions = [
    { label: "Analyze my spending", icon: TrendingUp, color: "text-primary" },
    { label: "How can I save more?", icon: PiggyBank, color: "text-success" },
    { label: "Review my budget", icon: Target, color: "text-warning" },
    { label: "Investment advice", icon: DollarSign, color: "text-muted-foreground" },
  ]

  const aiInsights = [
    {
      title: "Smart Tip",
      description: "You could save $120/month by reducing dining out expenses by 20%",
      icon: Lightbulb,
      color: "warning",
    },
    {
      title: "Goal Update",
      description: "You're 2 months ahead on your Emergency Fund goal!",
      icon: Target,
      color: "success",
    },
  ]

  const handleSend = () => {
    if (!message.trim()) return

    setMessages([...messages, { role: "user", content: message }])
    setMessage("")

    setTimeout(() => {
      const responses = [
        "Based on your spending patterns over the last 3 months, I've identified that you spend an average of $450/month on dining out. By meal prepping 2-3 times per week, you could reduce this by 30% and save approximately $135/month, which is $1,620 annually.",
        "Great question! I've analyzed your income and expenses. You currently have a savings rate of 18%. To reach your goal faster, I recommend increasing this to 25% by reducing discretionary spending in these categories: Entertainment (-$80), Shopping (-$120), and Subscriptions (-$50).",
        "Your investment portfolio is well-diversified. However, I notice you have $5,000 sitting in a low-interest savings account. Consider moving $3,000 to a high-yield savings account (4.5% APY) and $2,000 to your index fund. This could generate an additional $180/year in returns.",
      ]
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
        },
      ])
    }, 1200)
  }

  const handleQuickAction = (label: string) => {
    setMessage(label)
    handleSend()
  }

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-24 right-6 z-50 h-16 w-16 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <Brain className="h-7 w-7 text-white" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
          3
        </span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-3xl">
          <SheetHeader className="border-b bg-primary px-6 py-5">
            <SheetTitle className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Brain className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <span className="block text-lg font-semibold">AI Financial Coach</span>
                <span className="block text-xs text-white/80 font-normal">Powered by advanced AI</span>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Smart
              </Badge>
            </SheetTitle>
          </SheetHeader>

          <div className="flex h-[calc(100%-180px)] flex-col">
            {messages.length === 1 && (
              <div className="border-b bg-muted/30 px-6 py-4">
                <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Today's Insights
                </p>
                <div className="space-y-2">
                  {aiInsights.map((insight, index) => {
                    const Icon = insight.icon
                    return (
                      <Card
                        key={index}
                        className={`p-3 border-l-4 ${
                          insight.color === "warning"
                            ? "border-l-warning bg-warning/5"
                            : "border-l-success bg-success/5"
                        } cursor-pointer hover:shadow-sm transition-shadow`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              insight.color === "warning" ? "bg-warning/10" : "bg-success/10"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${insight.color === "warning" ? "text-warning" : "text-success"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-foreground mb-0.5">{insight.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === "user" ? "bg-primary text-white" : "border bg-card text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t bg-muted/20 px-6 py-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Badge
                      key={action.label}
                      variant="outline"
                      className="cursor-pointer gap-1.5 bg-background hover:bg-accent transition-colors py-2"
                      onClick={() => handleQuickAction(action.label)}
                    >
                      <Icon className={`h-3.5 w-3.5 ${action.color}`} />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Badge>
                  )
                })}
              </div>
            </div>

            {/* Input */}
            <div className="border-t bg-background px-6 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your finances..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 rounded-xl"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  className="shrink-0 rounded-xl bg-primary hover:bg-primary/90"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
