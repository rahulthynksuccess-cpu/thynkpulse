'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

const lbl: React.CSSProperties = { display:'block', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'7px' }
const inp: React.CSSProperties = { fontFamily:'var(--font-sans)', width:'100%', padding:'11px 14px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontSize:'14px', color:'var(--ink)', outline:'none', background:'#fff', boxSizing:'border-box' }

function ResetForm() {
  const router      = useRouter()
  const params      = useSearchParams()
  const token       = params.get('token') || ''
  const [pw,        setPw]        = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [tokenOk,   setTokenOk]   = useState<boolean|null>(null)
  const [tokenErr,  setTokenErr]  = useState('')

  // Validate token on mount
  useEffect(() => {
    if (!token) { setTokenOk(false); setTokenErr('No reset token found.'); return }
    fetch(`/api/auth/reset-password?token=${token}`)
      .then(r => r.json())
      .then(d => { setTokenOk(d.valid); if (!d.valid) setTokenErr(d.error || 'Invalid link') })
      .catch(() => { setTokenOk(false); setTokenErr('Could not verify link') })
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pw.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (pw !== confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: pw }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Reset failed'); return }
      setDone(true)
      toast.success('Password updated!')
      setTimeout(() => router.push('/login'), 2500)
    } catch {
      toast.error('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (tokenOk === null) return (
    <div style={{ textAlign:'center', padding:'40px 0' }}>
      <Loader2 style={{ width:28, height:28, animation:'spin 1s linear infinite', color:'var(--teal)', margin:'0 auto' }} />
      <p style={{ marginTop:'12px', color:'var(--muted)', fontFamily:'var(--font-sans)', fontSize:'13px' }}>Verifying reset link…</p>
    </div>
  )

  // Invalid token
  if (tokenOk === false) return (
    <div style={{ textAlign:'center', padding:'20px 0' }}>
      <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(239,68,68,.1)', border:'2px solid rgba(239,68,68,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
        <XCircle style={{ width:24, height:24, color:'#F87171' }} />
      </div>
      <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:'var(--ink)', marginBottom:'10px' }}>Link Invalid</h2>
      <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.7, marginBottom:'20px', fontWeight:300 }}>{tokenErr}</p>
      <Link href="/forgot-password" className="btn-teal" style={{ display:'inline-flex', justifyContent:'center', padding:'11px 28px', fontSize:'14px' }}>
        Request New Link
      </Link>
    </div>
  )

  // Success state
  if (done) return (
    <div style={{ textAlign:'center', padding:'20px 0' }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(74,222,128,.1)', border:'2px solid rgba(74,222,128,.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
        <CheckCircle style={{ width:28, height:28, color:'#4ADE80' }} />
      </div>
      <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:'var(--ink)', marginBottom:'10px' }}>Password Updated!</h2>
      <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.7, fontWeight:300 }}>Redirecting you to login…</p>
    </div>
  )

  return (
    <>
      <div style={{ textAlign:'center', marginBottom:'24px' }}>
        <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(10,95,85,.1)', border:'2px solid rgba(10,95,85,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
          <Lock style={{ width:24, height:24, color:'var(--teal)' }} />
        </div>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', marginBottom:'8px', letterSpacing:'-0.5px' }}>Set New Password</h1>
        <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.7, fontWeight:300 }}>Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        <div>
          <label style={lbl}>New Password</label>
          <div style={{ position:'relative' }}>
            <input style={{ ...inp, paddingRight:'44px' }} type={showPw?'text':'password'}
              placeholder="Min. 8 characters" value={pw} onChange={e=>setPw(e.target.value)} required />
            <button type="button" onClick={()=>setShowPw(!showPw)}
              style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', display:'flex', padding:0 }}>
              {showPw ? <EyeOff style={{ width:16, height:16 }} /> : <Eye style={{ width:16, height:16 }} />}
            </button>
          </div>
          {/* Strength indicator */}
          <div style={{ display:'flex', gap:'4px', marginTop:'6px' }}>
            {[1,2,3,4].map(n => (
              <div key={n} style={{ flex:1, height:3, borderRadius:'2px', background: pw.length >= n*2 ? (pw.length < 6 ? 'var(--coral)' : pw.length < 10 ? 'var(--gold)' : '#4ADE80') : 'var(--parchment)', transition:'background .2s' }} />
            ))}
          </div>
          <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'4px', fontFamily:'var(--font-sans)' }}>
            {pw.length === 0 ? 'At least 8 characters' : pw.length < 6 ? 'Too short' : pw.length < 10 ? 'Good' : 'Strong ✓'}
          </div>
        </div>

        <div>
          <label style={lbl}>Confirm Password</label>
          <input style={{ ...inp, borderColor: confirm && pw !== confirm ? 'var(--coral)' : 'var(--parchment)' }}
            type={showPw?'text':'password'} placeholder="Re-enter password"
            value={confirm} onChange={e=>setConfirm(e.target.value)} required />
          {confirm && pw !== confirm && (
            <div style={{ fontSize:'11px', color:'var(--coral)', marginTop:'4px', fontFamily:'var(--font-sans)' }}>Passwords don't match</div>
          )}
        </div>

        <button type="submit" className="btn-teal" disabled={loading || pw !== confirm || pw.length < 8}
          style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:'15px', opacity: (loading||pw!==confirm||pw.length<8) ? .6 : 1, marginTop:'4px' }}>
          {loading ? <><Loader2 style={{ width:15, height:15, animation:'spin 1s linear infinite' }} /> Updating…</> : 'Update Password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:'radial-gradient(circle, var(--teal) 1px, transparent 1px)', backgroundSize:'28px 28px', opacity:.04, pointerEvents:'none' }} />
      <div style={{ width:'100%', maxWidth:'460px', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:38, height:38, borderRadius:'10px', background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'16px', color:'#fff' }}>TP</span>
            </div>
            <span style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:'var(--ink)' }}>Thynk <em style={{ fontStyle:'normal', color:'var(--teal)' }}>Pulse</em></span>
          </Link>
        </div>
        <div className="card" style={{ padding:'36px' }}>
          <Suspense fallback={<div style={{ textAlign:'center', padding:'20px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>Loading…</div>}>
            <ResetForm />
          </Suspense>
        </div>
        <div style={{ textAlign:'center', marginTop:'16px' }}>
          <Link href="/login" style={{ fontSize:'13px', color:'var(--muted)', textDecoration:'none', fontFamily:'var(--font-sans)' }}>← Back to login</Link>
        </div>
      </div>
    </div>
  )
}
