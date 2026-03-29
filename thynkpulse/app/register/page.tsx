'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

type UserType = 'educator' | 'edtech_pro' | 'other'

const TYPE_OPTIONS = [
  { value: 'educator'   as UserType, label: 'Educator / Teacher',  emoji: '🏫', desc: 'School teachers, principals, academic professionals' },
  { value: 'edtech_pro' as UserType, label: 'EdTech Professional', emoji: '💡', desc: 'EdTech companies, product teams, sales & marketing' },
  { value: 'other'      as UserType, label: 'Other / General',     emoji: '🌍', desc: 'Researchers, parents, policy makers, general members' },
]

const lbl: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '7px' }
const inp: React.CSSProperties = { fontFamily: 'var(--font-sans)', width: '100%', padding: '11px 14px', border: '1.5px solid var(--parchment)', borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--ink)', outline: 'none', background: '#fff', boxSizing: 'border-box' }

export default function RegisterPage() {
  const router   = useRouter()
  const { setAuth } = useAuthStore()
  const [step,     setStep]     = useState<1|2>(1)
  const [userType, setUserType] = useState<UserType>('educator')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [form,     setForm]     = useState({ email: '', phone: '', password: '' })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email && !form.phone) { toast.error('Enter email or phone'); return }
    if (form.password.length < 8)   { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: userType }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Registration failed'); return }
      setAuth(data.user, data.token)
      toast.success('Account created! Welcome to Thynk Pulse 🎉')
      router.push('/profile/setup')
    } catch {
      toast.error('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--register-bg,var(--cream))', padding: '60px 20px' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, var(--teal) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: .04, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '11px', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '18px', color: '#fff' }}>TP</span>
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 900, color: 'var(--ink)' }}>
              Thynk <em style={{ fontStyle: 'normal', color: 'var(--teal)' }}>Pulse</em>
            </span>
          </Link>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', justifyContent: 'center' }}>
          {[1,2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-sans)', transition: 'all .3s',
                background: step >= s ? 'var(--teal)' : 'var(--parchment)',
                color: step >= s ? '#fff' : 'var(--muted)' }}>
                {step > s ? <CheckCircle style={{ width: 14, height: 14 }} /> : s}
              </div>
              <span style={{ fontSize: '12px', color: step === s ? 'var(--ink)' : 'var(--muted)', fontFamily: 'var(--font-sans)', fontWeight: step === s ? 600 : 400 }}>
                {s === 1 ? 'Who are you?' : 'Create Account'}
              </span>
              {s < 2 && <div style={{ width: 32, height: 1, background: 'var(--parchment)' }} />}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '36px' }}>

          {/* Step 1 — Choose type */}
          {step === 1 && (
            <>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 900, color: 'var(--ink)', marginBottom: '6px', letterSpacing: '-0.5px' }}>Join Thynk Pulse</h1>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', fontWeight: 300 }}>Tell us who you are so we can personalise your experience</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {TYPE_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => setUserType(opt.value)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '12px', border: `2px solid ${userType === opt.value ? 'var(--teal)' : 'var(--parchment)'}`, background: userType === opt.value ? 'rgba(10,95,85,.05)' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}>
                    <span style={{ fontSize: '28px', flexShrink: 0 }}>{opt.emoji}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>{opt.label}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{opt.desc}</div>
                    </div>
                    {userType === opt.value && <CheckCircle style={{ width: 18, height: 18, color: 'var(--teal)', marginLeft: 'auto', flexShrink: 0 }} />}
                  </button>
                ))}
              </div>

              <button type="button" onClick={() => setStep(2)} className="btn-teal"
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px' }}>
                Continue →
              </button>
            </>
          )}

          {/* Step 2 — Email/Phone + Password */}
          {step === 2 && (
            <>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '13px', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px', padding: 0 }}>
                ← Back
              </button>

              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 900, color: 'var(--ink)', marginBottom: '6px', letterSpacing: '-0.5px' }}>Create Account</h1>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', fontWeight: 300 }}>
                Joining as <strong style={{ color: 'var(--teal)' }}>{TYPE_OPTIONS.find(t => t.value === userType)?.label}</strong>
              </p>

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={lbl}>Email Address</label>
                  <input style={inp} type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--parchment)' }} />
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>or</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--parchment)' }} />
                </div>
                <div>
                  <label style={lbl}>Mobile Number</label>
                  <input style={inp} type="tel" placeholder="98XXXXXXXX"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input style={{ ...inp, paddingRight: '44px' }} type={showPw ? 'text' : 'password'}
                      placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}>
                      {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '5px', fontFamily: 'var(--font-sans)' }}>At least 8 characters</div>
                </div>

                <button type="submit" className="btn-teal" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', opacity: loading ? .7 : 1, marginTop: '4px' }}>
                  {loading ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Creating account…</> : 'Create Account →'}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '16px', fontFamily: 'var(--font-sans)' }}>
                By registering you agree to our{' '}
                <Link href="/terms" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Terms</Link>
                {' & '}
                <Link href="/privacy" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Privacy Policy</Link>
              </p>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
