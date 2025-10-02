import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/contexts/theme-context"
import { QueryProvider } from "@/components/ui/query-provider"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import "./globals.css"

export const metadata: Metadata = {
  title: "FinanceFlow - Smart Money Management",
  description:
    "Take control of your finances with AI-powered insights, budget tracking, and automated money management",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider>
              <Suspense fallback={<div>Loading...</div>}>
                {children}
                <Analytics />
              </Suspense>
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111111" />
      </body>
    </html>
  )
}
