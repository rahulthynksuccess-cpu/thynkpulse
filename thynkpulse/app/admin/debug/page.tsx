'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [results, setResults] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(false)

  async function runTests() {
    setLoading(true)
    const out: Record<string,string> = {}

    const token = localStorage.getItem('tp_token') || ''
    out['1. localStorage tp_token'] = token ? `✅ ${token.length} chars: ...${token.slice(-20)}` : '❌ MISSING'

    const cookie = document.cookie.match(/tp_token=([^;]+)/)?.[1] || ''
    out['2. Cookie tp_token'] = cookie ? '✅ Present' : '❌ MISSING'

    try {
      const s = localStorage.getItem('tp-auth')
      const p = s ? JSON.parse(s) : null
      out['3. Zustand tp-auth store'] = p?.state?.token ? `✅ token present, role=${p?.state?.user?.role}` : `❌ No token. Keys: ${Object.keys(p?.state||{}).join(',')}`
    } catch(e) { out['3. Zustand tp-auth store'] = `❌ ${e}` }

    try {
      if (token) {
        const pl = JSON.parse(atob(token.split('.')[1]))
        out['4. JWT payload'] = `role=${pl.role}, userId=${pl.userId}, exp=${new Date(pl.exp*1000).toLocaleString()}`
      } else out['4. JWT payload'] = '❌ no token'
    } catch(e) { out['4. JWT payload'] = `❌ ${e}` }

    try {
      const r = await fetch('/api/admin/posts?status=approved&limit=3', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const j = await r.json()
      out['5. GET /api/admin/posts'] = `HTTP ${r.status} → total=${j.total}, data.length=${j.data?.length}, error=${j.error||'none'}`
    } catch(e) { out['5. GET /api/admin/posts'] = `❌ ${e}` }

    try {
      const r = await fetch('/api/admin/users?limit=3', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const j = await r.json()
      out['6. GET /api/admin/users'] = `HTTP ${r.status} → total=${j.total}, data.length=${j.data?.length}, error=${j.error||'none'}`
    } catch(e) { out['6. GET /api/admin/users'] = `❌ ${e}` }

    try {
      const r = await fetch('/api/admin/posts?status=approved&limit=3')
      out['7. Posts WITHOUT auth'] = `HTTP ${r.status}`
    } catch(e) { out['7. Posts WITHOUT auth'] = `❌ ${e}` }

    setResults(out)
    setLoading(false)
  }

  useEffect(() => { runTests() }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', background: '#f9f6f0', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '20px' }}>🔍 Admin Debug Panel</h1>
      <button onClick={runTests} style={{ padding: '8px 18px', background: '#0A5F55', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '24px', fontSize: '13px' }}>
        {loading ? '⏳ Running...' : '🔄 Run Tests'}
      </button>
      {Object.entries(results).map(([k, v]) => (
        <div key={k} style={{ marginBottom: '10px', padding: '12px', borderRadius: '8px', background: v.startsWith('❌') ? '#fee2e2' : '#d1fae5', border: `1px solid ${v.startsWith('❌') ? '#fca5a5' : '#6ee7b7'}` }}>
          <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '4px', color: '#374151' }}>{k}</div>
          <div style={{ fontSize: '12px', wordBreak: 'break-all' }}>{v}</div>
        </div>
      ))}
    </div>
  )
}
