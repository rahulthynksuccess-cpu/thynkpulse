// lib/api.ts
const getBase = () => {
  if (typeof window !== 'undefined') return '/api'
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api'
}

export function getToken(): string {
  if (typeof window === 'undefined') return ''

  // 1. Direct localStorage key — set by setAuth() on login
  const direct = localStorage.getItem('tp_token') || sessionStorage.getItem('tp_token')
  if (direct) return direct

  // 2. Zustand persist fallback — key is 'tp-auth'
  try {
    const raw = localStorage.getItem('tp-auth')
    if (raw) {
      const token = JSON.parse(raw)?.state?.token
      if (token) {
        localStorage.setItem('tp_token', token) // re-sync
        return token
      }
    }
  } catch {}

  // 3. Cookie fallback
  return document.cookie.match(/tp_token=([^;]+)/)?.[1] || ''
}

async function request(
  method: string,
  url: string,
  data?: unknown,
  params?: Record<string, unknown>
) {
  const token = getToken()
  const fullUrl = new URL(
    getBase() + url,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  )
  if (params) Object.entries(params).forEach(([k, v]) => fullUrl.searchParams.set(k, String(v)))

  const res = await fetch(fullUrl.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  })

  if (!res.ok) {
    let errBody: any = {}
    try { errBody = await res.json() } catch {}

    const msg = errBody?.error || errBody?.message || `HTTP ${res.status}`

    // 401 = session expired → clear stored token so next request forces re-login
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tp_token')
      }
      throw new Error(`🔑 Session expired — please log out and sign in again. (${msg})`)
    }

    // 403 = wrong role → show the SQL fix from the server
    if (res.status === 403) {
      throw new Error(`🚫 ${msg}`)
    }

    throw new Error(msg)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const apiGet    = (url: string, params?: Record<string, unknown>) => request('GET',    url, undefined, params)
export const apiPost   = (url: string, data?: unknown)                   => request('POST',   url, data)
export const apiPut    = (url: string, data?: unknown)                   => request('PUT',    url, data)
export const apiPatch  = (url: string, data?: unknown)                   => request('PATCH',  url, data)
export const apiDelete = (url: string)                                   => request('DELETE', url)

export default { get: apiGet, post: apiPost, put: apiPut, patch: apiPatch, delete: apiDelete }
