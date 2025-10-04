"use client"

import { MessageCircle, Book, Mail, ExternalLink, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const helpResources = [
    {
      id: "faq",
      title: "FAQs",
      description: "Find answers to common questions",
      icon: Book,
      color: "from-blue-500 to-cyan-500",
      action: "View FAQs",
      href: "#faq",
    },
    {
      id: "support",
      title: "Contact Support",
      description: "Get help from our support team",
      icon: MessageCircle,
      color: "from-purple-500 to-indigo-500",
      action: "Contact Us",
      href: "mailto:support@financeapp.com",
    },
    {
      id: "docs",
      title: "Documentation",
      description: "Learn how to use all features",
      icon: Book,
      color: "from-green-500 to-emerald-500",
      action: "Read Docs",
      href: "#docs",
    },
  ]

  const faqs = [
    {
      question: "How do I add a new transaction?",
      answer:
        "Tap the green + button at the bottom right of the home screen. You can add transactions manually, by voice, or by taking a photo of a receipt.",
    },
    {
      question: "How do I set up a budget?",
      answer:
        "Go to the Budget tab and tap 'Create Budget'. Select a category, set your monthly limit, and save. You'll see real-time progress throughout the month.",
    },
    {
      question: "Can I export my data?",
      answer:
        "Yes! Go to More → Export Data to download your transactions in CSV format. You can import this file into Excel or Google Sheets.",
    },
    {
      question: "How do I track credit cards?",
      answer:
        "Navigate to More → Credit Cards to view all your cards, track utilization, and see upcoming payment due dates.",
    },
    {
      question: "What are subscriptions?",
      answer:
        "The app automatically detects recurring charges and categorizes them as subscriptions. View all your subscriptions in More → Subscriptions.",
    },
    {
      question: "How secure is my data?",
      answer:
        "All data is encrypted in transit and at rest. We use bank-level security with Supabase authentication and never store payment credentials.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 pb-24">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">
            Get help and learn how to make the most of the app
          </p>
        </div>

        {/* Help Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {helpResources.map((resource) => (
            <Card
              key={resource.id}
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                if (resource.href.startsWith("mailto:")) {
                  window.location.href = resource.href
                }
              }}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <resource.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {resource.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  {resource.action}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQs */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 ml-7">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Still need help?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Our support team is here to help you with any questions
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => (window.location.href = "mailto:support@financeapp.com")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Finance App v1.0.0
        </div>
      </div>
    </div>
  )
}
