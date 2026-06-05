'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { SplitAuthShell } from '@/components/auth/SplitAuthShell'
import toast from 'react-hot-toast'

type UserType = 'educator' | 'edtech_pro' | 'student' | 'parent' | 'other'

const TYPE_OPTIONS: { value: UserType; label: string; emoji: string; desc: string }[] = [
  { value: 'educator',   label: 'Educator / Teacher',    emoji: '🏫', desc: 'School teachers, principals, academic staff' },
  { value: 'edtech_pro', label: 'EdTech Professional',   emoji: '💡', desc: 'EdTech founders, product teams, sales & marketing' },
  { value: 'student',    label: 'Student',                emoji: '🎓', desc: 'School or college students' },
  { value: 'parent',     label: 'Parent / Guardian',      emoji: '👨‍👩‍👧', desc: "Parents engaged in their child's education journey" },
  { value: 'other',      label: 'School Leader / Others', emoji: '🌍', desc: 'School owners, investors, researchers, policy makers' },
]

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

export default function RegisterPage() {
  const router      = useRouter()
  const { setAuth } = useAuthStore()
  const [step,     setStep]     = useState<1 | 2>(1)
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
      toast.error('Network error — please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const selected = TYPE_OPTIONS.find(o => o.value === userType)!

  return (
    <SplitAuthShell
      variant="register"
      footerText={
        step === 2 ? (
          <>
            By joining you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--teal)' }}>Terms</Link> and{' '}
            <Link href="/privacy" style={{ color: 'var(--teal)' }}>Privacy Policy</Link>
          </>
        ) : undefined
      }
    >
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', marginBottom: '24px' }}>
        {[1, 2].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, transition: 'all .25s', background: step >= s ? 'var(--teal)' : 'var(--parchment)', color: step >= s ? '#fff' : 'var(--muted)' }}>
              {step > s ? <CheckCircle style={{ width: 13, height: 13 }} /> : s}
            </div>
            {s < 2 && (
              <div style={{ width: 40, height: 2, borderRadius: 2, background: step > s ? 'var(--teal)' : 'var(--parchment)', transition: 'background .25s' }} />
            )}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 900, color: 'var(--ink)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
            Join Thynk Pulse
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '22px', fontWeight: 300 }}>
            India's platform for everyone in education
          </p>
          <label style={{ ...lbl, marginBottom: '10px' }}>I am a…</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
            {TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value} type="button" onClick={() => setUserType(opt.value)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '11px', cursor: 'pointer', textAlign: 'left', width: '100%', border: `1.5px solid ${userType === opt.value ? 'var(--teal)' : 'var(--parchment)'}`, background: userType === opt.value ? 'rgba(10,95,85,.04)' : '#fff', transition: 'all .15s' }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{opt.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>{opt.label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--muted)', fontWeight: 300, marginTop: '1px' }}>{opt.desc}</div>
                </div>
                {userType === opt.value && <CheckCircle style={{ width: 15, height: 15, color: 'var(--teal)', flexShrink: 0 }} />}
              </button>
            ))}
          </div>
          <button
            type="button" onClick={() => setStep(2)}
            style={{ width: '100%', padding: '13px', borderRadius: '12px', background: 'var(--teal)', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
          >
            Continue →
          </button>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '18px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </>
      ) : (
        <form onSubmit={handleRegister}>
          {/* Selected role chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '10px 14px', background: 'rgba(10,95,85,.05)', borderRadius: '10px', border: '1.5px solid rgba(10,95,85,.12)' }}>
            <span style={{ fontSize: '18px' }}>{selected.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-sans)' }}>{selected.label}</div>
              <button
                type="button" onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--muted)', padding: 0, textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}
              >Change</button>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 900, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '-0.3px' }}>
            Your account details
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
            <div>
              <label style={lbl}>Email address</label>
              <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--parchment)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--parchment)' }} />
            </div>
            <div>
              <label style={lbl}>Phone number</label>
              <input style={inp} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Password <span style={{ color: 'var(--coral)' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...inp, paddingRight: '44px' }}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  required
                />
                <button
                  type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}
                >
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button" onClick={() => setStep(1)}
              style={{ padding: '12px 18px', borderRadius: '12px', border: '1.5px solid var(--parchment)', background: '#fff', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--muted)', cursor: 'pointer' }}
            >← Back</button>
            <button
              type="submit" disabled={loading}
              style={{ flex: 1, padding: '13px', borderRadius: '12px', background: 'var(--teal)', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading && <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </SplitAuthShell>
  )
}
