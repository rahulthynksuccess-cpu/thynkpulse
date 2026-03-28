'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Camera, User, Briefcase, BookOpen, ArrowRight, SkipForward } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const lbl: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '7px' }
const inp: React.CSSProperties = { fontFamily: 'var(--font-sans)', width: '100%', padding: '11px 14px', border: '1.5px solid var(--parchment)', borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--ink)', outline: 'none', background: '#fff', boxSizing: 'border-box' }

export default function ProfileSetupPage() {
  const router = useRouter()
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const [loading,  setLoading]  = useState(false)
  const [skipping, setSkipping] = useState(false)
  const [form,     setForm]     = useState({
    fullName: '', designation: '', instituteName: '', companyName: '',
    contactNumber: '', introduction: '', linkedinUrl: '', location: '', interests: '',
  })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.fullName.trim()) { toast.error('Full name is required'); return }
    setLoading(true)
    try {
      const token = localStorage.getItem('tp_token')
      const res = await fetch(`/api/users/${user?.email || user?.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, location: form.location, interests: form.interests, profileCompleted: true }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to save'); return }
      updateUser({ profile: { ...user?.profile, ...form, profileCompleted: true } })
      toast.success('Profile saved! Welcome to Thynk Pulse 🎉')
      router.push('/')
    } catch {
      toast.error('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleSkip() {
    setSkipping(true)
    try {
      const token = localStorage.getItem('tp_token')
      await fetch(`/api/users/${user?.email || user?.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileCompleted: false }),
      })
    } catch {}
    setSkipping(false)
    toast('Profile skipped — you can complete it anytime from your profile settings', { icon: '👋' })
    router.push('/')
  }

  const name = user?.profile?.fullName?.split(' ')[0] || 'there'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '40px 20px' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, var(--teal) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: .04, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(10,95,85,.1)', border: '3px solid rgba(10,95,85,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <User style={{ width: 28, height: 28, color: 'var(--teal)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-1px', marginBottom: '8px' }}>
            Welcome, {name}! 🎉
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto', fontWeight: 300 }}>
            Complete your profile so the community knows who you are.
            <br />
            <span style={{ fontSize: '13px', color: 'var(--coral)', fontWeight: 500 }}>
              ⚠️ You need a complete profile to publish posts or comment.
            </span>
          </p>
        </div>

        <div className="card" style={{ padding: '36px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Full name */}
            <div>
              <label style={lbl}>Full Name *</label>
              <input style={inp} type="text" placeholder="Your full name"
                value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
            </div>

            {/* Designation */}
            <div>
              <label style={lbl}>Designation / Role</label>
              <input style={inp} type="text" placeholder="e.g. Science Teacher, EdTech Founder, Sales Manager"
                value={form.designation} onChange={e => set('designation', e.target.value)} />
            </div>

            {/* Organisation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>School / Institute</label>
                <input style={inp} type="text" placeholder="Your school or college"
                  value={form.instituteName} onChange={e => set('instituteName', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Company</label>
                <input style={inp} type="text" placeholder="Your company name"
                  value={form.companyName} onChange={e => set('companyName', e.target.value)} />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label style={lbl}>Contact Number</label>
              <input style={inp} type="tel" placeholder="Your mobile number"
                value={form.contactNumber} onChange={e => set('contactNumber', e.target.value)} />
            </div>

            {/* Bio */}
            <div>
              <label style={lbl}>Short Bio</label>
              <textarea style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }} rows={3}
                placeholder="Tell the community about yourself — your experience, interests, what you write about..."
                value={form.introduction} onChange={e => set('introduction', e.target.value)} />
            </div>

            {/* LinkedIn */}
            <div>
              <label style={lbl}>LinkedIn URL (optional)</label>
              <input style={inp} type="url" placeholder="https://linkedin.com/in/yourname"
                value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} />
            </div>

            {/* Location */}
            <div>
              <label style={lbl}>Location (City, State)</label>
              <input style={inp} type="text" placeholder="e.g. Bangalore, Karnataka"
                value={form.location} onChange={e => set('location', e.target.value)} />
            </div>

            {/* Interests */}
            <div>
              <label style={lbl}>Areas of Interest (comma separated)</label>
              <input style={inp} type="text" placeholder="e.g. EdTech, AI in Education, School Leadership"
                value={form.interests} onChange={e => set('interests', e.target.value)} />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button type="button" onClick={handleSkip} disabled={skipping}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 20px', borderRadius: 'var(--radius)', border: '1.5px solid var(--parchment)', background: '#fff', color: 'var(--muted)', cursor: 'pointer', fontSize: '14px', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                {skipping ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <SkipForward style={{ width: 14, height: 14 }} />}
                Skip for now
              </button>
              <button type="submit" className="btn-teal" disabled={loading}
                style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '15px', opacity: loading ? .7 : 1 }}>
                {loading
                  ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Saving…</>
                  : <><ArrowRight style={{ width: 16, height: 16 }} /> Save & Go to Feed</>}
              </button>
            </div>
          </form>
        </div>

        {/* Why complete profile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '16px' }}>
          {[
            { icon: '✍️', title: 'Publish Posts', desc: 'Required to write and publish articles' },
            { icon: '💬', title: 'Comment', desc: 'Required to comment on posts' },
            { icon: '🤝', title: 'Get Found', desc: 'Help others discover your work' },
          ].map(item => (
            <div key={item.title} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{item.icon}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '12px', color: 'var(--ink)', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
