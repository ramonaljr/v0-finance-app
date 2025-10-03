import { ReactNode } from 'react'

// Simplified layout - removed server-side prefetch that was causing hangs
// Client-side React Query will handle data fetching
export default function HomeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
