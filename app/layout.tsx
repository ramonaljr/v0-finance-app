import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner"
import { Suspense } from "react"
import { ThemeProvider as LegacyThemeProvider } from "@/contexts/theme-context"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/ui/query-provider"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import Script from "next/script"
import { GlobalFABs } from "@/components/global-fabs"
import "@/app/globals.css"

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
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              themes={["light", "high-contrast"]}
            >
              <LegacyThemeProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  {children}
                  <Analytics />
                  <SpeedInsights />
                </Suspense>
                <Toaster position="top-right" richColors />
                {/* Global FABs */}
                <GlobalFABs />
              </LegacyThemeProvider>
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111111" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="v0 Finance" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="v0 Finance" />
        <meta name="msapplication-TileColor" content="#111111" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <Script
          id="service-worker-registration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
