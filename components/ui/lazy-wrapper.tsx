"use client"

import React, { Suspense } from 'react'
import { PageLoadingSkeleton } from '@/components/ui/loading-skeleton'

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  skeletonType?: 'transactions' | 'budgets' | 'insights' | 'stats'
}

export function LazyWrapper({
  children,
  fallback,
  skeletonType = 'default'
}: LazyWrapperProps) {
  const defaultFallback = <PageLoadingSkeleton type={skeletonType} />

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

// Higher-order component for lazy loading pages
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  skeletonType?: 'transactions' | 'budgets' | 'insights' | 'stats'
) {
  const LazyComponent = (props: P) => (
    <LazyWrapper skeletonType={skeletonType}>
      <Component {...props} />
    </LazyWrapper>
  )

  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`

  return LazyComponent
}
