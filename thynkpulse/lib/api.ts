const getBase = () => {
  if (typeof window !== 'undefined') return '/api'
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api'
}

function getToken(): string {
  if (typeof window === 'undefined') return ''

  // 1. Direct key — set by setAuth() on login
  const direct = localStorage.getItem('tp_token') || sessionStorage.getItem('tp_token')
  if (direct) return direct

  // 2. Zustand persist fallback — key is 'tp-auth' (the name in authStore.ts)
  //    Covers the case where tp_token was cleared but Zustand state is still hydrated
  try {
    const raw = localStorage.getItem('tp-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      const token = parsed?.state?.token
      if (token) {
        // Re-sync the direct key so future reads are fast
        localStorage.setItem('tp_token', token)
        return token
      }
    }
  } catch {}

  // 3. Cookie fallback (set by setAuth)
  return document.cookie.match(/tp_token=([^;]+)/)?.[1] || ''
}

async function request(method: string, url: string, data?: unknown, params?: Record<string, unknown>) {
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
    ...(data ? { body: JSON.stringify(data) } : {}),
  })

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`
    try { const e = await res.json(); errMsg = e.error || e.message || errMsg } catch {}
    throw new Error(errMsg)
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
