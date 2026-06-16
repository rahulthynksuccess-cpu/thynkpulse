'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Bell, Send, Loader2, Users, Globe, BookOpen, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

function hdrs() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('tp_access_token') || '' : ''
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }
}

const TEMPLATES = [
  { label: 'New Feature Announcement', body: 'We've just launched something new on ThynkPulse! Log in to explore the latest features.' },
  { label: 'Submission Reminder',      body: 'Have a story to share? Submit your post today and connect with 10,000+ educators reading ThynkPulse.' },
  { label: 'Scheduled Maintenance',    body: 'ThynkPulse will be briefly unavailable on Saturday 11 PM – 1 AM IST for scheduled maintenance.' },
  { label: 'Community Milestone',      body: 'ThynkPulse just hit a major milestone! Thank you for being part of this incredible community of educators.' },
]

const V = {
  bg:    'var(--admin-bg, #F5ECD8)',
  card:  'rgba(255,255,255,0.9)',
  border:'1px solid rgba(26,18,8,0.09)',
  text:  '#1A1208',
  muted: '#7A6A52',
  teal:  'var(--teal, #0A5F55)',
}

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 13px', background: '#fff',
  border: '1px solid rgba(26,18,8,0.12)', borderRadius: 9,
  color: V.text, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '1.2px',
  textTransform: 'uppercase', color: V.muted, marginBottom: 6, fontFamily: 'var(--font-sans)',
}

export default function AdminNotificationsPage() {
  const qc = useQueryClient()
  const [audience, setAudience] = useState<'all' | 'writers' | 'educators'>('all')
  const [title,    setTitle]    = useState('')
  const [body,     setBody]     = useState('')
  const [link,     setLink]     = useState('')

  const { data } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => fetch('/api/admin/notifications', { headers: hdrs() }).then(r => r.json()),
    staleTime: 30_000,
  })

  const send = useMutation({
    mutationFn: () => fetch('/api/admin/notifications', {
      method: 'POST', headers: hdrs(),
      body: JSON.stringify({ audience, title, body, link: link || undefined }),
    }).then(r => r.json()),
    onSuccess: () => {
      toast.success('Notification sent!')
      setTitle(''); setBody(''); setLink('')
      qc.invalidateQueries({ queryKey: ['admin-notifications'] })
    },
    onError: () => toast.error('Failed to send'),
  })

  const del = useMutation({
    mutationFn: (id: string) => fetch('/api/admin/notifications', {
      method: 'DELETE', headers: hdrs(), body: JSON.stringify({ id }),
    }).then(r => r.json()),
    onSuccess: () => {
      toast.success('Deleted')
      qc.invalidateQueries({ queryKey: ['admin-notifications'] })
    },
  })

  const AUDIENCE_OPTS = [
    { value: 'all',       icon: Globe,    label: 'All Users',    desc: 'Everyone on ThynkPulse',        color: '#0A5F55' },
    { value: 'writers',   icon: BookOpen, label: 'Writers',      desc: 'Educators + EdTech pros',       color: '#C9922A' },
    { value: 'educators', icon: Users,    label: 'Educators',    desc: 'Educator-role accounts only',   color: '#3D1F5E' },
  ]

  const broadcasts = data?.notifications || []

  return (
    <AdminLayout title="Notifications" subtitle="Broadcast in-app messages to all users or specific groups">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

        {/* Compose */}
        <div style={{ background: V.card, border: V.border, borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16, color: V.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell style={{ width: 16, height: 16, color: V.teal }} /> Compose Notification
          </h3>

          {/* Audience */}
          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Send To</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {AUDIENCE_OPTS.map(opt => {
                const Icon = opt.icon
                return (
                  <button key={opt.value} onClick={() => setAudience(opt.value as any)}
                    style={{ flex: 1, padding: '11px', borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                      border: audience === opt.value ? `1.5px solid ${opt.color}` : '1px solid rgba(26,18,8,0.1)',
                      background: audience === opt.value ? `${opt.color}12` : 'rgba(255,255,255,0.5)',
                      transition: 'all .15s' }}>
                    <Icon style={{ width: 15, height: 15, color: opt.color, marginBottom: 5 }} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: V.text, fontFamily: 'var(--font-sans)' }}>{opt.label}</div>
                    <div style={{ fontSize: 10, color: V.muted, marginTop: 2, fontFamily: 'var(--font-sans)' }}>{opt.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value.slice(0, 80))}
              placeholder="e.g. New feature available!" style={inp} />
            <div style={{ fontSize: 10, color: V.muted, textAlign: 'right', marginTop: 3 }}>{title.length}/80</div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Message *</label>
            <textarea value={body} onChange={e => setBody(e.target.value.slice(0, 500))}
              rows={4} placeholder="Write your notification message..."
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
            <div style={{ fontSize: 10, color: V.muted, textAlign: 'right', marginTop: 3 }}>{body.length}/500</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Link (optional)</label>
            <input value={link} onChange={e => setLink(e.target.value)}
              placeholder="/trending  or  https://..." style={inp} />
            <div style={{ fontSize: 11, color: V.muted, marginTop: 4 }}>Click destination when user taps the notification.</div>
          </div>

          <button
            onClick={() => { if (!title || !body) { toast.error('Title and body required'); return } send.mutate() }}
            disabled={send.isPending}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: V.teal, color: '#fff', border: 'none', borderRadius: 9, padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: send.isPending ? .7 : 1, boxShadow: '0 4px 14px rgba(10,95,85,.25)' }}>
            {send.isPending
              ? <><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> Sending…</>
              : <><Send style={{ width: 15, height: 15 }} /> Send Notification</>}
          </button>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Quick Templates */}
          <div style={{ background: V.card, border: V.border, borderRadius: 14, padding: 20 }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, color: V.text, marginBottom: 12 }}>Quick Templates</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TEMPLATES.map(t => (
                <button key={t.label} onClick={() => { setTitle(t.label); setBody(t.body) }}
                  style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(10,95,85,0.04)', border: '1px solid rgba(10,95,85,0.12)', color: V.muted, cursor: 'pointer', textAlign: 'left', fontSize: 12, fontFamily: 'var(--font-sans)', transition: 'all .15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(10,95,85,.3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(10,95,85,.12)'}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div style={{ background: V.card, border: V.border, borderRadius: 14, padding: 20 }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, color: V.text, marginBottom: 4 }}>Preview</h4>
            <p style={{ fontSize: 11, color: V.muted, marginBottom: 12 }}>How the bell notification will look</p>
            <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid rgba(26,18,8,0.08)', boxShadow: '0 2px 12px rgba(26,18,8,0.07)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--teal, #0A5F55)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell style={{ width: 15, height: 15, color: '#fff' }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: V.text, fontFamily: 'var(--font-sans)', marginBottom: 2 }}>{title || 'Notification Title'}</div>
                  <div style={{ fontSize: 12, color: V.muted, fontFamily: 'var(--font-sans)', lineHeight: 1.5 }}>{body || 'Your message will appear here...'}</div>
                  <div style={{ fontSize: 10, color: '#C9AE7A', marginTop: 6 }}>ThynkPulse · just now</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Broadcasts */}
          <div style={{ background: V.card, border: V.border, borderRadius: 14, padding: 20 }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, color: V.text, marginBottom: 12 }}>Recent Broadcasts</h4>
            {broadcasts.length === 0
              ? <div style={{ fontSize: 12, color: V.muted, textAlign: 'center', padding: '16px 0' }}>No broadcasts yet.</div>
              : broadcasts.slice(0, 6).map((n: any) => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid rgba(26,18,8,0.06)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: V.text, marginBottom: 1 }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: V.muted, marginBottom: 2, lineHeight: 1.4 }}>{n.body}</div>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'rgba(10,95,85,0.08)', color: '#0A5F55', fontWeight: 600 }}>
                      → {n.audience}
                    </span>
                  </div>
                  <button onClick={() => { if (confirm('Delete this broadcast?')) del.mutate(n.id) }}
                    style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#C0AE96' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#C0AE96'}>
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
