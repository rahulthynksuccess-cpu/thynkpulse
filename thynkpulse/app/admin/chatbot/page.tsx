'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '@/components/admin/AdminLayout'
import {
  MessageCircle, Plus, Pencil, Trash2, Save, X, Loader2,
  Search, ToggleLeft, ToggleRight, Settings2, Download, Eye, Hash, Users,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

// Style tokens (light cream theme of ThynkPulse)
const teal   = 'var(--teal, #0A5F55)'
const ink    = '#1A1208'
const muted  = '#7A6A52'
const border = 'rgba(26,18,8,0.09)'
const card   = { background: '#fff', border: `1px solid ${border}`, borderRadius: 14 } as React.CSSProperties
const inp: React.CSSProperties = {
  width: '100%', padding: '10px 13px', background: '#fff',
  border: `1px solid ${border}`, borderRadius: 9, color: ink,
  fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '1.2px',
  textTransform: 'uppercase', color: muted, marginBottom: 6, fontFamily: 'var(--font-sans)',
}

function hdrs() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('tp_access_token') || '' : ''
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }
}
const apiFetch = (qs: string) => fetch(`/api/chatbot?${qs}`, { headers: hdrs() }).then(r => r.json())
const apiPost  = (action: string, body: any) =>
  fetch(`/api/chatbot?action=${action}`, { method: 'POST', headers: hdrs(), body: JSON.stringify(body) }).then(r => r.json())
const apiDel   = (action: string, id: string) =>
  fetch(`/api/chatbot?action=${action}&id=${id}`, { method: 'DELETE', headers: hdrs() }).then(r => r.json())

const TABS = ['Bot Settings', 'FAQ Manager', 'Chat Logs'] as const
type Tab = typeof TABS[number]

// ── FAQ Modal ─────────────────────────────────────────────────────────────────
function FaqModal({ faq, onClose, onSave }: { faq?: any; onClose: () => void; onSave: (d: any) => void }) {
  const [question, setQuestion] = useState(faq?.question || '')
  const [answer,   setAnswer]   = useState(faq?.answer   || '')
  const [keywords, setKeywords] = useState(faq?.keywords?.join(', ') || '')
  const [active,   setActive]   = useState(faq?.is_active ?? true)

  const handleSave = () => {
    if (!question.trim() || !answer.trim() || !keywords.trim()) {
      toast.error('All fields required.'); return
    }
    onSave({ id: faq?.id, question, answer, keywords: keywords.split(',').map((k: string) => k.trim()).filter(Boolean), isActive: active })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,8,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: .95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ position: 'relative', width: '100%', maxWidth: 540, background: '#fff', border: `1px solid ${border}`, borderRadius: 16, padding: 24, zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: ink, fontFamily: 'var(--font-serif)' }}>
            {faq ? 'Edit FAQ' : 'Add FAQ'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted }}><X style={{ width: 16, height: 16 }} /></button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Question</label>
          <input style={inp} value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. How do I submit a post?" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Bot Answer</label>
          <textarea style={{ ...inp, minHeight: 100, resize: 'vertical' as const, lineHeight: 1.6 }}
            value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Write the bot's reply..." />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Trigger Keywords (comma-separated)</label>
          <input style={inp} value={keywords} onChange={e => setKeywords(e.target.value)}
            placeholder="e.g. publish, submit, write, post" />
          <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>Bot matches these when users type questions.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '10px 0', borderTop: `1px solid ${border}` }}>
          <span style={{ fontSize: 13, color: muted }}>Active (visible to users)</span>
          <button onClick={() => setActive(!active)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: active ? '#0A5F55' : '#C0AE96' }}>
            {active ? <ToggleRight style={{ width: 28, height: 28 }} /> : <ToggleLeft style={{ width: 28, height: 28 }} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSave}
            style={{ flex: 1, padding: '10px', background: teal, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Save style={{ width: 14, height: 14 }} /> {faq ? 'Update FAQ' : 'Add FAQ'}
          </button>
          <button onClick={onClose}
            style={{ padding: '10px 18px', background: 'rgba(26,18,8,0.04)', color: muted, border: `1px solid ${border}`, borderRadius: 9, fontSize: 13, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Transcript Modal ──────────────────────────────────────────────────────────
function TranscriptModal({ session, onClose }: { session: any; onClose: () => void }) {
  const { data: messages, isLoading } = useQuery({
    queryKey: ['tp-chatbot-messages', session.id],
    queryFn: () => apiFetch(`action=messages&sessionId=${session.id}`),
  })
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,8,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: .95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ position: 'relative', width: '100%', maxWidth: 500, maxHeight: '80vh', background: '#fff', border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: ink, fontFamily: 'var(--font-serif)' }}>{session.user_name || 'Anonymous'}</div>
            <div style={{ fontSize: 11, color: muted }}>{session.user_email || '--'}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted }}><X style={{ width: 16, height: 16 }} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8, background: '#F8F4ED' }}>
          {isLoading
            ? <div style={{ color: muted, textAlign: 'center', padding: 24 }}>Loading…</div>
            : (messages || []).map((m: any) => (
                <div key={m.id} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? teal : '#fff',
                  color: m.role === 'user' ? '#fff' : ink,
                  padding: '9px 13px', borderRadius: 10, fontSize: 13, maxWidth: '80%', lineHeight: 1.5,
                  borderBottomRightRadius: m.role === 'user' ? 3 : 10,
                  borderBottomLeftRadius: m.role === 'bot' ? 3 : 10,
                  boxShadow: '0 1px 4px rgba(26,18,8,0.07)',
                }}>
                  {m.content}
                  <div style={{ fontSize: 10, color: 'rgba(26,18,8,0.3)', marginTop: 4 }}>
                    {new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
          }
        </div>
      </motion.div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminChatbotPage() {
  const qc = useQueryClient()
  const [tab, setTab]               = useState<Tab>('Bot Settings')
  const [faqModal, setFaqModal]     = useState<any>(null)
  const [viewSession, setViewSession] = useState<any>(null)
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)

  const { data: stats } = useQuery({
    queryKey: ['tp-chatbot-stats'],
    queryFn: () => apiFetch('action=stats'),
    staleTime: 60_000,
  })

  const { data: config, isLoading: cfgLoading } = useQuery({
    queryKey: ['tp-chatbot-config'],
    queryFn: () => apiFetch('action=config'),
    staleTime: 30_000,
  })

  const { data: faqs, isLoading: faqsLoading } = useQuery({
    queryKey: ['tp-chatbot-faqs'],
    queryFn: () => apiFetch('action=faqs'),
    staleTime: 30_000,
    enabled: tab === 'FAQ Manager',
  })

  const params = new URLSearchParams({ action: 'sessions', page: String(page), limit: '20', search })
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['tp-chatbot-sessions', page, search],
    queryFn: () => apiFetch(params.toString()),
    staleTime: 30_000,
    enabled: tab === 'Chat Logs',
  })

  const [cfgLocal, setCfgLocal] = useState<Record<string, string>>({})
  useEffect(() => { if (config) setCfgLocal(config) }, [config])

  const saveCfg = useMutation({
    mutationFn: () => apiPost('config', { updates: cfgLocal }),
    onSuccess: () => { toast.success('Settings saved!'); qc.invalidateQueries({ queryKey: ['tp-chatbot-config'] }) },
    onError: () => toast.error('Failed to save settings'),
  })

  const upsertFaq = useMutation({
    mutationFn: (d: any) => apiPost('faq-upsert', d),
    onSuccess: () => { toast.success(faqModal?.id ? 'FAQ updated!' : 'FAQ added!'); setFaqModal(null); qc.invalidateQueries({ queryKey: ['tp-chatbot-faqs'] }) },
    onError: () => toast.error('Failed to save FAQ'),
  })

  const deleteFaq = useMutation({
    mutationFn: (id: string) => apiDel('faq', id),
    onSuccess: () => { toast.success('FAQ deleted'); qc.invalidateQueries({ queryKey: ['tp-chatbot-faqs'] }) },
  })

  const deleteSession = useMutation({
    mutationFn: (id: string) => apiDel('session', id),
    onSuccess: () => { toast.success('Session deleted'); qc.invalidateQueries({ queryKey: ['tp-chatbot-sessions'] }) },
  })

  function exportCSV() {
    const sessions = sessionsData?.data || []
    const csv = ['Name,Email,Messages,Page,Date',
      ...sessions.map((s: any) => `"${s.user_name||''}","${s.user_email||''}",${s.msg_count},"${s.page_url||''}","${new Date(s.started_at).toLocaleDateString('en-IN')}"`)
    ].join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'chatbot_sessions.csv'; a.click()
  }

  const sessions = sessionsData?.data || []
  const totalSessions = sessionsData?.total || 0

  const statCards = [
    { label: 'Total Chats',    value: stats?.totalSessions   ?? '--', color: teal },
    { label: 'Leads Captured', value: stats?.identifiedLeads ?? '--', color: '#C9922A' },
    { label: 'Today',          value: stats?.todaySessions   ?? '--', color: '#3D1F5E' },
    { label: 'Active FAQs',    value: stats?.activeFaqs      ?? '--', color: '#E8512A' },
  ]

  return (
    <AdminLayout title="AI Chatbot" subtitle="Configure bot, manage FAQs, view chat sessions and captured leads">

      <AnimatePresence>
        {faqModal !== null && <FaqModal faq={faqModal?.id ? faqModal : undefined} onClose={() => setFaqModal(null)} onSave={d => upsertFaq.mutate(d)} />}
        {viewSession && <TranscriptModal session={viewSession} onClose={() => setViewSession(null)} />}
      </AnimatePresence>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }}
            style={{ ...card, padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 28, color: s.color, lineHeight: 1, marginBottom: 4 }}>
              {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
            </div>
            <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: `1px solid ${border}` }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '9px 18px', borderRadius: '9px 9px 0 0', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: tab === t ? teal : 'transparent',
              color: tab === t ? '#fff' : muted,
              borderBottom: tab === t ? `2px solid ${teal}` : '2px solid transparent',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* BOT SETTINGS */}
      {tab === 'Bot Settings' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ ...card, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Settings2 style={{ width: 16, height: 16, color: teal }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: ink, fontFamily: 'var(--font-serif)' }}>Brand & Appearance</span>
            </div>
            {cfgLoading
              ? <div style={{ color: muted, textAlign: 'center', padding: 24 }}>Loading…</div>
              : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { key: 'bot_name',    label: 'Bot Name',    placeholder: 'Pulse Assistant' },
                    { key: 'brand_color', label: 'Brand Color', placeholder: '#0A5F55', type: 'color' },
                    { key: 'contact_email', label: 'Contact Email', placeholder: 'hello@thynkpulse.in' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={lbl}>{f.label}</label>
                      <input style={f.type === 'color' ? { ...inp, height: 42, padding: 4, cursor: 'pointer' } : inp}
                        type={f.type || 'text'}
                        value={cfgLocal[f.key] || ''}
                        onChange={e => setCfgLocal(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>
              )
            }
          </div>

          <div style={{ ...card, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <MessageCircle style={{ width: 16, height: 16, color: teal }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: ink, fontFamily: 'var(--font-serif)' }}>Bot Messages</span>
            </div>
            {[
              { key: 'greeting_message', label: 'Greeting Message', hint: 'First message when user opens chat.' },
              { key: 'fallback_message', label: 'Fallback Message',  hint: 'Shown when no FAQ matches.' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={lbl}>{f.label}</label>
                <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' as const, lineHeight: 1.6 }}
                  value={cfgLocal[f.key] || ''}
                  onChange={e => setCfgLocal(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.hint} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...card, padding: '14px 20px', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, color: ink, fontWeight: 600 }}>Chat Widget Enabled</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Hide the chatbot from your site entirely</div>
            </div>
            <button onClick={() => setCfgLocal(p => ({ ...p, bot_enabled: p.bot_enabled === 'false' ? 'true' : 'false' }))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: cfgLocal.bot_enabled !== 'false' ? '#0A5F55' : '#C0AE96' }}>
              {cfgLocal.bot_enabled !== 'false'
                ? <ToggleRight style={{ width: 32, height: 32 }} />
                : <ToggleLeft  style={{ width: 32, height: 32 }} />}
            </button>
          </div>

          <button onClick={() => saveCfg.mutate()} disabled={saveCfg.isPending}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: teal, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {saveCfg.isPending ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: 14, height: 14 }} />}
            Save Settings
          </button>
        </motion.div>
      )}

      {/* FAQ MANAGER */}
      {tab === 'FAQ Manager' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: muted }}>{(faqs || []).length} FAQ entries</div>
            <button onClick={() => setFaqModal({})}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: teal, color: '#fff', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Plus style={{ width: 14, height: 14 }} /> Add FAQ
            </button>
          </div>
          <div style={{ ...card, overflow: 'hidden' }}>
            {faqsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderBottom: `1px solid ${border}` }}>
                    <div style={{ height: 14, background: 'rgba(26,18,8,0.06)', borderRadius: 6, width: '60%', marginBottom: 8 }} />
                    <div style={{ height: 10, background: 'rgba(26,18,8,0.04)', borderRadius: 6, width: '85%' }} />
                  </div>
                ))
              : (faqs || []).length === 0
                ? <div style={{ textAlign: 'center', padding: 48, color: muted, fontSize: 13 }}>No FAQs yet. Add your first one.</div>
                : (faqs || []).map((f: any, i: number) => (
                    <motion.div key={f.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                      style={{ padding: '14px 18px', borderBottom: `1px solid rgba(26,18,8,0.04)`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(10,95,85,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <Hash style={{ width: 12, height: 12, color: teal }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: ink, marginBottom: 3 }}>{f.question}</div>
                        <div style={{ fontSize: 12, color: muted, lineHeight: 1.5, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                          {f.answer}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {(f.keywords || []).slice(0, 5).map((kw: string) => (
                            <span key={kw} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(10,95,85,0.08)', color: teal }}>{kw}</span>
                          ))}
                          {!f.is_active && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(239,68,68,0.08)', color: '#DC2626' }}>Inactive</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                        <button onClick={() => setFaqModal(f)}
                          style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(10,95,85,0.06)', color: teal, border: 'none', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Pencil style={{ width: 11, height: 11 }} /> Edit
                        </button>
                        <button onClick={() => { if (confirm('Delete this FAQ?')) deleteFaq.mutate(f.id) }}
                          style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(239,68,68,0.06)', color: '#DC2626', border: 'none', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Trash2 style={{ width: 11, height: 11 }} /> Del
                        </button>
                      </div>
                    </motion.div>
                  ))
            }
          </div>
        </motion.div>
      )}

      {/* CHAT LOGS */}
      {tab === 'Chat Logs' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 200, background: '#fff', border: `1px solid ${border}`, borderRadius: 8, padding: '7px 11px' }}>
              <Search style={{ width: 13, height: 13, color: muted }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search by name or email..."
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: ink, flex: 1 }} />
            </div>
            <button onClick={exportCSV}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, background: '#fff', border: `1px solid ${border}`, color: muted, cursor: 'pointer', fontSize: 11 }}>
              <Download style={{ width: 12, height: 12 }} /> Export CSV
            </button>
          </div>

          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['#','Name','Email','Msgs','Started','Actions'].map(h => (
                      <th key={h} style={{ padding: '9px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: muted, borderBottom: `1px solid ${border}`, background: 'rgba(26,18,8,0.02)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessionsLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i}><td colSpan={6} style={{ padding: '10px 14px' }}>
                          <div style={{ height: 30, background: 'rgba(26,18,8,0.04)', borderRadius: 6 }} />
                        </td></tr>
                      ))
                    : sessions.length === 0
                      ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: muted, fontSize: 13 }}>No chat sessions found.</td></tr>
                      : sessions.map((s: any, i: number) => (
                          <tr key={s.id}
                            onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(10,95,85,0.02)'}
                            onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                            <td style={{ padding: '11px 14px', fontSize: 12, color: muted, borderBottom: `1px solid rgba(26,18,8,0.04)` }}>{(page - 1) * 20 + i + 1}</td>
                            <td style={{ padding: '11px 14px', fontSize: 12, color: ink, fontWeight: 600, borderBottom: `1px solid rgba(26,18,8,0.04)` }}>{s.user_name || <em style={{ color: muted, fontStyle: 'italic' }}>Anonymous</em>}</td>
                            <td style={{ padding: '11px 14px', fontSize: 11, color: muted, borderBottom: `1px solid rgba(26,18,8,0.04)` }}>{s.user_email || '--'}</td>
                            <td style={{ padding: '11px 14px', fontSize: 12, borderBottom: `1px solid rgba(26,18,8,0.04)` }}>
                              <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: 'rgba(10,95,85,0.08)', color: teal }}>{s.msg_count} msgs</span>
                            </td>
                            <td style={{ padding: '11px 14px', fontSize: 11, color: muted, whiteSpace: 'nowrap', borderBottom: `1px solid rgba(26,18,8,0.04)` }}>
                              {new Date(s.started_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                            </td>
                            <td style={{ padding: '11px 14px', borderBottom: `1px solid rgba(26,18,8,0.04)` }}>
                              <div style={{ display: 'flex', gap: 5 }}>
                                <button onClick={() => setViewSession(s)}
                                  style={{ padding: '4px 10px', borderRadius: 7, background: 'rgba(10,95,85,0.06)', color: teal, border: 'none', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Eye style={{ width: 11, height: 11 }} /> View
                                </button>
                                <button onClick={() => { if (confirm('Delete session?')) deleteSession.mutate(s.id) }}
                                  style={{ padding: '4px 8px', borderRadius: 7, background: 'rgba(239,68,68,0.06)', color: '#DC2626', border: 'none', cursor: 'pointer' }}>
                                  <Trash2 style={{ width: 11, height: 11 }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                  }
                </tbody>
              </table>
            </div>
            {totalSessions > 20 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderTop: `1px solid ${border}` }}>
                <span style={{ fontSize: 11, color: muted }}>{(page - 1) * 20 + 1}-{Math.min(page * 20, totalSessions)} of {totalSessions}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: '6px 13px', borderRadius: 7, background: '#fff', border: `1px solid ${border}`, color: muted, cursor: 'pointer', fontSize: 11, opacity: page === 1 ? .4 : 1 }}>← Prev</button>
                  <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= totalSessions}
                    style={{ padding: '6px 13px', borderRadius: 7, background: '#fff', border: `1px solid ${border}`, color: muted, cursor: 'pointer', fontSize: 11, opacity: page * 20 >= totalSessions ? .4 : 1 }}>Next →</button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AdminLayout>
  )
}
