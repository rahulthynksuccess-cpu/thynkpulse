const getBase = () => {
  if (typeof window !== 'undefined') return '/api'
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api'
}

function getToken(): string {
  if (typeof window === 'undefined') return ''
  // Try localStorage first, then sessionStorage, then cookie
  return (
    localStorage.getItem('tp_token') ||
    sessionStorage.getItem('tp_token') ||
    document.cookie.match(/tp_token=([^;]+)/)?.[1] ||
    ''
  )
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
