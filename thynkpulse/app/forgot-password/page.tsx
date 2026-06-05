'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { SplitAuthShell } from '@/components/auth/SplitAuthShell'
import toast from 'react-hot-toast'

const lbl: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  marginBottom: '7px',
}
const inp: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  width: '100%',
  padding: '12px 16px',
  border: '1.5px solid var(--parchment)',
  borderRadius: 'var(--radius)',
  fontSize: '14px',
  color: 'var(--ink)',
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
  transition: 'border-color .2s',
}

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [sent,       setSent]       = useState(false)
  const [devToken,   setDevToken]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!identifier.trim()) { toast.error('Enter your email or phone'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Request failed'); return }
      setSent(true)
      if (data.token) setDevToken(data.token)
    } catch {
      toast.error('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SplitAuthShell
      variant="forgot"
      footerText={<>A free platform by <a href="https://thynksuccess.com" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Thynk Success</a></>}
    >
      {!sent ? (
        <>
          {/* Icon + heading */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(10,95,85,.08)', border: '2px solid rgba(10,95,85,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <Mail style={{ width: 24, height: 24, color: 'var(--teal)' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 900, color: 'var(--ink)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Forgot password?
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>
              Enter the email or phone number linked to your account and we'll send a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={lbl}>Email or Mobile Number</label>
              <input
                style={inp} type="text"
                placeholder="you@example.com or 98XXXXXXXX"
                value={identifier} onChange={e => setIdentifier(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: '12px', background: 'var(--teal)', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}
            >
              {loading && <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>

          <div style={{ marginTop: '22px' }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--muted)', textDecoration: 'none' }}>
              <ArrowLeft style={{ width: 13, height: 13 }} /> Back to login
            </Link>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,222,128,.1)', border: '2px solid rgba(74,222,128,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <CheckCircle style={{ width: 28, height: 28, color: '#22c55e' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 900, color: 'var(--ink)', marginBottom: '10px' }}>
            Check your inbox
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '8px' }}>
            If <strong style={{ color: 'var(--ink)' }}>{identifier}</strong> is registered,<br />a reset link has been sent.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>
            Didn&apos;t receive it?{' '}
            <button
              onClick={() => setSent(false)}
              style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontSize: '12px', fontWeight: 700, padding: 0 }}
            >Try again</button>
          </p>

          {/* Dev mode reset link */}
          {devToken && (
            <div style={{ background: 'rgba(201,146,42,.07)', border: '1px dashed rgba(201,146,42,.35)', borderRadius: '10px', padding: '14px', marginBottom: '16px', textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '1px', marginBottom: '6px', textTransform: 'uppercase' }}>Dev Mode — Reset Link</div>
              <Link
                href={`/reset-password?token=${devToken}`}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--teal)', wordBreak: 'break-all', display: 'block' }}
              >
                /reset-password?token={devToken.slice(0, 20)}…
              </Link>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>Only visible in dev mode. In production, this link is sent via email/SMS.</div>
            </div>
          )}

          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--muted)', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 13, height: 13 }} /> Back to login
          </Link>
        </div>
      )}
    </SplitAuthShell>
  )
}
