'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [results, setResults] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  async function runTests() {
    setLoading(true)
    const out: Record<string,string> = {}

    const token = localStorage.getItem('tp_token') || ''
    out['1. localStorage tp_token'] = token ? `✅ ${token.length} chars` : '❌ MISSING'
    out['2. Cookie tp_token'] = document.cookie.includes('tp_token') ? '✅ Present' : '❌ MISSING'

    try {
      const s = localStorage.getItem('tp-auth')
      const p = s ? JSON.parse(s) : null
      out['3. Zustand store'] = p?.state?.token ? `✅ role=${p?.state?.user?.role}` : '❌ No token'
    } catch(e) { out['3. Zustand store'] = `❌ ${e}` }

    try {
      const pl = JSON.parse(atob(token.split('.')[1]))
      out['4. JWT'] = `role=${pl.role}, exp=${new Date(pl.exp*1000).toLocaleString()}`
    } catch(e) { out['4. JWT'] = `❌ ${e}` }

    // Posts API
    try {
      const r = await fetch('/api/admin/posts?status=approved&limit=3', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const j = await r.json()
      out['5. GET /api/admin/posts (approved)'] = `HTTP ${r.status} → total=${j.total}, error=${j.error||'none'}`
    } catch(e) { out['5. GET /api/admin/posts'] = `❌ ${e}` }

    // Check all statuses
    for (const status of ['pending','draft','rejected']) {
      try {
        const r = await fetch(`/api/admin/posts?status=${status}&limit=1`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const j = await r.json()
        out[`   posts (${status})`] = `total=${j.total}`
      } catch(e) {}
    }

    // Users API  
    try {
      const r = await fetch('/api/admin/users?limit=3', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const text = await r.text()
      let j: any = {}
      try { j = JSON.parse(text) } catch {}
      out['6. GET /api/admin/users'] = `HTTP ${r.status} → total=${j.total}, error=${j.error||'none'} | raw: ${text.slice(0,120)}`
    } catch(e) { out['6. GET /api/admin/users'] = `❌ ${e}` }

    setResults(out)
    setLoading(false)
  }

  async function runSeed() {
    setSeeding(true)
    const token = localStorage.getItem('tp_token') || ''
    try {
      const r = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const j = await r.json()
      setSeedMsg(j.message || j.error || 'Done')
      await runTests()
    } catch(e) {
      setSeedMsg(`Error: ${e}`)
    }
    setSeeding(false)
  }

  useEffect(() => { runTests() }, [])

  return (
    <div style={{ padding:'32px', fontFamily:'monospace', background:'#f9f6f0', minHeight:'100vh' }}>
      <h1 style={{ fontSize:'20px', marginBottom:'8px' }}>🔍 Debug Panel</h1>
      <p style={{ fontSize:'13px', color:'#666', marginBottom:'20px' }}>Diagnose auth + DB issues</p>

      <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
        <button onClick={runTests} disabled={loading} style={{ padding:'9px 20px', background:'#0A5F55', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px' }}>
          {loading ? '⏳ Running...' : '🔄 Run Tests'}
        </button>
        <button onClick={runSeed} disabled={seeding} style={{ padding:'9px 20px', background:'#C9922A', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px' }}>
          {seeding ? '⏳ Seeding...' : '🌱 Seed Posts to DB'}
        </button>
      </div>

      {seedMsg && (
        <div style={{ padding:'12px 16px', background:'#d1fae5', borderRadius:'8px', marginBottom:'16px', fontSize:'13px', border:'1px solid #6ee7b7' }}>
          {seedMsg}
        </div>
      )}

      {Object.entries(results).map(([k, v]) => (
        <div key={k} style={{ marginBottom:'8px', padding:'10px 14px', borderRadius:'7px', background: v.startsWith('❌')?'#fee2e2':'#f0fdf4', border:`1px solid ${v.startsWith('❌')?'#fca5a5':'#bbf7d0'}` }}>
          <div style={{ fontWeight:700, fontSize:'10px', marginBottom:'3px', color:'#374151', letterSpacing:'0.5px' }}>{k.toUpperCase()}</div>
          <div style={{ fontSize:'12px', wordBreak:'break-all', color:'#111' }}>{v}</div>
        </div>
      ))}
    </div>
  )
}
