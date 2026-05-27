// hooks/useSessionTracker.ts
// Drop this hook into layout.tsx (or any page) to auto-track time spent
// Usage: in app/layout.tsx — add <SessionTracker /> component
//
// What it tracks:
//   - Session start time
//   - Total visible time (pauses when tab is backgrounded)
//   - Page path
//   - Whether user bounced (left < 15 seconds)
//   - Sends data on: visibilitychange (tab hide), beforeunload, and every 30s

'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

// Generate or reuse a session ID (persisted in sessionStorage, resets per browser tab)
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = window.sessionStorage.getItem('tp_sid')
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    window.sessionStorage.setItem('tp_sid', sid)
  }
  return sid
}

function fmtTime(sec: number): string {
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60), s = sec % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

async function sendSession(payload: {
  sessionId: string
  pagePath: string
  durationSec: number
  isBounced: boolean
  token?: string | null
}) {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (payload.token) headers['Authorization'] = `Bearer ${payload.token}`
    await fetch('/api/analytics/session', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sessionId: payload.sessionId,
        pagePath:  payload.pagePath,
        durationSec: payload.durationSec,
        isBounced:   payload.isBounced,
      }),
      keepalive: true, // works even if page is closing
    })
  } catch {
    // silently ignore — analytics should never break the UI
  }
}

export function useSessionTracker() {
  const pathname  = usePathname()
  const { token } = useAuthStore()

  const startRef    = useRef<number>(Date.now())
  const visibleRef  = useRef<number>(0)        // accumulated visible seconds
  const hiddenRef   = useRef<number | null>(null) // when tab was hidden
  const sentRef     = useRef(false)
  const sessionId   = getSessionId()

  useEffect(() => {
    startRef.start   = Date.now()
    visibleRef.current = 0
    sentRef.current    = false
    const pagePath     = pathname

    // Compute elapsed visible time
    function getElapsed(): number {
      if (hiddenRef.current !== null) {
        // Currently hidden — don't count this period
        return visibleRef.current
      }
      return visibleRef.current + Math.round((Date.now() - startRef.start) / 1000)
    }

    function flush(final = false) {
      if (sentRef.current && final) return
      if (final) sentRef.current = true
      const elapsed  = getElapsed()
      const isBounced = elapsed < 15
      sendSession({ sessionId, pagePath, durationSec: elapsed, isBounced, token })
    }

    // Pause/resume when tab visibility changes
    function onVisibilityChange() {
      if (document.hidden) {
        // Tab going background — bank elapsed time
        visibleRef.current += Math.round((Date.now() - startRef.start) / 1000)
        hiddenRef.current   = Date.now()
        flush() // send a heartbeat
      } else {
        // Tab returning — reset start
        hiddenRef.current  = null
        startRef.start     = Date.now()
      }
    }

    // Periodic heartbeat every 30 seconds
    const hbTimer = setInterval(() => flush(), 30_000)

    // Before tab/window closes
    function onUnload() { flush(true) }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('beforeunload', onUnload)
    window.addEventListener('pagehide',     onUnload)

    return () => {
      // Page/route changed — flush final session for this path
      flush(true)
      clearInterval(hbTimer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('beforeunload', onUnload)
      window.removeEventListener('pagehide',     onUnload)
    }
  }, [pathname]) // re-run on every route change
}

// ── Drop-in component (use in layout.tsx) ──────────────────────
export function SessionTracker() {
  useSessionTracker()
  return null // renders nothing
}

// ── Utility: format seconds for display ──
export { fmtTime }
