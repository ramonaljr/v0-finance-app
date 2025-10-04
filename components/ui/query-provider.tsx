"use client"

import { ReactNode, useState } from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type Props = {
  children: ReactNode
  dehydratedState?: unknown
}

export function QueryProvider({ children, dehydratedState }: Props) {
  // Create client once on the client to avoid re-instantiation during hydration
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes by default
            staleTime: 5 * 60 * 1000,
            // Keep data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Reduce retries for faster failure feedback
            retry: 1,
            // Retry delay
            retryDelay: 1000,
            // Don't refetch on window focus for better performance
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Don't retry mutations by default
            retry: 0,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only render devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
