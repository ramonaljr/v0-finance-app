'use client'

import { Component, type ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Page Error:', error, errorInfo)
    }

    // TODO: Send to error tracking service in production
    // e.g., Sentry.captureException(error)
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="p-8 max-w-md w-full">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h2>

              <p className="text-gray-600 mb-6">
                We're having trouble loading this page. Please try refreshing or go back to the home page.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                  <p className="text-xs font-mono text-red-800 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1"
                  variant="default"
                >
                  Reload Page
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                  variant="outline"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
