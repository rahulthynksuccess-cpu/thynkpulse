'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
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

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [identifier, setIdentifier] = useState('')
  const [password,   setPassword]   = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [loading,    setLoading]    = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!identifier || !password) { toast.error('Enter email and password'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Login failed'); return }
      setAuth(data.user, data.token)
      toast.success(`Welcome back, ${data.user.profile?.fullName || 'there'}!`)
      if (data.user.role === 'admin') {
        router.push('/admin')
      } else if (!data.user.profile?.profileCompleted) {
        router.push('/profile/setup')
      } else {
        router.push('/')
      }
    } catch {
      toast.error('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SplitAuthShell
      variant="login"
      footerText={<>A free platform by <a href="https://thynksuccess.com" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Thynk Success</a></>}
    >
      {/* Heading */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 900, color: 'var(--ink)', marginBottom: '6px', letterSpacing: '-0.5px' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 300 }}>
          Sign in to your Thynk Pulse account
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={lbl}>Email or Phone</label>
          <input
            style={inp} type="text"
            placeholder="you@example.com or 98XXXXXXXX"
            value={identifier} onChange={e => setIdentifier(e.target.value)}
            required autoFocus
          />
        </div>

        <div>
          <label style={lbl}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...inp, paddingRight: '44px' }}
              type={showPw ? 'text' : 'password'}
              placeholder="Your password"
              value={password} onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button" onClick={() => setShowPw(v => !v)}
              style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}
            >
              {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
            </button>
          </div>
          <div style={{ textAlign: 'right', marginTop: '6px' }}>
            <Link href="/forgot-password" style={{ fontSize: '12px', color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          style={{ width: '100%', padding: '13px', borderRadius: '12px', background: 'var(--teal)', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}
        >
          {loading && <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />}
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '22px' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}>Join free today</Link>
      </p>
    </SplitAuthShell>
  )
}
