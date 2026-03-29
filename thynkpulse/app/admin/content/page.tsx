'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiPost } from '@/lib/api'
import { Globe, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

/* ─── Every editable element on every page ───────────────────── */
const PAGES: { label: string; icon: string; sections: { id: string; label: string; fields: Field[] }[] }[] = [
  {
    label: 'Homepage', icon: '🏠',
    sections: [
      {
        id: 'hero', label: 'Hero Section',
        fields: [
          { id:'hero.eyebrow',       label:'Eyebrow text',         type:'text',   cssVar:'--hero-eyebrow-text',      default:'India\'s Education Community Platform' },
          { id:'hero.h1Line1',       label:'H1 Line 1',            type:'text',   cssVar:'--hero-h1-line1',          default:'Where Ideas' },
          { id:'hero.h1Line2',       label:'H1 Line 2 (italic)',   type:'text',   cssVar:'--hero-h1-line2',          default:'Shape Education' },
          { id:'hero.subtitle',      label:'Subtitle text',        type:'textarea',cssVar:'--hero-subtitle-text',   default:'Thynk Pulse is the free, open community for educators, EdTech professionals, innovators and school leaders.' },
          { id:'hero.h1Size',        label:'H1 font size',         type:'size',   cssVar:'--hero-h1-size',           default:'84', min:32, max:160 },
          { id:'hero.h1Color',       label:'H1 text colour',       type:'color',  cssVar:'--hero-h1-color',          default:'#1A1208' },
          { id:'hero.subSize',       label:'Subtitle font size',   type:'size',   cssVar:'--hero-sub-size',          default:'17', min:12, max:28 },
          { id:'hero.subColor',      label:'Subtitle colour',      type:'color',  cssVar:'--hero-sub-color',         default:'#7A6A52' },
          { id:'hero.bg',            label:'Background colour',    type:'color',  cssVar:'--hero-bg',                default:'#FDF6EC' },
          { id:'hero.btn1Text',      label:'Primary button text',  type:'text',   cssVar:'--hero-btn1-text',         default:'Start Writing Free' },
          { id:'hero.btn1Bg',        label:'Primary button background', type:'color', cssVar:'--hero-btn1-bg',      default:'#0A5F55' },
          { id:'hero.btn1Color',     label:'Primary button text colour', type:'color', cssVar:'--hero-btn1-color',  default:'#ffffff' },
          { id:'hero.btn2Text',      label:'Secondary button text',type:'text',   cssVar:'--hero-btn2-text',         default:'Explore Posts' },
          { id:'hero.btn2Bg',        label:'Secondary button background', type:'color', cssVar:'--hero-btn2-bg',   default:'transparent' },
          { id:'hero.btn2Color',     label:'Secondary button text colour', type:'color', cssVar:'--hero-btn2-color',default:'#1A1208' },
          { id:'hero.btn2Border',    label:'Secondary button border', type:'color', cssVar:'--hero-btn2-border',    default:'#EDE0C8' },
        ],
      },
      {
        id: 'stats', label: 'Stats Bar',
        fields: [
          { id:'stats.bg',           label:'Background colour',    type:'color',  cssVar:'--stats-bg',               default:'#ffffff' },
          { id:'stats.numColor',     label:'Number colour',        type:'color',  cssVar:'--stat-num-color',         default:'#1A1208' },
          { id:'stats.numSize',      label:'Number font size',     type:'size',   cssVar:'--stat-num-size',          default:'40', min:20, max:72 },
          { id:'stats.labelColor',   label:'Label colour',         type:'color',  cssVar:'--stat-label-color',       default:'#7A6A52' },
          { id:'stats.accentColor',  label:'Suffix accent colour', type:'color',  cssVar:'--stat-accent-color',      default:'#E8512A' },
          { id:'stats.1n',           label:'Stat 1 — Number',      type:'text',   cssVar:'--stat-1-n',               default:'10K' },
          { id:'stats.1l',           label:'Stat 1 — Label',       type:'text',   cssVar:'--stat-1-l',               default:'Community Members' },
          { id:'stats.2n',           label:'Stat 2 — Number',      type:'text',   cssVar:'--stat-2-n',               default:'2.4K' },
          { id:'stats.2l',           label:'Stat 2 — Label',       type:'text',   cssVar:'--stat-2-l',               default:'Articles Published' },
          { id:'stats.3n',           label:'Stat 3 — Number',      type:'text',   cssVar:'--stat-3-n',               default:'180' },
          { id:'stats.3l',           label:'Stat 3 — Label',       type:'text',   cssVar:'--stat-3-l',               default:'EdTech Companies' },
          { id:'stats.4n',           label:'Stat 4 — Number',      type:'text',   cssVar:'--stat-4-n',               default:'40' },
          { id:'stats.4l',           label:'Stat 4 — Label',       type:'text',   cssVar:'--stat-4-l',               default:'Countries' },
          { id:'stats.5n',           label:'Stat 5 — Number',      type:'text',   cssVar:'--stat-5-n',               default:'100' },
          { id:'stats.5l',           label:'Stat 5 — Label',       type:'text',   cssVar:'--stat-5-l',               default:'Free Forever' },
        ],
      },
      {
        id: 'cta', label: 'CTA / Join Section',
        fields: [
          { id:'cta.bg',             label:'Section background',   type:'color',  cssVar:'--cta-bg',                 default:'#0A5F55' },
          { id:'cta.headlineColor',  label:'Headline colour',      type:'color',  cssVar:'--cta-h2-color',           default:'#ffffff' },
          { id:'cta.headlineSize',   label:'Headline font size',   type:'size',   cssVar:'--cta-h2-size',            default:'38', min:20, max:72 },
          { id:'cta.subtitleColor',  label:'Subtitle colour',      type:'color',  cssVar:'--cta-subtitle-color',     default:'rgba(255,255,255,0.75)' },
          { id:'cta.btnBg',          label:'Button background',    type:'color',  cssVar:'--cta-btn-bg',             default:'#E8512A' },
          { id:'cta.btnColor',       label:'Button text colour',   type:'color',  cssVar:'--cta-btn-color',          default:'#ffffff' },
          { id:'cta.btnText',        label:'Button text',          type:'text',   cssVar:'--cta-btn-text',           default:'Join Free →' },
          { id:'cta.btnSize',        label:'Button font size',     type:'size',   cssVar:'--cta-btn-size',           default:'15', min:12, max:22 },
          { id:'cta.inputPlaceholder',label:'Email placeholder',   type:'text',   cssVar:'--cta-input-placeholder',  default:'Enter your work email' },
          { id:'cta.footnote',       label:'Footnote text',        type:'text',   cssVar:'--cta-footnote',           default:'🔒 No spam. No paywall. Free forever.' },
        ],
      },
    ],
  },
  {
    label: 'Navbar', icon: '📌',
    sections: [
      {
        id: 'navbar', label: 'Navigation Bar',
        fields: [
          { id:'navbar.bg',          label:'Background colour',    type:'color',  cssVar:'--nav-bg',                 default:'rgba(253,246,236,0.97)' },
          { id:'navbar.linkColor',   label:'Link text colour',     type:'color',  cssVar:'--nav-color',              default:'#7A6A52' },
          { id:'navbar.linkSize',    label:'Link font size',       type:'size',   cssVar:'--nav-size',               default:'13', min:10, max:18 },
          { id:'navbar.btnText',     label:'CTA button text',      type:'text',   cssVar:'--nav-btn-text',           default:'Start Writing' },
          { id:'navbar.btnBg',       label:'CTA button background',type:'color',  cssVar:'--nav-btn-bg',             default:'#0A5F55' },
          { id:'navbar.btnColor',    label:'CTA button text colour',type:'color', cssVar:'--nav-btn-color',          default:'#ffffff' },
          { id:'navbar.loginText',   label:'Login link text',      type:'text',   cssVar:'--nav-login-text',         default:'Login' },
        ],
      },
    ],
  },
  {
    label: 'Footer', icon: '🦶',
    sections: [
      {
        id: 'footer', label: 'Footer',
        fields: [
          { id:'footer.bg',          label:'Background colour',    type:'color',  cssVar:'--footer-bg',              default:'#0A5F55' },
          { id:'footer.textColor',   label:'Body text colour',     type:'color',  cssVar:'--footer-text-color',      default:'rgba(255,255,255,0.6)' },
          { id:'footer.linkColor',   label:'Link / accent colour', type:'color',  cssVar:'--footer-link-color',      default:'#E5B64A' },
          { id:'footer.headingColor',label:'Column heading colour',type:'color',  cssVar:'--footer-heading-color',   default:'rgba(255,255,255,0.35)' },
          { id:'footer.textSize',    label:'Text font size',       type:'size',   cssVar:'--footer-text-size',       default:'13', min:10, max:18 },
          { id:'footer.tagline',     label:'Tagline text',         type:'textarea',cssVar:'--footer-tagline',        default:'The free community platform for educators and EdTech professionals.' },
          { id:'footer.copyright',   label:'Copyright text',       type:'text',   cssVar:'--footer-copyright',      default:'© 2025 Thynk Pulse. All rights reserved.' },
        ],
      },
    ],
  },
  {
    label: 'Post Pages', icon: '📄',
    sections: [
      {
        id: 'post', label: 'Post Detail Page',
        fields: [
          { id:'post.bg',            label:'Page background',      type:'color',  cssVar:'--post-page-bg',           default:'#FDF6EC' },
          { id:'post.titleColor',    label:'Title colour',         type:'color',  cssVar:'--post-page-title-color',  default:'#1A1208' },
          { id:'post.titleSize',     label:'Title font size',      type:'size',   cssVar:'--post-page-title-size',   default:'40', min:24, max:72 },
          { id:'post.bodyColor',     label:'Body text colour',     type:'color',  cssVar:'--post-page-body-color',   default:'#1A1208' },
          { id:'post.bodySize',      label:'Body font size',       type:'size',   cssVar:'--post-page-body-size',    default:'16', min:12, max:22 },
          { id:'post.cardBg',        label:'Post card background', type:'color',  cssVar:'--post-card-bg',           default:'#ffffff' },
          { id:'post.titleColor2',   label:'Card title colour',    type:'color',  cssVar:'--post-title-color',       default:'#1A1208' },
          { id:'post.titleSize2',    label:'Card title size',      type:'size',   cssVar:'--post-title-size',        default:'20', min:14, max:32 },
          { id:'post.catColor',      label:'Category tag colour',  type:'color',  cssVar:'--post-cat-color',         default:'#0A5F55' },
        ],
      },
    ],
  },
  {
    label: 'Auth Pages', icon: '🔐',
    sections: [
      {
        id: 'login', label: 'Login Page',
        fields: [
          { id:'login.bg',           label:'Page background',      type:'color',  cssVar:'--login-bg',               default:'#FDF6EC' },
          { id:'login.cardBg',       label:'Card background',      type:'color',  cssVar:'--login-card-bg',          default:'#ffffff' },
          { id:'login.h1Color',      label:'Heading colour',       type:'color',  cssVar:'--login-h1-color',         default:'#1A1208' },
          { id:'login.h1Size',       label:'Heading font size',    type:'size',   cssVar:'--login-h1-size',          default:'30', min:20, max:48 },
          { id:'login.labelColor',   label:'Label colour',         type:'color',  cssVar:'--login-label-color',      default:'#7A6A52' },
          { id:'login.inputBorder',  label:'Input border colour',  type:'color',  cssVar:'--login-input-border',     default:'#EDE0C8' },
        ],
      },
      {
        id: 'register', label: 'Register Page',
        fields: [
          { id:'reg.bg',             label:'Page background',      type:'color',  cssVar:'--register-bg',            default:'#FDF6EC' },
          { id:'reg.h1Color',        label:'Heading colour',       type:'color',  cssVar:'--register-h1-color',      default:'#1A1208' },
          { id:'reg.h1Size',         label:'Heading font size',    type:'size',   cssVar:'--register-h1-size',       default:'28', min:20, max:48 },
        ],
      },
    ],
  },
  {
    label: 'Admin Panel', icon: '🛡️',
    sections: [
      {
        id: 'admin', label: 'Admin Dashboard',
        fields: [
          { id:'admin.bg',           label:'Page background',      type:'color',  cssVar:'--admin-bg',               default:'#F8F4EE' },
          { id:'admin.sidebarBg',    label:'Sidebar background',   type:'color',  cssVar:'--admin-sidebar-bg',       default:'#1A1208' },
          { id:'admin.sidebarActive',label:'Active item background',type:'color', cssVar:'--admin-sidebar-active',   default:'rgba(10,95,85,0.08)' },
          { id:'admin.sidebarActiveColor',label:'Active item colour',type:'color',cssVar:'--admin-sidebar-active-color',default:'#0A5F55' },
          { id:'admin.headerBg',     label:'Header/card background',type:'color', cssVar:'--admin-header-bg',        default:'#ffffff' },
        ],
      },
    ],
  },
  {
    label: 'Inner Pages', icon: '📰',
    sections: [
      {
        id: 'latest-posts', label: 'Latest Posts',
        fields: [
          { id:'lp.heroBg',          label:'Hero background',      type:'color',  cssVar:'--latest-posts-hero-bg',   default:'#0A5F55' },
          { id:'lp.heroColor',       label:'Hero text colour',     type:'color',  cssVar:'--latest-posts-hero-color',default:'#ffffff' },
          { id:'lp.pageBg',          label:'Page background',      type:'color',  cssVar:'--latest-posts-bg',        default:'#FDF6EC' },
        ],
      },
      {
        id: 'trending', label: 'Trending Page',
        fields: [
          { id:'tr.heroBg',          label:'Hero background',      type:'color',  cssVar:'--trending-hero-bg',       default:'#E8512A' },
          { id:'tr.heroColor',       label:'Hero text colour',     type:'color',  cssVar:'--trending-hero-color',    default:'#ffffff' },
          { id:'tr.pageBg',          label:'Page background',      type:'color',  cssVar:'--trending-page-bg',       default:'#ffffff' },
          { id:'tr.rankColor',       label:'Rank number colour',   type:'color',  cssVar:'--trending-rank-color',    default:'#EDE0C8' },
          { id:'tr.tagColor',        label:'Category tag colour',  type:'color',  cssVar:'--trending-tag-color',     default:'#E8512A' },
        ],
      },
      {
        id: 'community', label: 'Community Page',
        fields: [
          { id:'com.heroBg',         label:'Hero background',      type:'color',  cssVar:'--community-hero-bg',      default:'#0A5F55' },
          { id:'com.heroColor',      label:'Hero text colour',     type:'color',  cssVar:'--community-hero-color',   default:'#ffffff' },
          { id:'com.pageBg',         label:'Page background',      type:'color',  cssVar:'--community-page-bg',      default:'#ffffff' },
          { id:'com.statsBg',        label:'Stats bar background', type:'color',  cssVar:'--community-stats-bg',     default:'#ffffff' },
          { id:'com.statsNumColor',  label:'Stats number colour',  type:'color',  cssVar:'--community-stats-num-color',default:'#0A5F55' },
        ],
      },
      {
        id: 'writers', label: 'Writers Directory',
        fields: [
          { id:'wr.heroBg',          label:'Hero background',      type:'color',  cssVar:'--writers-hero-bg',        default:'#0A5F55' },
          { id:'wr.heroColor',       label:'Hero text colour',     type:'color',  cssVar:'--writers-hero-color',     default:'#ffffff' },
          { id:'wr.pageBg',          label:'Page background',      type:'color',  cssVar:'--writers-bg',             default:'#FDF6EC' },
          { id:'wr.cardBg',          label:'Writer card background',type:'color', cssVar:'--writers-card-bg',        default:'#ffffff' },
        ],
      },
    ],
  },
  {
    label: 'Legal Pages', icon: '🔒',
    sections: [
      {
        id: 'privacy', label: 'Privacy Policy',
        fields: [
          { id:'priv.heroBg',        label:'Hero background',      type:'color',  cssVar:'--privacy-hero-bg',        default:'#0A5F55' },
          { id:'priv.heroColor',     label:'Hero text colour',     type:'color',  cssVar:'--privacy-hero-color',     default:'#ffffff' },
          { id:'priv.pageBg',        label:'Page background',      type:'color',  cssVar:'--privacy-bg',             default:'#ffffff' },
          { id:'priv.headingColor',  label:'Section heading colour',type:'color', cssVar:'--privacy-heading-color',  default:'#1A1208' },
          { id:'priv.bodyColor',     label:'Body text colour',     type:'color',  cssVar:'--privacy-body-color',     default:'#7A6A52' },
        ],
      },
      {
        id: 'terms', label: 'Terms of Use',
        fields: [
          { id:'terms.heroBg',       label:'Hero background',      type:'color',  cssVar:'--terms-hero-bg',          default:'#1A1208' },
          { id:'terms.heroColor',    label:'Hero text colour',     type:'color',  cssVar:'--terms-hero-color',       default:'#ffffff' },
          { id:'terms.pageBg',       label:'Page background',      type:'color',  cssVar:'--terms-bg',               default:'#ffffff' },
          { id:'terms.headingColor', label:'Section heading colour',type:'color', cssVar:'--terms-heading-color',    default:'#1A1208' },
          { id:'terms.bodyColor',    label:'Body text colour',     type:'color',  cssVar:'--terms-body-color',       default:'#7A6A52' },
        ],
      },
    ],
  },
]

type Field = { id:string; label:string; type:'text'|'textarea'|'color'|'size'; cssVar:string; default:string; min?:number; max?:number }

/* Build flat map of all fields */
const ALL_FIELDS: Record<string, Field> = {}
PAGES.forEach(p => p.sections.forEach(s => s.fields.forEach(f => { ALL_FIELDS[f.id] = f })))

/* ─── Convert field values → CSS var block ────────────────────── */
function buildCSSVars(values: Record<string,string>): string {
  const lines = Object.entries(ALL_FIELDS).map(([id, field]) => {
    const val = values[id] ?? field.default
    const cssVal = field.type === 'size' ? `${val}px` : val
    return `  ${field.cssVar}: ${cssVal};`
  })
  return `:root {\n${lines.join('\n')}\n}`
}

/* ─── Components ──────────────────────────────────────────────── */
const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', background:'#fff', border:'1.5px solid var(--parchment)', borderRadius:'9px', fontSize:'13px', fontFamily:'var(--font-sans)', color:'var(--ink)', outline:'none', boxSizing:'border-box' as const }
const lbl: React.CSSProperties = { display:'block', fontSize:'10px', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase' as const, color:'var(--muted)', fontFamily:'var(--font-mono)', marginBottom:'5px' }

function FieldRow({ field, value, onChange }: { field:Field; value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid var(--border2)' }}>
      <label style={{ ...lbl, marginBottom:0, minWidth:'180px', flexShrink:0 }}>{field.label}</label>
      <div style={{ flex:1 }}>
        {field.type === 'color' && (
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <input type="color" value={value||field.default}
              onChange={e=>onChange(e.target.value)}
              style={{ width:36, height:32, border:'1.5px solid var(--parchment)', borderRadius:'7px', padding:'2px', cursor:'pointer', background:'none', flexShrink:0 }} />
            <input type="text" value={value||field.default}
              onChange={e=>onChange(e.target.value)}
              style={{ ...inp, fontFamily:'var(--font-mono)', fontSize:'12px', maxWidth:'160px' }} />
          </div>
        )}
        {field.type === 'size' && (
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <input type="range" min={field.min||8} max={field.max||100} value={Number(value||field.default)}
              onChange={e=>onChange(e.target.value)}
              style={{ flex:1, accentColor:'var(--teal)', cursor:'pointer' }} />
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px', fontWeight:700, color:'var(--teal)', minWidth:'52px', textAlign:'right' as const }}>
              {value||field.default}px
            </span>
          </div>
        )}
        {field.type === 'text' && (
          <input type="text" value={value||field.default} onChange={e=>onChange(e.target.value)} style={inp} />
        )}
        {field.type === 'textarea' && (
          <textarea value={value||field.default} onChange={e=>onChange(e.target.value)}
            style={{ ...inp, resize:'vertical' as const, lineHeight:1.6 }} rows={2} />
        )}
      </div>
      <button onClick={()=>onChange(field.default)}
        title="Reset to default"
        style={{ padding:'4px 8px', borderRadius:'6px', border:'1px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:'11px', flexShrink:0, fontFamily:'var(--font-sans)' }}>
        Reset
      </button>
    </div>
  )
}

export default function AdminContentPage() {
  const [values,    setValues]    = useState<Record<string,string>>({})
  const [openPages, setOpenPages] = useState<Record<string,boolean>>({ 'Homepage':true })
  const [unsaved,   setUnsaved]   = useState(false)

  const { data: saved } = useQuery({
    queryKey: ['admin-content-v2'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content')
      const all = await res.json()
      return all['content.styles'] ?? {}
    },
    staleTime: Infinity,
  })

  useEffect(() => {
    if (saved) setValues(saved)
  }, [saved])

  const set = useCallback((id:string, v:string) => {
    setValues(p => ({ ...p, [id]: v }))
    setUnsaved(true)
    // Live preview — apply CSS var immediately to the page
    const field = ALL_FIELDS[id]
    if (field) {
      const cssVal = field.type === 'size' ? `${v}px` : v
      document.documentElement.style.setProperty(field.cssVar, cssVal)
    }
  }, [])

  const saveMutation = useMutation({
    mutationFn: () => apiPost('/admin/content', { key: 'content.styles', value: values }),
    onSuccess: async () => {
      // Also save the full CSS block as a separate key for layout.tsx to inject
      const css = buildCSSVars(values)
      await apiPost('/admin/content', { key: 'content.css', value: css })
      toast.success('✅ Saved! Changes applied to site immediately.')
      setUnsaved(false)
    },
    onError: () => toast.error('Failed to save'),
  })

  const togglePage = (label:string) => setOpenPages(p => ({ ...p, [label]: !p[label] }))

  return (
    <AdminLayout title="Content & Style Manager" subtitle="Change any text, colour, font size or button style — updates apply live instantly">

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', padding:'12px 16px', background:'#fff', border:'1px solid var(--border)', borderRadius:'12px' }}>
        <div style={{ width:9, height:9, borderRadius:'50%', background: unsaved?'var(--gold)':'#4ADE80', boxShadow: unsaved?'0 0 8px rgba(201,146,42,.5)':'0 0 8px rgba(74,222,128,.4)' }} />
        <span style={{ fontSize:'12px', color:'var(--muted)', flex:1, fontFamily:'var(--font-sans)' }}>
          {unsaved ? '⚠ Unsaved changes — click Save to apply to live site' : '✓ All changes saved and live'}
        </span>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !unsaved}
          style={{ display:'flex', alignItems:'center', gap:'7px', padding:'10px 24px', borderRadius:'9px', background:'var(--teal)', border:'none', color:'#fff', cursor: (saveMutation.isPending||!unsaved)?'not-allowed':'pointer', fontSize:'13px', fontWeight:700, fontFamily:'var(--font-sans)', opacity:(saveMutation.isPending||!unsaved)?.6:1, boxShadow:'0 4px 14px rgba(10,95,85,.3)' }}>
          {saveMutation.isPending ? <><Loader2 style={{width:14,height:14,animation:'spin 1s linear infinite'}}/>Saving…</> : <><Globe style={{width:14,height:14}}/>Save to Site</>}
        </button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {PAGES.map(page => (
          <div key={page.label} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden' }}>
            {/* Page header */}
            <button onClick={()=>togglePage(page.label)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', padding:'14px 18px', border:'none', background: openPages[page.label] ? 'rgba(10,95,85,.04)' : '#fff', cursor:'pointer', textAlign:'left' as const }}>
              <span style={{ fontSize:'18px' }}>{page.icon}</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'15px', fontWeight:700, color:'var(--ink)', flex:1 }}>{page.label}</span>
              <span style={{ fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{page.sections.reduce((a,s)=>a+s.fields.length,0)} controls</span>
              {openPages[page.label] ? <ChevronDown style={{width:16,height:16,color:'var(--muted)'}} /> : <ChevronRight style={{width:16,height:16,color:'var(--muted)'}} />}
            </button>

            {openPages[page.label] && page.sections.map(section => (
              <div key={section.id} style={{ borderTop:'1px solid var(--border2)' }}>
                <div style={{ padding:'10px 18px 6px', fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'var(--teal)', background:'rgba(10,95,85,.02)' }}>
                  {section.label}
                </div>
                <div style={{ padding:'0 18px 8px' }}>
                  {section.fields.map(field => (
                    <FieldRow key={field.id} field={field} value={values[field.id]??''} onChange={v=>set(field.id,v)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
