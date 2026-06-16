'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Plus, Trash2, Save, Search, Download, Upload, Loader2, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Pages managed by ThynkPulse SEO ──────────────────────────────────────────
const PAGE_KEYS = [
  { key: 'global',          label: '🌐 Global / All Pages'     },
  { key: 'home',            label: '🏠 Homepage'               },
  { key: 'latest-posts',    label: '📰 Latest Posts'           },
  { key: 'trending',        label: '🔥 Trending'               },
  { key: 'community',       label: '👥 Community'              },
  { key: 'writers',         label: '✍️ Writers'                },
  { key: 'school-leadership', label: '🏫 School Leadership'    },
  { key: 'innovation',      label: '💡 Innovation'             },
  { key: 'edtech-stories',  label: '🎓 EdTech Stories'         },
  { key: 'edtech-articles', label: '📖 EdTech Articles'        },
  { key: 'write',           label: '✏️ Write / Editor'          },
  { key: 'login',           label: '🔐 Login / Register'       },
]

// ── Preset SEO parameters ────────────────────────────────────────────────────
const PRESET_PARAMS: Record<string, string[]> = {
  global: [
    'og:site_name','og:locale','twitter:card','twitter:site','twitter:creator',
    'robots','googlebot','referrer','theme-color',
    'viewport','format-detection','mobile-web-app-capable',
    'apple-mobile-web-app-capable','apple-mobile-web-app-status-bar-style',
    'google-site-verification','bing-site-verification','yandex-verification',
    'fb:app_id','article:publisher',
    'og:type','og:image:width','og:image:height','og:image:type',
    'schema:Organization:name','schema:Organization:url','schema:Organization:logo',
    'schema:Organization:sameAs','canonical:base_url',
    'rating','revisit-after','language','geo.region','geo.placename',
  ],
  home: [
    'title','description','keywords','og:title','og:description','og:image','og:url',
    'twitter:title','twitter:description','twitter:image','twitter:image:alt',
    'schema:WebSite:name','schema:WebSite:url','schema:WebSite:description',
    'schema:WebSite:potentialAction',
    'schema:FAQPage','schema:BreadcrumbList',
    'preload:font','preload:image','dns-prefetch','preconnect',
  ],
  'latest-posts': [
    'title','description','keywords','og:title','og:description','og:image','og:url',
    'twitter:title','twitter:description','twitter:image',
    'schema:Blog:name','schema:Blog:description',
  ],
  trending: [
    'title','description','keywords','og:title','og:description','og:image',
    'schema:ItemList:name',
  ],
}

type Param = { key: string; value: string; id: string }

function hdrs() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('tp_access_token') || '' : ''
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }
}

export default function AdminSEOPage() {
  const [activePage,   setActivePage]   = useState('global')
  const [params,       setParams]       = useState<Param[]>([])
  const [loading,      setLoading]      = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [search,       setSearch]       = useState('')
  const [newKey,       setNewKey]       = useState('')
  const [newVal,       setNewVal]       = useState('')
  const [bulkMode,     setBulkMode]     = useState(false)
  const [bulkText,     setBulkText]     = useState('')
  const [showPresets,  setShowPresets]  = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const pageCache = useRef<Record<string, Param[]>>({})

  // Load params when page changes
  useEffect(() => {
    if (pageCache.current[activePage]) { setParams(pageCache.current[activePage]); return }
    setLoading(true)
    fetch(`/api/admin/seo?page=${activePage}`, { headers: hdrs(), cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const loaded: Param[] = Object.entries(d.data || {}).map(([k, v]) => ({
          key: k, value: v as string, id: Math.random().toString(36).slice(2),
        }))
        pageCache.current[activePage] = loaded
        setParams(loaded)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activePage])

  useEffect(() => { if (!loading) pageCache.current[activePage] = params }, [params, activePage, loading])

  const save = async () => {
    setSaving(true)
    try {
      const obj: Record<string, string> = {}
      params.forEach(p => { if (p.key.trim()) obj[p.key.trim()] = p.value })
      const res = await fetch('/api/admin/seo', {
        method: 'POST', headers: hdrs(),
        body: JSON.stringify({ pageKey: activePage, params: obj }),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success(`SEO saved for "${PAGE_KEYS.find(p => p.key === activePage)?.label}"`)
    } catch (e: any) { toast.error(e.message || 'Save failed') }
    setSaving(false)
  }

  const addParam = () => {
    if (!newKey.trim()) { toast.error('Key is required'); return }
    if (params.find(p => p.key === newKey.trim())) { toast.error('Key already exists'); return }
    setParams(prev => [...prev, { key: newKey.trim(), value: newVal, id: Math.random().toString(36).slice(2) }])
    setNewKey(''); setNewVal('')
  }

  const allPresets = [...(PRESET_PARAMS.global || []), ...(PRESET_PARAMS[activePage] || [])].filter(k => !params.find(p => p.key === k))

  const addPreset = (key: string) => {
    if (params.find(p => p.key === key)) return
    setParams(prev => [...prev, { key, value: '', id: Math.random().toString(36).slice(2) }])
    setShowPresets(false)
  }

  const addAllPresets = () => {
    const toAdd = allPresets.filter(k => !params.find(p => p.key === k))
    setParams(prev => [...prev, ...toAdd.map(k => ({ key: k, value: '', id: Math.random().toString(36).slice(2) }))])
    setShowPresets(false)
    toast.success(`Added ${toAdd.length} preset parameters`)
  }

  const updateParam = (id: string, field: 'key' | 'value', val: string) =>
    setParams(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p))

  const deleteParam = (id: string) => setParams(prev => prev.filter(p => p.id !== id))

  const applyBulk = () => {
    const lines = bulkText.split('\n').filter(l => l.includes('='))
    const newParams: Param[] = []
    lines.forEach(line => {
      const idx = line.indexOf('=')
      const k = line.slice(0, idx).trim(); const v = line.slice(idx + 1).trim()
      if (k && !params.find(p => p.key === k))
        newParams.push({ key: k, value: v, id: Math.random().toString(36).slice(2) })
    })
    setParams(prev => [...prev, ...newParams])
    setBulkText(''); setBulkMode(false)
    toast.success(`Added ${newParams.length} parameters`)
  }

  const exportCSV = () => {
    const csv = 'key,value\n' + params.map(p => `"${p.key}","${p.value.replace(/"/g, '""')}"`).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `seo-${activePage}.csv`; a.click()
  }

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const lines = (ev.target?.result as string).split('\n').slice(1)
      const imported: Param[] = []
      lines.forEach(line => {
        const m = line.match(/^"?([^",]+)"?,(.*)$/)
        if (m) imported.push({ key: m[1].trim(), value: m[2].replace(/^"|"$/g, '').trim(), id: Math.random().toString(36).slice(2) })
      })
      setParams(prev => {
        const existing = new Set(prev.map(p => p.key))
        return [...prev, ...imported.filter(p => !existing.has(p.key))]
      })
      toast.success(`Imported ${imported.length} parameters`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const filtered = params.filter(p =>
    !search || p.key.toLowerCase().includes(search.toLowerCase()) || p.value.toLowerCase().includes(search.toLowerCase())
  )

  // Teal/parchment theme tokens
  const teal   = 'var(--teal, #0A5F55)'
  const cream  = '#fff'
  const border = 'rgba(26,18,8,0.09)'
  const muted  = '#7A6A52'
  const ink    = '#1A1208'

  return (
    <AdminLayout title="SEO Manager" subtitle="Manage meta tags, Open Graph, schema markup and all SEO parameters per page">
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, height: 'calc(100vh - 120px)' }}>

        {/* Page selector */}
        <div style={{ background: cream, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden', height: 'fit-content' }}>
          {PAGE_KEYS.map(p => (
            <button key={p.key} onClick={() => setActivePage(p.key)} style={{
              width: '100%', padding: '11px 14px', border: 'none', borderBottom: `1px solid rgba(26,18,8,0.05)`,
              cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 13,
              fontWeight: activePage === p.key ? 600 : 400,
              background: activePage === p.key ? 'rgba(10,95,85,0.08)' : 'transparent',
              color: activePage === p.key ? teal : muted,
              borderLeft: activePage === p.key ? `3px solid ${teal}` : '3px solid transparent',
            }}>{p.label}</button>
          ))}
        </div>

        {/* Main panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', background: cream, border: `1px solid ${border}`, borderRadius: 12, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(10,95,85,0.04)', borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 180 }}>
              <Search style={{ width: 14, height: 14, color: muted, flexShrink: 0 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search parameters…"
                style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: 13, fontFamily: 'var(--font-sans)', width: '100%' }} />
            </div>
            <span style={{ color: muted, fontSize: 12 }}>{filtered.length} / {params.length}</span>

            {/* Presets dropdown */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowPresets(!showPresets)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 8, background: 'rgba(10,95,85,0.06)', border: `1px solid rgba(10,95,85,0.2)`, color: teal, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                <Plus style={{ width: 13, height: 13 }} /> Presets <ChevronDown style={{ width: 12, height: 12 }} />
              </button>
              {showPresets && (
                <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, background: cream, border: `1px solid ${border}`, borderRadius: 10, padding: 8, width: 280, maxHeight: 320, overflowY: 'auto', boxShadow: '0 8px 32px rgba(26,18,8,0.12)', marginTop: 4 }}>
                  <button onClick={addAllPresets} style={{ width: '100%', padding: '8px 12px', borderRadius: 7, background: 'rgba(10,95,85,0.08)', border: `1px solid rgba(10,95,85,0.2)`, color: teal, cursor: 'pointer', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                    ✨ Add All {allPresets.length} Missing Presets
                  </button>
                  {allPresets.map(k => (
                    <button key={k} onClick={() => addPreset(k)}
                      style={{ width: '100%', textAlign: 'left', padding: '6px 12px', borderRadius: 6, background: 'transparent', border: 'none', color: muted, cursor: 'pointer', fontSize: 12, fontFamily: 'monospace', display: 'block' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(10,95,85,0.06)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      {k}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setBulkMode(!bulkMode)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 8, background: 'rgba(26,18,8,0.04)', border: `1px solid ${border}`, color: muted, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              Bulk Add
            </button>
            <button onClick={exportCSV} title="Export CSV"
              style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(26,18,8,0.04)', border: `1px solid ${border}`, color: muted, cursor: 'pointer', display: 'flex' }}>
              <Download style={{ width: 14, height: 14 }} />
            </button>
            <button onClick={() => fileRef.current?.click()} title="Import CSV"
              style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(26,18,8,0.04)', border: `1px solid ${border}`, color: muted, cursor: 'pointer', display: 'flex' }}>
              <Upload style={{ width: 14, height: 14 }} />
            </button>
            <input ref={fileRef} type="file" accept=".csv" onChange={importCSV} style={{ display: 'none' }} />

            <button onClick={save} disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 20px', borderRadius: 9, background: teal, border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: saving ? .7 : 1, marginLeft: 'auto' }}>
              {saving ? <><Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save style={{ width: 13, height: 13 }} /> Save All</>}
            </button>
          </div>

          {/* Bulk add */}
          {bulkMode && (
            <div style={{ background: cream, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: muted, marginBottom: 8 }}>
                Paste parameters as <code style={{ color: teal }}>key=value</code> — one per line.
              </p>
              <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={6}
                placeholder={'og:title=ThynkPulse\nog:description=Knowledge for Educators\nkeywords=edtech,educators,india'}
                style={{ width: '100%', background: 'rgba(10,95,85,0.03)', border: `1px solid rgba(10,95,85,0.15)`, borderRadius: 8, padding: '10px 14px', color: ink, fontFamily: 'monospace', fontSize: 12, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={applyBulk} style={{ padding: '8px 18px', borderRadius: 8, background: teal, border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Apply</button>
                <button onClick={() => { setBulkMode(false); setBulkText('') }} style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(26,18,8,0.04)', border: `1px solid ${border}`, color: muted, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Add new row */}
          <div style={{ display: 'flex', gap: 8, background: 'rgba(10,95,85,0.04)', border: `1px solid rgba(10,95,85,0.18)`, borderRadius: 12, padding: '10px 14px', alignItems: 'center' }}>
            <input value={newKey} onChange={e => setNewKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && addParam()}
              placeholder="meta name / property / key"
              style={{ flex: '0 0 280px', background: '#fff', border: `1px solid ${border}`, borderRadius: 8, padding: '8px 12px', color: teal, fontFamily: 'monospace', fontSize: 12, outline: 'none' }} />
            <input value={newVal} onChange={e => setNewVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addParam()}
              placeholder="value"
              style={{ flex: 1, background: '#fff', border: `1px solid ${border}`, borderRadius: 8, padding: '8px 12px', color: ink, fontFamily: 'monospace', fontSize: 12, outline: 'none' }} />
            <button onClick={addParam}
              style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(10,95,85,0.1)', border: `1px solid rgba(10,95,85,0.2)`, color: teal, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
              <Plus style={{ width: 13, height: 13 }} /> Add
            </button>
          </div>

          {/* Params list */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: muted }}>Loading…</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <p style={{ color: muted, fontSize: 14 }}>
                  {params.length === 0 ? 'No parameters yet. Add presets or type your own above.' : 'No matches.'}
                </p>
              </div>
            ) : filtered.map(p => (
              <div key={p.id}
                style={{ display: 'flex', gap: 8, alignItems: 'center', background: cream, border: `1px solid ${border}`, borderRadius: 9, padding: '8px 12px' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(10,95,85,0.03)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = cream}>
                <input value={p.key} onChange={e => updateParam(p.id, 'key', e.target.value)}
                  style={{ flex: '0 0 280px', background: 'transparent', border: 'none', outline: 'none', color: teal, fontFamily: 'monospace', fontSize: 12, padding: '2px 0' }} />
                <span style={{ color: muted, fontSize: 14 }}>=</span>
                <input value={p.value} onChange={e => updateParam(p.id, 'value', e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: ink, fontFamily: 'monospace', fontSize: 12, padding: '2px 0' }}
                  placeholder="(empty)" />
                <button onClick={() => deleteParam(p.id)}
                  style={{ padding: 4, background: 'none', border: 'none', color: '#C0AE96', cursor: 'pointer', display: 'flex', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#DC2626'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#C0AE96'}>
                  <Trash2 style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
