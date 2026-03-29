'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000,
        retry: (failureCount, error: any) => {
          // Don't retry 401/403 — but do retry network errors
          if (error?.message?.includes('401') || error?.message?.includes('403')) return false
          return failureCount < 2
        },
        // Never cache error responses
        gcTime: 5 * 60 * 1000,
      },
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" toastOptions={{
        style: { background: '#fff', color: '#1A1208', border: '1px solid rgba(10,95,85,0.12)', fontFamily: 'Outfit, sans-serif', fontSize: '14px' },
        success: { iconTheme: { primary: '#0A5F55', secondary: '#fff' } },
      }} />
    </QueryClientProvider>
  )
}
