'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'

export default function TestLogin() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function tryLogin() {
    setLoading(true)
    setResult('Trying...')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin@thynkpulse.in', password: 'password' })
      })
      const data = await res.json()
      setResult(`Status: ${res.status}\n\n${JSON.stringify(data, null, 2)}`)
    } catch (err: any) {
      setResult(`ERROR: ${err.message}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 40, fontFamily: 'monospace' }}>
      <h2>Login Debug Test</h2>
      <button onClick={tryLogin} disabled={loading}
        style={{ padding: '10px 20px', fontSize: 14, marginBottom: 20, cursor: 'pointer' }}>
        {loading ? 'Testing...' : 'Test Login API'}
      </button>
      <pre style={{ background: '#111', color: '#0f0', padding: 20, borderRadius: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {result || 'Click button to test'}
      </pre>
    </div>
  )
}
