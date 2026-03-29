'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/lib/api'
import { Save, Loader2, Globe, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

/* ── Default content for every editable section ── */
const DEFAULTS: Record<string, any> = {
  'content.hero': {
    eyebrow:   'India\'s Education Community Platform',
    h1Line1:   'Where Ideas',
    h1Line2:   'Shape Education',
    subtitle:  'Thynk Pulse is the free, open community for educators, EdTech professionals, innovators and school leaders to share experiences and shape the future of learning.',
    ctaPrimary:   'Start Writing Free',
    ctaSecondary: 'Explore Posts',
    socialProof:  'Join 10,000+ professionals already on Thynk Pulse',
  },
  'content.stats': [
    { n:'10K', sup:'+', l:'Community Members'   },
    { n:'2.4K', sup:'+', l:'Articles Published'  },
    { n:'180', sup:'+', l:'EdTech Companies'    },
    { n:'40', sup:'+',  l:'Countries Represented'},
    { n:'100', sup:'%', l:'Free Forever'         },
  ],
  'content.cta': {
    badge:     'Completely Free · No Credit Card',
    h2Line1:   'Join',
    h2Brand:   'Thynk Pulse',
    h2Line2:   'Shape Education\'s Future.',
    subtitle:  'Be part of India\'s most vibrant education community. Share your story, build your audience, and connect with thousands of education professionals.',
    inputPlaceholder: 'Enter your work email',
    btnLabel:  'Join Free →',
    footnote:  '🔒 No spam. No paywall. Free forever.',
  },
  'content.navbar': {
    brandName:  'Thynk Pulse',
    links: [
      { label:'Latest Posts',  href:'/latest-posts' },
      { label:'Trending',      href:'/trending'     },
      { label:'Community',     href:'/community'    },
      { label:'Writers',       href:'/writers'      },
    ],
    ctaLabel: 'Start Writing',
    loginLabel: 'Login',
  },
  'content.footer': {
    tagline:   'The free community platform for educators, EdTech professionals, innovators and school leaders.',
    copyright: '© 2025 Thynk Pulse. All rights reserved.',
    links: [
      { label:'About',   href:'/about'   },
      { label:'Blog',    href:'/blog'    },
      { label:'Privacy', href:'/privacy' },
      { label:'Terms',   href:'/terms'   },
    ],
  },
  'content.seo': {
    siteName:    'Thynk Pulse',
    tagline:     "India's Education Community Platform",
    description: 'The free community platform for educators, EdTech professionals, innovators and school leaders.',
    keywords:    'education community, EdTech, educators India, teaching, school leadership',
    ogImage:     '',
  },
  'content.latest-posts': {
    heroEyebrow: 'Community Feed',
    heroTitle:   'Latest Posts',
    heroSubtitle: 'Fresh articles from educators, EdTech founders, sales pros, and innovators shaping the future of education.',
    browseAllLabel: 'Browse All Articles →',
  },
  'content.trending': {
    heroEyebrow: "What's Hot",
    heroTitle:   'Trending Now',
    heroSubtitle: "The articles the community can't stop reading, sharing, and discussing right now.",
    sidebarCtaTitle: 'Share Your Insights',
    sidebarCtaBody: 'Your experience could be trending next. Write for the Thynk Pulse community.',
    sidebarCtaBtn: 'Start Writing →',
  },
  'content.edtech-articles': {
    heroEyebrow: 'EdTech Category',
    heroTitle:   'EdTech Articles',
    heroSubtitle: 'In-depth analysis, product deep-dives, funding news, and thought leadership from EdTech founders, investors, and practitioners.',
    viewAllLabel: 'View All EdTech Articles →',
  },
  'content.edtech-stories': {
    heroEyebrow: 'Real Stories',
    heroTitle:   'EdTech Stories',
    heroSubtitle: "Personal narratives from educators and EdTech professionals — the real stories behind the industry, in their own words.",
    ctaTitle:    'Your Story Matters',
    ctaSubtitle: 'Every educator has a unique journey. Share yours with 10,000+ education professionals.',
    ctaBtn:      'Share Your Story →',
    viewAllLabel: 'Read All Educator Stories →',
  },
  'content.school-leadership': {
    heroEyebrow: 'School Leadership',
    heroTitle:   'School Leadership',
    heroSubtitle: 'Insights from principals, directors, and administrators navigating the complex realities of leading educational institutions in modern India.',
    viewAllLabel: 'View All Leadership Articles →',
  },
  'content.innovation': {
    heroEyebrow: 'Innovation Hub',
    heroTitle:   'Innovation in Education',
    heroSubtitle: 'Cutting-edge ideas, experimental models, and real-world case studies from educators and technologists reimagining how learning happens.',
    viewAllLabel: 'View All Innovation Articles →',
  },
  'content.community': {
    heroTitle:    "India's Education Community",
    heroSubtitle: 'Connect with 10,000+ educators, EdTech founders, school leaders, and researchers — all building the future of education together.',
    heroCta1:    'Join Free →',
    heroCta2:    'Start Writing',
    ctaTitle:    'Ready to Join the Conversation?',
    ctaSubtitle: 'Free forever. No spam. Just the best conversations in Indian education.',
    ctaBtn1:     'Create Free Account →',
    ctaBtn2:     'Browse Articles First',
  },
  'content.writers': {
    heroTitle:    'Meet the Writers',
    heroSubtitle: "Educators, founders, researchers, and leaders sharing their expertise with India's education community.",
    searchPlaceholder: 'Search by name or role...',
    ctaTitle:    'Your Expertise Belongs Here',
    ctaSubtitle: "Join 2,400+ writers sharing knowledge with India's education community. It's free.",
    ctaBtn:      'Start Writing Today →',
  },
  'content.privacy': {
    lastUpdated: 'March 2025',
    summaryText: 'Thynk Pulse is a free community platform for education professionals. We collect only what we need to operate the platform, we never sell your data, and you can delete your account at any time.',
    contactEmail: 'privacy@thynksuccess.com',
  },
  'content.terms': {
    lastUpdated:  'March 2025',
    warningText:  'By creating an account or using Thynk Pulse, you agree to these Terms of Use. If you do not agree, please do not use the platform.',
    legalEmail:   'legal@thynksuccess.com',
    communityEmail: 'community@thynksuccess.com',
  },
}

const PAGES = [
  { key:'content.hero',           label:'🏠 Hero Section',        desc:'Headline, subtitle, CTA buttons'         },
  { key:'content.stats',          label:'📊 Stats Bar',           desc:'The 5 numbers below the hero'            },
  { key:'content.cta',            label:'📣 CTA Section',         desc:'Bottom join/signup section'              },
  { key:'content.navbar',         label:'📌 Navbar',              desc:'Brand name, nav links, CTA label'        },
  { key:'content.footer',         label:'🦶 Footer',              desc:'Tagline, links, copyright'               },
  { key:'content.seo',            label:'🔍 SEO & Meta',          desc:'Site name, description, keywords'        },
  { key:'content.latest-posts',   label:'📰 Latest Posts Page',   desc:'Hero text and labels for /latest-posts'  },
  { key:'content.trending',       label:'🔥 Trending Page',       desc:'Hero text and sidebar CTA for /trending' },
  { key:'content.edtech-articles',label:'💡 EdTech Articles',     desc:'Hero and labels for /edtech-articles'    },
  { key:'content.edtech-stories', label:'✍️ EdTech Stories',      desc:'Hero, CTA text for /edtech-stories'      },
  { key:'content.school-leadership', label:'🏆 School Leadership',desc:'Hero and labels for /school-leadership'  },
  { key:'content.innovation',     label:'🚀 Innovation Page',     desc:'Hero and labels for /innovation'         },
  { key:'content.community',      label:'🤝 Community Page',      desc:'All text on the /community hub page'     },
  { key:'content.writers',        label:'📖 Writers Directory',   desc:'Hero, search, CTA for /writers'          },
  { key:'content.privacy',        label:'🔒 Privacy Policy',      desc:'Last updated date, summary, contact'     },
  { key:'content.terms',          label:'📋 Terms of Use',        desc:'Last updated date, warning, contact'     },
]

const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', background:'#fff', border:'1.5px solid var(--parchment)', borderRadius:'9px', fontSize:'13px', fontFamily:'var(--font-sans)', color:'var(--ink)', outline:'none', boxSizing:'border-box' as const }
const ta:  React.CSSProperties = { ...{} as any, ...inp, resize:'vertical' as const, lineHeight:1.6 }
const lbl: React.CSSProperties = { display:'block', fontSize:'10px', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase' as const, color:'var(--muted)', fontFamily:'var(--font-mono)', marginBottom:'5px' }
const fieldWrap: React.CSSProperties = { marginBottom:'16px' }

function Field({ label, value, onChange, multiline=false, rows=2 }: any) {
  return (
    <div style={fieldWrap}>
      <label style={lbl}>{label}</label>
      {multiline
        ? <textarea style={ta} rows={rows} value={value||''} onChange={e=>onChange(e.target.value)} />
        : <input style={inp} type="text" value={value||''} onChange={e=>onChange(e.target.value)} />
      }
    </div>
  )
}

function HeroEditor({ val, onChange }: any) {
  const set = (k:string,v:string) => onChange({ ...val, [k]:v })
  return (
    <>
      <Field label="Eyebrow text"   value={val.eyebrow}    onChange={(v:string)=>set('eyebrow',v)} />
      <Field label="H1 Line 1"      value={val.h1Line1}    onChange={(v:string)=>set('h1Line1',v)} />
      <Field label="H1 Line 2 (italic gold)" value={val.h1Line2} onChange={(v:string)=>set('h1Line2',v)} />
      <Field label="Subtitle"       value={val.subtitle}   onChange={(v:string)=>set('subtitle',v)} multiline rows={3} />
      <Field label="Primary CTA button"   value={val.ctaPrimary}   onChange={(v:string)=>set('ctaPrimary',v)} />
      <Field label="Secondary CTA button" value={val.ctaSecondary} onChange={(v:string)=>set('ctaSecondary',v)} />
      <Field label="Social proof text"    value={val.socialProof}  onChange={(v:string)=>set('socialProof',v)} />
    </>
  )
}

function StatsEditor({ val, onChange }: any) {
  const stats = Array.isArray(val) ? val : DEFAULTS['content.stats']
  return (
    <>
      {stats.map((s:any,i:number) => (
        <div key={i} style={{ background:'var(--cream)', borderRadius:'10px', padding:'14px', marginBottom:'10px' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--muted)', fontWeight:700, marginBottom:'10px', letterSpacing:'1px' }}>STAT {i+1}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 1fr', gap:'10px' }}>
            <div>
              <label style={lbl}>Number</label>
              <input style={inp} value={s.n||''} onChange={e=>{ const a=[...stats]; a[i]={...a[i],n:e.target.value}; onChange(a) }} />
            </div>
            <div>
              <label style={lbl}>Suffix</label>
              <input style={inp} value={s.sup||''} onChange={e=>{ const a=[...stats]; a[i]={...a[i],sup:e.target.value}; onChange(a) }} />
            </div>
            <div>
              <label style={lbl}>Label</label>
              <input style={inp} value={s.l||''} onChange={e=>{ const a=[...stats]; a[i]={...a[i],l:e.target.value}; onChange(a) }} />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

function CTAEditor({ val, onChange }: any) {
  const set = (k:string,v:string) => onChange({ ...val, [k]:v })
  return (
    <>
      <Field label="Badge text"      value={val.badge}            onChange={(v:string)=>set('badge',v)} />
      <Field label="Headline part 1" value={val.h2Line1}          onChange={(v:string)=>set('h2Line1',v)} />
      <Field label="Brand name (gold italic)" value={val.h2Brand} onChange={(v:string)=>set('h2Brand',v)} />
      <Field label="Headline part 2" value={val.h2Line2}          onChange={(v:string)=>set('h2Line2',v)} />
      <Field label="Subtitle"        value={val.subtitle}         onChange={(v:string)=>set('subtitle',v)} multiline rows={3} />
      <Field label="Email placeholder" value={val.inputPlaceholder} onChange={(v:string)=>set('inputPlaceholder',v)} />
      <Field label="Button label"    value={val.btnLabel}         onChange={(v:string)=>set('btnLabel',v)} />
      <Field label="Footnote"        value={val.footnote}         onChange={(v:string)=>set('footnote',v)} />
    </>
  )
}

function NavbarEditor({ val, onChange }: any) {
  const set = (k:string,v:any) => onChange({ ...val, [k]:v })
  const links = val.links || []
  return (
    <>
      <Field label="Brand name" value={val.brandName} onChange={(v:string)=>set('brandName',v)} />
      <Field label="CTA button label" value={val.ctaLabel} onChange={(v:string)=>set('ctaLabel',v)} />
      <Field label="Login link label" value={val.loginLabel} onChange={(v:string)=>set('loginLabel',v)} />
      <div style={fieldWrap}>
        <label style={lbl}>Nav links</label>
        {links.map((lk:any,i:number) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'8px' }}>
            <input style={inp} placeholder="Label" value={lk.label||''} onChange={e=>{ const a=[...links]; a[i]={...a[i],label:e.target.value}; set('links',a) }} />
            <input style={inp} placeholder="href" value={lk.href||''} onChange={e=>{ const a=[...links]; a[i]={...a[i],href:e.target.value}; set('links',a) }} />
          </div>
        ))}
      </div>
    </>
  )
}

function FooterEditor({ val, onChange }: any) {
  const set = (k:string,v:any) => onChange({ ...val, [k]:v })
  const links = val.links || []
  return (
    <>
      <Field label="Tagline" value={val.tagline} onChange={(v:string)=>set('tagline',v)} multiline rows={2} />
      <Field label="Copyright text" value={val.copyright} onChange={(v:string)=>set('copyright',v)} />
      <div style={fieldWrap}>
        <label style={lbl}>Footer links</label>
        {links.map((lk:any,i:number) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'8px' }}>
            <input style={inp} placeholder="Label" value={lk.label||''} onChange={e=>{ const a=[...links]; a[i]={...a[i],label:e.target.value}; set('links',a) }} />
            <input style={inp} placeholder="href"  value={lk.href||''}  onChange={e=>{ const a=[...links]; a[i]={...a[i],href:e.target.value}; set('links',a) }} />
          </div>
        ))}
      </div>
    </>
  )
}

function SEOEditor({ val, onChange }: any) {
  const set = (k:string,v:string) => onChange({ ...val, [k]:v })
  return (
    <>
      <Field label="Site name"     value={val.siteName}    onChange={(v:string)=>set('siteName',v)} />
      <Field label="Tagline"       value={val.tagline}     onChange={(v:string)=>set('tagline',v)} />
      <Field label="Description"   value={val.description} onChange={(v:string)=>set('description',v)} multiline rows={3} />
      <Field label="Keywords (comma separated)" value={val.keywords} onChange={(v:string)=>set('keywords',v)} multiline rows={2} />
      <Field label="OG Image URL"  value={val.ogImage}     onChange={(v:string)=>set('ogImage',v)} />
    </>
  )
}

/* ── New page content editors ── */
function SimpleHeroEditor({ val, onChange, fields }: { val:any; onChange:any; fields:{label:string;key:string;multiline?:boolean}[] }) {
  const set = (k:string,v:string) => onChange({ ...val, [k]:v })
  return (
    <>
      {fields.map(f => (
        <Field key={f.key} label={f.label} value={val?.[f.key]||''} onChange={(v:string)=>set(f.key,v)} multiline={f.multiline} rows={f.multiline?2:undefined} />
      ))}
    </>
  )
}

function LatestPostsEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Hero eyebrow',     key:'heroEyebrow' },
    { label:'Hero title',       key:'heroTitle' },
    { label:'Hero subtitle',    key:'heroSubtitle', multiline:true },
    { label:'"Browse All" button label', key:'browseAllLabel' },
  ]} />
}

function TrendingEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Hero eyebrow',            key:'heroEyebrow' },
    { label:'Hero title',              key:'heroTitle' },
    { label:'Hero subtitle',           key:'heroSubtitle', multiline:true },
    { label:'Sidebar CTA title',       key:'sidebarCtaTitle' },
    { label:'Sidebar CTA body text',   key:'sidebarCtaBody', multiline:true },
    { label:'Sidebar CTA button label',key:'sidebarCtaBtn' },
  ]} />
}

function EdTechArticlesEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Hero eyebrow',   key:'heroEyebrow' },
    { label:'Hero title',     key:'heroTitle' },
    { label:'Hero subtitle',  key:'heroSubtitle', multiline:true },
    { label:'"View All" label', key:'viewAllLabel' },
  ]} />
}

function EdTechStoriesEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Hero eyebrow',    key:'heroEyebrow' },
    { label:'Hero title',      key:'heroTitle' },
    { label:'Hero subtitle',   key:'heroSubtitle', multiline:true },
    { label:'Bottom CTA title',key:'ctaTitle' },
    { label:'Bottom CTA subtitle', key:'ctaSubtitle', multiline:true },
    { label:'Bottom CTA button',   key:'ctaBtn' },
    { label:'"View All" label',    key:'viewAllLabel' },
  ]} />
}

function LeadershipEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Hero eyebrow',   key:'heroEyebrow' },
    { label:'Hero title',     key:'heroTitle' },
    { label:'Hero subtitle',  key:'heroSubtitle', multiline:true },
    { label:'"View All" label', key:'viewAllLabel' },
  ]} />
}

function InnovationEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Hero eyebrow',   key:'heroEyebrow' },
    { label:'Hero title',     key:'heroTitle' },
    { label:'Hero subtitle',  key:'heroSubtitle', multiline:true },
    { label:'"View All" label', key:'viewAllLabel' },
  ]} />
}

function CommunityPageEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Hero main title',         key:'heroTitle' },
    { label:'Hero subtitle',           key:'heroSubtitle', multiline:true },
    { label:'Hero CTA button 1',       key:'heroCta1' },
    { label:'Hero CTA button 2',       key:'heroCta2' },
    { label:'Bottom CTA title',        key:'ctaTitle' },
    { label:'Bottom CTA subtitle',     key:'ctaSubtitle', multiline:true },
    { label:'Bottom CTA button 1',     key:'ctaBtn1' },
    { label:'Bottom CTA button 2',     key:'ctaBtn2' },
  ]} />
}

function WritersEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Hero title',          key:'heroTitle' },
    { label:'Hero subtitle',       key:'heroSubtitle', multiline:true },
    { label:'Search placeholder',  key:'searchPlaceholder' },
    { label:'Bottom CTA title',    key:'ctaTitle' },
    { label:'Bottom CTA subtitle', key:'ctaSubtitle', multiline:true },
    { label:'Bottom CTA button',   key:'ctaBtn' },
  ]} />
}

function PrivacyEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Last updated date',    key:'lastUpdated' },
    { label:'Summary box text',     key:'summaryText', multiline:true },
    { label:'Contact email',        key:'contactEmail' },
  ]} />
}

function TermsEditor({ val, onChange }: any) {
  return <SimpleHeroEditor val={val} onChange={onChange} fields={[
    { label:'Last updated date',     key:'lastUpdated' },
    { label:'Warning banner text',   key:'warningText', multiline:true },
    { label:'Legal email',           key:'legalEmail' },
    { label:'Community email',       key:'communityEmail' },
  ]} />
}

export default function AdminContentPage() {
  const [active,  setActive]  = useState('content.hero')
  const [content, setContent] = useState<Record<string,any>>({})
  const [preview, setPreview] = useState(false)
  const [unsaved, setUnsaved] = useState(false)

  const { data: saved, isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: () => apiGet('/admin/content'),
    staleTime: Infinity,
  })

  useEffect(() => {
    if (saved) {
      const merged: Record<string,any> = {}
      PAGES.forEach(p => {
        merged[p.key] = saved[p.key] ?? DEFAULTS[p.key]
      })
      setContent(merged)
    }
  }, [saved])

  const saveMutation = useMutation({
    mutationFn: () => apiPost('/admin/content', { key: active, value: content[active] }),
    onSuccess: () => { toast.success('✅ Saved! Site updates in 60 seconds.'); setUnsaved(false) },
    onError: () => toast.error('Failed to save'),
  })

  const val = content[active] ?? DEFAULTS[active]
  const setVal = (v: any) => { setContent(p => ({ ...p, [active]: v })); setUnsaved(true) }

  const activePage = PAGES.find(p=>p.key===active)

  return (
    <AdminLayout title="Content Manager" subtitle="Edit every piece of text on the site — no code required">

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px', padding:'12px 16px', background:'#fff', border:'1px solid var(--border)', borderRadius:'12px' }}>
        <div style={{ width:9, height:9, borderRadius:'50%', background: unsaved?'var(--gold)':'#4ADE80', boxShadow: unsaved?'0 0 8px rgba(201,146,42,.5)':'0 0 8px rgba(74,222,128,.4)' }} />
        <span style={{ fontSize:'12px', color:'var(--muted)', flex:1, fontFamily:'var(--font-sans)' }}>
          {unsaved ? '⚠ Unsaved — click Save to apply' : '✓ All changes saved'}
        </span>
        <button onClick={() => setPreview(!preview)}
          style={{ display:'flex', alignItems:'center', gap:'6px', padding:'7px 14px', borderRadius:'8px', background:'var(--cream2)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontSize:'12px', fontFamily:'var(--font-sans)' }}>
          {preview ? <EyeOff style={{width:12,height:12}}/> : <Eye style={{width:12,height:12}}/>}
          {preview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending||!unsaved}
          style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 22px', borderRadius:'9px', background:'var(--teal)', border:'none', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:700, fontFamily:'var(--font-sans)', opacity: (saveMutation.isPending||!unsaved)?.6:1, boxShadow:'0 4px 14px rgba(10,95,85,.3)' }}>
          {saveMutation.isPending ? <><Loader2 style={{width:13,height:13,animation:'spin 1s linear infinite'}}/>Saving…</> : <><Globe style={{width:13,height:13}}/>Save to Site</>}
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'16px' }}>

        {/* Left sidebar — sections */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'12px', overflow:'hidden' }}>
          {PAGES.map(p => (
            <button key={p.key} onClick={() => { setActive(p.key) }}
              style={{ width:'100%', display:'block', padding:'12px 14px', border:'none', borderBottom:'1px solid var(--border2)', cursor:'pointer', textAlign:'left', transition:'all .15s',
                background: active===p.key ? 'rgba(10,95,85,.06)' : '#fff',
                borderLeft: active===p.key ? '3px solid var(--teal)' : '3px solid transparent' }}>
              <div style={{ fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight: active===p.key?700:500, color: active===p.key?'var(--teal)':'var(--ink)' }}>{p.label}</div>
              <div style={{ fontFamily:'var(--font-sans)', fontSize:'11px', color:'var(--muted)', marginTop:'2px' }}>{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Right — editor + preview */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Editor */}
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', padding:'22px' }}>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:'var(--ink)', marginBottom:'4px' }}>{activePage?.label}</div>
            <div style={{ fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-sans)', marginBottom:'20px' }}>{activePage?.desc}</div>

            {isLoading
              ? <div style={{ color:'var(--muted)', fontSize:'13px' }}>Loading…</div>
              : active==='content.hero'   ? <HeroEditor   val={val} onChange={setVal} />
              : active==='content.stats'  ? <StatsEditor  val={val} onChange={setVal} />
              : active==='content.cta'    ? <CTAEditor    val={val} onChange={setVal} />
              : active==='content.navbar'           ? <NavbarEditor          val={val} onChange={setVal} />
              : active==='content.footer'           ? <FooterEditor          val={val} onChange={setVal} />
              : active==='content.seo'              ? <SEOEditor             val={val} onChange={setVal} />
              : active==='content.latest-posts'     ? <LatestPostsEditor     val={val} onChange={setVal} />
              : active==='content.trending'         ? <TrendingEditor        val={val} onChange={setVal} />
              : active==='content.edtech-articles'  ? <EdTechArticlesEditor  val={val} onChange={setVal} />
              : active==='content.edtech-stories'   ? <EdTechStoriesEditor   val={val} onChange={setVal} />
              : active==='content.school-leadership'? <LeadershipEditor      val={val} onChange={setVal} />
              : active==='content.innovation'       ? <InnovationEditor      val={val} onChange={setVal} />
              : active==='content.community'        ? <CommunityPageEditor   val={val} onChange={setVal} />
              : active==='content.writers'          ? <WritersEditor         val={val} onChange={setVal} />
              : active==='content.privacy'          ? <PrivacyEditor         val={val} onChange={setVal} />
              : active==='content.terms'            ? <TermsEditor           val={val} onChange={setVal} />
              : null
            }
          </div>

          {/* Live preview */}
          {preview && (
            <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden' }}>
              <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)' }}>
                <Eye style={{width:12,height:12}}/> Preview — {activePage?.label}
              </div>
              <div style={{ padding:'24px', background:'var(--cream)' }}>

                {active==='content.hero' && val && (
                  <div>
                    <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'2px', color:'var(--teal)', textTransform:'uppercase', marginBottom:'16px' }}>{val.eyebrow}</div>
                    <div style={{ fontFamily:'var(--font-serif)', fontSize:'52px', fontWeight:900, lineHeight:1.04, color:'var(--ink)', letterSpacing:'-2px', marginBottom:'16px' }}>
                      {val.h1Line1} <br /><em style={{ fontStyle:'italic', color:'var(--gold)' }}>{val.h1Line2}</em>
                    </div>
                    <p style={{ fontSize:'15px', color:'var(--muted)', lineHeight:1.75, maxWidth:'480px', marginBottom:'24px', fontWeight:300 }}>{val.subtitle}</p>
                    <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                      <span style={{ padding:'12px 24px', borderRadius:'var(--radius)', background:'var(--teal)', color:'#fff', fontFamily:'var(--font-sans)', fontSize:'14px', fontWeight:600 }}>{val.ctaPrimary}</span>
                      <span style={{ padding:'11px 22px', borderRadius:'var(--radius)', border:'2px solid var(--parchment)', color:'var(--ink)', fontFamily:'var(--font-sans)', fontSize:'14px' }}>{val.ctaSecondary}</span>
                    </div>
                    <div style={{ marginTop:'20px', fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>{val.socialProof}</div>
                  </div>
                )}

                {active==='content.stats' && Array.isArray(val) && (
                  <div style={{ display:'grid', gridTemplateColumns:`repeat(${val.length},1fr)`, border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', background:'#fff' }}>
                    {val.map((s:any,i:number) => (
                      <div key={i} style={{ padding:'20px 0', textAlign:'center', borderRight:i<val.length-1?'1px solid var(--border)':'none' }}>
                        <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'32px', color:'var(--ink)', lineHeight:1 }}>{s.n}<span style={{ fontSize:'20px' }}>{s.sup}</span></div>
                        <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'4px', fontFamily:'var(--font-sans)' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                )}

                {active==='content.cta' && val && (
                  <div style={{ background:'var(--teal)', borderRadius:'24px', padding:'48px 40px', textAlign:'center', color:'#fff' }}>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', fontSize:'11px', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', padding:'6px 14px', borderRadius:'50px', marginBottom:'20px' }}>
                      <div style={{ width:6, height:6, background:'var(--coral)', borderRadius:'50%' }} /> {val.badge}
                    </div>
                    <div style={{ fontFamily:'var(--font-serif)', fontSize:'42px', fontWeight:900, letterSpacing:'-1.5px', lineHeight:1.05, marginBottom:'14px' }}>
                      {val.h2Line1} <em style={{ fontStyle:'italic', color:'var(--gold2)' }}>{val.h2Brand}</em>.<br />{val.h2Line2}
                    </div>
                    <p style={{ fontSize:'15px', color:'rgba(255,255,255,.75)', maxWidth:'400px', margin:'0 auto 24px', lineHeight:1.7, fontWeight:300 }}>{val.subtitle}</p>
                    <div style={{ display:'flex', gap:'8px', maxWidth:'380px', margin:'0 auto 12px' }}>
                      <input type="email" placeholder={val.inputPlaceholder} readOnly style={{ flex:1, background:'rgba(255,255,255,.12)', border:'1.5px solid rgba(255,255,255,.2)', color:'#fff', padding:'12px 16px', borderRadius:'10px', fontSize:'14px', outline:'none', fontFamily:'var(--font-sans)' }} />
                      <span style={{ padding:'12px 20px', borderRadius:'10px', background:'var(--coral)', color:'#fff', fontFamily:'var(--font-sans)', fontWeight:600, fontSize:'14px', flexShrink:0, whiteSpace:'nowrap' }}>{val.btnLabel}</span>
                    </div>
                    <div style={{ fontSize:'11px', color:'rgba(255,255,255,.5)' }}>{val.footnote}</div>
                  </div>
                )}

                {active==='content.navbar' && val && (
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', background:'rgba(253,246,236,.97)', borderRadius:'10px', border:'1px solid var(--border)' }}>
                    <span style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:'var(--ink)' }}>{val.brandName}</span>
                    <div style={{ display:'flex', gap:'20px' }}>
                      {(val.links||[]).map((lk:any) => (
                        <span key={lk.label} style={{ fontFamily:'var(--font-sans)', fontSize:'13px', color:'var(--muted)' }}>{lk.label}</span>
                      ))}
                    </div>
                    <span style={{ padding:'8px 18px', borderRadius:'var(--radius)', background:'var(--teal)', color:'#fff', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:600 }}>{val.ctaLabel}</span>
                  </div>
                )}

                {active==='content.footer' && val && (
                  <div style={{ background:'var(--teal)', borderRadius:'12px', padding:'24px 28px' }}>
                    <div style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:'#fff', marginBottom:'6px' }}>Thynk Pulse</div>
                    <div style={{ fontSize:'13px', color:'rgba(255,255,255,.6)', maxWidth:'400px', lineHeight:1.7, marginBottom:'16px', fontWeight:300 }}>{val.tagline}</div>
                    <div style={{ display:'flex', gap:'16px', flexWrap:'wrap', marginBottom:'14px' }}>
                      {(val.links||[]).map((lk:any) => (
                        <span key={lk.label} style={{ fontSize:'12px', color:'rgba(255,255,255,.5)', fontFamily:'var(--font-sans)' }}>{lk.label}</span>
                      ))}
                    </div>
                    <div style={{ fontSize:'11px', color:'rgba(255,255,255,.35)', fontFamily:'var(--font-sans)' }}>{val.copyright}</div>
                  </div>
                )}

                {active==='content.seo' && val && (
                  <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'10px', padding:'16px', fontFamily:'var(--font-sans)' }}>
                    <div style={{ fontSize:'10px', color:'#4ade80', marginBottom:'4px' }}>thynkpulse.vercel.app</div>
                    <div style={{ fontSize:'18px', color:'#1a0dab', marginBottom:'4px', fontWeight:500 }}>{val.siteName} — {val.tagline}</div>
                    <div style={{ fontSize:'13px', color:'#545454', lineHeight:1.6 }}>{val.description}</div>
                  </div>
                )}

                {/* New page previews */}
                {(['content.latest-posts','content.trending','content.edtech-articles','content.edtech-stories','content.school-leadership','content.innovation'].includes(active)) && val && (
                  <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid var(--border)' }}>
                    <div style={{ padding:'20px 24px', background:
                      active==='content.trending' ? 'var(--coral)' :
                      active==='content.edtech-stories' ? 'var(--plum)' :
                      active==='content.school-leadership' ? 'var(--gold)' :
                      active==='content.innovation' ? 'var(--plum)' : 'var(--teal)' }}>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(255,255,255,.5)', marginBottom:'6px' }}>{val.heroEyebrow || 'Category'}</div>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:'8px' }}>{val.heroTitle || 'Page Title'}</div>
                      <div style={{ fontSize:'13px', color:'rgba(255,255,255,.7)', lineHeight:1.6 }}>{val.heroSubtitle || 'Page subtitle goes here.'}</div>
                    </div>
                    <div style={{ padding:'16px 24px', background:'var(--cream)', display:'flex', gap:'8px', flexWrap:'wrap' }}>
                      {['All','EdTech','Educator','Leadership','Innovation'].map(c=>(
                        <span key={c} style={{ padding:'6px 14px', borderRadius:'100px', background: c==='All'?'var(--teal)':'#fff', color: c==='All'?'#fff':'var(--muted)', border:'1px solid var(--border)', fontSize:'12px', fontWeight:500 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {active==='content.community' && val && (
                  <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid var(--border)' }}>
                    <div style={{ padding:'28px 24px', background:'var(--teal)', textAlign:'center' }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:900, color:'#fff', marginBottom:'8px' }}>{val.heroTitle || "India's Education Community"}</div>
                      <div style={{ fontSize:'13px', color:'rgba(255,255,255,.7)', marginBottom:'16px', lineHeight:1.6 }}>{val.heroSubtitle}</div>
                      <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
                        <span style={{ padding:'10px 20px', borderRadius:'var(--radius)', background:'var(--gold2)', color:'var(--ink)', fontSize:'13px', fontWeight:700 }}>{val.heroCta1 || 'Join Free →'}</span>
                        <span style={{ padding:'9px 18px', borderRadius:'var(--radius)', border:'1px solid rgba(255,255,255,.3)', color:'#fff', fontSize:'13px' }}>{val.heroCta2 || 'Start Writing'}</span>
                      </div>
                    </div>
                    <div style={{ padding:'16px 24px', background:'#fff', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', textAlign:'center' }}>
                      {[['10K+','Members'],['2.4K+','Articles'],['180+','Companies'],['40+','Countries']].map(([n,l])=>(
                        <div key={l}>
                          <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'22px', color:'var(--teal)' }}>{n}</div>
                          <div style={{ fontSize:'11px', color:'var(--muted)' }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {active==='content.writers' && val && (
                  <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid var(--border)' }}>
                    <div style={{ padding:'28px 24px', background:'var(--teal)' }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:900, color:'#fff', marginBottom:'8px' }}>{val.heroTitle || 'Meet the Writers'}</div>
                      <div style={{ fontSize:'13px', color:'rgba(255,255,255,.7)', marginBottom:'14px' }}>{val.heroSubtitle}</div>
                      <div style={{ background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.2)', borderRadius:'10px', padding:'10px 14px', fontSize:'13px', color:'rgba(255,255,255,.6)' }}>{val.searchPlaceholder || 'Search by name or role...'}</div>
                    </div>
                    <div style={{ padding:'16px 24px', background:'var(--cream)', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
                      {[{n:'Rajesh K.',r:'EdTech Founder'},{n:'Priya S.',r:'Teacher'},{n:'Nalini V.',r:'Researcher'}].map((w,i)=>(
                        <div key={w.n} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'12px', padding:'12px', textAlign:'center' }}>
                          <div style={{ width:36, height:36, borderRadius:'9px', background:['var(--teal)','var(--coral)','var(--gold)'][i], display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'14px', color:'#fff', margin:'0 auto 8px' }}>{w.n[0]}</div>
                          <div style={{ fontSize:'12px', fontWeight:600, color:'var(--ink)' }}>{w.n}</div>
                          <div style={{ fontSize:'10px', color:'var(--muted)', marginTop:'2px' }}>{w.r}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(['content.privacy','content.terms'].includes(active)) && val && (
                  <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid var(--border)' }}>
                    <div style={{ padding:'24px', background: active==='content.privacy' ? 'var(--teal)' : 'var(--ink)' }}>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(255,255,255,.4)', marginBottom:'6px' }}>Legal · {val.lastUpdated}</div>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:'#fff' }}>{active==='content.privacy' ? 'Privacy Policy' : 'Terms of Use'}</div>
                    </div>
                    <div style={{ padding:'16px 24px', background:'#fff' }}>
                      <div style={{ background: active==='content.privacy' ? '#EAF4F0' : '#FFF9E6', border:`1.5px solid ${active==='content.privacy' ? 'rgba(10,95,85,.15)' : 'rgba(201,146,42,.2)'}`, borderRadius:'10px', padding:'14px 16px', fontSize:'12px', color:'var(--muted)', lineHeight:1.7, marginBottom:'12px' }}>
                        <strong style={{ color: active==='content.privacy' ? 'var(--teal)' : 'var(--gold)' }}>{active==='content.privacy' ? 'Summary:' : 'Please read carefully:'}</strong> {active==='content.privacy' ? val.summaryText : val.warningText}
                      </div>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:'15px', fontWeight:700, color:'var(--ink)', paddingBottom:'8px', borderBottom:'2px solid var(--border)' }}>1. About Thynk Pulse</div>
                      <div style={{ fontSize:'12px', color:'var(--muted)', lineHeight:1.7, marginTop:'8px' }}>This section will contain the full policy text as written in the page file.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
