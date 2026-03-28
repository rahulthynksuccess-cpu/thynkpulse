'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } }
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
