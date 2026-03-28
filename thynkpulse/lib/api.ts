const getBase = () => {
  if (typeof window !== 'undefined') return '/api'
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api'
}

async function request(method: string, url: string, data?: unknown, params?: Record<string, unknown>) {
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('tp_token') || '')
    : ''

  const fullUrl = new URL(getBase() + url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  if (params) Object.entries(params).forEach(([k, v]) => fullUrl.searchParams.set(k, String(v)))

  const res = await fetch(fullUrl.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err: any = new Error(json?.error || `Request failed: ${res.status}`)
    err.status = res.status
    err.data = json
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('tp_token')
      window.location.href = '/login'
    }
    throw err
  }

  return json
}

export const apiGet    = (url: string, params?: Record<string, unknown>) => request('GET',    url, undefined, params)
export const apiPost   = (url: string, data?: unknown)                   => request('POST',   url, data)
export const apiPut    = (url: string, data?: unknown)                   => request('PUT',    url, data)
export const apiPatch  = (url: string, data?: unknown)                   => request('PATCH',  url, data)
export const apiDelete = (url: string)                                   => request('DELETE', url)

export default { get: apiGet, post: apiPost, put: apiPut, patch: apiPatch, delete: apiDelete }
