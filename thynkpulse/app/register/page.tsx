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

      // FIX: Previously `if (!res.ok)` was missing — errors were silently ignored
      // and the generic catch block would show "Registration failed" for all errors
      // including 409 Conflict (duplicate email/phone). Now we surface the exact
      // API error message so the user knows what went wrong.
      if (!res.ok) {
        toast.error(data.error || 'Registration failed. Please try again.')
        return
      }

      setAuth(data.user, data.token)
      toast.success('Account created! Welcome to Thynk Pulse 🎉')
      router.push('/profile/setup')
    } catch {
      toast.error('Network error — please check your connection and try again.')
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
              {s < 2 && <div style={{ width: 48, height: 2, borderRadius: 2, transition: 'background .3s', background: step > s ? 'var(--teal)' : 'var(--parchment)' }} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid var(--parchment)', padding: '36px 32px' }}>

          {step === 1 ? (
            <>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 900, color: 'var(--ink)', marginBottom: '6px' }}>Join Thynk Pulse</h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--muted)', marginBottom: '28px', fontWeight: 300 }}>India's platform for education professionals</p>

              <div style={{ marginBottom: '20px' }}>
                <label style={lbl}>I am a…</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {TYPE_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => setUserType(opt.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '14px 16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                        border: `1.5px solid ${userType === opt.value ? 'var(--teal)' : 'var(--parchment)'}`,
                        background: userType === opt.value ? 'rgba(10,95,85,.04)' : '#fff',
                        transition: 'all .15s',
                      }}>
                      <span style={{ fontSize: '24px', flexShrink: 0 }}>{opt.emoji}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: '2px' }}>{opt.label}</div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--muted)', fontWeight: 300 }}>{opt.desc}</div>
                      </div>
                      {userType === opt.value && <CheckCircle style={{ width: 18, height: 18, color: 'var(--teal)', marginLeft: 'auto', flexShrink: 0 }} />}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => setStep(2)}
                style={{ width: '100%', padding: '13px', borderRadius: '12px', background: 'var(--teal)', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                Continue →
              </button>

              <p style={{ textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--muted)', marginTop: '20px' }}>
                Already have an account? <Link href="/login" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              </p>
            </>
          ) : (
            <form onSubmit={handleRegister}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 900, color: 'var(--ink)', marginBottom: '20px' }}>Your account details</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={lbl}>Email address</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => set('email', e.target.value)} style={inp} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--parchment)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'var(--parchment)' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={lbl}>Phone number</label>
                <input type="tel" placeholder="+91 98765 43210" value={form.phone}
                  onChange={e => set('phone', e.target.value)} style={inp} />
              </div>

              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <label style={lbl}>Password <span style={{ color: 'var(--coral)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    style={{ ...inp, paddingRight: '44px' }}
                    required
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}>
                    {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setStep(1)}
                  style={{ padding: '12px 20px', borderRadius: '12px', border: '1.5px solid var(--parchment)', background: '#fff', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--muted)', cursor: 'pointer' }}>
                  Back
                </button>
                <button type="submit" disabled={loading}
                  style={{ flex: 1, padding: '13px', borderRadius: '12px', background: 'var(--teal)', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : null}
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </div>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--muted)', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
                By joining you agree to our{' '}
                <Link href="/terms" style={{ color: 'var(--teal)' }}>Terms</Link> and{' '}
                <Link href="/privacy" style={{ color: 'var(--teal)' }}>Privacy Policy</Link>
              </p>
            </form>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
