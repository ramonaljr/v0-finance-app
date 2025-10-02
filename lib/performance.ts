import React from 'react'

// Performance monitoring utilities
export interface PerformanceMetrics {
  name: string
  startTime: number
  endTime?: number
  duration?: number
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()

  start(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
    })
  }

  end(name: string): number {
    const metric = this.metrics.get(name)
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`)
      return 0
    }

    const endTime = performance.now()
    const duration = endTime - metric.startTime

    metric.endTime = endTime
    metric.duration = duration

    // Log slow operations (> 100ms)
    if (duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  getMetrics(name?: string): PerformanceMetrics | PerformanceMetrics[] | undefined {
    if (name) {
      return this.metrics.get(name)
    }

    return Array.from(this.metrics.values())
  }

  clear(name?: string): void {
    if (name) {
      this.metrics.delete(name)
    } else {
      this.metrics.clear()
    }
  }

  // Measure async operations
  async measure<T>(name: string, operation: () => Promise<T>): Promise<T> {
    this.start(name)
    try {
      const result = await operation()
      this.end(name)
      return result
    } catch (error) {
      this.end(name)
      throw error
    }
  }

  // Measure sync operations
  measureSync<T>(name: string, operation: () => T): T {
    this.start(name)
    try {
      const result = operation()
      this.end(name)
      return result
    } catch (error) {
      this.end(name)
      throw error
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for measuring component render performance
export function usePerformanceMonitoring(componentName: string) {
  React.useEffect(() => {
    performanceMonitor.start(`render-${componentName}`)

    return () => {
      performanceMonitor.end(`render-${componentName}`)
    }
  }, [componentName])
}

// Utility for measuring API calls
export function measureAPICall<T>(url: string, operation: () => Promise<T>): Promise<T> {
  const metricName = `api-${url}`
  return performanceMonitor.measure(metricName, operation)
}

// Bundle size monitoring (for development)
export function logBundleSize() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Measure main bundle size
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        console.log(`Bundle load time: ${loadTime.toFixed(2)}ms`)
      }
    }, 0)
  }
}
