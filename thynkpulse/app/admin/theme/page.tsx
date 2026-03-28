'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Copy, RotateCcw, Check, Save, Eye, Loader2, Globe } from 'lucide-react'
import { apiGet, apiPost } from '@/lib/api'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────────────────────
   PRESETS — 5 complete colour + font + radius themes
───────────────────────────────────────────────────────────── */
const PRESETS: Record<string, Record<string, string | number>> = {
  'Thynk Pulse (Default)': {
    cream:'#FDF6EC', cream2:'#F5ECD8', parchment:'#EDE0C8',
    teal:'#0A5F55', teal2:'#0D7A6D', teal3:'#12A090',
    coral:'#E8512A', coral2:'#F07250',
    gold:'#C9922A', gold2:'#E5B64A',
    plum:'#3D1F5E', ink:'#1A1208', ink2:'#2D2416', muted:'#7A6A52',
    fontSerif:'Fraunces', fontSans:'Outfit', radius:12, radiusLg:20,
  },
  'Ocean Deep': {
    cream:'#EDF6FF', cream2:'#DBF0FF', parchment:'#C5E6FF',
    teal:'#1A4E8B', teal2:'#1E62B5', teal3:'#2178E0',
    coral:'#E84F2A', coral2:'#F07250',
    gold:'#F0A800', gold2:'#F5C842',
    plum:'#2E1458', ink:'#0B1620', ink2:'#162336', muted:'#4A6880',
    fontSerif:'Fraunces', fontSans:'Outfit', radius:12, radiusLg:20,
  },
  'Forest Sage': {
    cream:'#F2F5EF', cream2:'#E4EBE0', parchment:'#D2DDCC',
    teal:'#2D5A27', teal2:'#3A7232', teal3:'#4D9643',
    coral:'#C44B2B', coral2:'#D96840',
    gold:'#8B6914', gold2:'#C4A030',
    plum:'#2E1F45', ink:'#141A10', ink2:'#222D1C', muted:'#5A6854',
    fontSerif:'Fraunces', fontSans:'Outfit', radius:10, radiusLg:18,
  },
  'Warm Terracotta': {
    cream:'#FDF4EE', cream2:'#F8E8DC', parchment:'#F0D5C0',
    teal:'#7A3E28', teal2:'#9C5235', teal3:'#C06840',
    coral:'#D94F2A', coral2:'#E87050',
    gold:'#C08820', gold2:'#DEB040',
    plum:'#4A1E35', ink:'#1E0E08', ink2:'#301A10', muted:'#7A5A4A',
    fontSerif:'Fraunces', fontSans:'Outfit', radius:14, radiusLg:22,
  },
  'Night Mode': {
    cream:'#121820', cream2:'#1A2330', parchment:'#222E3C',
    teal:'#12A090', teal2:'#0D7A6D', teal3:'#0A5F55',
    coral:'#E8512A', coral2:'#F07250',
    gold:'#E5B64A', gold2:'#C9922A',
    plum:'#8B52D0', ink:'#E8E0D5', ink2:'#D0C8BE', muted:'#8899A6',
    fontSerif:'Fraunces', fontSans:'Outfit', radius:12, radiusLg:20,
  },
}

type ThemeMap = Record<string, string | number>

const COLOR_FIELDS: { key: string; label: string }[] = [
  { key:'cream',     label:'Background'      },
  { key:'cream2',    label:'Alt Background'  },
  { key:'parchment', label:'Border / Subtle' },
  { key:'teal',      label:'Primary'         },
  { key:'teal2',     label:'Primary Hover'   },
  { key:'teal3',     label:'Primary Light'   },
  { key:'coral',     label:'Accent'          },
  { key:'coral2',    label:'Accent Hover'    },
  { key:'gold',      label:'Highlight'       },
  { key:'gold2',     label:'Highlight Light' },
  { key:'plum',      label:'Tertiary'        },
  { key:'ink',       label:'Text Primary'    },
  { key:'ink2',      label:'Text Secondary'  },
  { key:'muted',     label:'Text Muted'      },
]

const inp: React.CSSProperties = {
  width:'100%', padding:'9px 12px', border:'1.5px solid var(--parchment)',
  borderRadius:'var(--radius)', fontSize:'13px', fontFamily:'var(--font-sans)',
  color:'var(--ink)', outline:'none', background:'#fff', boxSizing:'border-box',
}

/* Applies CSS vars directly to document.documentElement — instant, no reload */
function applyToDom(t: ThemeMap) {
  const r = document.documentElement
  COLOR_FIELDS.forEach(({ key }) => {
    if (t[key]) r.style.setProperty(`--${key}`, String(t[key]))
  })
  r.style.setProperty('--radius',    `${t.radius}px`)
  r.style.setProperty('--radius-lg', `${t.radiusLg}px`)
  r.style.setProperty('--radius-xl', `${Number(t.radiusLg) + 4}px`)
  if (t.fontSerif) r.style.setProperty('--font-serif', `'${t.fontSerif}', Georgia, serif`)
  if (t.fontSans)  r.style.setProperty('--font-sans',  `'${t.fontSans}', system-ui, sans-serif`)
}

export default function AdminThemePage() {
  const [activePreset, setActivePreset] = useState('Thynk Pulse (Default)')
  const [theme,        setTheme]        = useState<ThemeMap>({ ...PRESETS['Thynk Pulse (Default)'] })
  const [copied,       setCopied]       = useState(false)
  const [unsaved,      setUnsaved]      = useState(false)

  /* Load saved theme from DB on mount */
  const { data: savedData } = useQuery({
    queryKey: ['admin-theme'],
    queryFn: () => apiGet('/admin/theme'),
    staleTime: Infinity,
  })

  useEffect(() => {
    if (savedData?.theme) {
      setTheme(savedData.theme)
      applyToDom(savedData.theme)
      // Try to detect which preset it matches
      const match = Object.entries(PRESETS).find(([, v]) =>
        Object.keys(v).every(k => String(v[k]) === String(savedData.theme[k]))
      )
      if (match) setActivePreset(match[0])
      else        setActivePreset('Custom')
    }
  }, [savedData])

  /* Save theme to DB → site reloads with new theme in ≤60s */
  const saveMutation = useMutation({
    mutationFn: () => apiPost('/admin/theme', { theme }),
    onSuccess: () => {
      toast.success('✅ Theme saved! Site will update within 60 seconds.')
      setUnsaved(false)
    },
    onError: () => toast.error('Failed to save theme'),
  })

  const applyPreset = (name: string) => {
    const p = PRESETS[name]
    if (!p) return
    setActivePreset(name)
    setTheme({ ...p })
    applyToDom({ ...p })
    setUnsaved(true)
  }

  const setColor = (key: string, val: string) => {
    setTheme(p => { const n = { ...p, [key]: val }; applyToDom(n); return n })
    setUnsaved(true)
  }
  const setNum = (key: string, val: number) => {
    setTheme(p => { const n = { ...p, [key]: val }; applyToDom(n); return n })
    setUnsaved(true)
  }

  const resetDefault = () => {
    applyPreset('Thynk Pulse (Default)')
    toast.success('Reset to default theme')
  }

  /* Generate CSS for display / copy */
  const generateCSS = useCallback((t: ThemeMap) =>
`/* THYNK PULSE THEME — Generated ${new Date().toLocaleString('en-IN')} */
:root {
  --cream:      ${t.cream};
  --cream2:     ${t.cream2};
  --parchment:  ${t.parchment};
  --teal:       ${t.teal};
  --teal2:      ${t.teal2};
  --teal3:      ${t.teal3};
  --coral:      ${t.coral};
  --coral2:     ${t.coral2};
  --gold:       ${t.gold};
  --gold2:      ${t.gold2};
  --plum:       ${t.plum};
  --ink:        ${t.ink};
  --ink2:       ${t.ink2};
  --muted:      ${t.muted};
  --font-serif: '${t.fontSerif}', Georgia, serif;
  --font-sans:  '${t.fontSans}', system-ui, sans-serif;
  --radius:     ${t.radius}px;
  --radius-lg:  ${t.radiusLg}px;
}`, [])

  const copyCss = async () => {
    await navigator.clipboard.writeText(generateCSS(theme))
    setCopied(true)
    toast.success('CSS copied!')
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <AdminLayout title="Live Theme Controller" subtitle="Changes apply instantly to this panel — click Save to Site to update the whole website">

      {/* ── Top action bar ── */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', padding:'14px 18px', background:'#fff', border:'1px solid var(--border)', borderRadius:'12px' }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background: unsaved ? 'var(--gold)' : '#4ADE80', animation: unsaved ? 'blink 2s infinite' : 'none' }} />
        <span style={{ fontSize:'13px', fontFamily:'var(--font-sans)', color:'var(--muted)', flex:1 }}>
          {unsaved ? '⚠️ Unsaved changes — click Save to Site to apply to the whole website' : '✓ All changes saved to site'}
        </span>
        <button onClick={resetDefault} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'8px 14px', borderRadius:'8px', background:'var(--cream2)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontSize:'12px', fontWeight:500, fontFamily:'var(--font-sans)' }}>
          <RotateCcw style={{ width:12, height:12 }} /> Reset
        </button>
        <button onClick={copyCss} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'8px 14px', borderRadius:'8px', background:'var(--cream2)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontSize:'12px', fontWeight:500, fontFamily:'var(--font-sans)' }}>
          {copied ? <><Check style={{ width:12, height:12, color:'#4ADE80' }} /> Copied</> : <><Copy style={{ width:12, height:12 }} /> Copy CSS</>}
        </button>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
          style={{ display:'flex', alignItems:'center', gap:'7px', padding:'10px 22px', borderRadius:'9px', background:'var(--teal)', border:'none', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:700, fontFamily:'var(--font-sans)', opacity: saveMutation.isPending ? .7 : 1, boxShadow:'0 4px 14px rgba(10,95,85,.3)' }}>
          {saveMutation.isPending
            ? <><Loader2 style={{ width:14, height:14, animation:'spin 1s linear infinite' }} /> Saving…</>
            : <><Globe style={{ width:14, height:14 }} /> Save to Site</>}
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'18px', height:'calc(100vh - 200px)' }}>

        {/* ── LEFT: Controls ── */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflowY:'auto' }}>

          {/* Presets */}
          <div style={{ padding:'14px', borderBottom:'1px solid var(--border2)' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'10px' }}>Quick Presets</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
              {Object.entries(PRESETS).map(([name, vals]) => (
                <button key={name} onClick={() => applyPreset(name)}
                  style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 11px', borderRadius:'9px', border: activePreset===name ? '1.5px solid var(--teal)' : '1.5px solid var(--border)', background: activePreset===name ? 'rgba(10,95,85,.05)' : '#fff', cursor:'pointer', textAlign:'left', transition:'all .15s' }}>
                  <div style={{ display:'flex', gap:'3px', flexShrink:0 }}>
                    {[vals.teal, vals.coral, vals.gold, vals.cream].map((c, i) => (
                      <div key={i} style={{ width:13, height:13, borderRadius:'50%', background:String(c), border:'1px solid rgba(0,0,0,.1)', flexShrink:0 }} />
                    ))}
                  </div>
                  <span style={{ fontSize:'12px', fontWeight:600, color:'var(--ink)', fontFamily:'var(--font-sans)', flex:1 }}>{name}</span>
                  {activePreset===name && <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--teal)', flexShrink:0 }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Colours */}
          <div style={{ padding:'14px', borderBottom:'1px solid var(--border2)' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'10px' }}>Colours</div>
            {COLOR_FIELDS.map(({ key, label }) => (
              <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(10,95,85,.04)' }}>
                <div>
                  <div style={{ fontSize:'12px', color:'var(--ink)', fontFamily:'var(--font-sans)', fontWeight:500 }}>{label}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--muted)' }}>--{key}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                  <input type="color" value={String(theme[key] || '#000000')}
                    onChange={e => setColor(key, e.target.value)}
                    style={{ width:26, height:26, borderRadius:'6px', border:'1.5px solid var(--parchment)', cursor:'pointer', padding:'2px', background:'none' }} />
                  <input type="text" value={String(theme[key] || '')}
                    onChange={e => setColor(key, e.target.value)}
                    style={{ ...inp, width:'88px', fontSize:'11px', fontFamily:'monospace', padding:'4px 7px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Typography */}
          <div style={{ padding:'14px', borderBottom:'1px solid var(--border2)' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'10px' }}>Typography</div>
            <div style={{ marginBottom:'10px' }}>
              <div style={{ fontSize:'11px', color:'var(--muted)', marginBottom:'5px', fontFamily:'var(--font-sans)' }}>Heading font</div>
              <select value={String(theme.fontSerif)} onChange={e => setColor('fontSerif', e.target.value)} style={{ ...inp }}>
                {['Fraunces','Playfair Display','Cormorant Garamond','EB Garamond','Lora','DM Serif Display'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:'11px', color:'var(--muted)', marginBottom:'5px', fontFamily:'var(--font-sans)' }}>Body font</div>
              <select value={String(theme.fontSans)} onChange={e => setColor('fontSans', e.target.value)} style={{ ...inp }}>
                {['Outfit','Inter','DM Sans','Plus Jakarta Sans','Nunito','Poppins'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Border radius */}
          <div style={{ padding:'14px' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'10px' }}>Border Radius</div>
            {[
              { key:'radius',   label:'Base radius',  min:0,  max:20 },
              { key:'radiusLg', label:'Large radius',  min:8,  max:32 },
            ].map(({ key, label, min, max }) => (
              <div key={key} style={{ marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontSize:'12px', color:'var(--ink)', fontFamily:'var(--font-sans)' }}>{label}</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', fontWeight:700, color:'var(--teal)' }}>{theme[key]}px</span>
                </div>
                <input type="range" min={min} max={max} value={Number(theme[key])}
                  onChange={e => setNum(key, Number(e.target.value))}
                  style={{ width:'100%', accentColor:'var(--teal)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Live preview ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px', overflowY:'auto' }}>

          {/* How it works banner */}
          <div style={{ padding:'12px 16px', background:'rgba(10,95,85,.06)', border:'1px solid rgba(10,95,85,.15)', borderRadius:'10px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
            <div style={{ fontSize:'18px', flexShrink:0 }}>⚡</div>
            <div style={{ fontSize:'12px', color:'var(--teal)', fontFamily:'var(--font-sans)', lineHeight:1.6, fontWeight:500 }}>
              <strong>How it works:</strong> Colour changes apply instantly to this admin panel (live preview). 
              Click <strong>Save to Site</strong> to write the theme to the database — the full website updates within 60 seconds automatically. No GitHub push needed.
            </div>
          </div>

          {/* Live preview panel */}
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden', flex:1 }}>
            <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', display:'flex', alignItems:'center', gap:'8px' }}>
              <Eye style={{ width:12, height:12 }} /> Live Preview — changes reflect instantly below
            </div>
            <div style={{ padding:'28px', background:'var(--cream)', overflowY:'auto' }}>

              {/* Nav preview */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px', paddingBottom:'14px', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:'var(--ink)' }}>
                  Thynk <em style={{ fontStyle:'normal', color:'var(--teal)' }}>Pulse</em>
                </span>
                <div style={{ display:'flex', gap:'20px' }}>
                  {['Explore','Community','Trending','Writers'].map(l => (
                    <span key={l} style={{ fontFamily:'var(--font-sans)', fontSize:'13px', color:'var(--muted)' }}>{l}</span>
                  ))}
                </div>
                <div style={{ padding:'9px 20px', borderRadius:'var(--radius)', background:'var(--teal)', color:'#fff', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:600 }}>
                  Start Writing
                </div>
              </div>

              {/* Hero preview */}
              <div style={{ marginBottom:'36px' }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(10,95,85,.08)', border:'1px solid rgba(10,95,85,.18)', color:'var(--teal)', fontSize:'11px', fontWeight:600, letterSpacing:'1.2px', textTransform:'uppercase', padding:'7px 16px', borderRadius:'50px', marginBottom:'18px' }}>
                  <div style={{ width:7, height:7, background:'var(--coral)', borderRadius:'50%' }} />
                  India&apos;s Education Platform
                </div>
                <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'48px', lineHeight:1.04, letterSpacing:'-2px', color:'var(--ink)', marginBottom:'14px' }}>
                  Where <span style={{ color:'var(--teal)' }}>Educators</span>,<br />
                  Innovators &amp; <span style={{ color:'var(--coral)' }}>EdTech</span> Converge
                </div>
                <p style={{ fontFamily:'var(--font-sans)', fontSize:'15px', color:'var(--muted)', maxWidth:'440px', lineHeight:1.8, marginBottom:'22px', fontWeight:300 }}>
                  The free community for education professionals to share, grow and connect.
                </p>
                <div style={{ display:'flex', gap:'12px' }}>
                  <div style={{ padding:'12px 28px', borderRadius:'var(--radius)', background:'var(--teal)', color:'#fff', fontFamily:'var(--font-sans)', fontSize:'14px', fontWeight:600 }}>🚀 Join Free</div>
                  <div style={{ padding:'11px 24px', borderRadius:'var(--radius)', border:'2px solid var(--parchment)', color:'var(--ink)', fontFamily:'var(--font-sans)', fontSize:'14px' }}>Browse Articles →</div>
                </div>
              </div>

              {/* Stats bar */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius)', marginBottom:'28px', overflow:'hidden' }}>
                {[['10K+','Members'],['2.4K+','Articles'],['180+','Companies'],['40+','Countries'],['100%','Free']].map(([n,l],i) => (
                  <div key={l} style={{ padding:'16px 0', textAlign:'center', borderRight: i<4 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'28px', color:'var(--ink)', lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'4px', fontFamily:'var(--font-sans)' }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Cards row */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'24px' }}>
                {[
                  { emoji:'🤖', cat:'EdTech',    title:'AI is Rewriting Classroom Engagement',   bg:'linear-gradient(135deg,#EAF4F0,#C0E6DC)', author:'Rajesh Kumar', role:'EdTech Founder' },
                  { emoji:'🌱', cat:'Educator',  title:'Experiential Learning: Why It Works',    bg:'linear-gradient(135deg,#FEF0EA,#F7CBB8)', author:'Priya Sharma',  role:'Teacher · Delhi' },
                  { emoji:'📈', cat:'Sales Pro', title:'Selling to Schools: What Works',          bg:'linear-gradient(135deg,#FEF8E8,#F5DFA0)', author:'Arjun Mehta',   role:'Sales Director' },
                ].map(c => (
                  <div key={c.title} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
                    <div style={{ height:100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px', background:c.bg, position:'relative' }}>
                      {c.emoji}
                      <span style={{ position:'absolute', top:10, left:10, fontSize:'10px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', padding:'4px 10px', borderRadius:'5px', background:'rgba(10,95,85,.12)', color:'var(--teal)' }}>{c.cat}</span>
                    </div>
                    <div style={{ padding:'14px' }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:'14px', fontWeight:700, color:'var(--ink)', lineHeight:1.3, marginBottom:'10px' }}>{c.title}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', paddingTop:'10px', borderTop:'1px solid var(--border)' }}>
                        <div style={{ width:28, height:28, borderRadius:'7px', background:'linear-gradient(135deg,var(--teal),var(--teal3))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:900, color:'#fff', fontFamily:'var(--font-serif)', flexShrink:0 }}>{c.author[0]}</div>
                        <div>
                          <div style={{ fontSize:'11px', fontWeight:600, color:'var(--ink)' }}>{c.author}</div>
                          <div style={{ fontSize:'10px', color:'var(--muted)' }}>{c.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons showcase */}
              <div style={{ padding:'18px', background:'var(--cream2)', borderRadius:'var(--radius)', border:'1px solid var(--border)' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'12px' }}>UI Components</div>
                <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
                  <div style={{ padding:'10px 22px', borderRadius:'var(--radius)', background:'var(--teal)', color:'#fff', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:600 }}>Primary Button</div>
                  <div style={{ padding:'10px 22px', borderRadius:'var(--radius)', background:'var(--coral)', color:'#fff', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:600 }}>Accent Button</div>
                  <div style={{ padding:'10px 22px', borderRadius:'var(--radius)', background:'transparent', border:'2px solid var(--parchment)', color:'var(--ink)', fontFamily:'var(--font-sans)', fontSize:'13px' }}>Outline Button</div>
                  <div style={{ padding:'5px 12px', borderRadius:'100px', background:'rgba(10,95,85,.1)', color:'var(--teal)', border:'1px solid rgba(10,95,85,.2)', fontSize:'11px', fontWeight:700 }}>Badge Teal</div>
                  <div style={{ padding:'5px 12px', borderRadius:'100px', background:'rgba(232,81,42,.1)', color:'var(--coral)', border:'1px solid rgba(232,81,42,.2)', fontSize:'11px', fontWeight:700 }}>Badge Coral</div>
                  <div style={{ padding:'5px 12px', borderRadius:'100px', background:'rgba(201,146,42,.1)', color:'var(--gold)', border:'1px solid rgba(201,146,42,.2)', fontSize:'11px', fontWeight:700 }}>Badge Gold</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
