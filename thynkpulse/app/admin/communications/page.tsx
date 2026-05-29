'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api'
import toast from 'react-hot-toast'

// ── Types ─────────────────────────────────────────────────────
type Channel = 'email' | 'whatsapp'
const CH_COLOR: Record<Channel, string> = { email: '#4F46E5', whatsapp: '#25D366' }
const CH_BG:    Record<Channel, string> = { email: 'rgba(79,70,229,.1)', whatsapp: 'rgba(37,211,102,.1)' }

interface Template {
  id: string; name: string; channel: Channel; subject?: string; body: string
  whatsapp_template_name?: string; whatsapp_template_lang?: string; is_active: boolean
}
interface Trigger {
  id: string; event_type: string; channel: Channel; template_id: string | null
  recipient_type: 'user' | 'admin'; is_active: boolean; created_at: string
  template_name?: string
}

// ── Platform events ───────────────────────────────────────────
const EVENT_TYPES = [
  { key: 'user.registered',       label: 'User Registered',         desc: 'New user signs up on ThynkPulse', recipient: 'user' },
  { key: 'user.approved',         label: 'User Approved',           desc: 'Admin approves a writer profile', recipient: 'user' },
  { key: 'post.submitted',        label: 'Post Submitted',          desc: 'A writer submits a post for review', recipient: 'admin' },
  { key: 'post.approved',         label: 'Post Published',          desc: 'Admin approves and publishes a post', recipient: 'user' },
  { key: 'post.rejected',         label: 'Post Rejected',           desc: 'Admin rejects a submitted post', recipient: 'user' },
  { key: 'comment.received',      label: 'Comment on Post',         desc: 'Someone comments on the author\'s post', recipient: 'user' },
  { key: 'follower.new',          label: 'New Follower',            desc: 'Someone follows a writer', recipient: 'user' },
  { key: 'newsletter.welcome',    label: 'Newsletter Welcome',      desc: 'User subscribes to the newsletter', recipient: 'user' },
]

// ── Template variables ────────────────────────────────────────
const TPLVARS = [
  '{{user_name}}', '{{user_email}}', '{{user_designation}}',
  '{{post_title}}', '{{post_url}}', '{{post_category}}', '{{post_excerpt}}',
  '{{commenter_name}}', '{{comment_text}}',
  '{{follower_name}}', '{{follower_designation}}',
  '{{site_name}}', '{{site_url}}', '{{admin_url}}',
]

// ── Shared styles ─────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: '#fff', border: '1.5px solid var(--border)',
  borderRadius: 8, color: 'var(--ink)', fontSize: 13,
  fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '1px',
  textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6,
  fontFamily: 'var(--font-sans)',
}
const pill = (bg: string, color: string): React.CSSProperties => ({
  display: 'inline-block', padding: '2px 9px', borderRadius: 100,
  background: bg, color, fontSize: 11, fontWeight: 700,
  fontFamily: 'var(--font-sans)',
})
const tog = (on: boolean, color = '#22C55E'): React.CSSProperties => ({
  width: 44, height: 24, borderRadius: 12, background: on ? color : 'var(--border)',
  position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0,
})
const togDot = (on: boolean): React.CSSProperties => ({
  width: 18, height: 18, borderRadius: '50%', background: '#fff',
  position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left .2s',
  boxShadow: '0 1px 3px rgba(0,0,0,.2)',
})
const card: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)',
  borderRadius: 14, overflow: 'hidden',
}

// ── Template Modal ────────────────────────────────────────────
function TemplateModal({ initial, onClose, onSave }: {
  initial?: Template; onClose: () => void
  onSave: (d: Partial<Template>) => void
}) {
  const blank: Partial<Template> = { channel: 'email', is_active: true, name: '', subject: '', body: '', whatsapp_template_name: '', whatsapp_template_lang: 'en' }
  const [f, setF] = useState<Partial<Template>>(initial ?? blank)
  const [preview, setPreview] = useState(false)
  const set = (k: keyof Template, v: any) => setF(p => ({ ...p, [k]: v }))
  const insertVar = (v: string) => setF(p => ({ ...p, body: (p.body || '') + v }))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 640, maxHeight: '92vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.18)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1.5px solid var(--border)', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{initial?.id ? 'Edit Template' : 'New Template'}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Email & WhatsApp message templates</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20 }}>✕</button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name + Channel */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
            <div>
              <label style={lbl}>Template Name *</label>
              <input value={f.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="e.g. Welcome Email" style={inp} />
            </div>
            <div>
              <label style={lbl}>Channel *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['email', 'whatsapp'] as Channel[]).map(c => (
                  <button key={c} onClick={() => set('channel', c)}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1.5px solid ${f.channel === c ? CH_COLOR[c] : 'var(--border)'}`, background: f.channel === c ? CH_BG[c] : '#fff', color: f.channel === c ? CH_COLOR[c] : 'var(--muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    {c === 'email' ? '📧' : '💬'} {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subject (email only) */}
          {f.channel === 'email' && (
            <div>
              <label style={lbl}>Subject</label>
              <input value={f.subject ?? ''} onChange={e => set('subject', e.target.value)} placeholder="Welcome to ThynkPulse, {{user_name}}!" style={inp} />
            </div>
          )}

          {/* Variable chips */}
          <div>
            <label style={lbl}>Insert Variable (click to add to body)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {TPLVARS.map(v => (
                <button key={v} onClick={() => insertVar(v)}
                  style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(10,95,85,.06)', border: '1.5px solid rgba(10,95,85,.2)', color: 'var(--teal)', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer' }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Body / editor */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ ...lbl, margin: 0 }}>{f.channel === 'whatsapp' ? 'Message' : 'Body (HTML or plain text)'}</label>
              {f.channel === 'email' && (
                <button onClick={() => setPreview(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal)', fontSize: 12, fontWeight: 600 }}>
                  {preview ? '✏️ Edit' : '👁️ Preview'}
                </button>
              )}
            </div>

            {preview && f.channel === 'email' ? (
              <div style={{ background: 'var(--cream)', borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>Subject</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 14, paddingBottom: 12, borderBottom: '1.5px solid var(--border)' }}>{f.subject || '(no subject)'}</div>
                <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{f.body || '(no body)'}</div>
              </div>
            ) : (
              <textarea value={f.body ?? ''} onChange={e => set('body', e.target.value)}
                rows={f.channel === 'whatsapp' ? 6 : 12}
                placeholder={f.channel === 'whatsapp'
                  ? 'Hello {{user_name}}! Welcome to ThynkPulse 🎉'
                  : `Dear {{user_name}},\n\nWelcome to ThynkPulse — India's community for educators...\n\n`}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.65, fontFamily: f.channel === 'email' ? 'monospace' : 'var(--font-sans)', fontSize: 12 }} />
            )}

            {/* WhatsApp live preview */}
            {f.channel === 'whatsapp' && f.body && (
              <div style={{ marginTop: 10, padding: 14, background: '#0B1418', borderRadius: 10, borderLeft: '3px solid #25D366' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#25D366', marginBottom: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>Preview</div>
                <div style={{ background: '#1F2C34', borderRadius: '12px 12px 12px 2px', padding: '10px 14px', maxWidth: 280, display: 'inline-block' }}>
                  <div style={{ fontSize: 12, color: '#E9EDEF', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: f.body.replace(/\*(.+?)\*/g, '<strong>$1</strong>').replace(/_(.+?)_/g, '<em>$1</em>') }} />
                  <div style={{ fontSize: 10, color: '#8696A0', marginTop: 4, textAlign: 'right' }}>12:34 ✓✓</div>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Meta template fields */}
          {f.channel === 'whatsapp' && (
            <div style={{ padding: 16, borderRadius: 12, background: 'rgba(37,211,102,.05)', border: '1.5px solid rgba(37,211,102,.25)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#25D366', marginBottom: 4 }}>💬 Meta Approved Template <span style={{ fontWeight: 400, color: 'var(--muted)', fontSize: 11 }}>(required for first-contact messages)</span></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.5 }}>
                Enter the <strong>exact name</strong> from Meta Business Manager (e.g. <code>welcome_user</code>). Leave blank to send plain-text session messages (only within 24h of user reply).
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Template Name (Meta)</label>
                  <input value={f.whatsapp_template_name ?? ''} onChange={e => set('whatsapp_template_name', e.target.value)} placeholder="e.g. welcome_user" style={{ ...inp, fontFamily: 'monospace', fontSize: 12 }} />
                </div>
                <div>
                  <label style={lbl}>Language</label>
                  <input value={f.whatsapp_template_lang ?? 'en'} onChange={e => set('whatsapp_template_lang', e.target.value)} placeholder="en" style={{ ...inp, fontFamily: 'monospace', fontSize: 12 }} />
                  <p style={{ fontSize: 10, color: 'var(--muted)', margin: '3px 0 0' }}>BCP-47: en, hi, mr, ta…</p>
                </div>
              </div>
            </div>
          )}

          {/* Active toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--cream)', borderRadius: 10, border: '1.5px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Active</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Inactive templates won't send even if a trigger fires</div>
            </div>
            <div style={tog(!!f.is_active)} onClick={() => set('is_active', !f.is_active)}>
              <div style={togDot(!!f.is_active)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1.5px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, position: 'sticky', bottom: 0, background: '#fff' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 9, border: '1.5px solid var(--border)', background: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          <button onClick={() => onSave(f)} disabled={!f.name || !f.body?.trim()}
            style={{ padding: '9px 22px', borderRadius: 9, background: 'var(--teal)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', opacity: !f.name || !f.body?.trim() ? 0.5 : 1 }}>
            {initial?.id ? 'Save Changes' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Trigger Modal ─────────────────────────────────────────────
function TriggerModal({ initial, templates, onClose, onSave }: {
  initial?: Trigger; templates: Template[]
  onClose: () => void; onSave: (d: Partial<Trigger>) => void
}) {
  const [f, setF] = useState<Partial<Trigger>>(initial ?? { event_type: 'user.registered', channel: 'email', is_active: true, recipient_type: 'user' })
  const set = (k: keyof Trigger, v: any) => setF(p => ({ ...p, [k]: v }))
  const channelTemplates = templates.filter(t => t.channel === f.channel && t.is_active)
  const eventDef = EVENT_TYPES.find(e => e.key === f.event_type)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1.5px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{initial?.id ? 'Edit Trigger' : 'Add Trigger'}</div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Event */}
          <div>
            <label style={lbl}>Event *</label>
            <select value={f.event_type ?? 'user.registered'} onChange={e => set('event_type', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              {EVENT_TYPES.map(et => <option key={et.key} value={et.key}>{et.label}</option>)}
            </select>
            {eventDef && <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{eventDef.desc}</p>}
          </div>

          {/* Channel */}
          <div>
            <label style={lbl}>Channel *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['email', 'whatsapp'] as Channel[]).map(c => (
                <button key={c} onClick={() => { set('channel', c); set('template_id', null) }}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1.5px solid ${f.channel === c ? CH_COLOR[c] : 'var(--border)'}`, background: f.channel === c ? CH_BG[c] : '#fff', color: f.channel === c ? CH_COLOR[c] : 'var(--muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  {c === 'email' ? '📧' : '💬'} {c}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label style={lbl}>Send To *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['user', 'admin'] as const).map(rt => (
                <button key={rt} onClick={() => set('recipient_type', rt)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${f.recipient_type === rt ? 'var(--teal)' : 'var(--border)'}`, background: f.recipient_type === rt ? 'rgba(10,95,85,.07)' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: f.recipient_type === rt ? 'var(--teal)' : 'var(--ink)', fontFamily: 'var(--font-sans)' }}>
                    {rt === 'user' ? '🎓 User' : '🛡️ Admin'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, fontFamily: 'var(--font-sans)' }}>
                    {rt === 'user' ? "User's email / phone on their profile" : 'Site admin email'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template */}
          <div>
            <label style={lbl}>Template *</label>
            <select value={f.template_id ?? ''} onChange={e => set('template_id', e.target.value || null)} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">— Select template —</option>
              {channelTemplates.map(t => <option key={t.id} value={t.id}>{t.name}{t.channel === 'email' && t.subject ? ` · ${t.subject.slice(0, 40)}` : ''}</option>)}
            </select>
            {channelTemplates.length === 0 && (
              <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>⚠ No active {f.channel} templates. Create one first.</p>
            )}
          </div>

          {/* Active toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--cream)', borderRadius: 10, border: '1.5px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Active</div>
            <div style={tog(!!f.is_active)} onClick={() => set('is_active', !f.is_active)}>
              <div style={togDot(!!f.is_active)} />
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1.5px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 9, border: '1.5px solid var(--border)', background: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          <button onClick={() => onSave(f)} disabled={!f.template_id}
            style={{ padding: '9px 22px', borderRadius: 9, background: 'var(--teal)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', opacity: !f.template_id ? 0.5 : 1 }}>
            {initial?.id ? 'Save Changes' : 'Create Trigger'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function CommunicationsPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'templates' | 'triggers'>('templates')
  const [chFilter, setChFilter] = useState<Channel | 'all'>('all')
  const [templateModal, setTemplateModal] = useState<Template | true | null>(null)
  const [triggerModal, setTriggerModal] = useState<Trigger | true | null>(null)
  const [activeTrigger, setActiveTrigger] = useState<Trigger | null>(null)

  const { data: tplData } = useQuery({ queryKey: ['comm-templates'], queryFn: () => apiGet('/admin/comm/templates'), staleTime: 60_000 })
  const { data: trData }  = useQuery({ queryKey: ['comm-triggers'],  queryFn: () => apiGet('/admin/comm/triggers'),  staleTime: 60_000 })
  const templates: Template[] = tplData?.templates ?? []
  const triggers:  Trigger[]  = trData?.triggers   ?? []

  useEffect(() => {
    if (!activeTrigger && triggers.length) setActiveTrigger(triggers[0])
  }, [triggers])

  async function saveTemplate(data: Partial<Template>) {
    try {
      if ((data as any).id) await apiPatch('/admin/comm/templates', data)
      else await apiPost('/admin/comm/templates', data)
      toast.success('✅ Template saved!')
      qc.invalidateQueries({ queryKey: ['comm-templates'] })
      setTemplateModal(null)
    } catch (e: any) { toast.error('❌ ' + e.message) }
  }

  async function deleteTemplate(id: string) {
    if (!confirm('Delete this template?')) return
    await apiDelete('/admin/comm/templates').catch(() => {})
    // Pass id in body — need a fetch workaround
    await fetch('/api/admin/comm/templates', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('tp_token') || ''}` }, body: JSON.stringify({ id }) })
    toast.success('🗑 Template deleted')
    qc.invalidateQueries({ queryKey: ['comm-templates'] })
  }

  async function saveTrigger(data: Partial<Trigger>) {
    try {
      if ((data as any).id) await apiPatch('/admin/comm/triggers', data)
      else await apiPost('/admin/comm/triggers', data)
      toast.success('✅ Trigger saved!')
      qc.invalidateQueries({ queryKey: ['comm-triggers'] })
      setTriggerModal(null)
    } catch (e: any) { toast.error('❌ ' + e.message) }
  }

  async function deleteTrigger(id: string) {
    if (!confirm('Delete this trigger?')) return
    await fetch('/api/admin/comm/triggers', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('tp_token') || ''}` }, body: JSON.stringify({ id }) })
    toast.success('🗑 Trigger deleted')
    qc.invalidateQueries({ queryKey: ['comm-triggers'] })
    setActiveTrigger(null)
  }

  const filteredTriggers = triggers.filter(t => chFilter === 'all' || t.channel === chFilter)
  const emailActive = triggers.filter(t => t.channel === 'email' && t.is_active).length
  const waActive    = triggers.filter(t => t.channel === 'whatsapp' && t.is_active).length

  return (
    <AdminLayout title="Communications" subtitle="Auto-send emails & WhatsApp messages on platform events">

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { k: 'templates' as const, icon: '✉️', label: 'Message Templates', count: templates.length },
          { k: 'triggers'  as const, icon: '🔔', label: 'Triggers',           count: triggers.filter(t => t.is_active).length },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: `1.5px solid ${tab === t.k ? 'var(--teal)' : 'var(--border)'}`, background: tab === t.k ? 'rgba(10,95,85,.07)' : '#fff', color: tab === t.k ? 'var(--teal)' : 'var(--ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            {t.icon} {t.label}
            {t.count > 0 && <span style={pill('var(--teal)', '#fff')}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── TEMPLATES ── */}
      {tab === 'templates' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '12px 16px', ...card }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
                {templates.length === 0 ? 'No templates yet' : `${templates.length} template${templates.length !== 1 ? 's' : ''} · ${templates.filter(t => t.is_active).length} active`}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Use {'{{variable}}'} placeholders. Templates are linked to Triggers.</div>
            </div>
            <button onClick={() => setTemplateModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 9, background: 'var(--teal)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              + New Template
            </button>
          </div>

          {templates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 64, ...card, border: '1.5px dashed var(--border)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No templates yet</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Create email or WhatsApp templates. Use {'{{user_name}}'} as a placeholder.</div>
              <button onClick={() => setTemplateModal(true)}
                style={{ padding: '10px 22px', borderRadius: 9, background: 'var(--teal)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                + Create First Template
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {templates.map(t => (
                <div key={t.id} style={{ ...card, padding: '15px 20px', display: 'flex', alignItems: 'center', gap: 14, opacity: t.is_active ? 1 : 0.6 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{t.channel === 'email' ? '📧' : '💬'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{t.name}</span>
                      <span style={pill(CH_BG[t.channel], CH_COLOR[t.channel])}>{t.channel}</span>
                      <span style={pill(t.is_active ? 'rgba(16,185,129,.1)' : 'var(--border)', t.is_active ? '#15803d' : 'var(--muted)')}>{t.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    {t.subject && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>📨 {t.subject}</div>}
                    <div style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>{t.body?.slice(0, 120)}…</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => setTemplateModal(t)} style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: '#fff', color: 'var(--teal)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteTemplate(t.id)} style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.07)', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TRIGGERS ── */}
      {tab === 'triggers' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>📧 {emailActive} email · 💬 {waActive} WhatsApp active</span>
              {(['all', 'email', 'whatsapp'] as const).map(ch => (
                <button key={ch} onClick={() => setChFilter(ch)}
                  style={{ padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${chFilter === ch ? 'var(--teal)' : 'var(--border)'}`, background: chFilter === ch ? 'rgba(10,95,85,.07)' : 'transparent', color: chFilter === ch ? 'var(--teal)' : 'var(--muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  {ch === 'all' ? 'All' : ch === 'email' ? '📧 Email' : '💬 WhatsApp'}
                </button>
              ))}
            </div>
            <button onClick={() => setTriggerModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 9, background: 'var(--teal)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              + Add Trigger
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, alignItems: 'start' }}>
            {/* Trigger list */}
            <div style={card}>
              <div style={{ padding: '10px 14px', borderBottom: '1.5px solid var(--border)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {filteredTriggers.length} trigger{filteredTriggers.length !== 1 ? 's' : ''}
                </span>
              </div>
              {filteredTriggers.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
                  {triggers.length === 0 ? 'No triggers yet — add one!' : 'No triggers for this filter'}
                </div>
              ) : filteredTriggers.map(t => {
                const isActive = activeTrigger?.id === t.id
                const ev = EVENT_TYPES.find(e => e.key === t.event_type)
                return (
                  <button key={t.id} onClick={() => setActiveTrigger(t)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', border: 'none', textAlign: 'left', background: isActive ? 'rgba(10,95,85,.07)' : 'transparent', borderLeft: `3px solid ${isActive ? 'var(--teal)' : 'transparent'}`, cursor: 'pointer', transition: 'all .12s' }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{t.channel === 'email' ? '📧' : '💬'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? 'var(--teal)' : 'var(--ink)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ev?.label ?? t.event_type}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{t.template_name ?? 'No template'} · {t.recipient_type === 'admin' ? '🛡️ Admin' : '🎓 User'}</div>
                    </div>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: t.is_active ? '#10b981' : 'var(--border)' }} />
                  </button>
                )
              })}
            </div>

            {/* Detail panel */}
            {activeTrigger ? (
              <div style={card}>
                <div style={{ padding: '18px 20px', borderBottom: '1.5px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 17, color: 'var(--ink)', marginBottom: 8 }}>
                      {EVENT_TYPES.find(e => e.key === activeTrigger.event_type)?.label ?? activeTrigger.event_type}
                    </div>
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                      <span style={pill(CH_BG[activeTrigger.channel], CH_COLOR[activeTrigger.channel])}>{activeTrigger.channel === 'email' ? '📧' : '💬'} {activeTrigger.channel}</span>
                      <span style={pill(activeTrigger.is_active ? 'rgba(16,185,129,.1)' : 'var(--border)', activeTrigger.is_active ? '#15803d' : 'var(--muted)')}>{activeTrigger.is_active ? 'Active' : 'Inactive'}</span>
                      <span style={pill('rgba(10,95,85,.07)', 'var(--teal)')}>{activeTrigger.recipient_type === 'admin' ? '🛡️ Admin' : '🎓 User'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => setTriggerModal(activeTrigger)} style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: '#fff', color: 'var(--ink)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏️ Edit</button>
                    <button onClick={() => deleteTrigger(activeTrigger.id)} style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.07)', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🗑 Delete</button>
                  </div>
                </div>

                {/* Template preview */}
                {(() => {
                  const tmpl = templates.find(t => t.id === activeTrigger.template_id)
                  if (!tmpl) return (
                    <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                      ⚠️ No template linked. Edit this trigger to assign a template.
                    </div>
                  )
                  return (
                    <div style={{ padding: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: 12 }}>Template Preview — {tmpl.name}</div>
                      {tmpl.subject && (
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 10, padding: '8px 12px', background: 'var(--cream)', borderRadius: 8 }}>📨 {tmpl.subject}</div>
                      )}
                      {tmpl.channel === 'whatsapp' ? (
                        <div style={{ padding: 14, background: '#0B1418', borderRadius: 10, borderLeft: '3px solid #25D366' }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#25D366', marginBottom: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>WhatsApp Bubble</div>
                          <div style={{ background: '#1F2C34', borderRadius: '12px 12px 12px 2px', padding: '10px 14px', maxWidth: 300, display: 'inline-block' }}>
                            <div style={{ fontSize: 12, color: '#E9EDEF', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}
                              dangerouslySetInnerHTML={{ __html: tmpl.body.replace(/\*(.+?)\*/g, '<strong>$1</strong>').replace(/_(.+?)_/g, '<em>$1</em>') }} />
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: 14, background: 'var(--cream)', borderRadius: 10, fontSize: 13, color: 'var(--ink)', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)' }}>
                          {tmpl.body}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            ) : (
              <div style={{ ...card, padding: 48, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                {triggers.length === 0 ? 'Create your first trigger to get started' : 'Select a trigger from the list'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {templateModal && (
        <TemplateModal
          initial={templateModal === true ? undefined : templateModal}
          onClose={() => setTemplateModal(null)}
          onSave={saveTemplate}
        />
      )}
      {triggerModal && (
        <TriggerModal
          initial={triggerModal === true ? undefined : triggerModal}
          templates={templates}
          onClose={() => setTriggerModal(null)}
          onSave={saveTrigger}
        />
      )}
    </AdminLayout>
  )
}
