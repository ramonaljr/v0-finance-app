"use client"

import { useState } from "react"
import { Download, FileText, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExportPage() {
  const [exporting, setExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleExport = async (type: string) => {
    setExporting(true)
    setExportSuccess(false)

    try {
      // Get date range (last 90 days by default)
      const endDate = new Date().toISOString().split("T")[0]
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]

      const response = await fetch(
        `/api/export/transactions?format=csv&start_date=${startDate}&end_date=${endDate}`
      )

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setExporting(false)
    }
  }

  const exportOptions = [
    {
      id: "transactions",
      title: "Transactions",
      description: "Export all transactions (last 90 days)",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "budget",
      title: "Budget Report",
      description: "Export budget vs actual comparison",
      icon: Calendar,
      color: "from-purple-500 to-indigo-500",
      disabled: true,
    },
    {
      id: "year-end",
      title: "Year-End Summary",
      description: "Export annual financial summary",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      disabled: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 pb-24">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Data</h1>
          <p className="text-gray-600">
            Download your financial data in CSV format
          </p>
        </div>

        {/* Success Message */}
        {exportSuccess && (
          <Card className="bg-green-50 border-green-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-900">
                  Export completed successfully!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Options */}
        <div className="space-y-4">
          {exportOptions.map((option) => (
            <Card
              key={option.id}
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-md transition-all"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center`}
                    >
                      <option.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">
                        {option.title}
                      </CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleExport(option.id)}
                    disabled={option.disabled || exporting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {exporting ? "Exporting..." : "Export"}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">
              📊 Export Information
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Exports are in CSV format, compatible with Excel and Google Sheets</li>
              <li>• Transaction exports include the last 90 days by default</li>
              <li>• All amounts are in your account's base currency</li>
              <li>• Categories and tags are included for easy filtering</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
