'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiGet, apiPost } from '@/lib/api'
import toast from 'react-hot-toast'

// ── Shared styles ─────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)',
  borderRadius: 9, fontSize: 13, color: 'var(--ink)', background: '#fff',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '1px',
  textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'var(--font-sans)',
}
const tog = (on: boolean, color = '#22C55E'): React.CSSProperties => ({
  width: 44, height: 24, borderRadius: 12, background: on ? color : 'var(--border)',
  position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0,
})
const togDot = (on: boolean): React.CSSProperties => ({
  width: 18, height: 18, borderRadius: '50%', background: '#fff',
  position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left .2s',
  boxShadow: '0 1px 3px rgba(0,0,0,.2)',
})

// ── WhatsApp providers ────────────────────────────────────────
const WA_PROVIDERS = {
  thynkcomm: { label: 'ThynkComm', badge: '⚡ Recommended', badgeColor: '#166534', badgeBg: 'rgba(22,101,52,0.1)', iconBg: 'linear-gradient(135deg,#1ab8a8,#0e8a7d)', icon: '💬', description: 'Use your ThynkComm deployment as the WhatsApp channel.', docsUrl: 'https://thynkcom.vercel.app', color: '#1ab8a8', colorBg: 'rgba(26,184,168,0.08)', colorBorder: 'rgba(26,184,168,0.3)' },
  meta:       { label: 'Meta Cloud API', badge: 'Direct',  badgeColor: '#1d4ed8', badgeBg: 'rgba(29,78,216,0.1)', iconBg: 'linear-gradient(135deg,#1877F2,#0d47a1)', icon: '🔵', description: 'Connect directly to Meta WhatsApp Business Cloud API.', docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started', color: '#1877F2', colorBg: 'rgba(24,119,242,0.08)', colorBorder: 'rgba(24,119,242,0.3)' },
  twilio:     { label: 'Twilio',    badge: 'International', badgeColor: '#6B21A8', badgeBg: 'rgba(107,33,168,0.1)', iconBg: 'linear-gradient(135deg,#F22F46,#a51829)', icon: '🔴', description: 'Twilio WhatsApp. Best for international setups.', docsUrl: 'https://www.twilio.com/docs/whatsapp', color: '#F22F46', colorBg: 'rgba(242,47,70,0.08)', colorBorder: 'rgba(242,47,70,0.3)' },
} as const
type WaProvider = keyof typeof WA_PROVIDERS

interface WaSettings {
  provider: WaProvider; enabled: boolean
  tcUrl: string; tcApiKey: string; tcApiSecret: string
  metaToken: string; metaPhoneId: string
  accountSid: string; authToken: string; fromNumber: string
}
const WA_DEFAULT: WaSettings = { provider: 'thynkcomm', enabled: false, tcUrl: '', tcApiKey: '', tcApiSecret: '', metaToken: '', metaPhoneId: '', accountSid: '', authToken: '', fromNumber: '' }

// ── SMTP types ────────────────────────────────────────────────
interface SmtpConfig {
  id: string; name: string; fromName: string; fromEmail: string
  smtpHost: string; smtpPort: string; smtpUser: string; smtpPass: string; enabled: boolean
}
function newSmtp(o: Partial<SmtpConfig> = {}): SmtpConfig {
  return { id: Math.random().toString(36).slice(2), name: 'Default SMTP', fromName: 'ThynkPulse', fromEmail: '', smtpHost: 'smtp.gmail.com', smtpPort: '587', smtpUser: '', smtpPass: '', enabled: true, ...o }
}

// ── Secret field ──────────────────────────────────────────────
function SecretInput({ label, hint, value, onChange, placeholder }: { label?: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      {label && <label style={lbl}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? hint ?? ''} style={{ ...inp, paddingRight: 40, fontFamily: 'monospace', fontSize: 12 }} />
        <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 14 }}>{show ? '🙈' : '👁️'}</button>
      </div>
      {hint && <p style={{ fontSize: 10, color: 'var(--muted)', margin: '4px 0 0' }}>{hint}</p>}
    </div>
  )
}

// ── SMTP Card ─────────────────────────────────────────────────
function SmtpCard({ cfg, index, total, onChange, onDelete, onTest, testing, testResult }: {
  cfg: SmtpConfig; index: number; total: number
  onChange: (p: Partial<SmtpConfig>) => void; onDelete: () => void
  onTest: (to: string) => void; testing: boolean; testResult: { ok: boolean; msg: string } | null
}) {
  const [expanded, setExpanded] = useState(index === 0)
  const [showPass, setShowPass] = useState(false)
  const [testTo, setTestTo] = useState('')

  return (
    <div style={{ background: '#fff', border: `1.5px solid ${cfg.enabled ? 'rgba(10,95,85,.4)' : 'var(--border)'}`, borderRadius: 14, overflow: 'hidden', marginBottom: 10 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', cursor: 'pointer', background: cfg.enabled ? 'rgba(10,95,85,.03)' : 'transparent' }} onClick={() => setExpanded(e => !e)}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--teal),var(--teal2))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>{cfg.name || 'Unnamed SMTP'}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{cfg.smtpHost || '—'}:{cfg.smtpPort || '—'} · from {cfg.fromEmail || cfg.smtpUser || '—'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
          <button onClick={() => onChange({ enabled: !cfg.enabled }) }
            style={{ padding: '5px 12px', borderRadius: 7, border: '1.5px solid var(--border)', background: cfg.enabled ? 'var(--ink)' : 'transparent', color: cfg.enabled ? '#fff' : 'var(--muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            {cfg.enabled ? 'Enabled' : 'Disabled'}
          </button>
          {total > 1 && <button onClick={onDelete} style={{ padding: '5px 10px', borderRadius: 7, border: '1.5px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.07)', color: '#dc2626', fontSize: 11, cursor: 'pointer' }}>🗑</button>}
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
            <div>
              <label style={lbl}>Config Name *</label>
              <input value={cfg.name} onChange={e => onChange({ name: e.target.value })} placeholder="e.g. Main SMTP" style={inp} />
            </div>
            <div>
              <label style={lbl}>Sender Name</label>
              <input value={cfg.fromName} onChange={e => onChange({ fromName: e.target.value })} placeholder="ThynkPulse" style={inp} />
            </div>
            <div>
              <label style={lbl}>From Email</label>
              <input value={cfg.fromEmail} onChange={e => onChange({ fromEmail: e.target.value })} placeholder="noreply@thynkpulse.in" style={inp} />
            </div>
            <div>
              <label style={lbl}>SMTP Host</label>
              <input value={cfg.smtpHost} onChange={e => onChange({ smtpHost: e.target.value })} placeholder="smtp.gmail.com" style={inp} />
            </div>
            <div>
              <label style={lbl}>SMTP Port</label>
              <input value={cfg.smtpPort} onChange={e => onChange({ smtpPort: e.target.value })} placeholder="587" style={inp} />
            </div>
            <div>
              <label style={lbl}>SMTP Username</label>
              <input value={cfg.smtpUser} onChange={e => onChange({ smtpUser: e.target.value })} placeholder="your@gmail.com" style={inp} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>Password / App Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={cfg.smtpPass} onChange={e => onChange({ smtpPass: e.target.value })} placeholder="xxxx xxxx xxxx xxxx" style={{ ...inp, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 14 }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
              <p style={{ fontSize: 10, color: 'var(--muted)', margin: '4px 0 0' }}>
                <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noreferrer" style={{ color: 'var(--teal)' }}>Gmail: use an App Password →</a>
              </p>
            </div>
          </div>

          {/* Test section */}
          <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--cream)', borderRadius: 10, border: '1.5px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 10, fontFamily: 'var(--font-serif)' }}>📤 Send Test Email</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={lbl}>Send test to</label>
                <input value={testTo} onChange={e => setTestTo(e.target.value)} placeholder="your@email.com" style={inp} />
              </div>
              <button onClick={() => onTest(testTo)} disabled={testing || !testTo.trim()}
                style={{ padding: '10px 18px', borderRadius: 9, border: '1.5px solid var(--teal)', background: 'transparent', color: 'var(--teal)', cursor: (testing || !testTo) ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', opacity: (testing || !testTo) ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                {testing ? '⏳ Sending…' : '🔌 Test SMTP'}
              </button>
            </div>
            {testResult && (
              <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 8, background: testResult.ok ? 'rgba(16,185,129,.07)' : 'rgba(239,68,68,.07)', border: `1px solid ${testResult.ok ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.3)'}`, fontSize: 12, fontWeight: 600, color: testResult.ok ? '#15803d' : '#dc2626' }}>
                {testResult.ok ? '✅' : '❌'} {testResult.msg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Email Tab ─────────────────────────────────────────────────
function EmailTab() {
  const [configs, setConfigs] = useState<SmtpConfig[]>([newSmtp()])
  const [saving, setSaving] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; msg: string } | null>>({})

  useEffect(() => {
    apiGet('/admin/comm/settings').then(d => {
      const saved: SmtpConfig[] = d?.['comm.email_smtp_configs']
      if (saved?.length) setConfigs(saved.map(c => ({ ...newSmtp(), ...c, id: c.id || Math.random().toString(36).slice(2) })))
    }).catch(() => {})
  }, [])

  const update = (id: string, p: Partial<SmtpConfig>) => setConfigs(prev => prev.map(c => c.id === id ? { ...c, ...p } : c))
  const add    = () => setConfigs(p => [...p, newSmtp({ name: `SMTP ${p.length + 1}` })])
  const remove = (id: string) => setConfigs(p => p.filter(c => c.id !== id))

  const save = async () => {
    setSaving(true)
    try {
      await apiPost('/admin/comm/settings', { key: 'comm.email_smtp_configs', value: configs })
      toast.success('✅ Email SMTP configurations saved!')
    } catch { toast.error('❌ Save failed') }
    setSaving(false)
  }

  const testSmtp = async (cfg: SmtpConfig, to: string) => {
    if (!to.trim())                  { toast.error('Enter a test recipient'); return }
    if (!cfg.smtpUser || !cfg.smtpPass) { toast.error('Fill SMTP credentials first'); return }
    setTestingId(cfg.id)
    setTestResults(p => ({ ...p, [cfg.id]: null }))
    try {
      const r = await apiPost('/admin/comm/test', { type: 'email', to, smtpHost: cfg.smtpHost, smtpPort: cfg.smtpPort, smtpUser: cfg.smtpUser, smtpPass: cfg.smtpPass, fromName: cfg.fromName, fromEmail: cfg.fromEmail })
      setTestResults(p => ({ ...p, [cfg.id]: { ok: !!r.success, msg: r.message || r.error || 'Unknown' } }))
      toast(r.success ? '✅ Test email sent!' : '❌ SMTP test failed')
    } catch (e: any) { setTestResults(p => ({ ...p, [cfg.id]: { ok: false, msg: e.message } })) }
    setTestingId(null)
  }

  const hasEnabled = configs.some(c => c.enabled)

  return (
    <div>
      <div style={{ background: 'rgba(10,95,85,.05)', border: '1.5px solid rgba(10,95,85,.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--teal)', marginBottom: 6, fontFamily: 'var(--font-serif)' }}>📧 SMTP Email Configuration</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          Configure the SMTP account(s) ThynkPulse uses to send emails when triggers fire. You can add multiple accounts for different purposes.
        </div>
      </div>
      {!hasEnabled && (
        <div style={{ background: 'rgba(239,68,68,.07)', border: '1.5px solid rgba(239,68,68,.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 12, fontWeight: 600, color: '#dc2626' }}>
          ⚠️ No SMTP config enabled — emails from triggers will not send.
        </div>
      )}

      {configs.map((cfg, i) => (
        <SmtpCard key={cfg.id} cfg={cfg} index={i} total={configs.length}
          onChange={p => update(cfg.id, p)}
          onDelete={() => remove(cfg.id)}
          onTest={to => testSmtp(cfg, to)}
          testing={testingId === cfg.id}
          testResult={testResults[cfg.id] ?? null}
        />
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center' }}>
        <button onClick={add} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 9, border: '1.5px solid var(--teal)', background: 'transparent', color: 'var(--teal)', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
          + Add SMTP Config
        </button>
        <button onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 24px', borderRadius: 9, background: 'var(--teal)', border: 'none', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', opacity: saving ? 0.7 : 1 }}>
          {saving ? '⏳ Saving…' : '💾 Save SMTP Config'}
        </button>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{configs.length} config{configs.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

// ── WhatsApp Tab ──────────────────────────────────────────────
function WhatsAppTab() {
  const [wa, setWa] = useState<WaSettings>(WA_DEFAULT)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testPhone, setTestPhone] = useState('')
  const [testMsg, setTestMsg] = useState('Hello from ThynkPulse! Your WhatsApp integration is working. 🎉')
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string; hint?: string; raw?: any } | null>(null)
  const [showRaw, setShowRaw] = useState(false)
  const set = (p: Partial<WaSettings>) => setWa(prev => ({ ...prev, ...p }))

  useEffect(() => {
    apiGet('/admin/comm/settings').then(d => {
      if (d?.['comm.whatsapp_settings']) setWa(prev => ({ ...WA_DEFAULT, ...d['comm.whatsapp_settings'] }))
    }).catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await apiPost('/admin/comm/settings', { key: 'comm.whatsapp_settings', value: wa })
      toast.success('✅ WhatsApp settings saved!')
    } catch { toast.error('❌ Save failed') }
    setSaving(false)
  }

  const norm = (raw: string) => {
    let d = raw.replace(/\D/g, '')
    if (d.length === 10 && d[0] !== '0') d = '91' + d
    if (d.length === 11 && d[0] === '0') d = '91' + d.slice(1)
    return d
  }
  const isConfigured = () => {
    if (wa.provider === 'thynkcomm') return !!(wa.tcUrl && wa.tcApiKey && wa.tcApiSecret)
    if (wa.provider === 'meta')      return !!(wa.metaToken && wa.metaPhoneId)
    if (wa.provider === 'twilio')    return !!(wa.accountSid && wa.authToken && wa.fromNumber)
    return false
  }

  const sendTest = async () => {
    if (!testPhone.trim()) { toast.error('Enter a test phone number'); return }
    if (!isConfigured())   { toast.error('Configure and save credentials first'); return }
    setTesting(true); setTestResult(null); setShowRaw(false)
    try {
      const phone = norm(testPhone)
      const r = await apiPost('/admin/comm/test', {
        type: 'whatsapp', provider: wa.provider, to: phone, message: testMsg,
        tcUrl: wa.tcUrl, tcApiKey: wa.tcApiKey, tcApiSecret: wa.tcApiSecret,
        metaToken: wa.metaToken, metaPhoneId: wa.metaPhoneId,
        accountSid: wa.accountSid, authToken: wa.authToken, fromNumber: wa.fromNumber,
      })
      setTestResult({ ok: !!r.success, msg: r.message || r.error || 'Unknown', raw: r.raw })
      toast(r.success ? '✅ Message queued!' : '❌ Send failed')
    } catch (e: any) { setTestResult({ ok: false, msg: 'Network error: ' + e.message }) }
    setTesting(false)
  }

  const prov = WA_PROVIDERS[wa.provider]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Provider selector */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid var(--border)', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>WhatsApp Provider</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Choose how ThynkPulse sends WhatsApp messages</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: wa.enabled ? '#15803d' : 'var(--muted)' }}>{wa.enabled ? 'Enabled' : 'Disabled'}</span>
            <div style={tog(wa.enabled)} onClick={() => set({ enabled: !wa.enabled })}><div style={togDot(wa.enabled)} /></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {(Object.entries(WA_PROVIDERS) as [WaProvider, typeof WA_PROVIDERS[WaProvider]][]).map(([id, meta]) => {
            const selected = wa.provider === id
            return (
              <button key={id} onClick={() => set({ provider: id })}
                style={{ padding: '16px 14px', borderRadius: 12, border: `2px solid ${selected ? meta.color : 'var(--border)'}`, background: selected ? meta.colorBg : 'var(--cream)', cursor: 'pointer', textAlign: 'left', transition: 'all .15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{meta.icon}</div>
                  {selected && <div style={{ width: 16, height: 16, borderRadius: '50%', background: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>✓</div>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>{meta.label}</div>
                <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: meta.badgeBg, color: meta.badgeColor, marginBottom: 6 }}>{meta.badge}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{meta.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Credentials */}
      <div style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${prov.colorBorder}`, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: prov.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{prov.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{prov.label} Credentials</div>
              <div style={{ fontSize: 11, color: isConfigured() ? '#15803d' : '#dc2626', marginTop: 1 }}>{isConfigured() ? '✓ All credentials provided' : '⚠ Missing required credentials'}</div>
            </div>
          </div>
          <a href={prov.docsUrl} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${prov.colorBorder}`, background: prov.colorBg, fontSize: 11, fontWeight: 700, color: prov.color, textDecoration: 'none' }}>
            🔗 {wa.provider === 'thynkcomm' ? 'Open ThynkComm' : 'View Docs'}
          </a>
        </div>

        {wa.provider === 'thynkcomm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(26,184,168,.06)', border: '1px solid rgba(26,184,168,.2)', marginBottom: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1ab8a8', marginBottom: 8 }}>⚡ How to get your ThynkComm API Key</div>
              <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {['Open your ThynkComm dashboard', 'Go to Integrations → Other Apps tab', 'Click "+ New Integration Key" and fill in name', 'Select permissions: Send Messages ✓', 'Click Generate Key — copy API Key and Secret', 'Paste both below with your ThynkComm URL'].map((s, i) => (
                  <li key={i} style={{ fontSize: 11, color: 'var(--ink)', lineHeight: 1.5 }}>{s}</li>
                ))}
              </ol>
            </div>
            <div>
              <label style={lbl}>ThynkComm URL *</label>
              <input value={wa.tcUrl} onChange={e => set({ tcUrl: e.target.value })} placeholder="https://thynkcom.vercel.app" style={inp} />
              <p style={{ fontSize: 10, color: 'var(--muted)', margin: '4px 0 0' }}>Your Vercel deployment URL — no trailing slash.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lbl}>API Key *</label>
                <input value={wa.tcApiKey} onChange={e => set({ tcApiKey: e.target.value })} placeholder="tk_XXXXXXXXXXXXXXXX" style={{ ...inp, fontFamily: 'monospace', fontSize: 12 }} />
              </div>
              <SecretInput label="API Secret *" hint="Starts with sk_live_ — shown once at creation" value={wa.tcApiSecret} onChange={v => set({ tcApiSecret: v })} placeholder="sk_live_xxxxxxxx" />
            </div>
          </div>
        )}

        {wa.provider === 'meta' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <SecretInput label="Access Token *" hint="⚠ Use a permanent System User token — temporary tokens expire in 24 hours." value={wa.metaToken} onChange={v => set({ metaToken: v })} placeholder="EAAxxxxxxxx…" />
            </div>
            <div>
              <label style={lbl}>Phone Number ID *</label>
              <input value={wa.metaPhoneId} onChange={e => set({ metaPhoneId: e.target.value })} placeholder="1234567890" style={inp} />
              <p style={{ fontSize: 10, color: 'var(--muted)', margin: '4px 0 0' }}>Meta → WhatsApp → API Setup → Phone Number ID</p>
            </div>
          </div>
        )}

        {wa.provider === 'twilio' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={lbl}>Account SID *</label>
              <input value={wa.accountSid} onChange={e => set({ accountSid: e.target.value })} placeholder="ACxxxxxxxxxxxxxxxx" style={inp} />
            </div>
            <SecretInput label="Auth Token *" hint="Twilio Console → Account Info" value={wa.authToken} onChange={v => set({ authToken: v })} />
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>From Number *</label>
              <input value={wa.fromNumber} onChange={e => set({ fromNumber: e.target.value })} placeholder="whatsapp:+14155238886" style={inp} />
              <p style={{ fontSize: 10, color: 'var(--muted)', margin: '4px 0 0' }}>Include the whatsapp: prefix. Use your approved sender number.</p>
            </div>
          </div>
        )}
      </div>

      {/* Test panel */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid var(--border)', padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 4 }}>📤 Send a Test Message</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Verify the integration is working before going live</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={lbl}>Phone Number *</label>
            <input value={testPhone} onChange={e => setTestPhone(e.target.value)} placeholder="919876543210" style={inp} />
            <p style={{ fontSize: 10, color: 'var(--muted)', margin: '4px 0 0' }}>Country code + number, no +. Indian 10-digit auto-prefixed.</p>
          </div>
          <div>
            <label style={lbl}>Message</label>
            <input value={testMsg} onChange={e => setTestMsg(e.target.value)} style={inp} />
          </div>
        </div>

        {testResult && (
          <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: '12px 16px', borderRadius: 10, background: testResult.ok ? 'rgba(16,185,129,.07)' : 'rgba(239,68,68,.07)', border: `1px solid ${testResult.ok ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.3)'}`, display: 'flex', gap: 10 }}>
              <span>{testResult.ok ? '✅' : '❌'}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: testResult.ok ? '#15803d' : '#dc2626', wordBreak: 'break-all' }}>{testResult.msg}</span>
            </div>
            {testResult.hint && <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(201,146,42,.07)', border: '1px solid rgba(201,146,42,.2)', fontSize: 12, color: '#92610A' }}>🔧 {testResult.hint}</div>}
            {testResult.raw && (
              <div>
                <button onClick={() => setShowRaw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--muted)' }}>{showRaw ? '▲ Hide' : '▼ Show'} raw response</button>
                {showRaw && <pre style={{ marginTop: 6, padding: '10px 12px', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 11, overflow: 'auto', maxHeight: 160 }}>{JSON.stringify(testResult.raw, null, 2)}</pre>}
              </div>
            )}
          </div>
        )}

        <button onClick={sendTest} disabled={testing || !isConfigured()}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 9, background: isConfigured() ? '#15803d' : 'var(--border)', border: 'none', color: isConfigured() ? '#fff' : 'var(--muted)', cursor: (testing || !isConfigured()) ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)', opacity: testing ? 0.7 : 1 }}>
          {testing ? '⏳ Sending…' : '📤 Send Test Message'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={save} disabled={saving}
          style={{ padding: '11px 28px', borderRadius: 10, background: 'var(--teal)', border: 'none', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)', opacity: saving ? 0.7 : 1 }}>
          {saving ? '⏳ Saving…' : '💾 Save WhatsApp Settings'}
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function IntegrationsPage() {
  const [tab, setTab] = useState<'email' | 'whatsapp'>('email')
  const TABS = [
    { k: 'email'     as const, icon: '📧', label: 'Email / SMTP'  },
    { k: 'whatsapp'  as const, icon: '💬', label: 'WhatsApp'      },
  ]

  return (
    <AdminLayout title="Integrations" subtitle="Configure email SMTP accounts and WhatsApp API for sending communications">
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: `1.5px solid ${tab === t.k ? 'var(--teal)' : 'var(--border)'}`, background: tab === t.k ? 'rgba(10,95,85,.07)' : '#fff', color: tab === t.k ? 'var(--teal)' : 'var(--ink)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {tab === 'email'    && <EmailTab />}
      {tab === 'whatsapp' && <WhatsAppTab />}
    </AdminLayout>
  )
}
