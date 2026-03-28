'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const lbl: React.CSSProperties = { display:'block', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'7px' }
const inp: React.CSSProperties = { fontFamily:'var(--font-sans)', width:'100%', padding:'11px 14px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontSize:'14px', color:'var(--ink)', outline:'none', background:'#fff', boxSizing:'border-box' }

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [sent,       setSent]       = useState(false)
  const [devToken,   setDevToken]   = useState<string|null>(null)

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
      // Dev mode only — shows reset link directly
      if (data.token) setDevToken(data.token)
    } catch {
      toast.error('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:'radial-gradient(circle, var(--teal) 1px, transparent 1px)', backgroundSize:'28px 28px', opacity:.04, pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:'460px', position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:38, height:38, borderRadius:'10px', background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'16px', color:'#fff' }}>TP</span>
            </div>
            <span style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:'var(--ink)' }}>Thynk <em style={{ fontStyle:'normal', color:'var(--teal)' }}>Pulse</em></span>
          </Link>
        </div>

        <div className="card" style={{ padding:'36px' }}>
          {!sent ? (
            <>
              <div style={{ textAlign:'center', marginBottom:'24px' }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(10,95,85,.1)', border:'2px solid rgba(10,95,85,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <Mail style={{ width:24, height:24, color:'var(--teal)' }} />
                </div>
                <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', marginBottom:'8px', letterSpacing:'-0.5px' }}>Forgot Password?</h1>
                <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.7, fontWeight:300 }}>
                  Enter the email or phone number linked to your account. We'll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div>
                  <label style={lbl}>Email or Mobile Number</label>
                  <input style={inp} type="text" placeholder="you@example.com or 98XXXXXXXX"
                    value={identifier} onChange={e => setIdentifier(e.target.value)} autoFocus />
                </div>
                <button type="submit" className="btn-teal" disabled={loading}
                  style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:'15px', opacity:loading?.7:1, marginTop:'4px' }}>
                  {loading ? <><Loader2 style={{ width:15, height:15, animation:'spin 1s linear infinite' }} /> Sending…</> : 'Send Reset Link'}
                </button>
              </form>

              <div style={{ textAlign:'center', marginTop:'20px' }}>
                <Link href="/login" style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'13px', color:'var(--muted)', textDecoration:'none', fontFamily:'var(--font-sans)' }}>
                  <ArrowLeft style={{ width:13, height:13 }} /> Back to login
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign:'center' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(74,222,128,.1)', border:'2px solid rgba(74,222,128,.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <CheckCircle style={{ width:28, height:28, color:'#4ADE80' }} />
              </div>
              <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:'var(--ink)', marginBottom:'10px' }}>Check your inbox</h2>
              <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.7, fontWeight:300, marginBottom:'20px' }}>
                If <strong style={{ color:'var(--ink)' }}>{identifier}</strong> is registered, a reset link has been sent. Check your email or SMS.
              </p>
              <p style={{ fontSize:'12px', color:'var(--muted)', marginBottom:'20px' }}>
                Didn't receive it?{' '}
                <button onClick={() => setSent(false)} style={{ background:'none', border:'none', color:'var(--teal)', cursor:'pointer', fontSize:'12px', fontWeight:600, padding:0 }}>
                  Try again
                </button>
              </p>

              {/* Dev mode: show link directly */}
              {devToken && (
                <div style={{ background:'rgba(201,146,42,.08)', border:'1px dashed rgba(201,146,42,.4)', borderRadius:'10px', padding:'14px', marginBottom:'16px', textAlign:'left' }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, color:'var(--gold)', letterSpacing:'1px', marginBottom:'6px' }}>DEV MODE — RESET LINK</div>
                  <Link href={`/reset-password?token=${devToken}`}
                    style={{ fontFamily:'var(--font-sans)', fontSize:'12px', color:'var(--teal)', wordBreak:'break-all', display:'block' }}>
                    /reset-password?token={devToken.slice(0,20)}…
                  </Link>
                  <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'4px' }}>This link is only visible in dev mode. In production, it's sent via email/SMS.</div>
                </div>
              )}

              <Link href="/login" style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'13px', color:'var(--muted)', textDecoration:'none', fontFamily:'var(--font-sans)' }}>
                <ArrowLeft style={{ width:13, height:13 }} /> Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
